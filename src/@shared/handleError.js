import { getLabelById } from '@shared';
import * as Actions from 'app/store/actions';
import * as FormActions from 'app/main/apps/workspace/store/actions/form';

export const handleError = (dispatch, err) => {
  console.error(err);

  let status, message;
  if (err.response) {
    status = err.response.status || err.response.data?.error.status;
    message = err.response.data?.message || err.response.data?.error?.message;
  }
  if (!message) message = err.message || "Your token has expired";

  if (status >= 500) {
    message = `Blink API is not available now, Please try again!`;
  }

  if ([401, 403].includes(status)) {
    dispatch(Actions.checkAuthToken(false));
    dispatch(Actions.checkAllow(false));
  }
  else dispatch(Actions.showMessage({ message, variant: 'error' }));

  dispatch(FormActions.resetLoading());
  return [status, message];
};

export const handleDuplicateAttachment = (dispatch, metadata, attachments, medias, upComingField, upComingType) => {
  const { field_options: fieldOptions, inq_type_options: inqTypeOptions } = metadata;
  const filterAttachments = attachments
    .filter(att => (
      // attribute "field" and "inqType" dosen't exist when creating
      att.field !== undefined ? att.field === upComingField : att) && (att.inqType !== undefined ? att.inqType === upComingType : att)
    )
    .map(att => { return att.name });
  const isExist = medias.some(media => filterAttachments.includes(media.name));

  if (isExist) dispatch(Actions.showMessage({
    message: `Duplicate file(s) in ${getLabelById(fieldOptions, upComingField)} - ${getLabelById(inqTypeOptions, upComingType).slice(0, 7) + "..."}`,
    variant: 'error'
  }));
  return isExist;
}

export const handleDuplicateAmendmentAttachment = (dispatch, attachments, fileUploads) => {
  const attachFileName = attachments.map(f => f.name);
  const isExist = fileUploads.some(m => attachFileName.includes(m.name));
  if (isExist) dispatch(Actions.showMessage({
    message: `Duplicate file(s)`,
    variant: 'error'
  }));
  return isExist;
}