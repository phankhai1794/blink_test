import { changeStatus, updateInquiryChoice, createParagraphAnswer, updateParagraphAnswer } from 'app/services/inquiryService';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import { displayTime } from '@shared';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  Button,
  IconButton,
  Tooltip,
  Grid,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import * as AppAction from 'app/store/actions';
import clsx from 'clsx';
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import ArrowDropUp from "@material-ui/icons/ArrowDropUp";
import { updateInquiry, saveInquiry } from 'app/services/inquiryService';
import { uploadFile, getFile } from 'app/services/fileService';

import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from '../store/actions/form';

import ChoiceAnswer from './ChoiceAnswer';
import ParagraphAnswer from './ParagraphAnswer';
import AttachmentAnswer from './AttachmentAnswer';
import ImageAttach from './ImageAttach';
import FileAttach from './FileAttach';
import UserInfo from './UserInfo';
import AttachFile from './AttachFile';
import Comment from './Comment';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiButtonBase-root': {
      backgroundColor: 'silver !important'
    }
  },
  button: {
    margin: theme.spacing(1),
    borderRadius: 8,
    width: 120,
    boxShadow: 'none',
    textTransform: 'capitalize',
    fontFamily: 'Montserrat',
    fontWeight: 600,
    '&.reply': {
      backgroundColor: 'white',
      color: '#BD0F72',
      border: '1px solid #BD0F72'
    }
  },
  positionBtnImg: {
    left: '0',
    top: '-3rem'
  },
  positionBtnNotImg: {
    left: '0',
    top: '4rem'
  },
  icon: {
    border: '1px solid #BAC3CB',
    borderRadius: 4,
    position: 'relative',
    width: 16,
    height: 16,
    backgroundColor: '#f5f8fa',
    '&.borderChecked': {
      border: '1px solid #BD0F72'
    },
    '&.disabledCheck': {
      backgroundColor: '#DDE3EE'
    }
  },
  checkedIcon: {
    display: 'flex',
    alignItems: 'end',
    '& .MuiFormGroup-root': {
      flexDirection: 'row'
    },
    '& .container': {
      marginBottom: 5
    }
  },
  hideText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 5,
    '-webkit-box-orient': 'vertical',
  },
  viewMoreBtn: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: 'fit-content',
    position: 'sticky',
    left: '100%',
    color: '#BD0F72',
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: '16px',
    cursor: 'pointer'
  },
}
));

const InquiryAnswer = (props) => {
  const {onCancel} = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const currentField = useSelector(({ workspace }) => workspace.inquiryReducer.currentField);
  const currentEditInq = useSelector(({ workspace }) => workspace.inquiryReducer.currentEditInq);
  const [isDisableSave, setDisableSave] = useState(true);

  const onResolve = () => {
    changeStatus(currentField, 'COMPL')
      .then(() => {
        dispatch(FormActions.toggleReload());
      })
      .catch((error) => dispatch(AppAction.showMessage({ message: error, variant: 'error' })));
  };

  const onReply = () => {
    dispatch(InquiryActions.setReply(true));
  };

  const onSave = async () => {
    const inq = {...currentEditInq};
    if (inq.selectChoice) {
      await updateInquiryChoice(inq.selectChoice);
      //
      const answersObj = inq.answerObj;
      answersObj.forEach((item, i) => {
        answersObj[i].confirmed = false;
      });
      const answerIndex = answersObj.findIndex((item) => item.id === inq.selectChoice.answer);
      const answerUpdate = answersObj[answerIndex];
      answerUpdate.confirmed = true;
      dispatch(InquiryActions.setEditInq(inq));
      dispatch(
        AppAction.showMessage({ message: 'Save inquiry successfully', variant: 'success' })
      );
    } else if (inq.paragraphAnswer) {
      const objAns = inq.answerObj;
      if (inq.answerObj.length === 0) {
        createParagraphAnswer(inq.paragraphAnswer).then((res) => {
          if (res) {
            const { message, answerObj } = res;
            objAns.push(answerObj);
            dispatch(InquiryActions.setEditInq(inq));
            dispatch(AppAction.showMessage({ message: message, variant: 'success' }));
          }
        });
      } else {
        const answerId = inq.answerObj[0].id;
        updateParagraphAnswer(answerId, inq.paragraphAnswer).then((res) => {
          if (res) {
            const { message } = res;
            objAns[0].content = inq.paragraphAnswer.content;
            dispatch(InquiryActions.setEditInq(inq));
            dispatch(AppAction.showMessage({ message: message, variant: 'success' }));
          }
        });
      }
    }
    // const inquiry = inquiries.find((q) => q.id === currentEditInq.id);
    // const mediaCreate = currentEditInq.mediaFile.filter(
    //   ({ id: id1 }) => !inquiry.mediaFile.some(({ id: id2 }) => id2 === id1)
    // );
    // const mediaDelete = inquiry.mediaFile.filter(
    //   ({ id: id1 }) => !currentEditInq.mediaFile.some(({ id: id2 }) => id2 === id1)
    // );

    // for (const f in mediaCreate) {
    //   const form_data = mediaCreate[f].data;
    //   const res = await uploadFile(form_data);
    //   mediaCreate[f].id = res.response[0].id;
    // }
    // if (
    //   JSON.stringify(inq(currentEditInq)) !== JSON.stringify(inq(inquiry)) ||
    //   JSON.stringify(currentEditInq.answerObj) !== JSON.stringify(inquiry.answerObj) ||
    //   mediaCreate.length ||
    //   mediaDelete.length
    // ) {
    //   await updateInquiry(inquiry.id, {
    //     inq: inq(currentEditInq),
    //     files: { mediaCreate, mediaDelete }
    //   });
    // }
    
    const list = [...inquiries];
    list.forEach((ls, i) => {
      if (ls.id === currentEditInq.id) {
        list[i] = { ...currentEditInq };
      }
    });
    dispatch(InquiryActions.setInquiries(list));
    dispatch(InquiryActions.setEditInq());
  };


  useEffect(() => {
    if (!isDisableSave) setDisableSave(false);
  }, [isDisableSave]);

  return (
    <div className='changeToEditor'>  
      <div className="flex">
        <div className="flex">
          <Button
            variant="contained"
            color="primary"
            // disabled={isDisableSave}
            onClick={() => onSave()}
            classes={{ root: classes.button }}>
                Save
          </Button>
          <Button
            variant="contained"
            classes={{ root: clsx(classes.button, 'reply') }}
            color="primary"
            onClick={onCancel}>
              Cancel
          </Button>
        </div>
      </div>

      {/* <div className="flex">
        <Comment q={currentEditInq} inquiries={inquiries} indexes={indexes} userType={props.user} />
        <PermissionProvider
          action={PERMISSION.INQUIRY_UPDATE_INQUIRY_STATUS}
        // extraCondition={displayCmt}
        >
          <Button
            variant="contained"
            color="primary"
            // onClick={onResolve}
            classes={{ root: classes.button }}>
            Resolved
          </Button>
        </PermissionProvider>
        <PermissionProvider
          action={PERMISSION.INQUIRY_CREATE_COMMENT}
        // extraCondition={displayCmt}
        >
          {currentEditInq && props.user !== 'workspace' ? (
            <></>
          ) : (
            <Button
              variant="contained"
              classes={{ root: clsx(classes.button, 'reply') }}
              color="primary"
              // onClick={onReply}
            >
                Reply
            </Button>
          )}
        </PermissionProvider>
      </div> */}
    </div>
  );
};

export default InquiryAnswer;
