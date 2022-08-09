import { changeStatus, updateInquiryChoice, createParagraphAnswer, updateParagraphAnswer } from 'app/services/inquiryService';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import { displayTime } from '@shared';
import { uploadFile, getFile } from 'app/services/fileService';
import { updateInquiry, saveInquiry } from 'app/services/inquiryService';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import * as AppAction from 'app/store/actions';
import clsx from 'clsx';

import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from '../store/actions/form';

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
  const inq = (inq) => {
    return {
      content: inq.content,
      field: inq.field,
      inqType: inq.inqType,
      ansType: inq.ansType,
      receiver: inq.receiver
    };
  };
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
    if (currentEditInq.selectChoice) {
      await updateInquiryChoice(currentEditInq.selectChoice);
      //
      const answersObj = currentEditInq.answerObj;
      answersObj.forEach((item, i) => {
        answersObj[i].confirmed = false;
      });
      const answerIndex = answersObj.findIndex((item) => item.id === currentEditInq.selectChoice.answer);
      const answerUpdate = answersObj[answerIndex];
      answerUpdate.confirmed = true;
      dispatch(InquiryActions.setEditInq(currentEditInq));
      dispatch(
        AppAction.showMessage({ message: 'Save inquiry successfully', variant: 'success' })
      );
    } else if (currentEditInq.paragraphAnswer) {
      const objAns = currentEditInq.answerObj;
      if (currentEditInq.answerObj.length === 0) {
        createParagraphAnswer(currentEditInq.paragraphAnswer).then((res) => {
          if (res) {
            const { message, answerObj } = res;
            objAns.push(answerObj);
            dispatch(InquiryActions.setEditInq(currentEditInq));
            dispatch(AppAction.showMessage({ message: message, variant: 'success' }));
          }
        });
      } else {
        const answerId = currentEditInq.answerObj[0].id;
        updateParagraphAnswer(answerId, currentEditInq.paragraphAnswer).then((res) => {
          if (res) {
            const { message } = res;
            objAns[0].content = currentEditInq.paragraphAnswer.content;
            dispatch(InquiryActions.setEditInq(currentEditInq));
            dispatch(AppAction.showMessage({ message: message, variant: 'success' }));
          }
        });
      }
    }
    const inquiry = inquiries.find((q) => q.id === currentEditInq.id);
    const mediaCreate = currentEditInq.answerObj[0].mediaFiles.filter(
      ({ id: id1 }) => !inquiry.answerObj[0].mediaFiles.some(({ id: id2 }) => id2 === id1)
    );
    const mediaDelete = currentEditInq.answerObj[0].mediaFiles.filter(
      ({ id: id1 }) => !currentEditInq.answerObj[0].mediaFiles.some(({ id: id2 }) => id2 === id1)
    );

    for (const f in mediaCreate) {
      const form_data = mediaCreate[f].data;
      const res = await uploadFile(form_data);
      mediaCreate[f].id = res.response[0].id;
    }
    if (
      JSON.stringify(inq(currentEditInq)) !== JSON.stringify(inq(inquiry)) ||
      JSON.stringify(currentEditInq.answerObj) !== JSON.stringify(inquiry.answerObj) ||
      mediaCreate.length ||
      mediaDelete.length
    ) {
      await updateInquiry(inquiry.id, {
        inq: inq(currentEditInq),
        ans: { ansDelete:[], ansCreate:[], ansUpdate:[] },
        files: { mediaCreate, mediaDelete }
      });
    }
    
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
