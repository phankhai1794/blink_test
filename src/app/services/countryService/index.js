import axios from '@shared/axios';
const PATH = '/country';

export async function getUserCountry() {
  const response = await axios().get(`${PATH}/`);
  return response;
}