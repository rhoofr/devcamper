import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaCheck, FaTimes } from 'react-icons/fa';
import Loading from './Loading';
import Course from './Course';
import { useBootcampsContext } from '../context/bootcampsContext';

const SingleBootcamp = () => {
  const { id } = useParams();
  const {
    singleBootcamp,
    courses,
    singleBootcampLoading,
    fetchSingleBootcamp
  } = useBootcampsContext();
  const {
    averageRating,
    photo,
    housing,
    jobAssistance,
    jobGuarantee,
    acceptGi
  } = singleBootcamp;

  useEffect(() => {
    fetchSingleBootcamp(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (singleBootcampLoading) {
    return <Loading />;
  }

  return (
    <section className='bootcamp mt-5'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-8'>
            <h1>{singleBootcamp.name}</h1>

            <p>{singleBootcamp.description}</p>

            <p className='lead mb-4'>
              Average Course Cost:{' '}
              <span className='text-primary'>
                ${singleBootcamp.averageCost}
              </span>
            </p>

            {courses.map(course => {
              return <Course key={course._id} {...course} />;
            })}
          </div>

          <div className='col-md-4'>
            {photo ? (
              <img
                src={`http://localhost:5000/uploads/${photo}`}
                alt='bootcamp'
                className='img-thumbnail'
              />
            ) : (
              <h4>No image</h4>
            )}

            <h1 className='text-center my-4'>
              <div className='rating'>
                <span className='badge rounded-pill bg-secondary bg-success me-2'>
                  {averageRating}
                </span>{' '}
              </div>
              Rating
            </h1>

            <a href='reviews.html' className='btn btn-dark btn-block my-3'>
              <i className='fas fa-comments'></i> Read Reviews
            </a>
            <a href='add-review.html' className='btn btn-light btn-block my-3'>
              <i className='fas fa-pencil-alt'></i> Write a Review
            </a>

            {/* <div id='map' style='width: 100%; height: 300px;'></div> */}

            <ul className='list-group list-group-flush mt-4'>
              <li className='list-group-item'>
                {housing ? (
                  <FaCheck className='fa-check' />
                ) : (
                  <FaTimes className='fa-times' />
                )}{' '}
                Housing
              </li>
              <li className='list-group-item'>
                {jobAssistance ? (
                  <FaCheck className='fa-check' />
                ) : (
                  <FaTimes className='fa-times' />
                )}{' '}
                Job Assistance
              </li>
              <li className='list-group-item'>
                {jobGuarantee ? (
                  <FaCheck className='fa-check' />
                ) : (
                  <FaTimes className='fa-times' />
                )}{' '}
                Job Guarantee
              </li>
              <li className='list-group-item'>
                {acceptGi ? (
                  <FaCheck className='fa-check' />
                ) : (
                  <FaTimes className='fa-times' />
                )}{' '}
                Accepts GI Bill
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleBootcamp;
