import {
  SIDEBAR_OPEN,
  SIDEBAR_CLOSE,
  GET_BOOTCAMPS_BEGIN,
  GET_BOOTCAMPS_SUCCESS,
  GET_BOOTCAMPS_ERROR,
  GET_SINGLE_BOOTCAMP_BEGIN,
  GET_SINGLE_BOOTCAMP_SUCCESS,
  GET_BOOTCAMP_COURSES_SUCCESS,
  GET_SINGLE_BOOTCAMP_ERROR
} from '../actions';

const bootcampReducer = (state, action) => {
  switch (action.type) {
    case SIDEBAR_OPEN:
      return {
        ...state,
        isSidebarOpen: true
      };
    case SIDEBAR_CLOSE:
      return {
        ...state,
        isSidebarOpen: false
      };
    case GET_BOOTCAMPS_BEGIN:
      return {
        ...state,
        bootcampsLoading: true
      };
    case GET_BOOTCAMPS_SUCCESS:
      return {
        ...state,
        bootcampsLoading: false,
        bootcamps: action.payload
      };
    case GET_BOOTCAMPS_ERROR:
      return {
        ...state,
        bootcampsLoading: false,
        bootcampsError: true
      };
    case GET_SINGLE_BOOTCAMP_BEGIN:
      return {
        ...state,
        singleBootcampLoading: true,
        singleBootcampError: false
      };
    case GET_SINGLE_BOOTCAMP_SUCCESS:
      return {
        ...state,
        singleBootcampLoading: false,
        singleBootcamp: action.payload
      };
    case GET_BOOTCAMP_COURSES_SUCCESS:
      return {
        ...state,
        courses: action.payload
      };
    case GET_SINGLE_BOOTCAMP_ERROR:
      return {
        ...state,
        singleBootcampLoading: false,
        singleBootcampError: true
      };
    default:
      return state;
  }
};

export default bootcampReducer;
