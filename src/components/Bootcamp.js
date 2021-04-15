import React from 'react';
import { Link } from 'react-router-dom';

const Bootcamp = ({
  _id: id,
  name,
  location,
  averageRating,
  careers,
  photo
}) => {
  const getCareers = () => {
    return careers.join(', ').toString();
  };

  return (
    <div className='card mb-3'>
      <div className='row no-gutters'>
        <div className='col-md-4'>
          {photo !== 'no-photo.jpg' && (
            <img
              src={`http://localhost:5000/uploads/${photo}`}
              alt='camp'
              className='card-image'
              style={{ height: '140px', objectFit: 'cover' }}
            />
          )}
        </div>
        <div className='col-md-8'>
          <div className='card-body'>
            <h5 className='card-title'>
              <Link to={`/bootcamps/${id}`}>
                {name}
                <span className='float-end badge bg-success'>
                  {averageRating}
                </span>
              </Link>
            </h5>

            <span className='badge bg-dark mb-2'>
              {location.city}, {location.state}
            </span>
            <p className='card-text'>{getCareers()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bootcamp;