import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaChevronLeft } from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import { notifyError } from '../utils/toastNotify';
import { baseUrl } from '../utils/constants';

const CreateReview = props => {
  const { id } = useParams();
  const {
    name,
    editMode,
    bootcampName,
    reviewText,
    reviewTitle,
    reviewRating,
    reviewId
  } = props.location.state;
  const [rating, setRating] = useState(8);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    if (editMode) {
      setRating(reviewRating);
      setTitle(reviewTitle);
      setText(reviewText);
    }
  }, [editMode, reviewRating, reviewText, reviewTitle]);

  const onSubmit = async e => {
    e.preventDefault();
    if (title.trim() === '' || text.trim() === '') {
      return notifyError(`❕ Please enter a title and a review`);
    }

    try {
      let response;

      if (editMode) {
        response = await axios.put(`${baseUrl}/reviews/${reviewId}`, {
          title,
          text,
          rating,
          bootcamp: id
        });
      } else {
        response = await axios.post(`${baseUrl}/bootcamps/${id}/reviews`, {
          title,
          text,
          rating,
          bootcamp: id
        });
      }

      props.history.push({
        pathname: `/bootcamps/${id}/reviews`,
        state: {
          name: response.data.bootcamp.name,
          averageRating: response.data.bootcamp.averageRating
        }
      });
      // console.log('New post was created.');
    } catch (e) {
      console.log(e);
      // console.log(e.response.data.error);
      if (e.response.data.error === 'Duplicate field value entered') {
        notifyError(`❕ Review already entered for this Bootcamp`);
      } else if (
        e.response.data.error ===
        'User role publisher is not authorized to access this route'
      ) {
        notifyError(`❕ User with publisher role cannot write reviews`);
      } else {
        notifyError(`❕ ${e.response.data.error}`);
      }
    }
  };

  return (
    <section className='container mt-5'>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className='row'>
        <div className='col-md-8 m-auto'>
          <div className='card bg-white py-2 px-4'>
            <div className='card-body'>
              <Link to={`/bootcamps/${id}`} className='btn btn-secondary my-3'>
                <FaChevronLeft /> Bootcamp Info
              </Link>
              <h1 className='mb-2'>{name ? name : bootcampName}</h1>
              <h3 className='mb-4'>{editMode ? 'Edit' : 'Write'} Review</h3>
              <p>
                You must have attended and graduated this bootcamp to review
              </p>
              <form onSubmit={onSubmit}>
                <div className='mb-3'>
                  <label htmlFor='rating'>
                    Rating (1-10):{' '}
                    <span className='text-primary'>{rating}</span>
                  </label>
                  <input
                    type='range'
                    className='form-range'
                    min='1'
                    max='10'
                    step='1'
                    value={rating}
                    onChange={e => setRating(e.target.value)}
                    id='rating'
                  />
                </div>
                <div className='mb-3'>
                  <input
                    type='text'
                    name='title'
                    className='form-control'
                    placeholder='Review title'
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                </div>
                <div className='mb-3'>
                  <textarea
                    name='review'
                    rows='6'
                    className='form-control'
                    placeholder='Your review'
                    value={text}
                    onChange={e => setText(e.target.value)}
                  ></textarea>
                </div>
                <div className='form-group'>
                  <input
                    type='submit'
                    value='Submit Review'
                    className='btn btn-success btn-block'
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

export default CreateReview;
