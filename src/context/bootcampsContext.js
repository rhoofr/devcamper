import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import reducer from '../reducers/bootcampsReducer';

import {
  SIDEBAR_OPEN,
  SIDEBAR_CLOSE,
  GET_BOOTCAMPS_BEGIN,
  GET_BOOTCAMPS_SUCCESS,
  GET_BOOTCAMPS_ERROR,
  GET_SINGLE_BOOTCAMP_BEGIN,
  GET_SINGLE_BOOTCAMP_SUCCESS,
  GET_SINGLE_BOOTCAMP_ERROR,
  SUBMIT_BOOTCAMP_PHOTO_SUCCESS,
  SUBMIT_BOOTCAMP_PHOTO_ERROR,
  DELETE_BOOTCAMP_SUCCESS,
  DELETE_BOOTCAMP_ERROR,
  ADD_BOOTCAMP_SUCCESS,
  ADD_BOOTCAMP_ERROR,
  UPDATE_BOOTCAMP_SUCCESS,
  UPDATE_BOOTCAMP_ERROR,
  DELETE_COURSE_ERROR,
  ADD_COURSE_ERROR,
  UPDATE_COURSE_ERROR,
  CLEAR_ERRORS
} from '../actions';

const baseAPIUrl = process.env.REACT_APP_BASE_API_URL;

const initialState = {
  isSidebarOpen: false,
  bootcampsLoading: false,
  bootcampsError: false,
  bootcamps: [],
  singleBootcampLoading: false,
  singleBootcampError: false,
  singleBootcamp: {},
  error: null
};

const BootcampsContext = React.createContext();

