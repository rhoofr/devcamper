import axios from 'axios';
import React, { useContext, useReducer } from 'react';
import reducer from '../reducers/authReducer';
import { baseAPIUrl } from '../utils/constants';
import setAuthToken from '../utils/setAuthToken';
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
  USER_UPDATED
} from '../actions';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: false,
  user: null,
  error: null
};

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Update User
  const updateUser = (name, email) => {
    dispatch({ type: USER_UPDATED, payload: { name, email } });
  };

  // Load User
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    if (!state.isAuthenticated && localStorage.token) {
      try {
        const res = await axios.get(`${baseAPIUrl}/auth/me`);

        dispatch({ type: USER_LOADED, payload: res.data.user });
      } catch (err) {
        dispatch({ type: AUTH_ERROR, payload: err.response.data.error });
      }
    }
  };

  // Register User
  const register = async formData => {
    // Clear Auth header before calling
    setAuthToken(null);
    dispatch({ type: REGISTER_START });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post(
        `${baseAPIUrl}/auth/register`,
        formData,
        config
      );

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data.user,
        token: res.data.token
      });
      setAuthToken(res.data.token);
    } catch (err) {
      dispatch({ type: REGISTER_FAIL, payload: err.response.data.error });
    }
  };

  // Login User
  const login = async formData => {
    // Clear Auth header before calling
    setAuthToken(null);
    dispatch({ type: LOGIN_START });

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post(
        `${baseAPIUrl}/auth/login`,
        formData,
        config
      );

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data.user,
        token: res.data.token
      });
      setAuthToken(res.data.token);
    } catch (err) {
      // console.log(err.response);
      dispatch({ type: LOGIN_FAIL, payload: err.response.data.error });
    }
  };

  // Logout User
  const logout = () => {
    // Clear Auth header before calling
    setAuthToken(null);

    dispatch({ type: LOGOUT });
  };

  // Clear Errors
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  // useEffect(() => {
  //   fetchBootcamps(`${baseAPIUrl}/bootcamps`);
  // }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        login,
        logout,
        clearErrors,
        loadUser,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
// make sure use
export const useAuthContext = () => {
  return useContext(AuthContext);
};
