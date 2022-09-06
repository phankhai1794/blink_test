import { updateInquiryChoice, createParagraphAnswer, updateParagraphAnswer, updateInquiry, createAttachmentAnswer } from 'app/services/inquiryService';
import { uploadFile } from 'app/services/fileService';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import * as AppAction from 'app/store/actions';
import clsx from 'clsx';

import * as InquiryActions from '../store/actions/inquiry';

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
  const {onCancel, setSave, question} = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const currentEditInq = useSelector(({ workspace }) => workspace.inquiryReducer.currentEditInq);
  const metadata = useSelector(({ draftBL }) => draftBL.metadata);
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

 
  const saveAttachmentAnswer = async (currentEditInq) => {
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
        const {response} = media;
        response.forEach(file => {
          mediaList.push(file);
        });
        createAttachmentAnswer({question, mediaFile: mediaList, mediaRest}).then((res) => {
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
            optionsInquires[editedIndex].answerObj[0].content = currentEditInq.paragraphAnswer.content;
          } else if (currentEditInq.selectChoice) {
            // update choice answer
            const answersObj = currentEditInq.answerObj;
            answersObj.forEach((item, i) => {
              answersObj[i].confirmed = false;
            });
            const answerIndex = answersObj.findIndex((item) => item.id === currentEditInq.selectChoice.answer);
            const answerUpdate = answersObj[answerIndex];
            answerUpdate.confirmed = true;
            optionsInquires[editedIndex].answerObj = answersObj;
          }
          optionsInquires[editedIndex].state = 'ANS_DRF';
          //
          dispatch(InquiryActions.setInquiries(optionsInquires));
          setSave();
        }).catch((error) => {
          console.log(error)
        });
      }).catch((error) => dispatch(AppAction.showMessage({message: error, variant: 'error'})));
    } else {
      createAttachmentAnswer({question, mediaFile: mediaList, mediaRest}).then((res) => {
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
          });
          const answerIndex = answersObj.findIndex((item) => item.id === currentEditInq.selectChoice.answer);
          const answerUpdate = answersObj[answerIndex];
          answerUpdate.confirmed = true;
          optionsInquires[editedIndex].answerObj = answersObj;
        }
        optionsInquires[editedIndex].state = 'ANS_DRF';
        //
        dispatch(InquiryActions.setInquiries(optionsInquires));
        setSave();
      }).catch((error) => dispatch(AppAction.showMessage({message: error, variant: 'error'})));
    }
  }

  const onSave = async () => {
    const optionsInquires = [...inquiries];
    const editedIndex = optionsInquires.findIndex(inq => question.id === inq.id);
    if (question.selectChoice) {
      await updateInquiryChoice(question.selectChoice);
    } else if (question.paragraphAnswer) {
      if (question.answerObj.length === 0) {
        const response = await createParagraphAnswer(question.paragraphAnswer);
        optionsInquires[editedIndex].answerObj.push(response.answerObj);
      } else {
        const answerId = question.answerObj[0].id;
        await updateParagraphAnswer(answerId, question.paragraphAnswer);
      }
    }
    if (question.attachmentAnswer) {
      await saveAttachmentAnswer(question);
      dispatch(AppAction.showMessage({ message: 'Save inquiry successfully', variant: 'success' }));
    } else {
      if (question.selectChoice) {
        const answersObj = question.answerObj;
        answersObj.forEach((item, i) => {
          answersObj[i].confirmed = false;
        });
        const answerIndex = answersObj.findIndex((item) => item.id === question.selectChoice.answer);
        const answerUpdate = answersObj[answerIndex];
        answerUpdate.confirmed = true;
        optionsInquires[editedIndex].answerObj = question.answerObj;
        optionsInquires[editedIndex].state = 'ANS_DRF';
        //
        dispatch(InquiryActions.setInquiries(optionsInquires));
        setSave();
        dispatch(AppAction.showMessage({ message: 'Save inquiry successfully', variant: 'success' }));
      } else if (question.paragraphAnswer) {
        if (question.answerObj.length) {
          optionsInquires[editedIndex].answerObj[0].content = question.paragraphAnswer.content;
        }
        optionsInquires[editedIndex].state = 'ANS_DRF';
        dispatch(InquiryActions.setInquiries(optionsInquires));
        setSave();
        dispatch(AppAction.showMessage({ message: 'Save inquiry successfully', variant: 'success' }));
      }
    }
    dispatch(InquiryActions.setEditInq(null));
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

    </div>
  );
};

export default InquiryAnswer;
