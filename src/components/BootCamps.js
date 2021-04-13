import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useBootcampsContext } from '../context/bootcampsContext';
// import Error from './Error';
import Loading from './Loading';

import Bootcamp from './Bootcamp';

const BootCamps = () => {
  const {
    bootcamps,
    bootcampsLoading,
    fetchBootcampsWithinRadius,
    fetchBootcampsWithFilter
  } = useBootcampsContext();

  const [miles, setMiles] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [averageRating, setAverageRating] = useState('any');
  const [averageCost, setAverageCost] = useState('any');

  const handleRadiusSubmit = e => {
    e.preventDefault();
    if (!miles || miles.length < 1) {
      return notify('please enter the distance in miles');
    }
    if (!zipcode || zipcode.length < 5) {
      return notify('Please enter a 5 digit zip code');
    }
    setAverageRating('any');
    setAverageCost('any');
    fetchBootcampsWithinRadius(zipcode, miles);
  };

  const handleFilterSubmit = e => {
    e.preventDefault();
    setMiles('');
    setZipcode('');
    fetchBootcampsWithFilter(averageRating, averageCost);
  };

  const notify = msg =>
    toast.error(`🔍 ${msg}`, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    });

  if (bootcampsLoading) {
    return <Loading />;
  }

  return (
    <div className='container'>
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
      <div className='title my-4'>
        <h2>bootcamps</h2>
        <div className='underline'></div>
      </div>
      <div className='row'>
        <div className='col-md-4'>
          <div className='card card-body mb-4'>
            <h4 className='mb-3'>By Location</h4>
            <form onSubmit={handleRadiusSubmit}>
              <div className='row'>
                <div className='col-md-6'>
                  <div className='form-group'>
                    <input
                      type='number'
                      className='form-control mb-3'
                      name='miles'
                      id='miles'
                      placeholder='Miles From'
                      min='1'
                      step='1'
                      onChange={e => setMiles(e.target.value)}
                      value={miles}
                    />
                  </div>
                </div>
                <div className='col-md-6'>
                  <div className='form-group'>
                    <input
                      type='number'
                      className='form-control mb-3'
                      name='zipcode'
                      id='zipcode'
                      placeholder='Enter Zipcode'
                      min='0'
                      onChange={e => setZipcode(e.target.value)}
                      value={zipcode}
                    />
                  </div>
                </div>
              </div>
              <input
                type='submit'
                value='Find Bootcamps'
                className='btn btn-primary btn-block w-100'
              />
            </form>
          </div>

          <div className='card card-body mb-4'>
            <h4>Filter</h4>
            <form onSubmit={handleFilterSubmit}>
              <div className='form-group'>
                <label className='me-2'> Rating </label>
                <select
                  className='custom-select mb-3'
                  value={averageRating}
                  id='averageRating'
                  name='averageRating'
                  onChange={e => setAverageRating(e.target.value)}
                >
                  <option value='any'>Any</option>
                  <option value='9'>9+</option>
                  <option value='8'>8+</option>
                  <option value='7'>7+</option>
                  <option value='6'>6+</option>
                  <option value='5'>5+</option>
                  <option value='4'>4+</option>
                  <option value='3'>3+</option>
                  <option value='2'>2+</option>
                </select>
              </div>

              <div className='form-group'>
                <label className='me-2'> Budget </label>
                <select
                  className='custom-select mb-3'
                  value={averageCost}
                  id='averageCost'
                  name='averageCost'
                  onChange={e => setAverageCost(e.target.value)}
                >
                  <option value='any'>Any</option>
                  <option value='20000'>$20,000</option>
                  <option value='15000'>$15,000</option>
                  <option value='10000'>$10,000</option>
                  <option value='8000'>$8,000</option>
                  <option value='6000'>$6,000</option>
                  <option value='4000'>$4,000</option>
                  <option value='2000'>$2,000</option>
                </select>
              </div>
              <input
                type='submit'
                value='Find Bootcamps'
                className='btn btn-primary btn-block w-100'
              />
            </form>
          </div>
        </div>
        <div className='col-md-8'>
          {bootcamps.map(bootcamp => {
            return <Bootcamp key={bootcamp._id} {...bootcamp} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default BootCamps;
