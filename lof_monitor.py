import streamlit as st
import akshare as ak
import pandas as pd
import numpy as np
import time
import os
from pathlib import Path

# ===================== 页面设置 =====================
st.set_page_config(page_title="LOF溢价筛选器", layout="wide")
st.title("📊 LOF 溢价快照筛选")
st.caption("从网络获取并保存至本地缓存")

# ===================== 参数 =====================
THRESHOLD = 2  # ±2%
CACHE_FILE = Path("lof_data_cache.csv")

# ===================== 数据获取（本地缓存优先） =====================
def get_lof_data_from_web(retries: int = 3, wait: float = 1.0):
    """从网络获取 LOF 数据，返回 (df, err_str)。"""
    last_err = None
    for i in range(retries):
        try:
            df = ak.fund_lof_spot_em()
            if df is None:
                last_err = RuntimeError("akshare 返回 None")
                time.sleep(wait)
                continue
            df.columns = df.columns.astype(str).str.strip()
            return df, None
        except Exception as e:
            last_err = e
            time.sleep(wait)
    return pd.DataFrame(), repr(last_err)


def get_lof_data():
    """优先从本地缓存读取，不存在则从网络获取并保存到缓存。"""
    if CACHE_FILE.exists():
        try:
            df = pd.read_csv(CACHE_FILE)
            st.info(f"✅ 使用本地缓存数据（{CACHE_FILE}）")
            return df, None
        except Exception as e:
            st.warning(f"⚠️ 本地缓存读取失败，尝试从网络获取: {str(e)}")

    st.info("🌐 正在从网络获取 LOF 数据并保存到本地缓存...")
    df, err = get_lof_data_from_web(retries=3, wait=1.0)

    if not df.empty:
        try:
            df.to_csv(CACHE_FILE, index=False)
            st.success(f"✅ 数据已保存到本地缓存: {CACHE_FILE}")
        except Exception as e:
            st.warning(f"⚠️ 缓存保存失败: {str(e)}")
        return df, None
    else:
        return df, err
    
def get_purchase_data():
    """获取申购信息"""
    try:
        df = ak.fund_purchase_em()
        if df is None or df.empty:
            return pd.DataFrame()
        df.columns = df.columns.astype(str).str.strip()
        return df
    except:
        return pd.DataFrame()


df, last_err = get_lof_data()

if df.empty:
    st.error(f"获取 LOF 数据失败: {last_err}")
    with st.expander("💡 解决方案"):
        st.write("1. 检查网络连接")
        st.write("2. 等待几秒后刷新页面重试")
        st.write(f"3. 如果本地缓存文件 {CACHE_FILE} 存在但已过期，可手动删除后重新运行")

    if st.button("🔄 重新尝试获取 LOF 数据"):
        if CACHE_FILE.exists():
            os.remove(CACHE_FILE)
            st.info(f"已删除本地缓存 {CACHE_FILE}，刷新页面将重新从网络获取...")
        st.experimental_rerun()

    st.stop()

# ===================== 列名识别函数（定义在expander外） =====================
def find_col(keywords):
    """从列名列表中找到包含任意 keyword 的第一个列名（不区分大小写）。"""
    keywords_lower = [k.lower() for k in keywords]
    for col in df.columns:
        col_lower = col.lower()
        if any(k in col_lower for k in keywords_lower):
            return col
    return None


def get_fund_nav(code):
    """获取单个基金的最新净值，返回 (净值, 净值日期) 或 (None, None)。"""
    try:
        nav_df = ak.fund_open_fund_info_em(symbol=code, indicator="单位净值走势")
        if nav_df is not None and not nav_df.empty:
            nav_df = nav_df.sort_values("净值日期")
            latest = nav_df.iloc[-1]
            return float(latest["单位净值"]), str(latest["净值日期"])
    except Exception:
        pass
    return None, None


# ===================== 计算筛选（更稳健 + 诊断） =====================
# 诊断面板：显示实际列名和前几行数据
with st.expander("🔧 数据诊断面板（点击展开查看列名和样本数据）"):
    st.write(f"**数据行数:** {len(df)}")
    st.write(f"**列名列表:** {list(df.columns)}")
    st.write("**前 5 行数据:**")
    st.dataframe(df.head(5), use_container_width=True)

# 识别关键列（在expander外执行，确保有效）
code_col = find_col(['代码', 'code'])
price_col = find_col(['最新价', '现价', '最新', '市价', 'price'])

# 显示识别结果
st.write(f"**识别的列名:** 代码={code_col}, 最新价={price_col}")

if not code_col or not price_col:
    st.error(f"❌ 无法识别必要列：代码={code_col}, 最新价={price_col}")
    st.stop()

# 获取净值并计算溢价率
st.write("🔄 正在获取基金净值并计算溢价率...")
progress_bar = st.progress(0)

nav_dict = {}
for idx, code in enumerate(df[code_col]):
    nav, nav_date = get_fund_nav(str(code))
    nav_dict[code] = (nav, nav_date)
    progress_bar.progress((idx + 1) / len(df))

