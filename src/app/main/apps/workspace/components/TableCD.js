import {
  CONTAINER_NUMBER,
  CONTAINER_SEAL,
  CONTAINER_TYPE,
  CONTAINER_PACKAGE,
  CONTAINER_WEIGHT,
  CONTAINER_MEASUREMENT
} from '@shared/keyword';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, Grid } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AttachFile from '@material-ui/icons/AttachFile';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import * as FormActions from '../store/actions/form';
import * as InquiryActions from '../store/actions/inquiry';

import BLField from './BLField';
import Label from './FieldLabel';

const red = '#DC2626';
const pink = '#BD0F72';
const blue = '#EAF2FD';
const green = '#2F80ED';
const success = '#36B37E';

const useStyles = makeStyles((theme) => ({
  addIcon: {
    position: 'relative',
    left: '98%',
    fontSize: '20px'
  },
  colorHasInqIcon: {
    color: `${red} !important`
  },
  colorEmptyInqIcon: {
    color: `${pink} !important`
  },
  colorNoInqIcon: {
    color: `white !important`
  },
  enterTableFile: {
    borderRadius: '8px',
    zIndex: 0,
    paddingBottom: '1rem',
    '&:hover': {
      backgroundColor: '#FDF2F2'
    }
  },
  hasResolved: {
    backgroundColor: '#EBF7F2',
    '& fieldset': {
      backgroundColor: '#EBF7F2',
      borderColor: `${success} !important`
    },
    '&:hover': {
      backgroundColor: '#EBF7F2'
    }
  },
  hasAnswer: {
    backgroundColor: blue,
    zIndex: 0,
    '& fieldset': {
      backgroundColor: blue,
      borderColor: `${green} !important`
    },
    '&:hover fieldset': {
      borderColor: `${green} !important`
    },
    '&:focus-within fieldset': {
      border: `1px solid ${green} !important`
    }
  },
  colorHasAnswer: {
    color: `${green} !important`
  },

  colorHasResolved: {
    color: `${success} !important`
  },
  hasInq: {
    borderRadius: '8px',
    zIndex: 0,
    paddingBottom: '1rem',
    backgroundColor: '#FDF2F2'
  },
  labelMargin: {
    marginTop: '0.6rem !important',
    display: 'flex',
    textAlign: 'left',
    alignItems: 'left'
  },
  attachIcon: {
    transform: 'rotate(45deg)',
    marginLeft: '-2.5rem'
  }
}));

const allowAddInquiry = PermissionProvider({ action: PERMISSION.INQUIRY_CREATE_INQUIRY });

