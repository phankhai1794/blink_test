import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Link, IconButton } from '@material-ui/core';

import * as FormActions from '../store/actions/form';
import * as InquiryActions from '../store/actions/inquiry';
import { setLastField } from "../store/actions/inquiry";


const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: '8px',
    width: '130px',
    textTransform: 'none',
  },
  nextPrev: {
    '& .MuiButtonBase-root': {
      marginRight: 18,
      paddingLeft: 0,
      paddingRight: 0,
    },
    '& .MuiIconButton-root:hover': {
      backgroundColor: 'transparent'
    },
    '& .MuiIconButton-root:focus': {
      backgroundColor: 'transparent'
    },
  }
}));
const PopoverFooter = ({ title }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [question, fields, inquiries, lastField, openedInquiresForm] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.question,
    workspace.inquiryReducer.fields,
    workspace.inquiryReducer.inquiries,
    workspace.inquiryReducer.lastField,
    workspace.inquiryReducer.openedInquiresForm,
  ]);
  const openInquiryForm = useSelector(({ workspace }) => workspace.formReducer.openDialog);

  const toggleInquiriresDialog = () => {
    dispatch(FormActions.toggleAllInquiry(true));
    dispatch(FormActions.toggleInquiry(true));
    dispatch(FormActions.toggleSaveInquiry(true))
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
  return (
    <div className="flex justify-between" style={{ margin: '1.6rem auto', alignItems: "center" }}>
      <div className={classes.nextPrev}>
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
            fontWeight: '600',
          }}
          component="button" onClick={toggleInquiriresDialog}
        >
          Open all inquiries
        </Link>
      </div>
    </div>
  );
};

export default PopoverFooter;
