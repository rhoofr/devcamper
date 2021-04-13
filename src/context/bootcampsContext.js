import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import reducer from '../reducers/bootcampsReducer';
import { baseUrl } from '../utils/constants';
import {
  SIDEBAR_OPEN,
  SIDEBAR_CLOSE,
  GET_BOOTCAMPS_BEGIN,
  GET_BOOTCAMPS_SUCCESS,
  GET_BOOTCAMPS_ERROR,
  GET_SINGLE_BOOTCAMP_BEGIN,
  GET_SINGLE_BOOTCAMP_SUCCESS,
  GET_SINGLE_BOOTCAMP_ERROR,
  GET_BOOTCAMP_COURSES_SUCCESS
} from '../actions';

const initialState = {
  isSidebarOpen: false,
  bootcampsLoading: false,
  bootcampsError: false,
  bootcamps: [],
  singleBootcampLoading: false,
  singleBootcampError: false,
  singleBootcamp: {},
  courses: []
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
    fetchBootcamps(`${baseUrl}/bootcamps/radius/${zipcode}/${miles}`);
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

    fetchBootcamps(`${baseUrl}/bootcamps/${queryParam}`);
  };

  const fetchCoursesForBootcamp = async id => {
    try {
      const response = await axios(`${baseUrl}/bootcamps/${id}/courses`);
      const courses = response.data.data;

      if (courses) {
        dispatch({ type: GET_BOOTCAMP_COURSES_SUCCESS, payload: courses });
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: GET_SINGLE_BOOTCAMP_ERROR });
    }
  };

  const fetchSingleBootcamp = async id => {
    dispatch({ type: GET_SINGLE_BOOTCAMP_BEGIN });

    try {
      const response = await axios(`${baseUrl}/bootcamps/${id}`);
      const bootcamp = response.data.data;

      if (response) {
        await fetchCoursesForBootcamp(id);
        dispatch({ type: GET_SINGLE_BOOTCAMP_SUCCESS, payload: bootcamp });
      }
    } catch (error) {
      console.error(error);
      dispatch({ type: GET_SINGLE_BOOTCAMP_ERROR });
    }
  };

  useEffect(() => {
    fetchBootcamps(`${baseUrl}/bootcamps`);
  }, []);

  return (
    <BootcampsContext.Provider
      value={{
        ...state,
        openSidebar,
        closeSidebar,
        fetchSingleBootcamp,
        fetchBootcampsWithinRadius,
        fetchBootcampsWithFilter
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
