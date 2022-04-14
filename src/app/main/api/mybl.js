import axios from 'axios';
import { getHeaders } from 'app/main/shared-functions';

export async function getAllBl(state) {
  console.log('API state:', state);
  const response = await axios.get(`${process.env.REACT_APP_API}/mybl/`, {
    headers: getHeaders('get'),
    params: { state }
  });
  return response.data;
}

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
