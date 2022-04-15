import axios from 'axios';
export async function sendmail(myblId, from, toCustomer, toOnshore, subject, content) {
  console.log('API state:', myblId, from, toCustomer, toOnshore, subject, content);
  const response = await axios.post(  `${process.env.REACT_APP_API}/mail/sendMail`, {
      myblId,
      from,
      toCustomer,
      toOnshore, 
      subject,
      body:content
  });
  return response;
}

