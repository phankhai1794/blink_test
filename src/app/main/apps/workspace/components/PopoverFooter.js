import { PERMISSION, PermissionProvider } from '@shared/permission';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button, IconButton, Link } from '@material-ui/core';
import axios from "axios";
import { loadComment } from 'app/services/inquiryService';
import { getCommentDraftBl } from "app/services/draftblService";

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
const PopoverFooter = ({ title, user, checkSubmit }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [question, fields, inquiries, lastField, openedInquiresForm, currentField, enableSubmit, myBL] = useSelector(
    ({ workspace }) => [
      workspace.inquiryReducer.question,
      workspace.inquiryReducer.fields,
      workspace.inquiryReducer.inquiries,
      workspace.inquiryReducer.lastField,
      workspace.inquiryReducer.openedInquiresForm,
      workspace.inquiryReducer.currentField,
      workspace.inquiryReducer.enableSubmit,
      workspace.inquiryReducer.myBL,
    ]
  );
  const userInfo = useSelector(({ user }) => user);
  const openInquiryForm = useSelector(({ workspace }) => workspace.formReducer.openDialog);
  const isShowBackground = useSelector(
    ({ workspace }) => workspace.inquiryReducer.isShowBackground
  );
  const [isSubmit, setIsSubmit] = useState(true);

  useEffect(() => {
    if (userInfo.role !== 'Admin') {
      let currentFields = [];
      // inquiry list
      if (title === 'INQUIRY_LIST') {
        currentFields = inquiries;
      } // inquiry detail
      else if (title === currentField) {
        currentFields = inquiries.filter(inq => inq.field === currentField);
      }
      let isSubmit = true;
      currentFields.forEach((item) => {
        if (item.answerObj && item.state === "ANS_DRF") {
          isSubmit = false;
        }
      });
      //
      const inquiriesPendingProcess = currentFields.filter(op => op.process === 'pending');
      const amendment = currentFields.filter(op => op.process === 'draft');
      axios.all(inquiriesPendingProcess.map(q => loadComment(q.id)))
        .then(res => {
          if (res) {
            let commentList = [];
            res.map(r => {
              commentList = [...commentList, ...r];
            });
            const filterRepADraft = commentList.some((r) => r.state === 'REP_A_DRF');
            if (filterRepADraft) isSubmit = false;
            setIsSubmit(isSubmit)
          }
        }).catch(err => {
          console.error(err)
        })
      if (amendment.length) {
        getCommentDraftBl(myBL.id, amendment[0].field)
          .then((res) => {
            const filterRepADraft = res.some((r) => r.state === 'AME_DRF');
            if (filterRepADraft) isSubmit = false;
            setIsSubmit(isSubmit)
          }).catch(err => { console.error(err) });
      }
    }
  }, [inquiries, checkSubmit, enableSubmit]);

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
    setIsSubmit(true);
    dispatch(InquiryActions.setShowBackgroundAttachmentList(true));
  };

  const checkEnableBtnAddAmendment = () => {
    const filter = inquiries.filter(inq => inq.field === currentField);
    if (!filter.length) return false;
    return !filter.some(inq => inq.process === 'draft');
  }

  return (
    <div
      style={{
        padding: 10,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      {title !== 'INQUIRY_LIST' &&
        <div
          style={{
            position: 'absolute',
            left: '0px',
            top: '10px'
          }}>
          {inquiries.length > 0 && (
            <>
              <IconButton onClick={isShowBackground ? '' : prevQuestion}>
                <img alt={'nextIcon'} src={`/assets/images/icons/prev.svg`} />
              </IconButton>
              <IconButton onClick={isShowBackground ? '' : nextQuestion}>
                <img alt={'prevIcon'} src={`/assets/images/icons/next.svg`} />
              </IconButton>
            </>
          )}

          <Link
            style={{
              fontFamily: 'Montserrat',
              fontSize: '16px',
              color: isShowBackground ? 'rgb(21 100 238 / 58%)' : '#1564EE',
              cursor: isShowBackground ? 'inherit' : 'pointer',
              height: '20px',
              weight: '145px',
              fontWeight: '600',
            }}
            component="button"
            onClick={isShowBackground ? '' : toggleInquiriresDialog}>
            Open all inquiries
          </Link>
        </div>
      }

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
              textAlign: 'center',
            }}
            className={classes.root}
            color="primary"
            disabled={isShowBackground ? true : isSubmit}
            onClick={onSubmit}>
            Submit
          </Button>
        </div>
      </PermissionProvider>

      {checkEnableBtnAddAmendment() &&
        <div>
          <button onClick={() => dispatch(InquiryActions.addAmendment(null))}>Create Amendment</button>
        </div>
      }
    </div>
  );
};

export default PopoverFooter;
