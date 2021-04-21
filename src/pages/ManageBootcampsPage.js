import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notifyError, notifySuccess } from '../utils/toastNotify';
import { useAuthContext } from '../context/authContext';
import { useBootcampsContext } from '../context/bootcampsContext';
import Loading from '../components/Loading';

const baseUrl = process.env.REACT_APP_BASE_URL;

const ManageBootcampsPage = props => {
  const { user } = useAuthContext();
  const {
    bootcamps,
    submitBootcampPhoto,
    deleteBootcamp,
    bootcampsLoading,
    clearErrors,
    error
  } = useBootcampsContext();
  const [bootcamp, setBootcamp] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [disableButtons, setDisableButtons] = useState(false);

  useEffect(() => {
    const bootcamp = bootcamps.filter(bootcamp => {
      return bootcamp.user === user._id;
    });

    if (bootcamp.length > 0) {
      setBootcamp(bootcamp);
    } else {
      setBootcamp([]);
    }
  }, [bootcamps, user._id]);

  const handleSubmitPhoto = async e => {
    e.preventDefault();
    if (!selectedFile) {
      return notifyError(`❌ Please choose a file first`);
    }

    setDisableButtons(true);

    const data = new FormData();
    data.append('file', selectedFile);

    await submitBootcampPhoto(bootcamp[0]._id, data);

    if (error) {
      notifyError(`👎 ${error}`);
      clearErrors();
    } else {
      notifySuccess('✅ Image uploaded');
    }
    setSelectedFile(null);
    // reset input
    e.target.reset();
    setDisableButtons(false);
  };

  const getCareers = careers => {
    return careers.join(', ').toString();
  };

  const handleChooseFile = e => {
    setSelectedFile(e.target.files[0]);
  };

  const handleRemoveBootcamp = async e => {
    e.preventDefault();

    await deleteBootcamp(bootcamp[0]._id);

    if (error) {
      notifyError(`👎 ${error}`);
      clearErrors();
    } else {
      notifySuccess('✅ Bootcamp deleted');
    }
  };

  if (bootcampsLoading) {
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
                    {bootcamp.length < 1 ||
                    bootcamp[0].photo === 'no-photo.jpg' ? (
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

              <Link
                to='/managecourses'
                className='btn btn-secondary btn-block w-100 mb-2'
                disabled={disableButtons}
              >
                Manage Courses
              </Link>
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
