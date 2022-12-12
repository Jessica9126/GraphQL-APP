import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import login from '../login.png';
import HomePage from './HomePage';


export class Login extends Component {

  constructor(props){
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  submitHandler = () =>{
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    const requestBody = {
      query: `
        query{
          user(email: "${email}", password: "${password}"){
            email
            password
          }
        }
      `
    };

    fetch('http://localhost:7000/graphql',{
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    // }).then(res => {
    //   if (res.status != 200){
    //     throw new Error('Failed!');
    //   }
    // }).then(user =>{
    //   console.log(user);
    //   // if (resData.data.user.email == email){
    //   //   return <HomePage/>
    //   // }
    });
  };

  render() {
    return (
      <div className="container">
        <br/>
        <br/>
        <br/>
        <img
          src = {login}
          alt = "Login Logo"
          style={{ width: 150, display: 'block', margin: 'auto'}}
        />
        <div class="form-group" align = "center">
            <h3>Login</h3>
            <br/>
            <div style={{width: "400px"}} class="form-floating mb-3">
                <input type="email" class="form-control" ref={this.emailEl} placeholder="name@example.com"></input>
                <label for="floatingInput">Email address</label>
            </div>
            <div style={{width: "400px"}} class="form-floating mb-3">
                <input type="password" class="form-control" ref={this.passwordEl} placeholder="Password"></input>
                <label for="floatingPassword">Password</label>
            </div>
            <Link to={`/register`} class="btn btn-outline-success">Sign Up</Link>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Link to={`/homepage`} class="btn btn-success" onClick={this.submitHandler}>Login</Link>
        </div>
      </div>
    )
  }
}
  
export default Login
import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import login from '../login.png';


export class Login extends Component {

  render() {
    return (
      <div className="container">
        <br/>
        <br/>
        <br/>
        <img
          src = {login}
          alt = "Login Logo"
          style={{ width: 150, display: 'block', margin: 'auto'}}
        />
        <div class="form-group" align = "center">
            <h3>Login</h3>
            <br/>
            <div style={{width: "400px"}} class="form-floating mb-3">
                <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com"></input>
                <label for="floatingInput">Email address</label>
            </div>
            <div style={{width: "400px"}} class="form-floating mb-3">
                <input type="password" class="form-control" id="floatingPassword" placeholder="Password"></input>
                <label for="floatingPassword">Password</label>
            </div>
            <Link to={`/register`} class="btn btn-outline-success">Sign Up</Link>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Link to={`/homepage`} class="btn btn-success">Login</Link>
        </div>
      </div>
    )
  }
}
  
export default Login