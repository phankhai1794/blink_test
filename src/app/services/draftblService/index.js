import axios from '@shared/axios';
const PATH = '/draftbl';

export async function saveEditedField(body) {
  const response = await axios().post(`${PATH}/edit`, body);
  return response.data;
}

export async function getFieldContent(blId) {
  const response = await axios().get(`${PATH}/${blId}`);
  return response.data;
}