import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa';
import { notifyError, notifySuccess } from '../utils/toastNotify';
import { useAuthContext } from '../context/authContext';
import { useBootcampsContext } from '../context/bootcampsContext';
import { baseUrl } from '../utils/constants';
import CourseItem from '../components/CourseItem';
import Loading from '../components/Loading';

const ManageCoursesPage = props => {
  const { user } = useAuthContext();
  const {
    bootcamps,
    bootcampsLoading,
    deleteCourse,
    clearErrors,
    error
  } = useBootcampsContext();
  const [bootcamp, setBootcamp] = useState([]);
  // const [courses, setCourses] = useState([]);
  // const [updatedCount, setUpdatedCount] = useState(0);
  // const [loading, setLoading] = useState(false);
  // const [disableButtons, setDisableButtons] = useState(false);
  const [idToDelete, setIdToDelete] = useState('');

  const handleDelete = async e => {
    e.preventDefault();

    deleteCourse(idToDelete);

    if (error) {
      notifyError(`👎 ${error}`);
      clearErrors();
    } else {
      notifySuccess('✅ Course removed');
    }
  };

  useEffect(() => {
    const bootcamp = bootcamps.filter(bootcamp => {
      return bootcamp.user === user._id;
    });

    if (bootcamp.length > 0) {
      setBootcamp(bootcamp);
    }
  }, [bootcamps, user._id]);

  const getCareers = careers => {
    return careers.join(', ').toString();
  };

  if (bootcampsLoading || (bootcamp && bootcamp.length === 0)) {
    return <Loading />;
  }

  return (
    <section className='container mt-5'>
      <div
        className='modal fade'
        id='reviewModal'
        tabIndex='-1'
        aria-labelledby='reviewModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='reviewModalLabel'>
                Delete Confirmation
              </h5>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
              ></button>
            </div>
            <div className='modal-body'>
              Are you sure you wish to delete this review?
            </div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-danger'
                data-bs-dismiss='modal'
                onClick={handleDelete}
              >
                Yes
              </button>
              <input
                type='button'
                className='btn btn-primary'
                data-bs-dismiss='modal'
                autoFocus
                value='No'
              ></input>
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-8 m-auto'>
          <div className='card bg-white py-2 px-4'>
            <div className='card-body'>
              <Link
                to='/managebootcamps'
                className='btn btn-link text-secondary my-3'
              >
                <FaChevronLeft /> Manage Bootcamp
              </Link>
              <h1 className='mb-4'>Manage Courses</h1>
              <div className='card mb-3'>
                <div className='row no-gutters'>
                  <div className='col-md-4'>
                    {bootcamp[0].photo === 'no-photo.jpg' ? (
                      <h3 className='mt-4'>No Image</h3>
                    ) : (
                      <img
                        src={`${baseUrl}/uploads/${bootcamp[0].photo}`}
                        className='card-img'
                        alt='camp'
                      />
                    )}
                  </div>
                  <div className='col-md-8'>
                    <div className='card-body'>
                      <h5 className='card-title'>
                        <Link to={`/bootcamps/${bootcamp[0]._id}`}>
                          {bootcamp[0] && bootcamp[0].name}
                          <span className='float-end badge bg-success'>
                            {bootcamp[0].averageRating}
                          </span>
                        </Link>
                      </h5>
                      <span className='badge bg-dark mb-2'>
                        {bootcamp[0].location && bootcamp[0].location.city},{' '}
                        {bootcamp[0].location && bootcamp[0].location.state}
                      </span>
                      <p className='card-text'>
                        {bootcamp[0] && getCareers(bootcamp[0].careers)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to={{
                  pathname: `/addcourse`,
                  bootcampName: bootcamp[0].name,
                  bootcampId: bootcamp[0]._id
                }}
                className='btn btn-primary btn-block mb-4'
              >
                Add Bootcamp Course
              </Link>
              <table className='table table-striped'>
                <thead>
                  <tr>
                    <th scope='col'>Title</th>
                    <th scope='col'></th>
                  </tr>
                </thead>
                <tbody>
                  {bootcamp[0].courses &&
                    bootcamp[0].courses.map(course => {
                      return (
                        <CourseItem
                          key={course._id}
                          bootcampName={bootcamp[0].name}
                          setIdToDelete={setIdToDelete}
                          {...course}
                        />
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageCoursesPage;
