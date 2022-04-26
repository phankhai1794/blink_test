import axios from '@shared/axios';
const PATH = '/authentication';

export async function login(data) {
  const response = await axios().post(`${PATH}/login`, data);
  return response.data;
}

export async function verifyEmail(data) {
  const response = await axios().post(`${PATH}/email`, data);
  return response.data;
}

export async function verifyGuest(data) {
  const response = await axios().post(`${PATH}/guest`, data);
  return response.data;
}

export async function isVerified(data) {
  const response = await axios().post(`${PATH}/is-verified`, data);
  return response.data;
}
