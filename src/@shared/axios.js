import axios from 'axios';

export default (headers = {}) => {
  let user = {};
  const session = sessionStorage.getItem('USER');
  if (session) user = JSON.parse(session);

  return axios.create({
    baseURL: process.env.REACT_APP_API,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${localStorage.getItem('AUTH_TOKEN')}`,
      country: `${localStorage.getItem('country')}`,
      ...(user.userType && { userType: user.userType }),
      ...headers
    }
  });
};
