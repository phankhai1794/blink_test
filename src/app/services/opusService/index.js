import axios from '@shared/axios';
const PATH = '/opus';

export async function validateBkgNo(bkgNo) {
  const response = await axios().get(`${PATH}/${bkgNo}`);
  return response.data;
}
