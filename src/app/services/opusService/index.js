import axios from '@shared/axios';
const PATH = '/opus';

export async function validateBkgNo(bkgNo, cntr, data) {
  const response = await axios().post(`${PATH}/${bkgNo}/${cntr}`, data);
  return response.data;
}
export async function updateBlStatus(data) {
  const response = await axios().put(`${PATH}/blStatus`, data);
  return response.data;
}

