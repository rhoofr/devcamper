import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MultiSelect from 'react-multi-select-component';
import { notifyError, notifySuccess } from '../utils/toastNotify';
import { useAuthContext } from '../context/authContext';
import { useBootcampsContext } from '../context/bootcampsContext';
import Loading from '../components/Loading';

const AddEditBootcampPage = props => {
  const { user } = useAuthContext();
  const {
    bootcampsLoading,
    addBootcamp,
    updateBootcamp,
    clearErrors,
    error
  } = useBootcampsContext();
  let editMode;
  let bootcampToEdit;
  if (props.location.state) {
    editMode = props.location.state.editMode;
    bootcampToEdit = props.location.state.bootcampToEdit;
  }

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

  const careerOptions = [
    { label: 'Web Development', value: 'Web Development' },
    { label: 'Mobile Development', value: 'Mobile Development' },
    { label: 'UI/UX', value: 'UI/UX' },
    { label: 'Data Science', value: 'Data Science' },
    { label: 'Business', value: 'Business' },
    { label: 'Other', value: 'Other' }
  ];

  if (editMode) {
    bootcampToEdit.address = `${bootcampToEdit.location.street}, ${bootcampToEdit.location.city}, ${bootcampToEdit.location.state}, ${bootcampToEdit.location.zipcode}`;
  }
  const [selectedCareerOptions, setSelectedCareerOptions] = useState(
    editMode ? transformSelectedCareerOptions(bootcampToEdit.careers) : []
  );
  const [bootcamp, setBootcamp] = useState(
    editMode ? bootcampToEdit : initialState
  );

  function transformSelectedCareerOptions(options) {
    const retArr = [];
    for (let i = 0; i < options.length; i++) {
      const option = { label: options[i], value: options[i] };
      retArr.push(option);
    }
    return retArr;
  }

  function transformSelectedCareerOptionsForSave() {
    const retArr = [];
    for (let i = 0; i < selectedCareerOptions.length; i++) {
      retArr.push(selectedCareerOptions[i].value);
    }
    return retArr;
  }

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

    if (editMode) {
      await updateBootcamp(bootcamp._id, {
        name: bootcamp.name,
        address: bootcamp.address,
        phone: bootcamp.phone,
        email: bootcamp.email,
        website: bootcamp.website,
        description: bootcamp.description,
        housing: bootcamp.housing,
        jobAssistance: bootcamp.jobAssistance,
        jobGuarantee: bootcamp.jobGuarantee,
        acceptGi: bootcamp.acceptGi,
        user: user._id,
        careers: transformSelectedCareerOptionsForSave()
      });
      if (error) {
        notifyError(`👎 ${error}`);
        clearErrors();
      } else {
        notifySuccess('✅ Bootcamp updated');
        return props.history.push('/managebootcamps');
      }
    } else {
      await addBootcamp({
        name: bootcamp.name,
        address: bootcamp.address,
        phone: bootcamp.phone,
        email: bootcamp.email,
        website: bootcamp.website,
        description: bootcamp.description,
        housing: bootcamp.housing,
        jobAssistance: bootcamp.jobAssistance,
        jobGuarantee: bootcamp.jobGuarantee,
        acceptGi: bootcamp.acceptGi,
        user: user._id,
        careers: transformSelectedCareerOptionsForSave()
      });

      if (error) {
        notifyError(`👎 ${error}`);
        clearErrors();
      } else {
        notifySuccess('✅ Bootcamp added');
        return props.history.push('/managebootcamps');
      }
    }
  };

  if (bootcampsLoading) {
    return <Loading />;
  }

  return (
    <section className='container mt-3'>
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
                    autoFocus={!editMode}
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
                  <MultiSelect
                    options={careerOptions}
                    id='selectCareers'
                    disableSearch
                    value={selectedCareerOptions}
                    onChange={setSelectedCareerOptions}
                    labelledBy={'Select all that apply (at least one)'}
                  />
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
