import React, { useState } from 'react';
import axios from 'axios';
import { notifyError, notifySuccess } from '../utils/toastNotify';

const baseAPIUrl = process.env.REACT_APP_BASE_API_URL;

const UpdatePasswordPage = props => {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (password === '' || newPassword === '' || newPassword2 === '') {
      return notifyError(`❕ Please enter all fields`);
    } else if (newPassword !== newPassword2) {
      return notifyError(`❕ Passwords do not match`);
    } else if (newPassword.trim().length < 6) {
      return notifyError(`❕ Min length for new password is 6 chars`);
    } else {
      try {
        await axios.put(`${baseAPIUrl}/auth/updatepassword`, {
          currentPassword: password,
          newPassword: newPassword
        });

        notifySuccess('✅ Password was updated');
        props.history.push('/');
      } catch (e) {
        if (e.response.data.error) {
          // console.log(e.response.data.error);
          return notifyError(`❌ ${e.response.data.error}`);
        }

        notifyError('❌ An error occurred updating password');
      }
    }
  };

  return (
    <section className='container mt-5'>
      <div className='row'>
        <div className='col-md-8 m-auto'>
          <div className='card bg-white py-2 px-4'>
            <div className='card-body'>
              <h1 className='mb-4'>Update Password</h1>
              <form onSubmit={handleSubmit} noValidate>
                <div className='form-group mb-3'>
                  <label>Current Password</label>
                  <input
                    type='password'
                    name='password'
                    required
                    className='form-control'
                    placeholder='Current Password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoFocus
                    minLength='6'
                  />
                </div>
                <div className='form-group mb-3'>
                  <label>New Password</label>
                  <input
                    type='password'
                    name='newPassword'
                    required
                    className='form-control'
                    placeholder='New Password'
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    minLength='6'
                  />
                </div>
                <div className='form-group mb-4'>
                  <label>Confirm New Password</label>
                  <input
                    type='password'
                    name='newPassword2'
                    required
                    className='form-control'
                    placeholder='Confirm New Password'
                    value={newPassword2}
                    onChange={e => setNewPassword2(e.target.value)}
                    minLength='6'
                  />
                </div>
                <div className='form-group'>
                  <input
                    type='submit'
                    value='Update Password'
                    className='btn btn-success btn-block w-100'
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpdatePasswordPage;
