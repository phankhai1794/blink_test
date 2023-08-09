import axios from '@shared/axios';
const PATH = '/authentication';

export async function verifyToken(token) {
  const response = await axios().get(`${PATH}/verify-token/${token}`);
  return response.data;
}

export async function login(data) {
  const response = await axios().post(`${PATH}/login`, data);
  return response.data;
}

export async function verifyEmail(data) {
  const response = await axios().post(`${PATH}/email`, data);
  return response.data;
}

export async function requestCode(data) {
  const response = await axios().post(`${PATH}/request-access-code`, data);
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

export async function encodeAuthParam() {
  const response = await axios().get(`${PATH}/encode-auth-param`);
  return response.data;
}

export async function decodeAuthParam(auth) {
  const response = await axios().get(`${PATH}/decode-auth-param/${auth}`);
  return response.data;
}

export async function forgotPassword(data) {
  const response = await axios().post(`${PATH}/forgot`, data);
  return response.data;
}

export async function putUserPassword(data) {
  const response = await axios().put(`${PATH}/update-password`, data);
  return response;
}

export async function getPermissionByRole(data) {
  const response = await axios().get(`${PATH}/permissions/${data}`);
  return response.data;
}