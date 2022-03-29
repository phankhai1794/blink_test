import axios from 'axios';
import { getHeaders } from '../shared-functions';

export async function loadAccount(id) {
  const response = await axios.get(`${process.env.REACT_APP_API}/account/${id}`, {
    headers: getHeaders('get')
  });
  return response.data;
}
