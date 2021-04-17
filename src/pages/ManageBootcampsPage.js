import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { notifyError, notifySuccess } from '../utils/toastNotify';
import { useAuthContext } from '../context/authContext';
import { useBootcampsContext } from '../context/bootcampsContext';
import { baseAPIUrl, baseUrl } from '../utils/constants';
import Loading from '../components/Loading';

const ManageBootcampsPage = props => {
  const { user } = useAuthContext();
  const { bootcamps, fetchBootcamps } = useBootcampsContext();
  const [bootcamp, setBootcamp] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [disableButtons, setDisableButtons] = useState(false);
  const [imagePath, setImagePath] = useState('');

  useEffect(() => {
    const bootcamp = bootcamps.filter(bootcamp => {
      return bootcamp.user === user._id;
    });

    if (bootcamp.length > 0) {
      setBootcamp(bootcamp);
      setImagePath(`${baseUrl}/uploads/${bootcamp[0].photo}`);
    }
    setLoading(false);
  }, [bootcamps, user._id]);

  const handleSubmitPhoto = async e => {
    e.preventDefault();
    if (!selectedFile) {
      return notifyError(`❌ Please choose a file first`);
    }

    setDisableButtons(true);
    setImagePath('');

    const data = new FormData();
    data.append('file', selectedFile);

    try {
      // bootcamps/5d725a1b7b292f5f8ceff788/photo
      await axios.put(
        `${baseAPIUrl}/bootcamps/${bootcamp[0]._id}/photo`,
        data,
        {}
      );
      await fetchBootcamps(`${baseAPIUrl}/bootcamps`);
      notifySuccess('✅ Image uploaded');
    } catch (error) {
      if (error.response) {
        notifyError(`❌ ${error.response.data.error}`);
        console.log(error.response.data.error);
      }
    }
    setSelectedFile(null);
    // reset input
    e.target.reset();
    setDisableButtons(false);
    setImagePath(`${baseUrl}/uploads/${bootcamp[0].photo}`);
  };

  const getCareers = careers => {
    return careers.join(', ').toString();
  };

  const handleChooseFile = e => {
    setSelectedFile(e.target.files[0]);
  };

  const handleRemoveBootcamp = async e => {
    setLoading(true);
    e.preventDefault();

    try {
      await axios.delete(`${baseAPIUrl}/bootcamps/${bootcamp[0]._id}`);

      await fetchBootcamps(`${baseAPIUrl}/bootcamps`);
      props.history.push('/');
    } catch (e) {
      console.log(e.response.data.error);
      notifyError('❌ An error occurred deleting bootcamp');
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (bootcamp && bootcamp.length === 0) {
    return (
      <section className='container mt-5'>
        <div className='row'>
          <div className='col-md-8 m-auto'>
            <div className='card bg-white py-2 px-4'>
              <div className='card-body'>
                <h1 className='mb-4'>Manage Bootcamp</h1>
                <p className='lead'>You have not yet added a bootcamp</p>

                <Link
                  to='/addbootcamp'
                  className='btn btn-success btn-block w-100 mb-2'
                >
                  Add New Bootcamp
                </Link>

                <p className='text-muted mt-4'>
                  * You can only add one bootcamp per account.
                </p>
                <p className='text-muted'>
                  * You must be affiliated with the bootcamp in some way in
                  order to add it to DevCamper.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='container mt-5'>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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
                onClick={handleRemoveBootcamp}
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
              <h1 className='mb-4'>Manage Bootcamp</h1>
              <div className='card mb-3'>
                <div className='row no-gutters'>
                  <div className='col-md-4'>
                    {bootcamp[0].photo === 'no-photo.jpg' ? (
                      <h3 className='mt-4'>No Image</h3>
                    ) : (
                      <img src={imagePath} className='card-img' alt='camp' />
                    )}
                  </div>
                  <div className='col-md-8'>
                    <div className='card-body'>
                      <h5 className='card-title'>
                        <a href='bootcamp.html'>
                          {bootcamp[0] && bootcamp[0].name}
                          <span className='float-end badge bg-success'>
                            {bootcamp[0].averageRating}
                          </span>
                        </a>
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
              <form onSubmit={handleSubmitPhoto} className='mb-4'>
                <div className='form-group mb-3'>
                  <div className='custom-file'>
                    <input
                      type='file'
                      className='form-control'
                      id='inputGroupFile'
                      aria-describedby='inputGroupFileAddon'
                      aria-label='Upload'
                      onChange={handleChooseFile}
                    />
                  </div>
                </div>
                <input
                  type='submit'
                  className='btn btn-secondary btn-block w-100'
                  value='Upload Image'
                  disabled={disableButtons || bootcamp.length < 1}
                />
              </form>
              <Link
                to={{
                  pathname: `/editbootcamp`,
                  state: {
                    editMode: true,
                    bootcampToEdit: bootcamp[0]
                  }
                }}
                className='btn btn-primary btn-block w-100 mb-2'
                disabled={disableButtons}
              >
                Edit Bootcamp Details
              </Link>

              <a
                href='manage-courses.html'
                className='btn btn-secondary btn-block w-100 mb-2'
                disabled={disableButtons}
              >
                Manage Courses
              </a>
              <button
                data-bs-toggle='modal'
                data-bs-target='#reviewModal'
                className='btn btn-danger btn-block w-100'
                disabled={disableButtons}
              >
                Remove Bootcamp
              </button>
              <p className='text-muted mt-4'>
                * You can only add one bootcamp per account.
              </p>
              <p className='text-muted'>
                * You must be affiliated with the bootcamp in some way in order
                to add it to DevCamper.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageBootcampsPage;
