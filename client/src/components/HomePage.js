import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import image1 from '../1.jpg';
import image2 from '../2.jpg';
import image3 from '../3.jpg';
import image4 from '../4.jpg';


export class HomePage extends Component {

  constructor(){
    super()
    this.state={
        isLiked1: false,
        isLiked2: false,
        isLiked3: false,
        isLiked4: false,
    }
  };

  render() {
    return (
      <div>
      <br/>
      <Link to={`/upload`} class="btn btn-success">Post My Life</Link>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <Link to={`/`} class="btn btn-outline-warning">Log Out</Link>
      <br/>
      <br/>
      <div className='card card-body mb-3'>
        <div className='row'>
          <div className='col-md-9'>
            <h4>AKURA NAOKA</h4>
            <p>Good Morning! ! ! ! ! ! ! ! </p>
            <img
              src = {image1}
              // style={{ width: 150, display: 'block', margin: 'auto'}}
            />
          </div>
          <div className='col-md-3'>
            <span onClick={this.handleLike1.bind(this)}>
              {this.state.isLiked1 ? 'Dislike 💓' :'Like 🖤'}
            </span>
          </div>
        </div>
      </div>
      <div className='card card-body mb-3'>
        <div className='row'>
          <div className='col-md-9'>
            <h4>Matthew Ike</h4>
            <p>I have always loved dogs! Dogs are the cutest creatures in the world!</p>
            <img
              src = {image3}
              // style={{ width: 150, display: 'block', margin: 'auto'}}
            />
          </div>
          <div className='col-md-3'>
            <span onClick={this.handleLike2.bind(this)}>
              {this.state.isLiked2 ? 'Dislike 💓' :'Like 🖤'}
            </span>
          </div>
        </div>
      </div>
      <div className='card card-body mb-3'>
        <div className='row'>
          <div className='col-md-9'>
            <h4>Evenland Dallars</h4>
            <p>A Little Borinf These Days......</p>
            <img
              src = {image2}
              // style={{ width: 150, display: 'block', margin: 'auto'}}
            />
          </div>
          <div className='col-md-3'>
            <span onClick={this.handleLike3.bind(this)}>
              {this.state.isLiked3 ? 'Dislike 💓' :'Like 🖤'}
            </span>
          </div>
        </div>
      </div>
      <div className='card card-body mb-3'>
        <div className='row'>
          <div className='col-md-9'>
            <h4>Matthew Ike</h4>
            <p>I have always loved dogs! Dogs are the cutest creatures in the world!</p>
            <img
              src = {image4}
              // style={{ width: 150, display: 'block', margin: 'auto'}}
            />
          </div>
          <div className='col-md-3'>
            <span onClick={this.handleLike4.bind(this)}>
              {this.state.isLiked4 ? 'Dislike 💓' :'Like 🖤'}
            </span>
          </div>
        </div>
      </div>
    </div>
    )
  }

  handleLike1(){
    // console.log("sss")
    //第一种修改setState方法
    // this.setState({
    //     isLiked:!this.state.isLiked
    // })

    //第二种prevState是上次的state
    this.setState((prevState)=>{
        console.log(prevState)
        return{
            isLiked1:!prevState.isLiked1
        }
      },()=>{
        console.log(this.state.isLiked1) //setState回调 获取最新的状态
      })
  }

  handleLike2(){
    this.setState((prevState)=>{
        console.log(prevState)
        return{
            isLiked2:!prevState.isLiked2
        }
      },()=>{
        console.log(this.state.isLiked2)
      })
  }

  handleLike3(){
    this.setState((prevState)=>{
        console.log(prevState)
        return{
            isLiked3:!prevState.isLiked3
        }
      },()=>{
        console.log(this.state.isLiked3) 
      })
  }

  handleLike4(){
    this.setState((prevState)=>{
        console.log(prevState)
        return{
            isLiked4:!prevState.isLiked4
        }
      },()=>{
        console.log(this.state.isLiked4) 
      })
  }
}
  
export default HomePage