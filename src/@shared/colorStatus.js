import { sentStatus } from '@shared';

export const checkClassName = (
  hasInquiry,
  hasAmendment,
  hasAnswer,
  isResolved,
  isUploaded,
  classes
) => {
  let response = { className: '', iconColor: '' };

  if (hasAnswer) response = { className: classes.hasAnswer, iconColor: classes.colorHasAnswer };
  if (isResolved) response = { className: classes.hasResolved, iconColor: classes.colorHasResolved };
  else if (isUploaded) response = { className: classes.hasUploaded, iconColor: classes.colorHasUploaded };
  else if (hasInquiry || hasAmendment) response = { className: classes.hasInquiry, iconColor: classes.colorHasInqIcon };
  return response;
}

export const checkColorStatus = (
  id,
  user,
  inquiries,
) => {
  const colorStatusObj = {
    isEmpty: true,
    hasInquiry: false,
    hasAmendment: false,
    hasAttachment: false,
    hasAnswer: false,
    isResolved: false,
    isUploaded: false
  };

  /** Check Inquiry */
  const lstInq = inquiries.filter((q) => q.field === id);
  const inqSort = lstInq.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  if (lstInq.length) {
    const inq = inqSort[0];
    colorStatusObj.isEmpty = false;
    const statusReply = [...sentStatus, ...['REP_DRF']];

    // check has attachment
    if (inq.mediaFile?.length || inq.mediaFilesAnswer?.length || (inq.hasAttachment)) colorStatusObj.hasAttachment = true;

    // check has reply/answer
    if (statusReply.includes(inq.state)) colorStatusObj.hasAnswer = true;
    // check is resolved
    else if (['RESOLVED', 'COMPL'].includes(inq.state)) colorStatusObj.isResolved = true;
    // check is resolved
    else if (inq.state === 'UPLOADED') colorStatusObj.isUploaded = true;
    // check has amendment
    else if (inq.process === 'draft') colorStatusObj.hasAmendment = true;
    // check has inquiry
    else if (inq.process === 'pending') colorStatusObj.hasInquiry = true;
  }

  return colorStatusObj;
}