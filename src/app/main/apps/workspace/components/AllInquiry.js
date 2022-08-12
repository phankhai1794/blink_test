import { getKeyByValue } from '@shared';
import { loadComment } from 'app/services/inquiryService';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import {
  Card,
  Typography,
  Divider,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from '../store/actions/form';

import InquiryEditor from './InquiryEditor';
import AttachFile from './AttachFile';
import InquiryViewer from './InquiryViewer';
import InquiryAnswer from './InquiryAnswer';

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
  const [viewDropDown, setViewDropDown] = useState('');
  const [inqHasComment, setInqHasComment] = useState([]);
  const [inquiries, currentEditInq, metadata, valid, myBL] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.inquiries,
    workspace.inquiryReducer.currentEditInq,
    workspace.inquiryReducer.metadata,
    workspace.inquiryReducer.validation,
    workspace.inquiryReducer.myBL
  ]);
  
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

  useEffect(() => {  
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

  const toggleEdit = (index) => {
    dispatch(FormActions.toggleSaveInquiry(true));
    if (index >= 0) {
      const inqEdit = JSON.parse(JSON.stringify(inquiries[index]));
      dispatch(InquiryActions.setEditInq(inqEdit));
      dispatch(InquiryActions.setField(inqEdit.field));
    }
  };
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
        if (props.user === 'workspace') {
          return currentEditInq && q.id === currentEditInq.id ? (
            <div key={index}>
              {<InquiryEditor onCancel={onCancel} />}
              <Divider
                className="my-32"
                variant="middle"
                style={{ height: '2px', color: '#BAC3CB' }}
              />
            </div>
          ) : (
            <Card key={index} elevation={0} style={{ padding: '1rem ' }}>
              <div
                className={clsx(
                  classes.boxItem,
                  inqHasComment.includes(q.id) && classes.boxHasComment
                )}>
                <div style={{ marginBottom: '12px' }}>
                  <Typography color="primary" variant="h5" className={classes.inqTitle}>
                    {`${CURRENT_NUMBER}. ${getKeyByValue(metadata['field'], q.field)}`}
                  </Typography>

                  <InquiryViewer user={props.user} question={q} index={index} openInquiryReview={openInquiryReview} />
                </div>
              </div>
              <Divider
                className="my-32"
                variant="middle"
                style={{ height: '2px', color: '#BAC3CB' }}
              />
            </Card>
          );
        } else {
          const isEdit = currentEditInq && q.id === currentEditInq.id;
          return (
            <div key={index}>
              <InquiryViewer
                openInquiryReview={openInquiryReview}
                toggleEdit={() => toggleEdit(index)}
                question={isEdit ? currentEditInq : q}
                user={props.user}></InquiryViewer>
              {isEdit && <InquiryAnswer onCancel={onCancel} />}
            </div>
          );
        }


      })}
    </>
  );
};

export default AllInquiry;
