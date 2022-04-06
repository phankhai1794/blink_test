import axios from 'axios';

export async function getAccountByEmail(mail) {
  const response = await axios.get(`${process.env.REACT_APP_API}/account/${mail}`);
  return response.data;
}