export const BootcampsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const openSidebar = () => {
    dispatch({ type: SIDEBAR_OPEN });
  };
  const closeSidebar = () => {
    dispatch({ type: SIDEBAR_CLOSE });
  };

  // ?averageCost[lte]=9000
  // ?averageRating[gte]=7
  // ?select=name,description
  // ?sort=name,averageRating

  const fetchBootcamps = async url => {
    dispatch({ type: GET_BOOTCAMPS_BEGIN });

    try {
      const response = await axios(url);
      const bootcamps = response.data.data;

      if (response) {
        dispatch({ type: GET_BOOTCAMPS_SUCCESS, payload: bootcamps });
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: GET_BOOTCAMPS_ERROR });
    }
  };

  const fetchBootcampsWithinRadius = async (zipcode, miles) => {
    await fetchBootcamps(`${baseAPIUrl}/bootcamps/radius/${zipcode}/${miles}`);
  };

  const fetchBootcampsWithFilter = async (rating, cost) => {
    let queryParam = '';

    if (rating !== 'any') {
      queryParam = `?averageRating[gte]=${rating}`;
    }
    if (cost !== 'any') {
      if (!queryParam) {
        queryParam = `?averageCost[lte]=${cost}`;
      } else {
        queryParam += `&averageCost[lte]=${cost}`;
      }
    }

    fetchBootcamps(`${baseAPIUrl}/bootcamps/${queryParam}`);
  };

  const fetchSingleBootcamp = async id => {
    dispatch({ type: GET_SINGLE_BOOTCAMP_BEGIN });

    try {
      const response = await axios(`${baseAPIUrl}/bootcamps/${id}`);
      const bootcamp = response.data.data;

      if (response) {
        dispatch({ type: GET_SINGLE_BOOTCAMP_SUCCESS, payload: bootcamp });
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: GET_SINGLE_BOOTCAMP_ERROR });
    }
  };

  const submitBootcampPhoto = async (bootcampId, data) => {
    dispatch({ type: GET_BOOTCAMPS_BEGIN });

    try {
      // PUT bootcamps/5d725a1b7b292f5f8ceff788/photo
      const response = await axios.put(
        `${baseAPIUrl}/bootcamps/${bootcampId}/photo`,
        {
          body: JSON.stringify({ data }),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      dispatch({
        type: SUBMIT_BOOTCAMP_PHOTO_SUCCESS,
        payload: { photo: response.data.data, id: bootcampId }
      });
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        dispatch({
          type: SUBMIT_BOOTCAMP_PHOTO_ERROR,
          payload: error.response.data.error
        });
      } else {
        dispatch({
          type: SUBMIT_BOOTCAMP_PHOTO_ERROR,
          payload: 'An error occured uploading photo'
        });
      }
    }
  };

  const deleteBootcamp = async id => {
    dispatch({ type: GET_BOOTCAMPS_BEGIN });

    try {
      await axios.delete(`${baseAPIUrl}/bootcamps/${id}`);
      dispatch({ type: DELETE_BOOTCAMP_SUCCESS, payload: id });
    } catch (error) {
      // console.log(error.response.data);
      if (error.response && error.response.data && error.response.data.error) {
        dispatch({
          type: DELETE_BOOTCAMP_ERROR,
          payload: error.response.data.error
        });
      } else {
        dispatch({
          type: DELETE_BOOTCAMP_ERROR,
          payload: 'An error occured deleting bootcamp'
        });
      }
    }
  };

  const addBootcamp = async bootcamp => {
    dispatch({ type: GET_BOOTCAMPS_BEGIN });

    try {
      const newBootcamp = await axios.post(`${baseAPIUrl}/bootcamps`, bootcamp);
      dispatch({ type: ADD_BOOTCAMP_SUCCESS, payload: newBootcamp.data.data });
    } catch (error) {
      // console.log(error.response.data);
      if (error.response && error.response.data && error.response.data.error) {
        dispatch({
          type: ADD_BOOTCAMP_ERROR,
          payload: error.response.data.error
        });
      } else {
        dispatch({
          type: ADD_BOOTCAMP_ERROR,
          payload: 'An error occured creating bootcamp'
        });
      }
    }
  };

  const updateBootcamp = async (id, bootcamp) => {
    dispatch({ type: GET_BOOTCAMPS_BEGIN });

    try {
      const updatedBootcamp = await axios.put(
        `${baseAPIUrl}/bootcamps/${id}`,
        bootcamp
      );
      dispatch({
        type: UPDATE_BOOTCAMP_SUCCESS,
        payload: updatedBootcamp.data.data
      });
    } catch (error) {
      // console.log(error.response.data);
      if (error.response && error.response.data && error.response.data.error) {
        dispatch({
          type: UPDATE_BOOTCAMP_ERROR,
          payload: error.response.data.error
        });
      } else {
        dispatch({
          type: ADD_BOOTCAMP_ERROR,
          payload: 'An error occured creating bootcamp'
        });
      }
    }
  };

  const addCourse = async (bootcampId, course) => {
    dispatch({ type: GET_BOOTCAMPS_BEGIN });

    try {
      await axios.post(`${baseAPIUrl}/bootcamps/${bootcampId}/courses`, course);
      await fetchBootcamps(`${baseAPIUrl}/bootcamps`);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        dispatch({
          type: ADD_COURSE_ERROR,
          payload: error.response.data.error
        });
      } else {
        dispatch({
          type: ADD_COURSE_ERROR,
          payload: 'An error occured deleting course'
        });
      }
    }
  };

  const updateCourse = async (courseId, course) => {
    dispatch({ type: GET_BOOTCAMPS_BEGIN });

    try {
      await axios.put(`${baseAPIUrl}/courses/${courseId}`, course);
      await fetchBootcamps(`${baseAPIUrl}/bootcamps`);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        dispatch({
          type: UPDATE_COURSE_ERROR,
          payload: error.response.data.error
        });
      } else {
        dispatch({
          type: UPDATE_COURSE_ERROR,
          payload: 'An error occured deleting course'
        });
      }
    }
  };

  const deleteCourse = async courseId => {
    dispatch({ type: GET_BOOTCAMPS_BEGIN });

    try {
      await axios.delete(`${baseAPIUrl}/courses/${courseId}`);
      await fetchBootcamps(`${baseAPIUrl}/bootcamps`);
    } catch (error) {
      // console.log(error.response.data);
      if (error.response && error.response.data && error.response.data.error) {
        dispatch({
          type: DELETE_COURSE_ERROR,
          payload: error.response.data.error
        });
      } else {
        dispatch({
          type: DELETE_COURSE_ERROR,
          payload: 'An error occured deleting course'
        });
      }
    }
  };

  // Clear Errors
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  useEffect(() => {
    fetchBootcamps(`${baseAPIUrl}/bootcamps`);
  }, []);

  return (
    <BootcampsContext.Provider
      value={{
        ...state,
        openSidebar,
        closeSidebar,
        fetchBootcamps,
        fetchSingleBootcamp,
        fetchBootcampsWithinRadius,
        fetchBootcampsWithFilter,
        submitBootcampPhoto,
        deleteBootcamp,
        addBootcamp,
        updateBootcamp,
        addCourse,
        updateCourse,
        deleteCourse,
        clearErrors
      }}
    >
      {children}
    </BootcampsContext.Provider>
  );
};
// make sure use
export const useBootcampsContext = () => {
  return useContext(BootcampsContext);
};
