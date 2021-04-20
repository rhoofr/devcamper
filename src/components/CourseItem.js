import { FaTimes, FaPencilAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CourseItem = ({
  _id,
  title,
  description,
  minimumSkill,
  weeks,
  tuition,
  setIdToDelete,
  bootcamp,
  bootcampName
}) => {
  const course = {
    _id,
    title,
    description,
    minimumSkill,
    weeks,
    tuition,
    bootcamp,
    bootcampName
  };

  return (
    <>
      <tr className='align-middle'>
        <td className=''>{title}</td>
        <td>
          <div className='float-end'>
            <Link
              to={{
                pathname: `/editcourse/${_id}`,
                courseToEdit: course,
                editMode: true
              }}
              className='btn btn-secondary me-2'
            >
              <FaPencilAlt />
            </Link>
            <button
              type='button'
              className='btn btn-danger'
              data-bs-toggle='modal'
              data-bs-target='#reviewModal'
              onClick={() => setIdToDelete(_id)}
            >
              <FaTimes />
            </button>
          </div>
        </td>
      </tr>
    </>
  );
};

export default CourseItem;
