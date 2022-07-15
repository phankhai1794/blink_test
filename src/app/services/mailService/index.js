import axios from '@shared/axios';
const PATH = '/mail';

export async function sendmail(myblId, from, toCustomer, toCustomerCc, toCustomerBcc, toOnshore, toOnshoreCc, toOnshoreBcc, subject, content) {
  const response = await axios().post(`${PATH}/sendMail`, {
    myblId,
    from,
    toCustomer,
    toCustomerCc,
    toCustomerBcc,
    toOnshore,
    toOnshoreCc,
    toOnshoreBcc,
    subject,
    body: content
  });
  return response;
}


export async function getSuggestMail(keyword) {
  const response = await axios().get(`${PATH}/suggestMail?keyword=${keyword}`);
  return response;
}
