import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { ToastContainer } from 'react-toastify';
// import { notifyError, notifySuccess } from '../utils/toastNotify';
import { useAuthContext } from '../context/authContext';
import { useBootcampsContext } from '../context/bootcampsContext';
import { baseUrl } from '../utils/constants';
import Loading from '../components/Loading';

const ManageBootcampsPage = () => {
  const { user } = useAuthContext();
  const { bootcamps, fetchBootcamps } = useBootcampsContext();
  const [bootcamp, setBootcamp] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const bootcamp = bootcamps.filter(bootcamp => {
      return bootcamp.user === user._id;
    });

    if (bootcamp.length > 0) {
      setBootcamp(bootcamp);
    }
    setLoading(false);
  }, [bootcamps, user._id]);

  const handleSubmit = async e => {
    setLoading(true);
    e.preventDefault();
    const data = new FormData();
    data.append('file', selectedFile);
    ///bootcamps/5d725a1b7b292f5f8ceff788/photo
    try {
      await axios.put(
        `${baseUrl}/bootcamps/${bootcamp[0]._id}/photo`,
        data,
        {}
      );
      await fetchBootcamps(`${baseUrl}/bootcamps`);
    } catch (error) {
      console.log(error.response.data.error);
    }
    setSelectedFile(null);
    setLoading(false);
  };

  const getCareers = careers => {
    return careers.join(', ').toString();
  };

  const handleChooseFile = e => {
    setSelectedFile(e.target.files[0]);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <section className='container mt-5'>
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
                      <img
                        src={`http://localhost:5000/uploads/${bootcamp[0].photo}`}
                        className='card-img'
                        alt='camp'
                      />
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
              <form onSubmit={handleSubmit} className='mb-4'>
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
                  disabled={bootcamp.length < 1}
                />
              </form>
              <a
                href='add-bootcamp.html'
                className='btn btn-primary btn-block w-100 mb-2'
              >
                Edit Bootcamp Details
              </a>
              <a
                href='manage-courses.html'
                className='btn btn-secondary btn-block w-100 mb-2'
              >
                Manage Courses
              </a>
              <a href='nothing.html' className='btn btn-danger btn-block w-100'>
                Remove Bootcamp
              </a>
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
