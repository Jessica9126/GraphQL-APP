import React from 'react';
import gql from 'graphql-tag';
import {Link} from 'react-router-dom';
import { Query } from 'react-apollo';

const User_QUERY = gql`
  query UsersQuery {
    users{
      username
    }
  }
`;

export default function HomePage() {
  return (
    <div>
      <Query query={User_QUERY}>
        {
          ({data})=>{
            return <h1>{data.username}</h1>
          }
        }
      </Query>
    </div>
    // <div>
    //   <br/>
    //   <Link to={`/upload`} class="btn btn-success">Post My Life</Link>
    //   &nbsp;&nbsp;&nbsp;&nbsp;
    //   <Link to={`/`} class="btn btn-outline-warning">Log Out</Link>
    //   <br/>
    //   <br/>
    //   <div className='card card-body mb-3'>
    //     <div className='row'>
    //       <div className='col-md-9'>
    //         <h4>NickName</h4>
    //         <p>This is a example</p>
    //       </div>
    //       <div className='col-md-3'>
    //         <button className='btn btn-secondary'>Details</button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  )
}
