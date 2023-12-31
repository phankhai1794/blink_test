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

// export async function updateBL(id, data) {
//   const response = await axios().patch(`${PATH}/${id}`, data);
//   return response.data;
// }

export async function getCustomerAmendment(id) {
  const response = await axios().get(`${PATH}/${id}/customer-amendments-latest`);
  return response.data;
}

export async function validateTextInput(data) {
  const response = await axios().post(`${PATH}/validate/check-input`, data);
  return response.data;
}

export async function getQueueList(page, size, search) {
  const response = await axios().post(`${PATH}/queue/list/${page}/${size}`, { search });
  return response.data;
}

export async function getOffshoreQueueList(data) {
  const response = await axios().post(`${PATH}/get-queue-list/offshore`, data);
  return response.data;
}

export async function getOnshoreQueueList(data) {
  const response = await axios().post(`${PATH}/get-queue-list/onshore`, data);
  return response.data;
}