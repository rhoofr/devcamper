import React from 'react';

const Review = ({ title, text, rating, user }) => {
  return (
    <div className='card mb-3'>
      <h5 className='card-header bg-dark text-white'>{title}</h5>
      <div className='card-body'>
        <h5 className='card-title'>
          Rating: <span className='text-success'>{rating}</span>
        </h5>
        <p className='card-text'>{text}</p>
        <p className='text-muted'>Written By {user.name}</p>
      </div>
    </div>
  );
};

export default Review;
