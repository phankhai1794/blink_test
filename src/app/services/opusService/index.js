import axios from '@shared/axios';
const PATH = '/opus';

export async function validateBkgNo(bkgNo) {
  const response = await axios().get(`${PATH}/${bkgNo}`);
  return response.data;
}
export async function updateBlStatus(data) {
  const response = await axios().put(`${PATH}/blStatus`, data);
  return response.data;
}

