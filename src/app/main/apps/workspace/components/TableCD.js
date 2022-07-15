import { CONTAINER_NUMBER, CONTAINER_SEAL, CONTAINER_TYPE, CONTAINER_PACKAGE, CONTAINER_WEIGHT, CONTAINER_MEASUREMENT } from '@shared/keyword';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, Grid } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { PERMISSION, PermissionProvider } from '@shared/permission';

import * as FormActions from '../store/actions/form';
import * as InquiryActions from '../store/actions/inquiry';

import BLField from './BLField';
import Label from './FieldLabel';

const red = '#DC2626';
const pink = '#BD0F72';

const useStyles = makeStyles((theme) => ({
  addIcon: {
    position: 'relative',
    left: '98%',
    fontSize: '20px',
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
  }
}));

const allowAddInquiry = PermissionProvider({ action: PERMISSION.INQUIRY_CREATE_INQUIRY });

const TableCD = (props) => {
  const { id, containerDetail } = props;
  const dispatch = useDispatch();
  const classes = useStyles();

  const [showAddIcon, setShowAddIcon] = useState(false);
  const [questionIsEmpty, setQuestionIsEmpty] = useState(true);
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const originalInquiry = useSelector(({ workspace }) => workspace.inquiryReducer.originalInquiry);
  const questions = useSelector(({ workspace }) => workspace.inquiryReducer.question);
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const valid = useSelector(({ workspace }) => workspace.inquiryReducer.validation);

  const onMouseEnter = (e) => setShowAddIcon(true);

  const onMouseLeave = (e) => setShowAddIcon(false);

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
  }

  const checkQuestionIsEmpty = () => {
    if (originalInquiry.length > 0) {
      const check = originalInquiry.filter((q) => q.field === id);
      return check.length === 0;
    }
    return true;
  };

  useEffect(() => {
    setQuestionIsEmpty(checkQuestionIsEmpty());
  }, [originalInquiry, metadata]);

  return (
    <>
      <div className={clsx(classes.addIcon, `justify-self-end opacity-${(showAddIcon || !questionIsEmpty) ? '100' : '0'}`)}>
        {!questionIsEmpty ?
          < HelpIcon className={clsx(classes.colorHasInqIcon)} />
          : (allowAddInquiry && <AddCircleIcon className={clsx(classes.colorEmptyInqIcon)} />)}
      </div>
      <div className={clsx(!questionIsEmpty ? classes.hasInq : classes.enterTableFile)} onClick={onClick}>
        <Grid container
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className='px-8 justify-between'>

          <Grid container spacing={2}>
            <Grid item xs={2} spacing={1}>
              <Label className={clsx(classes.labelMargin)}>CONTAINER NUMBER</Label>
            </Grid>
            <Grid item xs={2} spacing={1}>
              <Label className={clsx(classes.labelMargin)}>SEAL</Label>
            </Grid>
            <Grid item xs={2} spacing={1}>
              <Label className={clsx(classes.labelMargin)}>TYPE</Label>
            </Grid>
            <Grid item xs={2} spacing={1}>
              <Label className={clsx(classes.labelMargin)}>PACKAGE</Label>
            </Grid>
            <Grid item xs={2} spacing={1}>
              <Label className={clsx(classes.labelMargin)}>WEIGHT</Label>
            </Grid>
            <Grid item xs={2} spacing={1}>
              <Label className={clsx(classes.labelMargin)}>MEASUREMENT</Label>
            </Grid>
            {containerDetail?.length > 0 ?
              containerDetail.map((cd, index) =>
                (<Grid container spacing={2} className='px-8 py-2' key={index}>
                  <Grid item xs={2}>
                    <BLField>{cd?.[metadata?.inq_type?.[CONTAINER_NUMBER]]}</BLField>
                  </Grid>
                  <Grid item xs={2}>
                    <BLField>{cd?.[metadata?.inq_type?.[CONTAINER_SEAL]]}</BLField>
                  </Grid>
                  <Grid item xs={2}>
                    <BLField>{cd?.[metadata?.inq_type?.[CONTAINER_TYPE]]}</BLField>
                  </Grid>
                  <Grid item xs={2}>
                    <BLField>{cd?.[metadata?.inq_type?.[CONTAINER_PACKAGE]]}</BLField>
                  </Grid>
                  <Grid item xs={2}>
                    <BLField>{cd?.[metadata?.inq_type?.[CONTAINER_WEIGHT]]}</BLField>
                  </Grid>
                  <Grid item xs={2}>
                    <BLField>{cd?.[metadata?.inq_type?.[CONTAINER_MEASUREMENT]]}</BLField>
                  </Grid>
                </Grid>))
              : (<Grid container spacing={2} className='px-8 py-2'>
                <Grid item xs={2}>
                  <BLField></BLField>
                </Grid>
                <Grid item xs={2}>
                  <BLField></BLField>
                </Grid>
                <Grid item xs={2}>
                  <BLField></BLField>
                </Grid>
                <Grid item xs={2}>
                  <BLField></BLField>
                </Grid>
                <Grid item xs={2}>
                  <BLField></BLField>
                </Grid>
                <Grid item xs={2}>
                  <BLField></BLField>
                </Grid>
              </Grid>)
            }
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default TableCD;
