import axios from '@shared/axios';
const PATH = '/trans';

export async function createBlTrans(mybl, content) {
  const response = await axios().post(`${PATH}/createBlTrans`, { mybl, content });
  return response.data;
}

export async function getMyBLTrans(id) {
  const response = await axios().get(`${PATH}/getMyBLTrans/${id}`);
  return response;
}

export async function getInqsTrans(id) {
  const response = await axios().get(`${PATH}/getInqsTrans/${id}`);
  return response.data;
}
