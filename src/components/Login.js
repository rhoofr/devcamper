import React, { useState, useEffect } from 'react';
// import AlertContext from '../context/alert/alertContext';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/authContext';
import { ToastContainer } from 'react-toastify';
import { notifyError } from '../utils/toastNotify';
// import 'react-toastify/dist/ReactToastify.css';

const Login = props => {
  const { login, error, clearErrors, isAuthenticated } = useAuthContext();
  // const alertContext = useContext(AlertContext);

  // const { setAlert } = alertContext;
  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const { email, password } = user;

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push('/');
    }

    if (error) {
      // setAlert(error, 'danger', 3000);
      notifyError(`👎 ${error}`);
      clearErrors();
    }
    // eslint-disable-next-line
  }, [error, isAuthenticated, props.history]);

  const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (email.trim() === '' || password.trim() === '') {
      notifyError(`❕ Please enter email and password`);
      // notify('❕ Please enter email and passord');
      // setAlert('Please enter all fields', 'danger', 3000);
    } else {
      login({
        email,
        password
      });
    }
  };

  return (
    <section className='form mt-5'>
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
        <div className='row'>
          <div className='col-md-6 m-auto'>
            <div className='card bg-white p-4 mb-4'>
              <div className='card-body'>
                <h1>
                  <i className='fas fa-sign-in-alt'></i> Login
                </h1>
                <p>
                  Log in to list your bootcamp or rate, review and favorite
                  bootcamps
                </p>
                <form onSubmit={onSubmit} noValidate>
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
                      autoFocus
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

                  <div className='form-group mb-3'>
                    <input
                      type='submit'
                      value='Login'
                      className='btn btn-primary btn-block w-100'
                    />
                  </div>
                </form>
                <p>
                  Not Registered? <Link to='/register'>Register here</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Login;
