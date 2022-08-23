import { useSelector } from 'react-redux';

const ReceiverProvider = ({ receiver, children }) => {
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const arrReceivers = new Set(inquiries.map(inq => { return inq.receiver[0] }));
  return arrReceivers.has(receiver) ? children : null;
};

export default ReceiverProvider;
