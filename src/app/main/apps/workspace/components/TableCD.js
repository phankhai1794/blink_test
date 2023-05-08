import {
  CONTAINER_NUMBER,
  CONTAINER_SEAL,
  CONTAINER_TYPE,
  CONTAINER_PACKAGE,
  CONTAINER_WEIGHT,
  CONTAINER_MEASUREMENT,
  CONTAINER_PACKAGE_UNIT,
  CONTAINER_WEIGHT_UNIT,
  CONTAINER_MEASUREMENT_UNIT
} from '@shared/keyword';
import { NumberFormat } from '@shared';
import { packageUnitsJson } from '@shared/units';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, Grid } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AttachFile from '@material-ui/icons/AttachFile';
import { checkClassName, checkColorStatus } from '@shared/colorStatus';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ReplyIcon from "@material-ui/icons/Reply";

import * as FormActions from '../store/actions/form';
import * as InquiryActions from '../store/actions/inquiry';
import * as DraftActions from "../../draft-bl/store/actions";

import BLField from './BLFieldCont';
import Label from './FieldLabel';

const red = '#DC2626';
const lightPink = '#FAF1F5';
const pink = '#BD0F72';
const lightBlue = '#EAF2FD';
const blue = '#2F80ED';
const darkBlue = '#00506D';
const lightGreen = '#EBF7F2';
const green = '#36B37E';

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: 0,
    borderRadius: '8px',
    paddingBottom: '1rem',
    '&:hover': {
      backgroundColor: lightPink,
    },
  },
  sizeIcon: {
    fontSize: '20px',
  },
  colorAddIcon: {
    color: `${pink} !important`,
  },
  colorHasInqIcon: {
    color: `${red} !important`,
  },
  colorHasAnswer: {
    color: `${blue} !important`,
  },
  colorHasResolved: {
    color: `${green} !important`,
  },
  colorHasUploaded: {
    color: `${darkBlue} !important`,
  },
  hasInquiry: {
    backgroundColor: `${lightPink} !important`,
    '& fieldset': {
      backgroundColor: lightPink,
      borderColor: `${pink} !important`,
    },
    '&:hover fieldset': {
      borderColor: `${pink} !important`,
    },
  },
  hasAnswer: {
    backgroundColor: `${lightBlue} !important`,
    '& fieldset': {
      backgroundColor: lightBlue,
      borderColor: `${blue} !important`,
    },
    '&:hover fieldset': {
      borderColor: `${blue} !important`,
    },
  },
  hasResolved: {
    backgroundColor: `${lightGreen} !important`,
    '& fieldset': {
      backgroundColor: lightGreen,
      borderColor: `${green} !important`,
    },
    '&:hover fieldset': {
      borderColor: `${green} !important`,
    },
  },
  hasUploaded: {
    backgroundColor: '#E6EDF0 !important',
    '& fieldset': {
      backgroundColor: '#E6EDF0',
      borderColor: `${darkBlue} !important`,
    },
    '&:hover fieldset': {
      borderColor: `${darkBlue} !important`,
    },
  },
  attachIcon: {
    transform: 'rotate(45deg)',
    marginLeft: '-2.5rem',
  },
  iconSvg: {
    width: 17,
    marginBottom: 1.5,
    paddingLeft: 3,
  },
  labelMargin: {
    marginTop: '0.6rem !important',
    display: 'flex',
  }
}));

