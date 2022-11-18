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
  if (hasInquiry || hasAmendment) response = { className: classes.hasInquiry, iconColor: classes.colorHasInqIcon };
  else if (hasAnswer) response = { className: classes.hasAnswer, iconColor: classes.colorHasAnswer };
  else if (isResolved) response = { className: classes.hasResolved, iconColor: classes.colorHasResolved };
  else if (isUploaded) response = { className: classes.hasUploaded, iconColor: classes.colorHasUploaded };
  return response;
}

export const checkColorStatus = (
  id,
  user,
  inquiries,
  listCommentDraft
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
  const lstInq = inquiries.filter((q) => q.field === id && q.process === 'pending');
  if (lstInq.length) {
    colorStatusObj.isEmpty = false;
    const statusReply = user?.role === 'Admin' ? sentStatus : [...sentStatus, ...['ANS_DRF']];

    lstInq.forEach(inq => {
      // check has attachment
      if (!colorStatusObj.hasAttachment && inq.mediaFile?.length) colorStatusObj.hasAttachment = true;

      // check has inquiry
      if (!colorStatusObj.hasInquiry && ['OPEN', 'INQ_SENT', 'ANS_DRF'].includes(inq.state)) colorStatusObj.hasInquiry = true;

      // check has reply/answer
      else if (!colorStatusObj.hasAnswer, statusReply.includes(inq.state)) colorStatusObj.hasAnswer = true;

      // check is resolved
      else if (!colorStatusObj.isResolved && inq.state === 'COMPL') colorStatusObj.isResolved = true;

      // check is resolved
      else if (!colorStatusObj.isUploaded && inq.state === 'UPLOADED') colorStatusObj.isUploaded = true;
    });
  }

  /** Check Amendment */
  const listCommentFilter = listCommentDraft.filter(q => q.field === id);
  if (listCommentFilter.length) {
    colorStatusObj.isEmpty = false;
    const statusReply = user?.role === 'Admin' ? [...sentStatus, ...['REP_DRF']] : [...sentStatus, ...['AME_DRF']];
    const amendment = listCommentFilter[0] || {};
    const lastComment = listCommentFilter[listCommentFilter.length - 1] || {};

    // check has attachment
    if (!colorStatusObj.hasAttachment && amendment.content?.mediaFile?.length) colorStatusObj.hasAttachment = true;

    // check has amendment
    if (!colorStatusObj.hasAmendment && listCommentFilter.length === 1) colorStatusObj.hasAmendment = true;

    // check has reply/answer
    else if (!colorStatusObj.hasAnswer && statusReply.includes(lastComment.state)) colorStatusObj.hasAnswer = true;

    // check is resolved
    else if (!colorStatusObj.isResolved && ['RESOLVED'].includes(lastComment.state)) colorStatusObj.isResolved = true;

    // check is resolved
    else if (!colorStatusObj.isUploaded && ['UPLOADED'].includes(lastComment.state)) colorStatusObj.isUploaded = true;
  }

  return colorStatusObj;
}