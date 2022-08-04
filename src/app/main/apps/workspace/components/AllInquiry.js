import { getKeyByValue, stateResquest, displayTime } from '@shared';
import { getFile } from 'app/services/fileService';
import { deleteInquiry, loadComment } from 'app/services/inquiryService';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import DeleteIcon from '@material-ui/icons/Delete';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import {
  Card,
  Typography,
  FormControl,
  FormGroup,
  Tooltip,
  FormControlLabel,
  IconButton,
  Checkbox,
  FormHelperText,
  Divider,
  RadioGroup,
  Radio,
  Grid
} from '@material-ui/core';
import IconAttachFile from '@material-ui/icons/AttachFile';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from '../store/actions/form';

import InquiryEditor from './InquiryEditor';
import AttachFile from './AttachFile';
import InquiryViewer from './InquiryViewer';

const useStyles = makeStyles((theme) => ({
  root: {
    '&:hover': {
      backgroundColor: 'transparent'
    }
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
    }
  },
  checkedIcon: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '& .MuiFormGroup-root': {
      flexDirection: 'row'
    },
    '& .container': {
      marginBottom: 5
    }
  },
  inqTitle: {
    fontFamily: 'Montserrat',
    color: '#BD0F72',
    fontSize: 22,
    fontWeight: 600,
    wordBreak: 'break-word'
  },
  attachIcon: {
    transform: 'rotate(45deg)',
    color: '#8A97A3 !important'
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
  hideText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 5,
    '-webkit-box-orient': 'vertical'
  },
  boxItem: {
    borderLeft: '2px solid',
    borderColor: '#DC2626',
    paddingLeft: '2rem'
  },
  boxHasComment: {
    borderColor: '#2F80ED'
  }
}));
const AllInquiry = (props) => {
  const dispatch = useDispatch();
  const { receiver, openInquiryReview } = props;
  const classes = useStyles();
  const [allowDeleteInq, setAllowDeleteInq] = useState(true);
  const [viewDropDown, setViewDropDown] = useState('');
  const [inqHasComment, setInqHasComment] = useState([]);
  const [inquiries, currentEditInq, metadata, valid, myBL] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.inquiries,
    workspace.inquiryReducer.currentEditInq,
    workspace.inquiryReducer.metadata,
    workspace.inquiryReducer.validation,
    workspace.inquiryReducer.myBL
  ]);
  const allowCreateAttachmentAnswer = PermissionProvider({
    action: PERMISSION.INQUIRY_ANSWER_ATTACHMENT
  });
  let CURRENT_NUMBER = 0;

  const changeToEditor = (inq) => {
    const index = inquiries.findIndex((q) => q.id === inq.id);
    if (index >= 0) {
      const inqEdit = JSON.parse(JSON.stringify(inq));
      dispatch(InquiryActions.setEditInq(inqEdit));

      dispatch(InquiryActions.setField(inq.field));
      setViewDropDown('');
    }
  };

  const removeQuestion = (index) => {
    const optionsOfQuestion = [...inquiries];
    const inqDelete = optionsOfQuestion.splice(index, 1)[0];
    deleteInquiry(inqDelete.id)
      .then(() => {
        dispatch(InquiryActions.setInquiries(optionsOfQuestion));
      })
      .catch((error) => console.error(error));
  };

  const handleReceiverChange = (e, index) => {
    const optionsOfQuestion = { ...currentEditInq };
    optionsOfQuestion.receiver = [];
    dispatch(InquiryActions.validate({ ...valid, receiver: true }));
    optionsOfQuestion.receiver.push(e.target.value);
    dispatch(InquiryActions.setEditInq(optionsOfQuestion));
    dispatch(FormActions.setEnableSaveInquiriesList(false));
  };


  useEffect(() => {
    myBL?.state !== stateResquest && setAllowDeleteInq(false);
    for (let i in inquiries) {
      loadComment(inquiries[i].id)
        .then((res) => {
          if (res.length) {
            const listInqId = inqHasComment;
            listInqId.push(inquiries[i].id);
            setInqHasComment(listInqId);
          }
        })
        .catch((error) => console.error(error));
    }
  }, []);

  const onCancel = () => {
    if (currentEditInq.id) {
      dispatch(InquiryActions.setEditInq());
    }
  };

  return (
    <>
      {inquiries.map((q, index) => {
        if (receiver && !q.receiver.includes(receiver)) {
          return (
            <div key={index} style={{ display: 'flex' }} onClick={() => changeToEditor(q)}></div>
          );
        }
        const type = q.ansType;
        CURRENT_NUMBER++;
        return currentEditInq && q.id === currentEditInq.id ? (
          <>
            {<InquiryEditor onCancel={onCancel} />}
            <Divider
              className="my-32"
              variant="middle"
              style={{ height: '2px', color: '#BAC3CB' }}
            />
          </>
        ) : (
          <Card elevation={0} style={{ padding: '1rem ' }}>
            <div
              className={clsx(
                classes.boxItem,
                inqHasComment.includes(q.id) && classes.boxHasComment
              )}>
              <div style={{ marginBottom: '12px' }}>
                <div className="flex justify-between">
                  <Typography color="primary" variant="h5" className={classes.inqTitle}>
                    {`${CURRENT_NUMBER}. ${getKeyByValue(metadata['field'], q.field)}`}
                  </Typography>
                  <div className="flex justify-end" style={{ width: '350px' }}>
                    <div
                      className="flex justify-end items-center mr-2 "
                      onClick={() => changeToEditor(q)}>
                      <img
                        style={{ width: 20, cursor: 'pointer' }}
                        src="/assets/images/icons/edit.svg"
                      />
                    </div>
                    <div className="flex justify-end items-center mr-2 ">
                      {q.mediaFile?.length > 0 && (
                        <IconAttachFile className={clsx(classes.attachIcon)} />
                      )}
                      {/* {allowDeleteInq &&
                              <IconButton className="p-8" onClick={() => removeQuestion(index)}>
                                <DeleteIcon />
                              </IconButton>} */}
                    </div>
                    <div
                      className="flex justify-end items-center"
                      onClick={() => removeQuestion(index)}>
                      {allowDeleteInq && (
                        <img
                          style={{ height: '22px', cursor: 'pointer' }}
                          src="/assets/images/icons/trash-gray.svg"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <InquiryViewer question={q} index={index} />
              </div>
            </div>
            <Divider
              className="my-32"
              variant="middle"
              style={{ height: '2px', color: '#BAC3CB' }}
            />
          </Card>
        );
      })}
    </>
  );
};

export default AllInquiry;
