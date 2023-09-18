import {
  CONTAINER_MANIFEST,
  CM_MARK,
  CM_PACKAGE,
  CM_DESCRIPTION,
  CM_WEIGHT,
  CM_MEASUREMENT,
  CM_PACKAGE_UNIT,
  CM_WEIGHT_UNIT,
  CM_MEASUREMENT_UNIT,
  CONTAINER_NUMBER,
  SHIPPING_MARK,
  TOTAL_PACKAGE,
  TOTAL_PACKAGE_UNIT,
  DESCRIPTION_OF_GOODS,
  TOTAL_WEIGHT,
  TOTAL_WEIGHT_UNIT,
  TOTAL_MEASUREMENT,
  TOTAL_MEASUREMENT_UNIT, CONTAINER_DETAIL,
  DESCRIPTION_OF_GOODS1,
  DESCRIPTION_OF_GOODS2,
  SEQ
} from '@shared/keyword';
import { getTotalValueMDView, NumberFormat } from '@shared';
import { packageUnitsJson } from '@shared/units';
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
import ReplyIcon from '@material-ui/icons/Reply';

import * as FormActions from '../store/actions/form';
import * as InquiryActions from '../store/actions/inquiry';
import * as DraftActions from '../../draft-bl/store/actions/index';

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
      backgroundColor: lightPink
    }
  },
  sizeIcon: {
    fontSize: '20px'
  },
  colorAddIcon: {
    color: `${pink} !important`
  },
  colorHasInqIcon: {
    color: `${red} !important`
  },
  colorHasAnswer: {
    color: `${blue} !important`
  },
  colorHasResolved: {
    color: `${green} !important`
  },
  colorHasUploaded: {
    color: `${darkBlue} !important`
  },
  hasInquiry: {
    backgroundColor: `${lightPink} !important`,
    '& fieldset': {
      backgroundColor: lightPink,
      borderColor: `${pink} !important`
    },
    '&:hover fieldset': {
      borderColor: `${pink} !important`
    }
  },
  hasAnswer: {
    backgroundColor: `${lightBlue} !important`,
    '& fieldset': {
      backgroundColor: lightBlue,
      borderColor: `${blue} !important`
    },
    '&:hover fieldset': {
      borderColor: `${blue} !important`
    }
  },
  hasResolved: {
    backgroundColor: `${lightGreen} !important`,
    '& fieldset': {
      backgroundColor: lightGreen,
      borderColor: `${green} !important`
    },
    '&:hover fieldset': {
      borderColor: `${green} !important`
    }
  },
  hasUploaded: {
    backgroundColor: '#E6EDF0 !important',
    '& fieldset': {
      backgroundColor: '#E6EDF0',
      borderColor: `${darkBlue} !important`
    },
    '&:hover fieldset': {
      borderColor: `${darkBlue} !important`
    }
  },
  attachIcon: {
    transform: 'rotate(45deg)',
    marginLeft: '-2.5rem'
  },
  iconSvg: {
    width: 17,
    marginBottom: 1.5,
    paddingLeft: 3
  },
  labelMargin: {
    marginTop: '0.6rem !important',
    padding: '4px',
    height: '40px',
    display: 'flex',
    textAlign: 'center',
    alignItems: 'center'
  },
  'grid-xs-1': {
    flexBasis: '14%',
    maxWidth: '14%'
  },
  'grid-xs-2': {
    flexBasis: '15%'
  },
  'grid-xs-3': {
    flexBasis: '26%',
    maxWidth: '26%'
  },
  styleGrid: {
    '& .MuiGrid-grid-xs-2': {
      maxWidth: '13.34%'
    }
  },
  styleGridSeq: {
    maxWidth: '6.5%'
  }
}));

