import {
  SIDEBAR_OPEN,
  SIDEBAR_CLOSE,
  GET_BOOTCAMPS_BEGIN,
  GET_BOOTCAMPS_SUCCESS,
  GET_BOOTCAMPS_ERROR,
  GET_SINGLE_BOOTCAMP_BEGIN,
  GET_SINGLE_BOOTCAMP_SUCCESS,
  GET_BOOTCAMP_COURSES_SUCCESS,
  GET_SINGLE_BOOTCAMP_ERROR,
  SUBMIT_BOOTCAMP_PHOTO_SUCCESS,
  SUBMIT_BOOTCAMP_PHOTO_ERROR,
  DELETE_BOOTCAMP_SUCCESS,
  DELETE_BOOTCAMP_ERROR,
  ADD_BOOTCAMP_SUCCESS,
  ADD_BOOTCAMP_ERROR,
  UPDATE_BOOTCAMP_SUCCESS,
  UPDATE_BOOTCAMP_ERROR,
  // DELETE_COURSE_SUCCESS,
  DELETE_COURSE_ERROR,
  // ADD_COURSE_SUCCESS,
  ADD_COURSE_ERROR,
  // UPDATE_COURSE_SUCCESS,
  UPDATE_COURSE_ERROR,
  CLEAR_ERRORS
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
    case GET_SINGLE_BOOTCAMP_ERROR:
      return {
        ...state,
        singleBootcampLoading: false,
        singleBootcampError: true
      };
    case GET_BOOTCAMP_COURSES_SUCCESS:
      return {
        ...state,
        courses: action.payload
      };

    case SUBMIT_BOOTCAMP_PHOTO_SUCCESS:
      return {
        ...state,
        bootcampsLoading: false,
        bootcamps: state.bootcamps.map(bootcamp =>
          bootcamp._id === action.payload.id
            ? { ...bootcamp, photo: action.payload.photo }
            : bootcamp
        )
      };
    case DELETE_BOOTCAMP_SUCCESS:
      const tempBootcamps = state.bootcamps.filter(bootcamp => {
        return bootcamp._id !== action.payload;
      });

      return { ...state, bootcampsLoading: false, bootcamps: tempBootcamps };
    case ADD_BOOTCAMP_SUCCESS:
      return {
        ...state,
        bootcampsLoading: false,
        bootcamps: [...state.bootcamps, action.payload]
      };
    case UPDATE_BOOTCAMP_SUCCESS:
      return {
        ...state,
        bootcampsLoading: false,
        bootcamps: state.bootcamps.map(bootcamp =>
          bootcamp._id === action.payload._id ? action.payload : bootcamp
        )
      };
    // case ADD_COURSE_SUCCESS: ///////////////////////////////////////////
    //   return {
    //     ...state,
    //     bootcampsLoading: false,
    //     bootcamps: [...state.bootcamps, action.payload]
    //   };
    // case DELETE_COURSE_SUCCESS: ///////////////////////////////////////
    //   state.bootcamps.forEach(bootcamp =>
    //     bootcamp.courses.forEach((course, index) => {
    //       if (
    //         course._id === action.payload.courseId &&
    //         bootcamp._id === action.payload.bootcampId
    //       ) {
    //         return bootcamp.courses.splice(index, 1);
    //       }
    //     })
    //   );

    //   return { ...state, bootcampsLoading: false };
    // case UPDATE_COURSE_SUCCESS: ////////////////////////////////////////////
    //   return {
    //     ...state,
    //     bootcampsLoading: false,
    //     bootcamps: state.bootcamps.map(bootcamp =>
    //       bootcamp._id === action.payload._id ? action.payload : bootcamp
    //     )
    //   };
    case SUBMIT_BOOTCAMP_PHOTO_ERROR:
    case DELETE_BOOTCAMP_ERROR:
    case UPDATE_BOOTCAMP_ERROR:
    case ADD_BOOTCAMP_ERROR:
    case DELETE_COURSE_ERROR:
    case UPDATE_COURSE_ERROR:
    case ADD_COURSE_ERROR:
      return {
        ...state,
        error: action.payload,
        bootcampsLoading: false
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        bootcampsError: false
      };
    default:
      return state;
  }
};

export default bootcampReducer;
