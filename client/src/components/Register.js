import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import login from '../login.png';
// import { Query } from 'react-apollo';

// const LAUNCHES_QUERY = gql`
//   query LaunchesQuery {
//     launches{
//       flight_number
//       mission_name
//       launch_date_local
//       launch_success
//     }
//   }
// `;

export class Register extends Component {

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
        mutation{
          createUser(userInput: {email: "${email}", password: "${password}"}){
            email
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
                <input type="password" class="form-control" ref={this.passwordEl} id="floatingPassword" placeholder="Password"></input>
                <label for="floatingPassword">Password</label>
            </div>
            {/* <div style={{width: "400px"}} class="form-floating mb-3">
                <input type="password" class="form-control" ref={this.passwordEl} id="floatingPassword" placeholder="Password"></input>
                <label for="floatingPassword">Confirmed Password</label>
            </div> */}
            <Link to={`/`} class="btn btn-success" onClick={this.submitHandler}>Register</Link>
        </div>
      </div>
    )
  }
}

export default Register