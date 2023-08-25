import axios from '@shared/axios';
const PATH = '/file';

export async function uploadFile(data) {
  const response = await axios({ 'Content-Type': 'multipart/form-data' }).post(
    `${PATH}/upload`,
    data
  );
  return response.data;
}

export async function getFile(bkgNo, id) {
  const response = await axios().get(`${PATH}/getFile/${bkgNo}/${id}`, { responseType: 'blob' });
  return response.data;
}