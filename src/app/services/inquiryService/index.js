import axios from '@shared/axios';
const PATH = '/inquiry';

export async function saveInquiry(data) {
  const response = await axios().post(`${PATH}/`, data);
  return response.data;
}

export async function saveComment(data) {
  const response = await axios().post(`${PATH}/comment`, data);
  return response.data;
}

export async function getInquiryById(id) {
  const response = await axios().get(`${PATH}/${id}`);
  return response.data;
}

export async function updateInquiry(id, data) {
  const response = await axios().put(`${PATH}/${id}`, data);
  return response.data;
}

export async function getMetadata() {
  const response = await axios().get(`${PATH}/metadata`);
  return response.data;
}

export async function loadComment(id) {
  const response = await axios().get(`${PATH}/comment/${id}`);
  return response.data;
}

export async function deleteComment(id) {
  const response = await axios().delete(`${PATH}/comment/${id}`);
  return response.data;
}

export async function editComment(id, content) {
  const response = await axios().patch(`${PATH}/comment/${id}`, { content });
  return response.data;
}

export async function changeStatus(id, state) {
  const response = await axios().patch(`${PATH}/status/${id}`, { state });
  return response.data;
}
