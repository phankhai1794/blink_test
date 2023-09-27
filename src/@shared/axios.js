import axios from 'axios';
import { getLocalUser } from '@shared/permission';

export default (headers = {}) => {
  const userType = sessionStorage.getItem('userType');

  return axios.create({
    baseURL: process.env.REACT_APP_API,
    headers: {
      'Content-Type': 'application/json',
      Authorization: getLocalUser('_TOKEN'),
      country: `${localStorage.getItem('country')}`,
      ...(userType && { userType }),
      ...headers
    }
  });
};
