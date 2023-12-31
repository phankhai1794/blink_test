import axios from '@shared/axios';
const PATH = '/mail';

export async function sendmail({ myblId, replyInqs, user, header, ...form }) {
  const response = await axios().post(`${PATH}/sendMail`, {
    myblId,
    user,
    replyInqs,
    header,
    ...form
  });
  return response;
}

export async function sendmailResolve(data) {
  const response = await axios().post(`${PATH}/sendMailResolve`, data);
  return response;
}

export async function getSuggestMail(keyword) {
  const response = await axios().get(`${PATH}/suggestMail?keyword=${keyword}`);
  return response;
}

export async function getMail(myblId) {
  const response = await axios().get(`${PATH}/byBl/${myblId}`);
  return response;
}

export async function getAllMailAccess(myblId) {
  const response = await axios().get(`${PATH}/permission/${myblId}`);
  return response;
}

export async function updateMailAccess(data, myblId) {
  const response = await axios().patch(`${PATH}/permission/${myblId}`, data);
  return response;
}
