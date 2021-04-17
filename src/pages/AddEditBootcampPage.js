import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { notifyError, notifySuccess } from '../utils/toastNotify';
import { useAuthContext } from '../context/authContext';
import { useBootcampsContext } from '../context/bootcampsContext';
import { baseAPIUrl } from '../utils/constants';
import Loading from '../components/Loading';

const AddEditBootcampPage = props => {
  const { user } = useAuthContext();
  const { fetchBootcamps } = useBootcampsContext();
  const { editMode, bootcampToEdit } = props.location.state;
  const initialState = {
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    description: '',
    housing: false,
    jobAssistance: false,
    jobGuarantee: false,
    acceptGi: false
  };

  const [loading, setLoading] = useState(false);
  const [selectedCareerOptions, setSelectedCareerOptions] = useState(
    editMode ? bootcampToEdit.careers : []
  );
  if (editMode) {
    // setLoading(true);
    bootcampToEdit.address = `${bootcampToEdit.location.street}, ${bootcampToEdit.location.city}, ${bootcampToEdit.location.state}, ${bootcampToEdit.location.zipcode}`;
    // setSelectedCareerOptions(bootcampToEdit.careers);
    // console.log(bootcampToEdit.careers);
    // setLoading(false);
  }
  const [bootcamp, setBootcamp] = useState(
    editMode ? bootcampToEdit : initialState
  );

  // if (editMode) {
  //   setLoading(true);
  //   setBootcamp({
  //     ...bootcamp,
  //     address: `${bootcampToEdit.location.street}, ${bootcampToEdit.location.city}, ${bootcampToEdit.location.state}, ${bootcampToEdit.location.zipcode}`
  //   });
  //   setLoading(false);
  // }

  const {
    name,
    address,
    phone,
    email,
    website,
    description,
    housing,
    jobAssistance,
    jobGuarantee,
    acceptGi
  } = bootcamp;

  const onChange = e => {
    setBootcamp({ ...bootcamp, [e.target.name]: e.target.value });
  };

  const handleSelectChange = e => {
    console.log('in handleSelectChange');
    const options = e.target.options;
    const value = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setSelectedCareerOptions(value);
  };

  const validateFields = () => {
    if (
      bootcamp.name.trim() === '' ||
      bootcamp.address.trim() === '' ||
      bootcamp.description.trim() === '' ||
      selectedCareerOptions.length === 0
    ) {
      return false;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateFields()) {
      return notifyError('❌ Please enter all required fields');
    }
    try {
      if (editMode) {
        await axios.put(`${baseAPIUrl}/bootcamps/${bootcamp._id}`, {
          name: name,
          address: address,
          phone: phone,
          email: email,
          website: website,
          description: description,
          housing: housing,
          jobAssistance: jobAssistance,
          jobGuarantee: jobGuarantee,
          acceptGi: acceptGi,
          user: user._id,
          careers: selectedCareerOptions
        });
      } else {
        await axios.post(`${baseAPIUrl}/bootcamps`, {
          name: name,
          address: address,
          phone: phone,
          email: email,
          website: website,
          description: description,
          housing: housing,
          jobAssistance: jobAssistance,
          jobGuarantee: jobGuarantee,
          acceptGi: acceptGi,
          user: user._id,
          careers: selectedCareerOptions
        });
      }

      await fetchBootcamps(`${baseAPIUrl}/bootcamps`);
      props.history.push('/managebootcamps');
    } catch (e) {
      console.log(e);
      // console.log(e.response.data.error);
      if (e.response.data.error === 'Duplicate field value entered') {
        notifyError(`❕ Review already entered for this Bootcamp`);
      } else if (
        e.response.data.error ===
        'User role publisher is not authorized to access this route'
      ) {
        notifyError(`❕ User with publisher role cannot write reviews`);
      } else {
        notifyError(`❕ ${e.response.data.error}`);
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <section className='container mt-3'>
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
      <h1 className='mb-2'>{editMode ? 'Edit' : 'Add'} Bootcamp</h1>
      <p>
        Important: You must be affiliated with a bootcamp to add to DevCamper
      </p>
      <form onSubmit={handleSubmit} noValidate>
        <div className='row'>
          <div className='col-md-6'>
            <div className='card bg-white py-2 px-4'>
              <div className='card-body'>
                <h3>Location & Contact</h3>
                <p className='text-muted'>
                  If multiple locations, use the main or largest
                </p>
                <div className='form-group'>
                  <label>
                    Name{' '}
                    <small>
                      <span className='text-danger'>(Required)</span>
                    </small>
                  </label>
                  <input
                    type='text'
                    name='name'
                    value={name}
                    onChange={onChange}
                    className='form-control'
                    placeholder='Bootcamp Name'
                    required
                    autoFocus
                  />
                </div>
                <div className='form-group'>
                  <label>
                    Address{' '}
                    <small>
                      <span className='text-danger'>(Required)</span>
                    </small>
                  </label>
                  <input
                    type='text'
                    name='address'
                    value={address}
                    onChange={onChange}
                    className='form-control'
                    placeholder='Full Address'
                    required
                  />
                  <small className='form-text text-muted'>
                    Street, city, state, zipcode
                  </small>
                </div>
                <div className='form-group'>
                  <label>Phone Number</label>
                  <input
                    type='text'
                    name='phone'
                    value={phone}
                    onChange={onChange}
                    className='form-control'
                    placeholder='Phone'
                  />
                </div>
                <div className='form-group'>
                  <label>Email</label>
                  <input
                    type='email'
                    name='email'
                    value={email}
                    onChange={onChange}
                    className='form-control'
                    placeholder='Contact Email'
                  />
                </div>
                <div className='form-group'>
                  <label>Website</label>
                  <input
                    type='url'
                    name='website'
                    value={website}
                    onChange={onChange}
                    className='form-control'
                    placeholder='Website URL'
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='col-md-6'>
            <div className='card bg-white py-2 px-4'>
              <div className='card-body'>
                <h3>Other Info</h3>
                <div className='form-group'>
                  <label>
                    Description{' '}
                    <small>
                      <span className='text-danger'>(Required)</span>
                    </small>
                  </label>
                  <textarea
                    name='description'
                    value={description}
                    onChange={onChange}
                    required
                    rows='5'
                    className='form-control'
                    placeholder='Description (What you offer, etc)'
                    maxLength='500'
                  ></textarea>
                  <small className='form-text text-muted'>
                    No more than 500 characters
                  </small>
                </div>
                <div className='form-group mb-3'>
                  <label htmlFor='selectCareers' className='form-label'>
                    Careers{' '}
                    <small>
                      <span className='text-danger'>(Required)</span>
                    </small>
                  </label>
                  <select
                    name='careers'
                    id='selectCareers'
                    className='form-select'
                    multiple
                    onChange={handleSelectChange}
                  >
                    <option disabled>
                      Select all that apply (at least one)
                    </option>
                    <option value='Web Development'>Web Development</option>
                    <option value='Mobile Development'>
                      Mobile Development
                    </option>
                    <option value='UI/UX'>UI/UX</option>
                    <option value='Data Science'>Data Science</option>
                    <option value='Business'>Business</option>
                    <option value='Other'>Other</option>
                  </select>
                </div>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    checked={housing}
                    onChange={e => {
                      onChange({
                        target: {
                          name: e.target.name,
                          value: e.target.checked
                        }
                      });
                    }}
                    name='housing'
                    id='housing'
                  />
                  <label className='form-check-label' htmlFor='housing'>
                    Housing
                  </label>
                </div>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    checked={jobAssistance}
                    onChange={e => {
                      onChange({
                        target: {
                          name: e.target.name,
                          value: e.target.checked
                        }
                      });
                    }}
                    name='jobAssistance'
                    id='jobAssistance'
                  />
                  <label className='form-check-label' htmlFor='jobAssistance'>
                    Job Assistance
                  </label>
                </div>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    checked={jobGuarantee}
                    onChange={e => {
                      onChange({
                        target: {
                          name: e.target.name,
                          value: e.target.checked
                        }
                      });
                    }}
                    name='jobGuarantee'
                    id='jobGuarantee'
                  />
                  <label className='form-check-label' htmlFor='jobGuarantee'>
                    Job Guarantee
                  </label>
                </div>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    checked={acceptGi}
                    onChange={e => {
                      onChange({
                        target: {
                          name: e.target.name,
                          value: e.target.checked
                        }
                      });
                    }}
                    name='acceptGi'
                    id='acceptGi'
                  />
                  <label className='form-check-label' htmlFor='acceptGi'>
                    Accepts GI Bill
                  </label>
                </div>
                <p className='text-muted mt-3 mb-0'>
                  *After you add the bootcamp, you can add the specific courses
                  offered
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-6'>
            <input
              type='submit'
              value='Submit Bootcamp'
              className='btn btn-success btn-block my-4 w-100'
            />
          </div>
          <div className='col-md-6'>
            <Link
              to='/managebootcamps'
              className='btn btn-danger btn-block my-4 w-100'
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </section>
  );
};

export default AddEditBootcampPage;
