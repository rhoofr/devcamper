import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/authContext';
import { notifyError } from '../utils/toastNotify';

const Register = props => {
  const { register, error, clearErrors, isAuthenticated } = useAuthContext();

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'user'
  });

  const { name, email, password, password2, role } = user;

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push('/');
    }

    if (error) {
      notifyError(`👎 ${error}`);
      clearErrors();
    }
    // eslint-disable-next-line
  }, [error, isAuthenticated, props.history]);

  const onChange = e => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    if (name === '' || email === '' || password === '') {
      notifyError(`❕ Please enter all fields`);
    } else if (password !== password2) {
      notifyError(`❕ Passwords do not match`);
    } else {
      register({
        name,
        email,
        password,
        role
      });
    }
  };

  return (
    <section className='form mt-5'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-6 m-auto'>
            <div className='card bg-white p-4 mb-4'>
              <div className='card-body'>
                <h1>
                  <i className='fas fa-sign-in-alt'></i> Register
                </h1>
                <p>
                  Register to list your bootcamp or rate, review and favorite
                  bootcamps
                </p>
                <form onSubmit={onSubmit} noValidate>
                  <div className='mb-3'>
                    <label htmlFor='name' className='form-label'>
                      Name
                    </label>
                    <input
                      type='name'
                      className='form-control'
                      id='name'
                      name='name'
                      value={name}
                      onChange={onChange}
                      required
                      aria-describedby='nameHelp'
                      autoFocus
                    />
                  </div>

                  <div className='mb-3'>
                    <label htmlFor='email' className='form-label'>
                      Email address
                    </label>
                    <input
                      type='email'
                      className='form-control'
                      id='email'
                      name='email'
                      value={email}
                      onChange={onChange}
                      required
                      aria-describedby='emailHelp'
                    />
                  </div>

                  <div className='mb-3'>
                    <label htmlFor='password' className='form-label'>
                      Password
                    </label>
                    <input
                      type='password'
                      className='form-control'
                      id='password'
                      name='password'
                      value={password}
                      onChange={onChange}
                      required
                      aria-describedby='passwordHelp'
                      minLength='6'
                    />
                  </div>

                  <div className='mb-3'>
                    <label htmlFor='password' className='form-label'>
                      Confirm Password
                    </label>
                    <input
                      type='password'
                      className='form-control'
                      id='password2'
                      name='password2'
                      value={password2}
                      onChange={onChange}
                      required
                      aria-describedby='password2Help'
                      minLength='6'
                    />
                  </div>

                  <div className='card card-body mb-3'>
                    <h5>User Role</h5>
                    <div className='form-check'>
                      <input
                        className='form-check-input'
                        type='radio'
                        name='role'
                        id='user'
                        value='user'
                        checked={role === 'user'}
                        onChange={onChange}
                      />
                      <label htmlFor='user' className='form-check-label'>
                        Regular User (Browse, Write reviews, etc)
                      </label>
                    </div>
                    <div className='form-check'>
                      <input
                        className='form-check-input'
                        type='radio'
                        name='role'
                        id='publisher'
                        value='publisher'
                        onChange={onChange}
                        checked={role === 'publisher'}
                      />
                      <label htmlFor='publisher' className='form-check-label'>
                        Bootcamp Publisher
                      </label>
                    </div>
                  </div>
                  <p className='text-danger'>
                    * You must be affiliated with the bootcamp in some way in
                    order to add it to DevCamper.
                  </p>

                  <input
                    type='submit'
                    value='Register'
                    className='btn btn-primary btn-block w-100'
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
