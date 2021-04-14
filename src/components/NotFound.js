import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className='section section-center'>
      <div className='text-center'>
        <h2>Page cannot be found.</h2>
        <p className='lead text-muted'>
          You can always visit the <Link to='/'>home page</Link> to get a fresh
          start.
        </p>
      </div>
    </div>
  );
}

export default NotFound;
