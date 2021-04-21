import {
  REGISTER_START,
  LOGIN_START,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
  USER_UPDATED,
  SET_AUTH_LINKS
} from '../actions';

const authReducer = (state, action) => {
  switch (action.type) {
    case REGISTER_START:
    case LOGIN_START:
      return {
        ...state,
        loading: true
      };
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', action.token);
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload,
        token: action.token
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload
      };
    case USER_UPDATED:
      return {
        ...state,
        user: {
          ...state.user,
          name: action.payload.name,
          email: action.payload.email
        }
      };
    case SET_AUTH_LINKS:
      const tempAuthLinks = [];
      if (state.user && state.user.role !== 'user') {
        tempAuthLinks.push({
          id: 1,
          text: 'Manage Bootcamp',
          url: '/managebootcamps'
        });
      }

      if (state.user && state.user.role !== 'publisher') {
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
      return {
        ...state,
        authLinks: [...tempAuthLinks]
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export default authReducer;
