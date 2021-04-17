import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { notifyError, notifySuccess } from '../utils/toastNotify';
import { useAuthContext } from '../context/authContext';
import Loading from '../components/Loading';
import ReviewItem from '../components/ReviewItem';
import { baseAPIUrl } from '../utils/constants';

const ManageReviewsPage = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [updatedCount, setUpdatedCount] = useState(0);
  const [idToDelete, setIdToDelete] = useState('');

  const handleDelete = async e => {
    e.preventDefault();

    try {
      await axios.delete(`${baseAPIUrl}/reviews/${idToDelete}`);
      setUpdatedCount(prev => prev + 1);

      notifySuccess('✅ Review was deleted');
    } catch (e) {
      console.log(e.response.data.error);
      notifyError('❌ An error occurred deleting review');
    }
  };

  useEffect(() => {
    const axiosRequest = axios.CancelToken.source();

    async function fetchReviews() {
      try {
        const response = await axios.get(
          `${baseAPIUrl}/reviews/user/${user._id}`,
          {
            cancelToken: axiosRequest.token
          }
        );
        if (response.data) {
          setReviews(response.data.data);
        } else {
          console.log('no data');
        }
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
    fetchReviews();
    // Cleanup
    return () => {
      axiosRequest.cancel();
    };
  }, [user._id, updatedCount]);

  if (loading) {
    return <Loading />;
  }

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
      <div
        className='modal fade'
        id='reviewModal'
        tabIndex='-1'
        aria-labelledby='reviewModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title' id='reviewModalLabel'>
                Delete Confirmation
              </h5>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
              ></button>
            </div>
            <div className='modal-body'>
              Are you sure you wish to delete this review?
            </div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-danger'
                data-bs-dismiss='modal'
                onClick={handleDelete}
              >
                Yes
              </button>
              <input
                type='button'
                className='btn btn-primary'
                data-bs-dismiss='modal'
                autoFocus
                value='No'
              ></input>
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-8 m-auto'>
          <div className='card bg-white py-2 px-4'>
            <div className='card-body'>
              <h1 className='mb-4'>Manage Reviews</h1>
              <table className='table table-striped'>
                <thead>
                  <tr>
                    <th scope='col'>Bootcamp</th>
                    <th scope='col'>Rating</th>
                    <th scope='col'></th>
                  </tr>
                </thead>
                <tbody>
                  {reviews &&
                    reviews.map(review => {
                      return (
                        <ReviewItem
                          key={review._id}
                          id={review._id}
                          bootcampId={review.bootcamp._id}
                          name={review.bootcamp.name}
                          setIdToDelete={setIdToDelete}
                          {...review}
                        />
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageReviewsPage;
