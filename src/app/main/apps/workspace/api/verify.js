import axios from 'axios';

export async function verifyEmail(data) {
  const response = await axios.post(`${process.env.REACT_APP_API}/authentication/email`, data);
  return response.data;
}

export async function verifyGuest(data) {
  const response = await axios.post(`${process.env.REACT_APP_API}/authentication/guest`, data);
  return response.data;
}
