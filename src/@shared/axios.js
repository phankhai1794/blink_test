import axios from 'axios';

export default (headers = {}) =>
  axios.create({
    baseURL: process.env.REACT_APP_API,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${localStorage.getItem('AUTH_TOKEN')}`,
      country: `${localStorage.getItem('country')}`,
      ...headers
    }
  });