df['单位净值'] = df[code_col].map(lambda c: nav_dict.get(c, (None, None))[0])
df['净值日期'] = df[code_col].map(lambda c: nav_dict.get(c, (None, None))[1])

# 计算溢价率
price_ser = pd.to_numeric(df[price_col], errors='coerce')
nav_ser = pd.to_numeric(df['单位净值'], errors='coerce')

df['溢价率'] = (price_ser - nav_ser) / nav_ser * 100

valid_count = int(df['溢价率'].notna().sum())
st.success(f"✅ 净值获取完毕：有效数据 {valid_count}/{len(df)}")

# 过滤时忽略 NaN 溢价
filtered = df[df['溢价率'].notna() & ((df['溢价率'] >= THRESHOLD) | (df['溢价率'] <= -THRESHOLD))].copy()

# ===================== 排序 =====================
filtered = filtered.sort_values("溢价率", ascending=False)

# ===================== 申购信息补充 =====================
st.write("🔄 正在获取申购状态与日限额...")

purchase_df = get_purchase_data()

if not purchase_df.empty:

    # 自动识别列
    code_col_p = next((c for c in purchase_df.columns if "代码" in c), None)
    status_col = next((c for c in purchase_df.columns if "申购" in c or "状态" in c), None)
    limit_col = next((c for c in purchase_df.columns if "日" in c and "限" in c), None)

    if code_col_p:

        purchase_df[code_col_p] = purchase_df[code_col_p].astype(str)

        status_map = {}
        limit_map = {}

        for _, r in purchase_df.iterrows():
            code = str(r.get(code_col_p, ""))

            status = str(r.get(status_col, "")) if status_col else ""
            limit = r.get(limit_col, None) if limit_col else None

            status_map[code] = status
            limit_map[code] = limit

        # 写回 filtered
        filtered["申购状态"] = filtered[code_col].astype(str).map(status_map)
        filtered["日限额"] = filtered[code_col].astype(str).map(limit_map)

else:
    st.warning("⚠️ 未获取到申购数据")

# ===================== 展示 =====================
st.subheader("📌 满足条件的LOF（≥2% 或 ≤-2%）")

st.write(f"总LOF数量：{len(df)}")
st.write(f"筛选后数量：{len(filtered)}")

# 简单诊断信息：缺失最新价与缺失溢价率的数量
missing_premium = int(df['溢价率'].isna().sum())
st.info(f"✓ 溢价率计算完毕：有效数据 {len(df) - missing_premium}/{len(df)}，无法计算 {missing_premium}/{len(df)}")

if filtered.empty:
    st.warning("当前没有满足条件的LOF")
    st.subheader("📋 当前所有 LOF 基础信息（快照）")
    all_cols = [
        "代码", "名称", "最新价", "单位净值", "净值日期",
        "溢价率", "涨跌幅", "成交额", "成交量"
    ]
    all_cols = [c for c in all_cols if c in df.columns]

    if all_cols:
        st.dataframe(df[all_cols], use_container_width=True, hide_index=True)
    else:
        st.dataframe(df.head(100), use_container_width=True, hide_index=True)
else:
    show_cols = [
        "代码", "名称", "最新价", "单位净值", "净值日期",
        "溢价率", "涨跌幅", "成交额", "成交量",
        "申购状态", "日限额"
    ]

    show_cols = [c for c in show_cols if c in filtered.columns]

    st.dataframe(
        filtered[show_cols],
        use_container_width=True,
        hide_index=True
    )

# ===================== 说明 =====================
st.divider()
st.caption("筛选逻辑：溢价率 ≥ +2%（溢价） 或 ≤ -2%（折价）")

# ===================== 第二层筛选（申购条件过滤） =====================

if not filtered.empty and "申购状态" in filtered.columns and "日限额" in filtered.columns:

    # 清洗日限额（防止字符串/None）
    filtered["日限额_num"] = pd.to_numeric(filtered["日限额"], errors="coerce")

    filtered_purchase_ok = filtered[
        (filtered["申购状态"] == "开放申购") &
        (filtered["日限额_num"] >= 50) &
        (filtered["日限额_num"] <= 100000)
    ].copy()

    st.subheader("📌 满足【溢价 + 申购开放 + 限额50~10w】的LOF")

    if not filtered_purchase_ok.empty:
        st.dataframe(filtered_purchase_ok, use_container_width=True, hide_index=True)
    else:
        st.warning("没有满足申购条件的LOF")

    # ===================== 自动保存 CSV =====================
    try:
        filtered.to_csv("2%溢价筛选结果.csv", index=False, encoding="utf-8-sig")
        filtered_purchase_ok.to_csv("申购限额满足条件.csv", index=False, encoding="utf-8-sig")
        st.success("✅ 已自动保存两个CSV文件到本地")
    except Exception as e:
        st.error(f"CSV保存失败: {e}")
