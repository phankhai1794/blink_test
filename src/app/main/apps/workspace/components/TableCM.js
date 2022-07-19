import { CM_MARK, CM_PACKAGE, CM_DESCRIPTION, CM_WEIGHT, CM_MEASUREMENT } from '@shared/keyword';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, Grid } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import HelpIcon from '@material-ui/icons/Help';
import AttachFile from '@material-ui/icons/AttachFile';
import { PERMISSION, PermissionProvider } from '@shared/permission';

import * as FormActions from '../store/actions/form';
import * as InquiryActions from '../store/actions/inquiry';

import BLField from './BLField';
import Label from './FieldLabel';

const red = '#DC2626';
const pink = '#BD0F72';

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
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const originalInquiry = useSelector(({ workspace }) => workspace.inquiryReducer.originalInquiry);
  const questions = useSelector(({ workspace }) => workspace.inquiryReducer.question);
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);

  const onMouseEnter = (e) => setShowIcons(true);

  const onMouseLeave = (e) => setShowIcons(false);

  const onClick = (e) => {
    if (!questionIsEmpty) {
      const currentInq = inquiries.find((q) => q.field === id);
      dispatch(InquiryActions.setOneInq(currentInq));
    }
    else if (allowAddInquiry) {
      if (
        questions.length > 1 &&
        !questions[questions.length - 1].id
      ) {
        if (inquiries.length + questions.length + 1 === metadata.field_options.length) {
          dispatch(FormActions.toggleAddInquiry(false));
        }
        if (inquiries.length + questions.length !== metadata.field_options.length) {
          dispatch(InquiryActions.addQuestion());
          dispatch(InquiryActions.setEdit(questions.length));
        }
      }
      dispatch(FormActions.toggleCreateInquiry(true));
    }
    dispatch(InquiryActions.setField(id));
  };

  const checkQuestionIsEmpty = () => {
    if (originalInquiry.length > 0) {
      const check = originalInquiry.filter((q) => q.field === id);
      const checkMedita = originalInquiry.filter((q) => q.field === id && q.mediaFile.length);
      checkMedita.length && setMediaFileIsEmpty(false);
      return check.length === 0;
    }
    return true;
  };

  useEffect(() => {
    setQuestionIsEmpty(checkQuestionIsEmpty());
  }, [originalInquiry, metadata]);


  return (
    <>
      <div className={clsx(classes.hoverIcon, `justify-self-end opacity-${(showIcons || !questionIsEmpty) ? '100' : '0'}`)}>
        {!questionIsEmpty ?
          <>
            {!mediaFileIsEmpty && <AttachFile className={clsx(classes.colorHasInqIcon, classes.attachIcon)} />}
            < HelpIcon className={clsx(classes.colorHasInqIcon)} />
          </>
          : (allowAddInquiry && <AddCircleIcon className={clsx(classes.colorEmptyInqIcon)} />)}
      </div>
      <div className={clsx(!questionIsEmpty ? classes.hasInq : classes.enterTableFile)} onClick={onClick}>
        <Grid container
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className='px-8 justify-between'>
          <Grid container item xs={2} spacing={1}>
            <Label className={clsx(classes.labelMargin)}>CNTR. NOS. W/SEAL NOS.MARKS & NUMBERS</Label>
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
          {containerManifest?.length > 0 ?
            containerManifest.map((cm, index) =>
              (<Grid container spacing={2} className='px-8 py-2' key={index}>
                <Grid item xs={2}>
                  <BLField multiline={true} rows={6}>{cm?.[metadata?.inq_type?.[CM_MARK]]}</BLField>
                </Grid>
                <Grid item xs={2}>
                  <BLField multiline={true} rows={6}>{cm?.[metadata?.inq_type?.[CM_PACKAGE]]}</BLField>
                </Grid>
                <Grid item xs={4}>
                  <BLField multiline={true} rows={6} width='360px'>{cm?.[metadata?.inq_type?.[CM_DESCRIPTION]]}</BLField>
                </Grid>
                <Grid item xs={2}>
                  <BLField multiline={true} rows={6}>{cm?.[metadata?.inq_type?.[CM_WEIGHT]]}</BLField>
                </Grid>
                <Grid item xs={2}>
                  <BLField multiline={true} rows={6}>{cm?.[metadata?.inq_type?.[CM_MEASUREMENT]]}</BLField>
                </Grid>
              </Grid>))
            : (<Grid container spacing={2} className='px-8 py-2'>
              <Grid item xs={2}>
                <BLField></BLField>
              </Grid>
              <Grid item xs={2}>
                <BLField ></BLField>
              </Grid>
              <Grid item xs={4}>
                <BLField width='360px'> </BLField>
              </Grid>
              <Grid item xs={2}>
                <BLField></BLField>
              </Grid>
              <Grid item xs={2}>
                <BLField ></BLField>
              </Grid>
            </Grid>)
          }
        </Grid>
      </div>
    </>
  );
};

export default TableCM;
