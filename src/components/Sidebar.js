import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBootcampsContext } from '../context/bootcampsContext';
import { useAuthContext } from '../context/authContext';
import { FaTimes } from 'react-icons/fa';
import Loading from '../components/Loading';

const Sidebar = () => {
  const { isSidebarOpen, closeSidebar } = useBootcampsContext();
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, authLinks, setAuthLinks, logout } = useAuthContext();

  // const authLinks = [];

  useEffect(() => {
    setAuthLinks();
    setLoading(false);
    // eslint-disable-next-line
  }, [isAuthenticated]);

  // useEffect(() => {
  //   setLoading(true);
  //   function populateAuthLinks() {
  //     if (user && user.role !== 'user') {
  //       authLinks.push({
  //         id: 1,
  //         text: 'Manage Bootcamp',
  //         url: '/managebootcamps'
  //       });
  //     }

  //     if (user && user.role !== 'publisher') {
  //       authLinks.push({
  //         id: 2,
  //         text: 'Manage Reviews',
  //         url: '/managereviews'
  //       });
  //     }

  //     authLinks.push({
  //       id: 3,
  //       text: 'Manage Account',
  //       url: '/manageaccount'
  //     });

  //     authLinks.push({
  //       id: 4,
  //       text: 'Logout',
  //       url: '/'
  //     });
  //   }

  //   populateAuthLinks();

  //   console.log(authLinks);
  //   setLoading(false);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [user, isAuthenticated]);

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

// const SidebarContainer = styled.div`
//   text-align: center;
//   .sidebar-header {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     padding: 1rem 1.5rem;
//   }
//   .close-btn {
//     font-size: 2rem;
//     background: transparent;
//     border-color: transparent;
//     color: var(--clr-primary-5);
//     transition: var(--transition);
//     cursor: pointer;
//     color: var(--clr-red-dark);
//     margin-top: 0.2rem;
//   }
//   .close-btn:hover {
//     color: var(--clr-red-light);
//   }
//   .logo {
//     justify-self: center;
//     height: 45px;
//   }
//   .links {
//     margin-bottom: 2rem;
//   }
//   .links a {
//     display: block;
//     text-align: left;
//     font-size: 1rem;
//     text-transform: capitalize;
//     padding: 1rem 1.5rem;
//     color: var(--clr-grey-3);
//     transition: var(--transition);
//     letter-spacing: var(--spacing);
//   }

//   .links a:hover {
//     padding: 1rem 1.5rem;
//     padding-left: 2rem;
//     background: var(--clr-grey-10);
//     color: var(--clr-grey-2);
//   }

//   .sidebar {
//     position: fixed;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     background: var(--clr-white);
//     transition: var(--transition);
//     transform: translate(-100%);
//     z-index: -1;
//   }
//   .show-sidebar {
//     transform: translate(0);
//     z-index: 999;
//   }
//   .cart-btn-wrapper {
//     margin: 2rem auto;
//   }
//   @media screen and (min-width: 992px) {
//     .sidebar {
//       display: none;
//     }
//   }
// `;

export default Sidebar;
