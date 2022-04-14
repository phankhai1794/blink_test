import axios from 'axios';
import { getHeaders } from 'app/main/shared-functions';

export async function verifyEmail(data) {
  const response = await axios.post(`${process.env.REACT_APP_API}/authentication/email`, data);
  return response.data;
}

export async function verifyGuest(data) {
  const response = await axios.post(`${process.env.REACT_APP_API}/authentication/guest`, data);
  return response.data;
}

export async function isVerified(data) {
  const response = await axios.post(
    `${process.env.REACT_APP_API}/authentication/is-verified`,
    data,
    { headers: getHeaders('', 'GUEST_TOKEN') }
  );
  return response.data;
}