const TableCM = (props) => {
  const { containerDetail, containerManifest } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const myBL = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);
  const user = useSelector(({ user }) => user);
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const listCommentDraft = useSelector(
    ({ workspace }) => workspace.inquiryReducer.listCommentDraft
  );
  const content = useSelector(({ workspace }) => workspace.inquiryReducer.content);
  const drfView = useSelector(({ draftBL }) => draftBL.drfView);

  const getField = (field) => {
    return metadata.field ? metadata.field[field] : '';
  };

  const getValueField = (field) => {
    let result = '';
    if (field === DESCRIPTION_OF_GOODS) {
      const line1 = content[getField(DESCRIPTION_OF_GOODS1)] ? `${content[getField(DESCRIPTION_OF_GOODS1)]}\n` : '';
      const line2 = content[getField(DESCRIPTION_OF_GOODS2)] ? `${content[getField(DESCRIPTION_OF_GOODS2)]}\n` : '';
      result = `${line1}${line2}${content[getField(field)]}`
    } else result = content[getField(field)] || '';
    return result || '';
  };

  const [id, setId] = useState(getField(CONTAINER_DETAIL));
  const [isHovering, setIsHovering] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [hasInquiry, setHasInquiry] = useState(false);
  const [hasAmendment, setHasAmendment] = useState(false);
  const [hasAttachment, setHasAttachment] = useState(true);
  const [hasAnswer, setHasAnswer] = useState(false);
  const [isResolved, setIsResolved] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [mapContSeq, setMapContSeq] = useState([]);

  const allowAddInquiry = PermissionProvider({ action: PERMISSION.INQUIRY_CREATE_INQUIRY });
  const allowCreateAmendment = PermissionProvider({ action: PERMISSION.VIEW_CREATE_AMENDMENT });

  const getType = (type) => {
    return metadata.inq_type?.[type] || '';
  };

  const drfMD = getTotalValueMDView(drfView, containerDetail, getType);

  const getPackageName = (packageCode) =>
    packageUnitsJson.find((pkg) => pkg.code === packageCode)?.description || '';

  const onMouseEnter = (e) => setIsHovering(true);

  const onMouseLeave = (e) => setIsHovering(false);

  const onClick = (e, id) => {
    e.stopPropagation()
    // Check field is empty , id can be either Container Manifest or DoG
    const currentInq = inquiries.find((q) => q.field === id);
    if (currentInq) {
      dispatch(InquiryActions.setOneInq(currentInq));
    } else if (allowAddInquiry) {
      dispatch(InquiryActions.addQuestion(id));
      if (inquiries.length > 1 && !inquiries[inquiries.length - 1].id) {
        if (inquiries.length + 1 === metadata.field_options.length) {
          dispatch(FormActions.toggleAddInquiry(false));
        }
      }
      dispatch(FormActions.toggleCreateInquiry(true));
    } else if (
      allowCreateAmendment &&
      myBL?.state?.includes('DRF_') &&
      user.userType === 'CUSTOMER' // Allow only customer to create amendment
    ) {
      dispatch(FormActions.toggleCreateAmendment(true));
    }
    dispatch(InquiryActions.setField(id));
    dispatch(DraftActions.setAmendmentField(getField(CONTAINER_MANIFEST)));
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
    const attachIcon = (
      <>
        {hasAttachment && (
          <AttachFile className={clsx(classes.sizeIcon, classes.attachIcon, iconColor)} />
        )}
      </>
    );

    if (hasInquiry || hasAmendment) {
      return (
        <>
          {attachIcon}
          {hasInquiry && <HelpIcon className={clsx(classes.sizeIcon, iconColor)} />}
          {hasAmendment && (
            <img src="/assets/images/icons/icon-amendment.svg" className={classes.iconSvg} />
          )}
        </>
      );
    } else if (hasAnswer) {
      return (
        <>
          {attachIcon}
          <ReplyIcon className={clsx(classes.sizeIcon, iconColor)} />
        </>
      );
    } else if (isResolved) {
      return (
        <>
          {attachIcon}
          <CheckCircleIcon className={clsx(classes.sizeIcon, iconColor)} />
        </>
      );
    } else if (isUploaded) {
      return (
        <>
          {attachIcon}
          <img src="/assets/images/icons/icon-uploaded.svg" className={classes.iconSvg} />
        </>
      );
    }
  };

  const setColorStatus = () => {
    const ameSts = ['AME_DRF', 'AME_SENT'];
    const inqs = [...inquiries].filter(inq => !(
      inq.field === getField(CONTAINER_DETAIL)
      && inq.process === 'draft'
      && ameSts.includes(inq.state)
    ));
    let colorStatusObj = checkColorStatus(id, user, inqs);
    
    // set icon amendment for CM
    const data = inqs
      .filter(inq => [getField(CONTAINER_DETAIL), getField(CONTAINER_MANIFEST)].includes(inq.field))
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    if (data.length) {
      const inq = data[0];
      if (ameSts.includes(inq.state)) {
        colorStatusObj = {
          ...colorStatusObj,
          isEmpty: false,
          hasInquiry: false,
          hasAmendment: true,
          hasAnswer: false,
          isResolved: false,
          isUploaded: false
        }
      }
    }

    setIsEmpty(colorStatusObj.isEmpty);
    setHasInquiry(colorStatusObj.hasInquiry);
    setHasAmendment(colorStatusObj.hasAmendment);
    setHasAttachment(colorStatusObj.hasAttachment);
    setHasAnswer(colorStatusObj.hasAnswer);
    setIsResolved(colorStatusObj.isResolved);
    setIsUploaded(colorStatusObj.isUploaded);
  };

  useEffect(() => {
    setColorStatus();
  }, [metadata, id, inquiries, listCommentDraft]);

  useEffect(() => {
    let defaultId = getField(CONTAINER_DETAIL);
    if (inquiries && inquiries.length) {
      if (user.role === 'Guest') {
        const filterInq = inquiries.filter(inq => [getField(CONTAINER_DETAIL), getField(CONTAINER_MANIFEST)].includes(inq.field) && inq.process === 'pending');
        if (!filterInq.length) defaultId = getField(CONTAINER_MANIFEST);
      } else if (user.role === 'Admin') {
        const filterInqDrf = inquiries.filter(inq =>
          [getField(CONTAINER_DETAIL), getField(CONTAINER_MANIFEST)].includes(inq.field) && inq.process === 'draft');
        const filterInqPending = inquiries.filter(inq => [getField(CONTAINER_DETAIL), getField(CONTAINER_MANIFEST)].includes(inq.field) && inq.process === 'pending');
        if (filterInqDrf.length && !filterInqPending.length) defaultId = getField(CONTAINER_MANIFEST);
      }
    }
    setId(defaultId);
  }, [drfView, inquiries]);

  return (
    <div
      className={clsx(
        classes.root,
        checkClassName(hasInquiry, hasAmendment, hasAnswer, isResolved, isUploaded, classes).className,
        drfView === 'CM' ? classes.styleGrid : ``
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={(e) => {
        !props.isEditSeq ? onClick(e, id) : e.preventDefault();
      }}>
      <Grid style={{ height: 20, padding: '5px 5px 0 5px', textAlign: 'right' }}>
        {checkDisplayIcon()}
        {isHovering && allowAddInquiry && isEmpty && (
          <AddCircleIcon className={clsx(classes.sizeIcon, classes.colorAddIcon)} />
        )}
      </Grid>
      <Grid
        container
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="px-8 justify-between">
        {drfView === 'CM' && (
          <Grid container item xs={1} className={classes.styleGridSeq}>
            <Label className={clsx(classes.labelMargin)} style={{ marginLeft: '15px' }}>SEQ</Label>
          </Grid>
        )}
        <Grid container item xs={drfView === 'CM' ? 1 : 2} className={drfView === 'CM' ? clsx(classes['grid-xs-1']) : ''} spacing={1}>
          <Label className={clsx(classes.labelMargin)}>
            {'CNTR. NOS. W/SEAL NOS.\nMARKS & NUMBERS'}
          </Label>
        </Grid>
        {drfView === 'CM' && (
          <Grid container item xs={2} className={clsx(classes['grid-xs-2'], 'justify-center')} spacing={1}>
            <Label className={clsx(classes.labelMargin)}>MARK</Label>
          </Grid>
        )}
        <Grid container item xs={2} className={drfView === 'CM' ? clsx(classes['grid-xs-2']) : ''} spacing={1}>
          <Label className={clsx(classes.labelMargin)}>
            QUANTITY (FOR CUSTOMS DECLARATION ONLY)
          </Label>
        </Grid>
        <Grid container item xs={drfView === 'CM' ? 3 : 4} spacing={1} className="justify-center">
          <Label className={clsx(classes.labelMargin)}>DESCRIPTION OF GOODS</Label>
        </Grid>
        <Grid container item xs={2} className={drfView === 'CM' ? clsx(classes['grid-xs-2']) : ''} spacing={1}>
          <Label className={clsx(classes.labelMargin)} style={{ paddingLeft: '20%' }}>
            GROSS WEIGHT
          </Label>
        </Grid>
        <Grid container item xs={2} spacing={1}>
          <Label className={clsx(classes.labelMargin)}>GROSS MEASUREMENT</Label>
        </Grid>

        {drfView === 'MD' ? (
          <Grid container spacing={2} className="px-8 py-2">
            <Grid item xs={2}>
              <BLField multiline={true}>{getValueField(SHIPPING_MARK)}</BLField>
            </Grid>
            <Grid item xs={2}>
              <BLField multiline={true}>
                {`${NumberFormat(drfMD[TOTAL_PACKAGE], 0)} ${getPackageName(drfMD[TOTAL_PACKAGE_UNIT])}`}
              </BLField>
            </Grid>
            <Grid item xs={4}>
              <BLField multiline={true}>{getValueField(DESCRIPTION_OF_GOODS)}</BLField>
            </Grid>
            <Grid item xs={2}>
              <BLField multiline={true}>
                {`${NumberFormat(drfMD[TOTAL_WEIGHT], 3)} ${drfMD[TOTAL_WEIGHT_UNIT]}`}
              </BLField>
            </Grid>
            <Grid item xs={2}>
              <BLField multiline={true}>
                {`${NumberFormat(drfMD[TOTAL_MEASUREMENT], 3)} ${drfMD[TOTAL_MEASUREMENT_UNIT]}`}
              </BLField>
            </Grid>
          </Grid>
        ) : containerManifest?.length > 0 ? (
          containerManifest.map((cm, index) => (
            <Grid container spacing={2} className="py-2" key={index}>
              <Grid container item xs={1} className={classes.styleGridSeq}>
                <BLField multiline={true} isSeq={true} isEditSeq={props.isEditSeq} cmEditing={cm?.[metadata?.inq_type?.[CONTAINER_NUMBER]]} handleChangeSeqState={(val) => {
                  if (props.mapContSeq.length) {
                    props.mapContSeq.forEach(p => {
                      if (p.contNo === val.contNo) {
                        p.seq = val.seq
                      }
                    })
                  }
                }}>
                  {!props.isEditSeq ? cm?.[metadata?.inq_type?.[SEQ]] :
                      (props.mapContSeq.length ? props.mapContSeq.find(m => m.contNo === cm?.[metadata?.inq_type?.[CONTAINER_NUMBER]])?.seq : '')
                  }
                </BLField>
              </Grid>
              <Grid item xs={1} className={clsx(classes['grid-xs-1'])}>
                <BLField multiline={true}>{cm?.[metadata?.inq_type?.[CONTAINER_NUMBER]]}</BLField>
              </Grid>
              <Grid item xs={2} className={clsx(classes['grid-xs-2'])}>
                <BLField multiline={true}>{cm?.[metadata?.inq_type?.[CM_MARK]]}</BLField>
              </Grid>
              <Grid item xs={2} className={clsx(classes['grid-xs-2'])}>
                <BLField multiline={true}>
                  {`${NumberFormat(cm?.[metadata?.inq_type?.[CM_PACKAGE]], 0) || ''} ${getPackageName(
                    cm?.[metadata?.inq_type?.[CM_PACKAGE_UNIT]]
                  )}`}
                </BLField>
              </Grid>
              <Grid item xs={3} className={clsx(classes['grid-xs-3'])}>
                <BLField multiline={true}>{cm?.[metadata?.inq_type?.[CM_DESCRIPTION]]}</BLField>
              </Grid>
              <Grid item xs={2} className={clsx(classes['grid-xs-2'])}>
                <BLField multiline={true}>
                  {`${NumberFormat(cm?.[metadata?.inq_type?.[CM_WEIGHT]], 3) || ''} ${cm?.[metadata?.inq_type?.[CM_WEIGHT_UNIT]] || ''}`}
                </BLField>
              </Grid>
              <Grid item xs={2} className={clsx(classes['grid-xs-2'])}>
                <BLField multiline={true}>
                  {`${NumberFormat(cm?.[metadata?.inq_type?.[CM_MEASUREMENT]], 3) || ''} ${cm?.[metadata?.inq_type?.[CM_MEASUREMENT_UNIT]] || ''}`}
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
            <Grid item xs={4}>
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
    </div>
  );
};

export default TableCM;
