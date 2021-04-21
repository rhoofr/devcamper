import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { notifyError, notifySuccess } from '../utils/toastNotify';
import { useAuthContext } from '../context/authContext';
import { baseAPIUrl } from '../utils/constants';

const ManageAccountPage = props => {
  const { user, updateUser } = useAuthContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
  }, [user]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (name.trim() === '' || email.trim() === '') {
      return notifyError(`❕ Please enter name and email`);
    }

    try {
      await axios.put(`${baseAPIUrl}/auth/updatedetails`, { name, email });
      updateUser(name, email);

      notifySuccess('✅ Account was updated');
      props.history.push('/');
    } catch (e) {
      if (e.response.data.error) {
        console.log(e.response.data.error);
        return notifyError(`❌ ${e.response.data.error}`);
      }

      notifyError('❌ An error occurred updating account');
    }
  };

  return (
    <section className='container mt-5'>
      <div className='row'>
        <div className='col-md-8 m-auto'>
          <div className='card bg-white py-2 px-4'>
            <div className='card-body'>
              <h1 className='mb-2'>Manage Account</h1>
              <form onSubmit={handleSubmit} noValidate>
                <div className='form-group'>
                  <label>Name</label>
                  <input
                    type='text'
                    name='name'
                    required
                    className='form-control'
                    placeholder='Name'
                    value={name}
                    onChange={e => setName(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className='form-group mb-3'>
                  <label>Email</label>
                  <input
                    type='email'
                    name='email'
                    required
                    className='form-control'
                    placeholder='Email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div className='form-group'>
                  <div className='row'>
                    <div className='col-sm-6 mb-2 mb-sm-0'>
                      <input
                        type='submit'
                        value='Save'
                        className='btn btn-success btn-block w-100'
                      />
                    </div>
                    <div className='col-sm-6'>
                      <Link
                        to='/updatepassword'
                        className='btn btn-secondary btn-block w-100'
                      >
                        Update Password
                      </Link>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageAccountPage;
