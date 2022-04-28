import axios from '@shared/axios';
const PATH = '/mybl';

export async function getAllBl(state) {
  const response = await axios().get(`${PATH}/`, { params: { state } });
  return response.data;
}

export async function getBlInfo(id) {
  const response = await axios().get(`${PATH}/${id}`);
  return response.data;
}

export async function createBL(bkgNo) {
  const response = await axios().post(`${PATH}/${bkgNo}`, {});
  return response.data;
}
