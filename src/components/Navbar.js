import React, { useEffect } from 'react';
import {
  FaLaptopCode,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserPlus,
  FaUser
} from 'react-icons/fa';
import { IconContext } from 'react-icons';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/authContext';
import { useBootcampsContext } from '../context/bootcampsContext';

const Nav = () => {
  const { openSidebar } = useBootcampsContext();
  const { user, isAuthenticated, logout, loadUser } = useAuthContext();

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  const onLogout = () => {
    logout();
  };

  const authLinks = (
    <>
      <li className='nav-item dropdown'>
        <a
          className='nav-link dropdown-toggle'
          href='/'
          id='navbarDropdown'
          role='button'
          data-bs-toggle='dropdown'
        >
          <FaUser /> Account
        </a>
        <div className='dropdown-menu'>
          {user && user.role !== 'user' && (
            <Link className='dropdown-item' to='/managebootcamps'>
              Manage Bootcamp
            </Link>
          )}
          {user && user.role !== 'publisher' && (
            <Link className='dropdown-item' to='/managereviews'>
              Manage Reviews
            </Link>
          )}
          <Link className='dropdown-item' to='/manageaccount'>
            Manage Account
          </Link>
          <div className='dropdown-divider'></div>
          <Link className='dropdown-item' onClick={onLogout} to='/'>
            <FaSignOutAlt /> Logout
          </Link>
        </div>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li className='nav-item'>
        <Link className='nav-link' to='/login'>
          <FaSignInAlt /> Login
        </Link>
      </li>
      <li className='nav-item'>
        <Link className='nav-link' to='/register'>
          <FaUserPlus /> Register
        </Link>
      </li>
    </>
  );

  return (
    <nav className='navbar navbar-expand-sm navbar-dark bg-primary'>
      <div className='container'>
        <IconContext.Provider value={{ className: 'react-icons' }}>
          <FaLaptopCode />
        </IconContext.Provider>
        <Link className='navbar-brand' to='/'>
          <i className='fas fa-laptop-code'></i> DevCamper
        </Link>
        <button
          className='navbar-toggler'
          type='button'
          data-toggle='collapse'
          onClick={openSidebar}
          data-target='#navbarSupportedContent'
        >
          <span className='navbar-toggler-icon'></span>
        </button>

        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          <ul className='navbar-nav ms-auto'>
            {isAuthenticated ? authLinks : guestLinks}
            <li className='nav-item d-none d-sm-block'>
              <Link className='nav-link' to='/'>
                |
              </Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to='/'>
                Browse Bootcamps
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