const TableCD = (props) => {
  const { id, containerDetail } = props;
  const dispatch = useDispatch();
  const classes = useStyles();

  const myBL = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);
  const user = useSelector(({ user }) => user);
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const listCommentDraft = useSelector(({ workspace }) => workspace.inquiryReducer.listCommentDraft);

  const [isHovering, setIsHovering] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [hasInquiry, setHasInquiry] = useState(false);
  const [hasAmendment, setHasAmendment] = useState(false);
  const [hasAttachment, setHasAttachment] = useState(true);
  const [hasAnswer, setHasAnswer] = useState(false);
  const [isResolved, setIsResolved] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const allowAddInquiry = PermissionProvider({ action: PERMISSION.INQUIRY_CREATE_INQUIRY });
  const allowCreateAmendment = PermissionProvider({ action: PERMISSION.VIEW_CREATE_AMENDMENT });

  const onMouseEnter = (e) => setIsHovering(true);

  const onMouseLeave = (e) => setIsHovering(false);

  const onClick = (e) => {
    if (!isEmpty) {
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
    else if (
      allowCreateAmendment
      && myBL?.state?.includes('DRF_')
      && user.userType === 'CUSTOMER' // Allow only customer to create amendment
    ) dispatch(FormActions.toggleCreateAmendment(true));

    dispatch(InquiryActions.setField(id));
    dispatch(DraftActions.setAmendmentField(id));
  };

  const checkDisplayIcon = () => {
    const { iconColor } = checkClassName(
      hasInquiry,
      hasAmendment,
      hasAnswer,
      isResolved,
      isUploaded,
      classes
    );

    const attachIcon = <>
      {hasAttachment && (
        <AttachFile
          className={clsx(
            classes.sizeIcon,
            classes.attachIcon,
            iconColor
          )}
        />
      )}
    </>

    if (hasInquiry || hasAmendment) {
      return <>
        {attachIcon}
        {hasInquiry && <HelpIcon className={clsx(classes.sizeIcon, iconColor)} />}
        {hasAmendment && <img src='/assets/images/icons/icon-amendment.svg' className={classes.iconSvg} />}
      </>
    }
    else if (hasAnswer) {
      return <>
        {attachIcon}
        <ReplyIcon className={clsx(classes.sizeIcon, iconColor)} />
      </>
    }
    else if (isResolved) {
      return <>
        {attachIcon}
        <CheckCircleIcon className={clsx(classes.sizeIcon, iconColor)} />
      </>
    }
    else if (isUploaded) {
      return <>
        {attachIcon}
        <img src='/assets/images/icons/icon-uploaded.svg' className={classes.iconSvg} />
      </>
    }
  }

  const setColorStatus = () => {
    const colorStatusObj = checkColorStatus(
      id,
      user,
      inquiries,
    );

    setIsEmpty(colorStatusObj.isEmpty);
    setHasInquiry(colorStatusObj.hasInquiry);
    setHasAmendment(colorStatusObj.hasAmendment);
    setHasAttachment(colorStatusObj.hasAttachment);
    setHasAnswer(colorStatusObj.hasAnswer);
    setIsResolved(colorStatusObj.isResolved);
    setIsUploaded(colorStatusObj.isUploaded);
  }

  useEffect(() => {
    setColorStatus();
  }, [metadata, inquiries, listCommentDraft]);

  return (
    <div
      className={clsx(
        classes.root,
        checkClassName(
          hasInquiry,
          hasAmendment,
          hasAnswer,
          isResolved,
          isUploaded,
          classes
        ).className
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <Grid style={{ height: 20, padding: '5px 5px 0 5px', textAlign: 'right' }}>
        {checkDisplayIcon()}
        {isHovering && allowAddInquiry && isEmpty &&
          <AddCircleIcon className={clsx(classes.sizeIcon, classes.colorAddIcon)} />
        }
      </Grid>
      <Grid
        container
        className="px-8 justify-between">
        <Grid container spacing={2}>
          <Grid container item xs={2}>
            <Label className={clsx(classes.labelMargin)} style={{ marginLeft: '15px' }}>CONTAINER NUMBER</Label>
          </Grid>
          <Grid container item xs={2}>
            <Label className={clsx(classes.labelMargin)} style={{ marginLeft: '75px' }}>SEAL</Label>
          </Grid>
          <Grid container item xs={2}>
            <Label className={clsx(classes.labelMargin)} style={{ marginLeft: '75px' }}>TYPE</Label>
          </Grid>
          <Grid container item xs={2}>
            <Label className={clsx(classes.labelMargin)} style={{ marginLeft: '55px' }}>PACKAGE</Label>
          </Grid>
          <Grid container item xs={2}>
            <Label className={clsx(classes.labelMargin)} style={{ marginLeft: '60px' }}>WEIGHT</Label>
          </Grid>
          <Grid container item xs={1}>
            <Label className={clsx(classes.labelMargin)} style={{ marginLeft: '30px' }}>MEASUREMENT</Label>
          </Grid>
          {containerDetail?.length > 0 ? (
            containerDetail.map((cd, index) => (
              <Grid container spacing={2} className="px-8 py-2" key={index}>
                <Grid item xs={2}>
                  <BLField>
                    {cd?.[metadata?.inq_type?.[CONTAINER_NUMBER]]}
                  </BLField>
                </Grid>
                <Grid item xs={2}>
                  <BLField>
                    {cd?.[metadata?.inq_type?.[CONTAINER_SEAL]]}
                  </BLField>
                </Grid>
                <Grid item xs={2}>
                  <BLField>
                    {cd?.[metadata?.inq_type?.[CONTAINER_TYPE]]}
                  </BLField>
                </Grid>
                <Grid item xs={2}>
                  <BLField>
                    {`${NumberFormat(cd?.[metadata?.inq_type?.[CONTAINER_PACKAGE]], 0) || ''} ${packageUnitsJson.find(pkg => pkg.code === cd?.[metadata?.inq_type?.[CONTAINER_PACKAGE_UNIT]])?.description || ''}`}
                  </BLField>
                </Grid>
                <Grid item xs={2}>
                  <BLField>
                    {`${NumberFormat(cd?.[metadata?.inq_type?.[CONTAINER_WEIGHT]], 3) || ''} ${cd?.[metadata?.inq_type?.[CONTAINER_WEIGHT_UNIT]] || ''}`}
                  </BLField>
                </Grid>
                <Grid item xs={2}>
                  <BLField>
                    {`${NumberFormat(cd?.[metadata?.inq_type?.[CONTAINER_MEASUREMENT]], 3) || ''} ${cd?.[metadata?.inq_type?.[CONTAINER_MEASUREMENT_UNIT]] || ''}`}
                  </BLField>
                </Grid>
              </Grid>
            ))
          ) : (
            <Grid container spacing={2} className="px-8 py-2">
              <Grid item xs={2}>
                <BLField />
              </Grid>
              <Grid item xs={2}>
                <BLField />
              </Grid>
              <Grid item xs={2}>
                <BLField />
              </Grid>
              <Grid item xs={2}>
                <BLField />
              </Grid>
              <Grid item xs={2}>
                <BLField />
              </Grid>
              <Grid item xs={2}>
                <BLField />
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default TableCD;
