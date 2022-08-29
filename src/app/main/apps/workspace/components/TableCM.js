import { CM_MARK, CM_PACKAGE, CM_DESCRIPTION, CM_WEIGHT, CM_MEASUREMENT } from '@shared/keyword';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, Grid } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import HelpIcon from '@material-ui/icons/Help';
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
const success = '#36B37E'

const useStyles = makeStyles((theme) => ({
  hoverIcon: {
    position: 'relative',
    left: '98%',
    fontSize: '20px',
  },
  attachIcon: {
    transform: 'rotate(45deg)',
    marginLeft: '-2.5rem'
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
      backgroundColor: '#FDF2F2',
    },
  },
  hasInq: {
    borderRadius: '8px',
    zIndex: 0,
    paddingBottom: '1rem',
    backgroundColor: '#FDF2F2',
  },
  colorHasAnswer: {
    color: `${green} !important`
  },

  colorHasResolved: {
    color: `${success} !important`
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
  labelMargin: {
    marginTop: '0.6rem !important',
    padding: '4px',
    height: '40px',
    display: 'flex',
    textAlign: 'center',
    alignItems: 'center'
  }
}));
const allowAddInquiry = PermissionProvider({ action: PERMISSION.INQUIRY_CREATE_INQUIRY });

const TableCM = (props) => {
  const { id, containerManifest } = props;
  const dispatch = useDispatch();
  const classes = useStyles();

  const [showIcons, setShowIcons] = useState(false);
  const [questionIsEmpty, setQuestionIsEmpty] = useState(true);
  const [mediaFileIsEmpty, setMediaFileIsEmpty] = useState(true);
  const [hasAnswer, setHasAnswer] = useState(false);
  const [isResolved, setIsResolved] = useState(false)

  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  // const originalInquiry = useSelector(({ workspace }) => workspace.inquiryReducer.originalInquiry);
  const questions = useSelector(({ workspace }) => workspace.inquiryReducer.question);
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);

  const checkAnswerSent = () => {
    if (inquiries.length > 0) {
      const lst = inquiries.filter((q) => q.field === id);
      return lst.some(e => ['ANS_SENT','REP_Q_DRF','REP_Q_SENT','REP_A_DRF','REP_A_SENT'].includes(e.state))
    }
    return false;
  };

  const checkQuestionIsResolved = () => {
    if (inquiries.length > 0) {
      const lst = inquiries.filter((q) => q.field === id);
      console.log(lst);
      if (lst.length > 0)
        return lst.every(e => e.state === 'COMPL' || e.state === 'UPLOADED')
    }
    return false;
  };

  const onMouseEnter = (e) => setShowIcons(true);

  const onMouseLeave = (e) => setShowIcons(false);

  const onClick = (e) => {
    if (!questionIsEmpty) {
      const currentInq = inquiries.find((q) => q.field === id);
      dispatch(InquiryActions.setOneInq(currentInq));
    }
    else if (allowAddInquiry) {
      dispatch(InquiryActions.addQuestion(id));
      if (
        inquiries.length > 1 &&
        !inquiries[inquiries.length - 1].id
      ) {
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
    setHasAnswer(checkAnswerSent())
    setIsResolved(checkQuestionIsResolved())
  }, [inquiries, metadata]);


  return (
    <>
      <div className={clsx(classes.hoverIcon, `justify-self-end opacity-${(showIcons || !questionIsEmpty) ? '100' : '0'}`)}>
        {!isResolved ?(
          !questionIsEmpty ?
            <>
              {!mediaFileIsEmpty && <AttachFile className={clsx(classes.colorHasInqIcon, classes.attachIcon)} />}
              < HelpIcon className={clsx(classes.colorHasInqIcon)} />
            </>
            : (allowAddInquiry &&<AddCircleIcon className={(showIcons ? clsx(classes.colorEmptyInqIcon) : clsx(classes.colorNoInqIcon))}/> )):<></>
        }
      </div>
      <div className={clsx(!questionIsEmpty ? classes.hasInq : classes.enterTableFile, hasAnswer ? classes.hasAnswer : '',
        isResolved ? classes.hasResolved : '')} onClick={onClick}>
        <Grid container
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className='px-8 justify-between'>
          <Grid container item xs={2} spacing={1}>
            <Label className={clsx(classes.labelMargin)}>{'CNTR. NOS. W/SEAL NOS.\nMARKS & NUMBERS'}</Label>
          </Grid>
          <Grid container item xs={2} spacing={1}>
            <Label className={clsx(classes.labelMargin)}>QUANTITY (FOR CUSTOMS DECLARATION ONLY)</Label>
          </Grid>
          <Grid container item xs={4} spacing={1} className='justify-center'>
            <Label className={clsx(classes.labelMargin)}>DESCRIPTION OF GOODS</Label>
          </Grid>
          <Grid container item xs={2} spacing={1}>
            <Label className={clsx(classes.labelMargin)}>GROSS WEIGHT</Label>
          </Grid>
          <Grid container item xs={2} spacing={1}>
            <Label className={clsx(classes.labelMargin)}>GROSS MEASUREMENT</Label>
          </Grid>
          {isResolved&&<CheckCircleIcon style={{paddingTop: 15, paddingLeft: 15}} className={clsx(classes.sizeIcon, classes.colorHasResolved)} />}
          {containerManifest?.length > 0 ?
            containerManifest.map((cm, index) =>
              (<Grid container spacing={2} className='px-8 py-2' key={index}>
                <Grid item xs={2}>
                  <BLField disableClick={true} multiline={true} rows={6}>{cm?.[metadata?.inq_type?.[CM_MARK]]}</BLField>
                </Grid>
                <Grid item xs={2}>
                  <BLField disableClick={true} multiline={true} rows={6}>{cm?.[metadata?.inq_type?.[CM_PACKAGE]]}</BLField>
                </Grid>
                <Grid item xs={4}>
                  <BLField disableClick={true} multiline={true} rows={6} width='360px'>{cm?.[metadata?.inq_type?.[CM_DESCRIPTION]]}</BLField>
                </Grid>
                <Grid item xs={2}>
                  <BLField disableClick={true} multiline={true} rows={6}>{cm?.[metadata?.inq_type?.[CM_WEIGHT]]}</BLField>
                </Grid>
                <Grid item xs={2}>
                  <BLField disableClick={true} multiline={true} rows={6}>{cm?.[metadata?.inq_type?.[CM_MEASUREMENT]]}</BLField>
                </Grid>
              </Grid>))
            : (<Grid container spacing={2} className='px-8 py-2'>
              <Grid item xs={2}>
                <BLField disableClick={true}></BLField>
              </Grid>
              <Grid item xs={2}>
                <BLField disableClick={true}></BLField>
              </Grid>
              <Grid item xs={4}>
                <BLField disableClick={true} width='360px'> </BLField>
              </Grid>
              <Grid item xs={2}>
                <BLField disableClick={true}></BLField>
              </Grid>
              <Grid item xs={2}>
                <BLField disableClick={true}></BLField>
              </Grid>
            </Grid>)
          }
        </Grid>
      </div>
    </>
  );
};

export default TableCM;
