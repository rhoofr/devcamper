import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCheck, FaTimes, FaPencilAlt, FaComments } from 'react-icons/fa';
import Loading from './Loading';
import Course from './Course';
import { useBootcampsContext } from '../context/bootcampsContext';

const baseUrl = process.env.REACT_APP_BASE_URL;

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
    averageCost,
    description,
    photo,
    housing,
    jobAssistance,
    jobGuarantee,
    acceptGi,
    name
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
            <h1>{name}</h1>

            <p>{description}</p>

            <p className='lead mb-4'>
              Average Course Cost:{' '}
              <span className='text-primary'>${averageCost}</span>
            </p>

            {courses.map(course => {
              return <Course key={course._id} {...course} />;
            })}
          </div>

          <div className='col-md-4'>
            {photo && photo !== 'no-photo.jpg' ? (
              <img
                src={`${baseUrl}/uploads/${photo}`}
                alt='bootcamp'
                className='img-thumbnail'
              />
            ) : (
              <h4 style={{ textAlign: 'center' }}>No image</h4>
            )}

            <h1 className='text-center my-4'>
              <div className='rating'>
                <span className='badge rounded-pill bg-secondary bg-success me-2'>
                  {averageRating}
                </span>{' '}
              </div>
              Rating
            </h1>

            <Link
              to={{
                pathname: `/bootcamps/${id}/reviews`,
                state: { name, averageRating }
              }}
              className='btn btn-dark btn-block my-2 w-100'
            >
              <FaComments /> Read Reviews
            </Link>
            <Link
              to={{
                pathname: `/createreview/${id}`,
                state: { name }
              }}
              className='btn btn-light btn-block my-2 w-100'
            >
              <FaPencilAlt /> Write a Review
            </Link>

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
