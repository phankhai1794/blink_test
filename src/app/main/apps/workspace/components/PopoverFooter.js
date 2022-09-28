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
  },
  button: {
    borderRadius: '8px',
    textTransform: 'none',
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 16,
    textAlign: 'center',
    margin: '0 5px'
  },
  textCreateAmendment: {
    position: 'relative',
    left: 17,
    fontWeight: 600,
    fontFamily: 'Montserrat',
    lineHeight: '20px',
    padding: '4px 13px 4px 7px',
    '&:before': {
      position: 'absolute',
      top: 5,
      left: -21,
      width: 21,
      height: 21,
      content: '""',
      backgroundImage: 'url("assets/images/icons/plus.svg")',
      backgroundSize: 'cover'
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
            className={classes.button}
            style={{ width: 130 }}
            color="primary"
            disabled={isShowBackground ? true : isSubmit}
            onClick={onSubmit}>
            Submit
          </Button>
        </div>
      </PermissionProvider>

      <PermissionProvider
        action={PERMISSION.VIEW_CREATE_AMENDMENT}
        extraCondition={checkEnableBtnAddAmendment() && myBL?.state?.includes('DRF_')}>
        <div>
          <Button
            variant="contained"
            className={classes.button}
            color="primary"
            onClick={() => dispatch(InquiryActions.addAmendment(null))}>
            <span className={classes.textCreateAmendment}>Create Amendment</span>
          </Button>
        </div>
      </PermissionProvider>
    </div>
  );
};

export default PopoverFooter;
