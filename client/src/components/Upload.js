import React from 'react';
import {Link} from 'react-router-dom';

export default function Upload() {
  return (
    <div class="form-group">
      <h5 for="formFile" class="form-label mt-4">Please The Image You Want To Post</h5>
      <br/>
      <input class="form-control" type="file" id="formFile" />
      <br/>
      <Link to={`/homepage`} class="btn btn-success">Post</Link>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <Link to={`/homepage`} class="btn btn-outline-warning">Back to HomePage</Link>
    </div>
  )
}
