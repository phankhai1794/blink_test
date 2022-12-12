import {
  updateInquiryChoice,
  createParagraphAnswer,
  updateParagraphAnswer,
  updateInquiry,
  createAttachmentAnswer,
  addTransactionAnswer, getUpdatedAtAnswer
} from 'app/services/inquiryService';
import { uploadFile } from 'app/services/fileService';
import { validateTextInput } from 'app/services/myBLService';
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

import { ONLY_ATT } from '@shared/keyword';
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
  const { onCancel, setSave, question } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const currentEditInq = useSelector(({ workspace }) => workspace.inquiryReducer.currentEditInq);
  const metadata = useSelector(({ draftBL }) => draftBL.metadata);
  const [isDisableSave, setDisableSave] = useState(false);
  const myBL = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);
  const inq = (inq) => {
    return {
      content: inq.content,
      field: inq.field,
      inqType: inq.inqType,
      ansType: inq.ansType,
      receiver: inq.receiver
    };
  };
  const optionsInquires = [...inquiries];
  const editedIndex = optionsInquires.findIndex(inq1 => question.id === inq1.id);
  let currentAnswer = optionsInquires[editedIndex]


  const saveAttachmentAnswer = async (currentEditInq, responseSelectChoice) => {
    const question = {
      inqId: currentEditInq.id,
      ansType: metadata.ans_type['attachment'],
    };
    const mediaRest = [];
    const mediaList = [];
    let isHasMedia = false;
    const optionsInquires = [...inquiries];
    const editedIndex = optionsInquires.findIndex(inq => currentEditInq.id === inq.id);
    const formData = new FormData();
    currentEditInq.mediaFilesAnswer.forEach((mediaFileAns, index) => {
      if (mediaFileAns.id === null) {
        formData.append('files', mediaFileAns.data);
        isHasMedia = true;
      } else {
        mediaRest.push(mediaFileAns.id);
      }
    });
    if (isHasMedia) {
      uploadFile(formData).then(media => {
        const { response } = media;
        response.forEach(file => {
          mediaList.push(file);
        });
        createAttachmentAnswer({ question, mediaFile: mediaList, mediaRest }).then(async (res) => {
          // update attachment answer
          const answerObjMediaFiles = currentEditInq?.mediaFilesAnswer.filter((q) => q.id);
          mediaList.forEach((item) => {
            answerObjMediaFiles.push({
              id: item.id,
              name: item.name,
              ext: item.ext,
            })
          });
          optionsInquires[editedIndex].mediaFilesAnswer = answerObjMediaFiles;
          //
          if (currentEditInq.paragraphAnswer) {
            // update paragraph answer
            optionsInquires[editedIndex].answerObj[0].content = currentEditInq.paragraphAnswer.content.trim();
          } else if (currentEditInq.selectChoice) {
            // update choice answer
            const answersObj = currentEditInq.answerObj;
            answersObj.forEach((item, i) => {
              answersObj[i].confirmed = false;
              answersObj[i].updatedAt = responseSelectChoice.userAnswer.updatedAt;
              answersObj[i].updater = responseSelectChoice.userAnswer.updater;
            });
            const answerIndex = answersObj.findIndex((item) => item.id === currentEditInq.selectChoice.answer);
            const answerUpdate = answersObj[answerIndex];
            answerUpdate.confirmed = true;
            optionsInquires[editedIndex].answerObj = answersObj;
          }
          if (optionsInquires[editedIndex].state === 'INQ_SENT') {
            optionsInquires[editedIndex].state = 'ANS_DRF';
          }
          //
          const dataDate = await getUpdatedAtAnswer(question.inqId);
          optionsInquires[editedIndex].createdAt = dataDate.data;
          optionsInquires[editedIndex].showIconAttachAnswerFile = false;
          dispatch(InquiryActions.setInquiries(optionsInquires));
          props.getUpdatedAt();
          // setSave();
        }).catch((error) => {
          console.log(error)
        });
      }).catch((error) => dispatch(AppAction.showMessage({ message: error, variant: 'error' })));
    } else {
      createAttachmentAnswer({ question, mediaFile: mediaList, mediaRest }).then(async (res) => {
        optionsInquires[editedIndex].mediaFilesAnswer = currentEditInq.mediaFilesAnswer;
        //
        if (currentEditInq.paragraphAnswer) {
          // update paragraph answer
          optionsInquires[editedIndex].answerObj[0].content = currentEditInq.paragraphAnswer.content;
        } else if (currentEditInq.selectChoice) {
          // update choice answer
          const answersObj = currentEditInq.answerObj;
          answersObj.forEach((item, i) => {
            answersObj[i].confirmed = false;
            answersObj[i].updatedAt = responseSelectChoice.userAnswer.updatedAt;
            answersObj[i].updater = responseSelectChoice.userAnswer.updater;
          });
          const answerIndex = answersObj.findIndex((item) => item.id === currentEditInq.selectChoice.answer);
          const answerUpdate = answersObj[answerIndex];
          answerUpdate.confirmed = true;
          optionsInquires[editedIndex].answerObj = answersObj;
        }
        if (optionsInquires[editedIndex].state === 'INQ_SENT') {
          optionsInquires[editedIndex].state = 'ANS_DRF';
        }
        //
        const dataDate = await getUpdatedAtAnswer(question.inqId);
        optionsInquires[editedIndex].createdAt = dataDate.data;
        optionsInquires[editedIndex].showIconAttachAnswerFile = false;
        dispatch(InquiryActions.setInquiries(optionsInquires));
        props.getUpdatedAt();
        // setSave();
      }).catch((error) => dispatch(AppAction.showMessage({ message: error, variant: 'error' })));
    }
  }

  const handleValidateInput = async (confirm = null) => {
    let textInput = currentAnswer?.paragraphAnswer?.content.trim() || '';
    const { isWarning, prohibitedInfo } = await validateTextInput({ textInput, dest: myBL.bkgNo });
    if (isWarning) {
      dispatch(FormActions.validateInput({ isValid: false, prohibitedInfo, handleConfirm: confirm }));
    } else {
      confirm && confirm();
    }
  }

  const onSave = async () => {
    dispatch(FormActions.validateInput({ isValid: true, prohibitedInfo: null, handleConfirm: null }));
    const optionsInquires = [...inquiries];
    const editedIndex = optionsInquires.findIndex(inq => question.id === inq.id);
    setDisableSave(true)
    let responseSelectChoice;

    if (!question.paragraphAnswer && question.attachmentAnswer && question.ansType === metadata.ans_type['paragraph']) {
      question.paragraphAnswer = {
        inquiry: question.attachmentAnswer.inquiry,
        content: ONLY_ATT
      }
    }
    //
    await addTransactionAnswer({ inquiryId: question.id });
    //
    if (question.selectChoice) {
      responseSelectChoice = await updateInquiryChoice(question.selectChoice);
    } else if (question.paragraphAnswer) {
      if (question.answerObj.length === 0) {
        const response = await createParagraphAnswer(question.paragraphAnswer);
        optionsInquires[editedIndex].answerObj.push(response.answerObj);
      } else {
        const answerId = question.answerObj[0].id;
        if (question.paragraphAnswer.content.trim() === '') {
          question.paragraphAnswer.content = ONLY_ATT;
        }
        await updateParagraphAnswer(answerId, question.paragraphAnswer);
      }
    }
    if (question.attachmentAnswer) {
      await saveAttachmentAnswer(question, responseSelectChoice);
      dispatch(AppAction.showMessage({ message: 'Save inquiry successfully', variant: 'success' }));
    } else {
      if (question.selectChoice) {
        const answersObj = question.answerObj;
        answersObj.forEach((item, i) => {
          answersObj[i].confirmed = false;
          answersObj[i].updatedAt = responseSelectChoice.userAnswer.updatedAt;
          answersObj[i].updater = responseSelectChoice.userAnswer.updater;
        });
        const answerIndex = answersObj.findIndex((item) => item.id === question.selectChoice.answer);
        const answerUpdate = answersObj[answerIndex];
        answerUpdate.confirmed = true;
        optionsInquires[editedIndex].answerObj = question.answerObj;
        if (optionsInquires[editedIndex].state === 'INQ_SENT') {
          optionsInquires[editedIndex].state = 'ANS_DRF';
        }
        //
        const dataDate = await getUpdatedAtAnswer(question.id);
        optionsInquires[editedIndex].createdAt = dataDate.data;
        optionsInquires[editedIndex].showIconAttachAnswerFile = false;
        dispatch(InquiryActions.setInquiries(optionsInquires));
        props.getUpdatedAt();
        // setSave();
        dispatch(AppAction.showMessage({ message: 'Save inquiry successfully', variant: 'success' }));
      } else if (question.paragraphAnswer) {
        if (question.answerObj.length) {
          optionsInquires[editedIndex].answerObj[0].content = question.paragraphAnswer.content;
        }
        if (optionsInquires[editedIndex].state === 'INQ_SENT') {
          optionsInquires[editedIndex].state = 'ANS_DRF';
        }
        const dataDate = await getUpdatedAtAnswer(question.id);
        optionsInquires[editedIndex].createdAt = dataDate.data;
        optionsInquires[editedIndex].showIconAttachAnswerFile = false;
        dispatch(InquiryActions.setInquiries(optionsInquires));
        props.getUpdatedAt();
        // setSave();
        dispatch(AppAction.showMessage({ message: 'Save inquiry successfully', variant: 'success' }));
      }
    }
    dispatch(InquiryActions.setEditInq(null));
  };

  useEffect(() => {
    if (isDisableSave) setDisableSave(false);
  }, []);

  return (
    <div className='changeToEditor'>
      <div className="flex">

        <div className="flex">
          <Button
            variant="contained"
            color="primary"
            disabled={
              (
                !currentAnswer?.paragraphAnswer?.content?.trim()
                && !currentAnswer.selectChoice
                && (!currentAnswer.mediaFilesAnswer || currentAnswer.mediaFilesAnswer.length == 0)
              )
              ||
              isDisableSave
            }
            onClick={() => handleValidateInput(onSave)}
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

    </div>
  );
};

export default InquiryAnswer;
