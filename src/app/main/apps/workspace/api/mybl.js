import axios from 'axios';
import { getHeaders } from '../shared-functions';

export async function createBL(id) {
  const response = await axios.post(
    `${process.env.REACT_APP_API}/mybl/${id}`,
    {},
    {
      headers: getHeaders('create')
    }
  );
  return response.data;
}

export async function loadBL(id) {
  const response = await axios.get(`${process.env.REACT_APP_API}/mybl/${id}`, {
    headers: getHeaders('get')
  });
  return response.data;
}
