import { CM_PACKAGE, CM_DESCRIPTION, CM_WEIGHT, CM_MEASUREMENT, CM_PACKAGE_UNIT, CM_WEIGHT_UNIT, CM_MEASUREMENT_UNIT, CONTAINER_NUMBER } from '@shared/keyword';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, Grid } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import HelpIcon from '@material-ui/icons/Help';
import AttachFile from '@material-ui/icons/AttachFile';
import { checkClassName, checkColorStatus } from '@shared/colorStatus';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ReplyIcon from "@material-ui/icons/Reply";

import * as FormActions from '../store/actions/form';
import * as InquiryActions from '../store/actions/inquiry';

import BLField from './BLField';
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
    padding: '4px',
    height: '40px',
    display: 'flex',
    textAlign: 'center',
    alignItems: 'center'
  }
}));

const TableCM = (props) => {
  const { id, containerDetail, containerManifest } = props;
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

  // Sort CMs based on contNo
  let cmSorted = [];
  let cms = [...containerManifest];
  const contsNo = [...new Set((containerDetail || []).map(cd => cd?.[metadata?.inq_type?.[CONTAINER_NUMBER]]))];
  if (contsNo.length) {
    contsNo.forEach(contNo => {
      cmSorted = [...cmSorted, ...cms.filter(cm => contNo === cm?.[metadata?.inq_type?.[CONTAINER_NUMBER]])];
      cms = cms.filter(cm => contNo !== cm?.[metadata?.inq_type?.[CONTAINER_NUMBER]]);
    });
  }
  if (cmSorted.length) cmSorted = [...cmSorted, ...cms];
  else cmSorted = containerManifest;
  
  const onMouseEnter = (e) => setIsHovering(true);

  const onMouseLeave = (e) => setIsHovering(false);

  const onClick = (e) => {
    if (!isEmpty) {
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
    else if (
      allowCreateAmendment
      && myBL?.state?.includes('DRF_')
      && user.userType === 'CUSTOMER' // Allow only customer to create amendment
    ) dispatch(FormActions.toggleCreateAmendment(true));

    dispatch(InquiryActions.setField(id));
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
          <Label className={clsx(classes.labelMargin)} style={{ paddingLeft: '20%' }}>GROSS WEIGHT</Label>
        </Grid>
        <Grid container item xs={2} spacing={1}>
          <Label className={clsx(classes.labelMargin)}>GROSS MEASUREMENT</Label>
        </Grid>
        {cmSorted?.length > 0 ? cmSorted.map((cm, index) =>
          <Grid container spacing={2} className='px-8 py-2' key={index}>
            <Grid item xs={2}>
              <BLField disableClick={true} multiline={true} rows={6} disableIcon={true}>{cm?.[metadata?.inq_type?.[CONTAINER_NUMBER]]}</BLField>
            </Grid>
            <Grid item xs={2}>
              <BLField disableClick={true} multiline={true} rows={6} disableIcon={true}>{`${cm?.[metadata?.inq_type?.[CM_PACKAGE]] || ''} ${cm?.[metadata?.inq_type?.[CM_PACKAGE_UNIT]] || ''}`}</BLField>
            </Grid>
            <Grid item xs={4}>
              <BLField disableClick={true} multiline={true} rows={6} disableIcon={true}>{cm?.[metadata?.inq_type?.[CM_DESCRIPTION]]}</BLField>
            </Grid>
            <Grid item xs={2}>
              <BLField disableClick={true} multiline={true} rows={6} disableIcon={true}>{`${cm?.[metadata?.inq_type?.[CM_WEIGHT]] || ''} ${cm?.[metadata?.inq_type?.[CM_WEIGHT_UNIT]] || ''}`}</BLField>
            </Grid>
            <Grid item xs={2}>
              <BLField disableClick={true} multiline={true} rows={6} disableIcon={true}>{`${cm?.[metadata?.inq_type?.[CM_MEASUREMENT]] || ''} ${cm?.[metadata?.inq_type?.[CM_MEASUREMENT_UNIT]] || ''}`}</BLField>
            </Grid>
          </Grid>) :
          <Grid container spacing={2} className='px-8 py-2'>
            <Grid item xs={2}>
              <BLField disableClick={true} ></BLField>
            </Grid>
            <Grid item xs={2}>
              <BLField disableClick={true} ></BLField>
            </Grid>
            <Grid item xs={4}>
              <BLField disableClick={true} width='360px'> </BLField>
            </Grid>
            <Grid item xs={2}>
              <BLField disableClick={true} ></BLField>
            </Grid>
            <Grid item xs={2}>
              <BLField disableClick={true} ></BLField>
            </Grid>
          </Grid>
        }
      </Grid>
    </div>
  );
};

export default TableCM;