const TableCD = (props) => {
  const { id, containerDetail } = props;
  const dispatch = useDispatch();
  const classes = useStyles();

  const [showAddIcon, setShowAddIcon] = useState(false);
  const [questionIsEmpty, setQuestionIsEmpty] = useState(true);
  const [mediaFileIsEmpty, setMediaFileIsEmpty] = useState(true);
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const valid = useSelector(({ workspace }) => workspace.inquiryReducer.validation);
  const [hasAnswer, setHasAnswer] = useState(false);
  const [isResolved, setIsResolved] = useState(false);

  const checkAnswerSent = () => {
    if (inquiries.length > 0) {
      const lst = inquiries.filter((q) => q.field === id);
      return lst.some((e) =>
        ['ANS_SENT', 'REP_Q_DRF', 'REP_Q_SENT', 'REP_A_DRF', 'REP_A_SENT'].includes(e.state)
      );
    }
    return false;
  };

  const checkQuestionIsResolved = () => {
    if (inquiries.length > 0) {
      const lst = inquiries.filter((q) => q.field === id);
      if (lst.length > 0) return lst.every((e) => e.state === 'COMPL' || e.state === 'UPLOADED');
    }
    return false;
  };

  const onMouseEnter = (e) => setShowAddIcon(true);

  const onMouseLeave = (e) => setShowAddIcon(false);

  const onClick = (e) => {
    if (!questionIsEmpty) {
      const currentInq = inquiries.find((q) => q.field === id);
      dispatch(InquiryActions.setOneInq(currentInq));
    } else if (allowAddInquiry) {
      dispatch(InquiryActions.addQuestion(id));
      if (inquiries.length > 1 && !inquiries[inquiries.length - 1].id) {
        if (inquiries.length + 1 === metadata.field_options.length) {
          dispatch(FormActions.toggleAddInquiry(false));
        }
      }
      dispatch(FormActions.toggleCreateInquiry(true));
    }
    dispatch(InquiryActions.setField(id));
  };

  const checkQuestionIsEmpty = () => {
    if (inquiries.length > 0) {
      const check = inquiries.filter((q) => q.field === id);
      const checkMedita = inquiries.filter((q) => q.field === id && q.mediaFile.length);
      checkMedita.length && setMediaFileIsEmpty(false);
      return check.length === 0;
    }
    return true;
  };

  useEffect(() => {
    setQuestionIsEmpty(checkQuestionIsEmpty());
    setHasAnswer(checkAnswerSent());
    setIsResolved(checkQuestionIsResolved());
  }, [inquiries, metadata]);

  return (
    <>
      <div
        className={clsx(
          classes.addIcon,
          `justify-self-end opacity-${showAddIcon || !questionIsEmpty ? '100' : '0'}`
        )}>
        {!isResolved ?
          (!questionIsEmpty ? (
            <>
              {!mediaFileIsEmpty && (
                <AttachFile className={clsx(classes.colorHasInqIcon, classes.attachIcon)} />
              )}
              <HelpIcon className={clsx(classes.colorHasInqIcon)} />
            </>
          ) : (
            allowAddInquiry && (
              <AddCircleIcon
                className={
                  showAddIcon ? clsx(classes.colorEmptyInqIcon) : clsx(classes.colorNoInqIcon)
                }
              />
            )
          )): <CheckCircleIcon className={clsx(classes.sizeIcon, classes.colorHasResolved)}/>}
      </div>
      <div
        className={clsx(
          !questionIsEmpty & !hasAnswer & !isResolved ? classes.hasInq : classes.enterTableFile,
          hasAnswer ? classes.hasAnswer : '',
          isResolved ? classes.hasResolved : ''
        )}
        onClick={onClick}>
        <Grid
          container
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="px-8 justify-between">
          <Grid container spacing={2}>
            <Grid container item xs={2}>
              <Label className={clsx(classes.labelMargin)}>CONTAINER NUMBER</Label>
            </Grid>
            <Grid container item xs={2}>
              <Label className={clsx(classes.labelMargin)}>SEAL</Label>
            </Grid>
            <Grid container item xs={2}>
              <Label className={clsx(classes.labelMargin)}>TYPE</Label>
            </Grid>
            <Grid container item xs={2}>
              <Label className={clsx(classes.labelMargin)}>PACKAGE</Label>
            </Grid>
            <Grid container item xs={2}>
              <Label className={clsx(classes.labelMargin)}>WEIGHT</Label>
            </Grid>
            <Grid container item xs={1}>
              <Label className={clsx(classes.labelMargin)}>MEASUREMENT</Label>
            </Grid>
            {containerDetail?.length > 0 ? (
              containerDetail.map((cd, index) => (
                <Grid container spacing={2} className="px-8 py-2" key={index}>
                  <Grid item xs={2}>
                    <BLField disableClick={true}>
                      {cd?.[metadata?.inq_type?.[CONTAINER_NUMBER]]}
                    </BLField>
                  </Grid>
                  <Grid item xs={2}>
                    <BLField disableClick={true}>
                      {cd?.[metadata?.inq_type?.[CONTAINER_SEAL]]}
                    </BLField>
                  </Grid>
                  <Grid item xs={2}>
                    <BLField disableClick={true}>
                      {cd?.[metadata?.inq_type?.[CONTAINER_TYPE]]}
                    </BLField>
                  </Grid>
                  <Grid item xs={2}>
                    <BLField disableClick={true}>
                      {cd?.[metadata?.inq_type?.[CONTAINER_PACKAGE]]}
                    </BLField>
                  </Grid>
                  <Grid item xs={2}>
                    <BLField disableClick={true}>
                      {cd?.[metadata?.inq_type?.[CONTAINER_WEIGHT]]}
                    </BLField>
                  </Grid>
                  <Grid item xs={2}>
                    <BLField disableClick={true}>
                      {cd?.[metadata?.inq_type?.[CONTAINER_MEASUREMENT]]}
                    </BLField>
                  </Grid>
                </Grid>
              ))
            ) : (
              <Grid container spacing={2} className="px-8 py-2">
                <Grid item xs={2}>
                  <BLField disableClick={true}></BLField>
                </Grid>
                <Grid item xs={2}>
                  <BLField disableClick={true}></BLField>
                </Grid>
                <Grid item xs={2}>
                  <BLField disableClick={true}></BLField>
                </Grid>
                <Grid item xs={2}>
                  <BLField disableClick={true}></BLField>
                </Grid>
                <Grid item xs={2}>
                  <BLField disableClick={true}></BLField>
                </Grid>
                <Grid item xs={2}>
                  <BLField disableClick={true}></BLField>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default TableCD;
