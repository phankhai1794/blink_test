import axios from 'axios';
import { getHeaders } from '../shared-functions';

export async function createBL(bkgNo) {
  const response = await axios.post(
    `${process.env.REACT_APP_API}/mybl/${bkgNo}`,
    {},
    {
      headers: getHeaders('create')
    }
  );
  return response.data;
}
