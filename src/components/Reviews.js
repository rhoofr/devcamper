import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FaChevronLeft, FaPencilAlt } from 'react-icons/fa';
import Loading from './Loading';
import Review from './Review';
import { baseAPIUrl } from '../utils/constants';

const Reviews = ({ location }) => {
  const { name, averageRating } = location.state;
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const axiosRequest = axios.CancelToken.source();

    async function fetchReviews() {
      try {
        const response = await axios.get(
          `${baseAPIUrl}/bootcamps/${id}/reviews`,
          {
            cancelToken: axiosRequest.token
          }
        );
        if (response.data) {
          setReviews(response.data.data);
          setLoading(false);
        } else {
          console.log('no data');
        }
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    }
    fetchReviews();
    // Cleanup
    return () => {
      axiosRequest.cancel();
    };
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  return (
    <section className='bootcamp mt-5'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-8'>
            <Link to={`/bootcamps/${id}`} className='btn btn-secondary my-3'>
              <FaChevronLeft /> Bootcamp Info
            </Link>
            <h1 className='mb-4'>{name} Reviews</h1>

            {reviews.map(review => {
              return <Review key={review._id} {...review} />;
            })}
          </div>
          <div className='col-md-4'>
            <h1 className='text-left my-4 align-middle'>
              <span className='badge rounded-pill bg-secondary bg-success me-2 align-middle badge-small'>
                {averageRating}
              </span>
              Rating
            </h1>
            <Link
              to={{
                pathname: `/createreview/${id}`,
                state: { name }
              }}
              className='btn btn-primary btn-block my-3'
            >
              <FaPencilAlt /> Review This Bootcamp
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
