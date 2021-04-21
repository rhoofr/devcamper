import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBootcampsContext } from '../context/bootcampsContext';
import { useAuthContext } from '../context/authContext';
import { FaTimes } from 'react-icons/fa';
import Loading from '../components/Loading';

const Sidebar = () => {
  const { isSidebarOpen, closeSidebar } = useBootcampsContext();
  const [loading, setLoading] = useState(true);
  const [authLinks, setAuthLinks] = useState([]);
  const { isAuthenticated, logout, user } = useAuthContext();

  useEffect(() => {
    const initAuthLinks = () => {
      const tempAuthLinks = [];
      if (user && user.role !== 'user') {
        tempAuthLinks.push({
          id: 1,
          text: 'Manage Bootcamp',
          url: '/managebootcamps'
        });
      }

      if (user && user.role !== 'publisher') {
        tempAuthLinks.push({
          id: 2,
          text: 'Manage Reviews',
          url: '/managereviews'
        });
      }

      tempAuthLinks.push({
        id: 3,
        text: 'Manage Account',
        url: '/manageaccount'
      });

      tempAuthLinks.push({
        id: 4,
        text: 'Logout',
        url: '/'
      });

      setAuthLinks(tempAuthLinks);
    };

    initAuthLinks();
    setLoading(false);
    // eslint-disable-next-line
  }, [isAuthenticated, user]);

  const guestLinks = [
    {
      id: 5,
      text: 'Login',
      url: '/login'
    },
    {
      id: 6,
      text: 'Register',
      url: '/register'
    }
  ];

  const handleClick = text => {
    if (text === 'Logout') logout();
    closeSidebar();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='sidebarContainer'>
      <aside
        className={`${isSidebarOpen ? 'sidebar show-sidebar' : 'sidebar'}`}
      >
        <div className='sidebar-header'>
          <button className='close-btn' onClick={closeSidebar}>
            <FaTimes />
          </button>
        </div>
        <ul className='links'>
          {isAuthenticated
            ? authLinks.map(({ id, text, url }) => {
                return (
                  <li key={id}>
                    <Link
                      to={url}
                      onClick={() => {
                        handleClick(text);
                      }}
                    >
                      {text}
                    </Link>
                  </li>
                );
              })
            : guestLinks.map(({ id, text, url }) => {
                return (
                  <li key={id}>
                    <Link to={url} onClick={closeSidebar}>
                      {text}
                    </Link>
                  </li>
                );
              })}
          <li key={20} className='nav-item'>
            <Link className='nav-link' to='/' onClick={closeSidebar}>
              Browse Bootcamps
            </Link>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
