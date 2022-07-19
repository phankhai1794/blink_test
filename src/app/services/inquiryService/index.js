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

export async function updateInquiryChoice(state) {
  const response = await axios().patch(`${PATH}/choice`, { state });
  return response.data;
}

export async function createParagraphAnswer(state) {
  const response = await axios().post(`${PATH}/paragraph`, { state });
  return response.data;
}

export async function updateParagraphAnswer(id, state) {
  const response = await axios().patch(`${PATH}/paragraph/${id}`, { state });
  return response.data;
}

export async function createAttachmentAnswer(state) {
  const response = await axios().post(`${PATH}/attachment`, { state });
  return response.data;
}

export async function updateInquiryAttachment(state) {
  const response = await axios().patch(`${PATH}/attachment-field`, state);
  return response.data;
}

export async function addNewMedia(state) {
  const response = await axios().post(`${PATH}/new-attachment`, state);
  return response.data;
}

export async function removeMultipleMedia(state) {
  const response = await axios().delete(`${PATH}/attachments`, {data: state});
  return response.data;
}

export async function replaceFile(data) {
  const response = await axios().patch(`${PATH}/attachment`, data);
  return response.data;
}

export async function deleteInquiry(id) {
  const response = await axios().delete(`${PATH}/${id}`);
  return response.data;
}
