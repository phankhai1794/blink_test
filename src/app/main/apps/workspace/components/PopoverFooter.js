import { saveInquiry, changeStatus, submitInquiryAnswer } from 'app/services/inquiryService';
import { uploadFile } from 'app/services/fileService';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import { toFindDuplicates } from '@shared';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Link, Button, IconButton } from '@material-ui/core';
import * as AppActions from 'app/store/actions';

import * as FormActions from '../store/actions/form';
import * as InquiryActions from '../store/actions/inquiry';
import { setLastField } from '../store/actions/inquiry';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: '8px',
    width: '130px',
    textTransform: 'none'
  },
  nextPrev: {
    '& .MuiButtonBase-root': {
      marginRight: 18,
      paddingLeft: 0,
      paddingRight: 0
    },
    '& .MuiIconButton-root:hover': {
      backgroundColor: 'transparent'
    },
    '& .MuiIconButton-root:focus': {
      backgroundColor: 'transparent'
    }
  }
}));
const PopoverFooter = ({ title, user }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [question, fields, inquiries, lastField, openedInquiresForm] = useSelector(
    ({ workspace }) => [
      workspace.inquiryReducer.question,
      workspace.inquiryReducer.fields,
      workspace.inquiryReducer.inquiries,
      workspace.inquiryReducer.lastField,
      workspace.inquiryReducer.openedInquiresForm
    ]
  );

  const openInquiryForm = useSelector(({ workspace }) => workspace.formReducer.openDialog);
  const [canSubmit, setCanSubmit] = useState(false);
  useEffect(() => {
    setCanSubmit(inquiries.some((item) => (title === "INQUIRY_LIST" || title === item.field )&& item.answerObj && item.state === "ANS_DRF" ));
  }, [inquiries]);

  const toggleInquiriresDialog = () => {
    dispatch(FormActions.toggleAllInquiry(true));
    dispatch(FormActions.toggleInquiry(true));
    dispatch(FormActions.toggleSaveInquiry(true));
  };

  const nextQuestion = () => {
    dispatch(setLastField(question[question.length - 1].field));
    // check next if inquiry form opened
    if (openInquiryForm) {
      dispatch(InquiryActions.setOpenedInqForm(true));
      dispatch(FormActions.toggleCreateInquiry(false));
    }
    let temp = inquiries.findIndex((inq) => inq.field === title);
    if (temp !== inquiries.length - 1) {
      temp += 1;
      dispatch(InquiryActions.setField(fields[temp]));
    } else {
      if (openedInquiresForm) {
        dispatch(FormActions.toggleCreateInquiry(true));
        dispatch(InquiryActions.setField(lastField));
      } else {
        temp = 0;
        dispatch(InquiryActions.setOneInq(inquiries[temp]));
        dispatch(InquiryActions.setField(fields[temp]));
      }
    }
  };
  const prevQuestion = () => {
    dispatch(setLastField(question[question.length - 1].field));
    // check prev if inquiry form opened
    if (openInquiryForm) {
      dispatch(InquiryActions.setOpenedInqForm(true));
      dispatch(FormActions.toggleCreateInquiry(false));
    }
    let temp = inquiries.findIndex((inq) => inq.field === title);
    if (temp === -1) {
      temp = inquiries.length - 1;
      dispatch(InquiryActions.setOneInq(inquiries[temp]));
      dispatch(InquiryActions.setField(fields[temp]));
    } else if (temp === 0) {
      if (openedInquiresForm) {
        dispatch(InquiryActions.setOneInq({}));
        dispatch(FormActions.toggleCreateInquiry(true));
        dispatch(InquiryActions.setField(lastField));
      } else {
        temp = inquiries.length - 1;
        dispatch(InquiryActions.setOneInq(inquiries[temp]));
        dispatch(InquiryActions.setField(fields[temp]));
      }
    } else {
      temp -= 1;
      dispatch(InquiryActions.setOneInq(inquiries[temp]));
      dispatch(InquiryActions.setField(fields[temp]));
    }
  };

  const onSubmit = () => {
    const inqs = [... inquiries];
    const lstIdInq = inqs.map((item) => {
      if ((title === "INQUIRY_LIST" || title === item.field ) && item.answerObj && item.state === "ANS_DRF") {
        item.state = 'ANS_SENT';
        return item.id;
      }
      return null;
    });
    submitInquiryAnswer({
      listIdInq: lstIdInq.filter(x => x !== null)
    });
    dispatch(InquiryActions.setInquiries(inqs));
    dispatch(
      AppActions.showMessage({ message: 'Submit Answer inquiry successfully', variant: 'success' })
    );
  };

  return (
    <div
      style={{
        padding: 10,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <div
        style={{
          position: 'absolute',
          left: '0px',
          top: '10px'
        }}>
        {inquiries.length > 0 && (
          <>
            <IconButton onClick={prevQuestion}>
              <img alt={'nextIcon'} src={`/assets/images/icons/prev.svg`} />
            </IconButton>
            <IconButton onClick={nextQuestion}>
              <img alt={'prevIcon'} src={`/assets/images/icons/next.svg`} />
            </IconButton>
          </>
        )}

        <Link
          style={{
            fontFamily: 'Montserrat',
            fontSize: '16px',
            color: '#1564EE',
            height: '20px',
            weight: '145px',
            fontWeight: '600'
          }}
          component="button"
          onClick={toggleInquiriresDialog}>
          Open all inquiries
        </Link>
      </div>

      {
        <PermissionProvider
          action={PERMISSION.INQUIRY_SUBMIT_INQUIRY_ANSWER}>
          <div>
            <Button
              variant="contained"
              style={{
                textTransform: 'capitalize',
                left: '13.45%',
                right: '13.45%',
                top: '25%',
                bottom: '25%',
                fontFamily: 'Montserrat',
                fontStyle: 'normal',
                fontWeight: '600',
                fontSize: '16px',
                lineHegiht: '20px',
                textAlign: 'center',
                backgroundColor: canSubmit ? '#bd1874' : ''
              }}
              className={classes.root}
              color="primary"
              disabled={!canSubmit}
              onClick={onSubmit}>
          Submit
            </Button>
          </div>
        </PermissionProvider>
      }
      
    </div>
  );
};

export default PopoverFooter;
