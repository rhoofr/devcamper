import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa';
import { notifyError, notifySuccess } from '../utils/toastNotify';
import { useBootcampsContext } from '../context/bootcampsContext';
import Loading from '../components/Loading';

const AddEditCoursePage = props => {
  const {
    bootcampsLoading,
    addCourse,
    updateCourse,
    clearErrors,
    error
  } = useBootcampsContext();
  const editMode = props.location.editMode;
  const bootcampName = props.location.bootcampName;
  const courseToEdit = props.location.courseToEdit;
  const bootcampId = props.location.bootcampId;

  const initialState = {
    title: '',
    description: '',
    weeks: 0,
    tuition: 0,
    minimumSkill: 'beginner',
    scholarshipAvailable: false
  };

  const [course, setCourse] = useState(editMode ? courseToEdit : initialState);

  const {
    title,
    description,
    weeks,
    tuition,
    minimumSkill,
    scholarshipAvailable
  } = course;

  const onChange = e => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const validateFields = () => {
    if (
      title.trim() === '' ||
      description.trim() === '' ||
      minimumSkill.trim() === '' ||
      weeks <= 0 ||
      tuition <= 0
    ) {
      return false;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateFields()) {
      return notifyError('❌ Please enter all required fields');
    }
    if (editMode) {
      await updateCourse(course._id, {
        title,
        description,
        weeks,
        tuition,
        minimumSkill,
        scholarshipAvailable
      });
      if (error) {
        notifyError(`👎 ${error}`);
        clearErrors();
      } else {
        notifySuccess('✅ Course updated');
        return props.history.push('/managecourses');
      }
    } else {
      await addCourse(bootcampId, course);
      if (error) {
        notifyError(`👎 ${error}`);
        clearErrors();
      } else {
        notifySuccess('✅ Course added');
        return props.history.push('/managecourses');
      }
    }
  };

  if (bootcampsLoading) {
    return <Loading />;
  }

  return (
    <section className='container mt-5'>
      <div className='row'>
        <div className='col-md-8 m-auto'>
          <div className='card bg-white py-2 px-4'>
            <div className='card-body'>
              <Link
                to='/managecourses'
                className='btn btn-link text-secondary my-3'
              >
                <FaChevronLeft /> Manage Courses
              </Link>
              <h1 className='mb-2'>{bootcampName}</h1>
              <h3 className='text-primary mb-4'>
                {editMode ? 'Edit' : 'Add'} Course
              </h3>
              <form onSubmit={handleSubmit} noValidate>
                <div className='form-group'>
                  <label>
                    Course Title{' '}
                    <small>
                      <span className='text-danger'>(Required)</span>
                    </small>
                  </label>
                  <input
                    type='text'
                    name='title'
                    value={title}
                    className='form-control'
                    placeholder='Title'
                    onChange={onChange}
                    autoFocus={!editMode}
                  />
                </div>
                <div className='form-group'>
                  <label>
                    Duration{' '}
                    <small>
                      <span className='text-danger'>(Required)</span>
                    </small>
                  </label>
                  <input
                    type='number'
                    name='weeks'
                    value={weeks}
                    minimum='1'
                    step='1'
                    placeholder='Duration'
                    className='form-control'
                    onChange={onChange}
                  />
                  <small className='form-text text-muted'>
                    Enter number of weeks course lasts
                  </small>
                </div>
                <div className='form-group'>
                  <label>
                    Course Tuition{' '}
                    <small>
                      <span className='text-danger'>(Required)</span>
                    </small>
                  </label>
                  <input
                    type='number'
                    name='tuition'
                    value={tuition}
                    placeholder='Tuition'
                    className='form-control'
                    onChange={onChange}
                  />
                  <small className='form-text text-muted'>USD Currency</small>
                </div>
                <div className='form-group mb-3'>
                  <label htmlFor='minimumSkill' className='form-label'>
                    Minimum Skill{' '}
                    <small>
                      <span className='text-danger'>(Required)</span>
                    </small>
                  </label>
                  <select
                    name='minimumSkill'
                    value={minimumSkill}
                    className='form-select'
                    aria-label='Default select example'
                    onChange={onChange}
                  >
                    <option value='beginner'>Beginner (Any)</option>
                    <option value='intermediate'>Intermediate</option>
                    <option value='advanced'>Advanced</option>
                  </select>
                </div>
                <div className='form-group'>
                  <textarea
                    name='description'
                    value={description}
                    rows='5'
                    className='form-control'
                    placeholder={'Course description summary (Required)'}
                    maxLength='500'
                    onChange={onChange}
                  ></textarea>
                  <small className='form-text text-muted'>
                    No more than 500 characters
                  </small>
                </div>
                <div className='form-check'>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    name='scholarshipAvailable'
                    value={scholarshipAvailable}
                    id='scholarshipAvailable'
                    onChange={e => {
                      onChange({
                        target: {
                          name: e.target.name,
                          value: e.target.checked
                        }
                      });
                    }}
                  />
                  <label
                    className='form-check-label'
                    htmlFor='scholarshipAvailable'
                  >
                    Scholarship Available
                  </label>
                </div>
                <div className='form-group mt-4'>
                  <input
                    type='submit'
                    value={editMode ? 'Save' : 'Add Course'}
                    className='btn btn-primary btn-block my-4 w-100'
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddEditCoursePage;
