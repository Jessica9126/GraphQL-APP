import React from 'react';
import {Link} from 'react-router-dom';
import image4 from '../4.jpg';

export default function Upload() {
  return (
    <div class="form-group">
      <h5 for="formFile" class="form-label mt-4">Please The Image You Want To Post</h5>
      <br/>
      <input class="form-control" type="file" id="formFile" />
      <br/>
      <img
        src = {image4}
        // style={{ width: 150, display: 'block', margin: 'auto'}}
      />
      <br/>
      <br/>
      <Link to={`/homepage`} class="btn btn-success">Post</Link>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <Link to={`/homepage`} class="btn btn-outline-warning">Back to HomePage</Link>
    </div>
  )
}
