import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import clsx from 'clsx';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import AttachFile from '@material-ui/icons/AttachFile';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, InputAdornment, makeStyles, Icon, Paper, Fade } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ReplyIcon from '@material-ui/icons/Reply';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { checkClassName, checkColorStatus } from '@shared/colorStatus';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import { copyTextToClipboard } from '@shared';
import * as AppAction from 'app/store/actions';
import EllipsisPopper from 'app/main/apps/workspace/shared-components/EllipsisPopper';

import * as FormActions from '../store/actions/form';
import * as InquiryActions from '../store/actions/inquiry';

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Montserrat'
  }
});

const white = '#FFFFFF';
const gray = '#BAC3CB';
const darkGray = '#515E6A';
const lightGray = '#F5F8FA';
const lightPink = '#FAF1F5';
const pink = '#BD0F72';
const red = '#DC2626';
const lightBlue = '#EAF2FD';
const blue = '#2F80ED';
const darkBlue = '#00506D';
const green = '#36B37E';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
    '& fieldset': {
      borderColor: gray,
      backgroundColor: white,
      borderRadius: '8px',
      zIndex: '-1'
    },
    '&:hover fieldset': {
      borderColor: `${pink} !important`
    },
    '&:focus-within fieldset': {
      border: `1px solid ${pink} !important`
    }
  },
  hasInquiry: {
    '& fieldset': {
      backgroundColor: lightPink
    }
  },
  hasAnswer: {
    '& fieldset': {
      backgroundColor: lightBlue,
      borderColor: `${blue} !important`
    },
    '&:hover fieldset': {
      borderColor: `${blue} !important`
    },
    '&:focus-within fieldset': {
      border: `1px solid ${blue} !important`
    }
  },
  hasResolved: {
    '& fieldset': {
      backgroundColor: '#EBF7F2',
      borderColor: `${green} !important`
    }
  },
  hasUploaded: {
    '& fieldset': {
      backgroundColor: '#E6EDF0',
      borderColor: `${darkBlue} !important`
    }
  },
  input: {
    fontSize: '15px',
    color: darkGray,
    padding: '9px 0 9px 16px',
    lineHeight: '22px',
    fontWeight: '500',
    textOverflow: 'ellipsis',
    overflow: 'auto'
  },
  notchedOutlineNotChecked: {
    borderColor: `${red} !important`
  },
  adornment: {
    padding: '10px 10px 10px 0',
    margin: 0
  },
  adornmentMultiline: {
    alignItems: 'flex-end',
    position: 'absolute',
    right: '0%',
    bottom: 0
  },
  adornmentMultilineDoG: {
    alignItems: 'flex-end',
    position: 'absolute',
    right: '0%',
    bottom: '0%'
  },
  adornmentRow_2: {
    height: '4em',
    maxHeight: '4em'
  },
  adornmentRow_3: {
    height: '6em',
    maxHeight: '6em'
  },
  adornmentRow_4: {
    height: '8em',
    maxHeight: '8em'
  },
  adornmentRow_5: {
    height: '10.7em',
    maxHeight: '10.7em'
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
  locked: {
    '& fieldset': {
      backgroundColor: lightGray
    }
  },
  colorLockIcon: {
    color: darkGray
  },
  attachIcon: {
    transform: 'rotate(45deg)'
  },
  iconSvg: {
    width: 17,
    marginBottom: 1.5,
    paddingLeft: 3
  },
  paper: {
    maxHeight: 400,
    maxWidth: 400,
    overflow: 'auto',
    padding: 15,
    color: '#515E6A',
    whiteSpace: 'pre-wrap'
  },
  popper: {
    '&[x-placement*="right"]': {
      left: '10px !important'
    },
    '&[x-placement*="left"]': {
      right: '10px !important'
    }
  }
}));

const BLField = ({
  children,
  width,
  multiline,
  rows,
  id,
  lock,
  readOnly,
  disableClick,
  disableIcon
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const myBL = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);
  const user = useSelector(({ user }) => user);
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const currentEditInq = useSelector(({ workspace }) => workspace.inquiryReducer.currentEditInq);
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const listCommentDraft = useSelector(
    ({ workspace }) => workspace.inquiryReducer.listCommentDraft
  );
  const valid = useSelector(({ workspace }) => workspace.inquiryReducer.validation);

  const [anchorEl, setAnchorEl] = useState(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [hasInquiry, setHasInquiry] = useState(false);
  const [hasAmendment, setHasAmendment] = useState(false);
  const [hasAttachment, setHasAttachment] = useState(false);
  const [hasAnswer, setHasAnswer] = useState(false);
  const [isResolved, setIsResolved] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [anchorElCopy, setAnchorElCopy] = useState(false);
  const [popover, setPopover] = useState({ open: false, text: '' });

  const allowAddInquiry = PermissionProvider({ action: PERMISSION.INQUIRY_CREATE_INQUIRY });
  const allowCreateAmendment = PermissionProvider({ action: PERMISSION.VIEW_CREATE_AMENDMENT });

  const onMouseOver = (e) => {
    const { currentTarget, target } = e;
    const { scrollWidth, clientWidth, scrollHeight, clientHeight } = target;
    if (isEmpty) setAnchorEl(currentTarget);
    setAnchorElCopy(currentTarget);
    if (Boolean((scrollWidth > clientWidth) && !rows) || (Boolean((scrollHeight > clientHeight) && rows))) {
      setPopover({ open: true, text: children });
    }
  };

  const onMouseLeave = (e) => {
    if (e.currentTarget !== null) setAnchorEl(null);
    setAnchorElCopy(null);
    setPopover({ open: false });
  };

  const handlePopoverMouseEnter = () => setPopover({ ...popover, open: true });

  const handlePopoverMouseLeave = () => setPopover({ open: false });

  const checkValidate = (question) => {
    if (!question.inqType || !question.receiver.length) {
      dispatch(
        InquiryActions.validate({
          ...valid,
          field: true,
          inqType: Boolean(question.inqType),
          receiver: Boolean(question.receiver.length)
        })
      );
      return false;
    }
    return true;
  };

  const onCopyClick = (e, text) => {
    e.stopPropagation();
    copyTextToClipboard(text)
    dispatch(AppAction.showMessage({ message: 'Copy to clipboard !', variant: 'info', autoHideDuration: 2000 }));
  };

  const onClick = (e) => {
    dispatch(
      InquiryActions.validate({
        inqType: true,
        field: true,
        receiver: true,
        ansType: true,
        content: true,
        answerContent: true
      })
    );
    if (!disableClick) {
      if (isEmpty && allowAddInquiry) {
        dispatch(InquiryActions.addQuestion(id));
      } else if (!isEmpty) {
        const currentInq = inquiries.find((q) => q.field === id);
        dispatch(InquiryActions.setOneInq(currentInq));
      }
      if (anchorEl && anchorEl.id === id && !lock) {
        if (allowAddInquiry) {
          if (
            inquiries.length > 0 &&
            !currentEditInq &&
            checkValidate(inquiries[inquiries.length - 1])
          ) {
            if (inquiries.length + 1 === metadata.field_options.length) {
              dispatch(FormActions.toggleAddInquiry(false));
            }
          }
          dispatch(FormActions.toggleCreateInquiry(true));
        } else if (
          allowCreateAmendment &&
          myBL?.state?.includes('DRF_') &&
          user.userType === 'CUSTOMER' // Allow only customer to create amendment
        )
          dispatch(FormActions.toggleCreateAmendment(true));
      }
      dispatch(InquiryActions.setField(e.currentTarget.id));
      setAnchorEl(e.currentTarget.id);
    }
  };

  const checkDisplayIcon = () => {
    if (!disableIcon) {
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

      if (lock) {
        return <LockOutlinedIcon className={clsx(classes.sizeIcon, classes.colorLockIcon)} />;
      }
      return (
        <>
          {attachIcon}
          {hasInquiry && <HelpIcon className={clsx(classes.sizeIcon, iconColor)} />}
          {hasAmendment && (
            <img src="/assets/images/icons/icon-amendment.svg" className={classes.iconSvg} />
          )}
          {hasAnswer && <ReplyIcon className={clsx(classes.sizeIcon, iconColor)} />}
          {isResolved && <CheckCircleIcon className={clsx(classes.sizeIcon, iconColor)} />}
          {isUploaded && (
            <img src="/assets/images/icons/icon-uploaded.svg" className={classes.iconSvg} />
          )}
        </>
      );
    }
  };

  const setColorStatus = () => {
    if (!disableIcon) {
      const colorStatusObj = checkColorStatus(id, user, inquiries);

      setIsEmpty(colorStatusObj.isEmpty);
      setHasInquiry(colorStatusObj.hasInquiry);
      setHasAmendment(colorStatusObj.hasAmendment);
      setHasAttachment(colorStatusObj.hasAttachment);
      setHasAnswer(colorStatusObj.hasAnswer);
      setIsResolved(colorStatusObj.isResolved);
      setIsUploaded(colorStatusObj.isUploaded);
    }
  };

  useEffect(() => {
    setColorStatus();
  }, [inquiries, metadata, listCommentDraft]);

  let isContinue = false;
  let finalChidren = children;
  const lines = children.split('\n');

  if (children && id) {
    if (metadata.field['shipper'] === id && typeof children === 'string' && children.slice(-3,) === 'SH>') isContinue = 'SH>';
    if (metadata.field['consignee'] === id && typeof children === 'string' && children.slice(-3,) === 'CN>') isContinue = 'CN>';
    if (metadata.field['notify'] === id && typeof children === 'string' && children.slice(-3,) === 'NP>') isContinue = 'NP>';
    if (metadata.field['alsoNotify'] === id && typeof children === 'string' && children.slice(-5,) === 'A/NF>') isContinue = 'A/NF>';
    if (metadata.field['forwarder'] === id && typeof children === 'string' && children.slice(-3,) === 'FW>') isContinue = 'FW>';
  }
  if (isContinue && [3, 4, 5].includes(lines.length)) {
    if (isContinue === 'A/NF>') finalChidren = finalChidren.slice(0, -5);
    else finalChidren = finalChidren.slice(0, -3);
  }
  if (isContinue && lines.length > 5) {
    const lastline = lines.slice(-1)[0];
    const listT = lastline.match(/\w+/g);
    let count = 0;
    listT.forEach((item) => {
      count += item.length;
    });
    finalChidren = finalChidren.slice(0, -3) + ' '.repeat((35 - count) * 3 + 3) + isContinue;
  }

  return (
    <>
      <EllipsisPopper
        open={popover.open}
        anchorEl={anchorElCopy}
        arrow={true}
        // className={classes.popper}
        flip={true}
        transition
        placement={'left'}
        disablePortal={false}
        preventOverflow={'scrollParent'}>
        {({ TransitionProps, placement, arrow }) => (
          <div onMouseEnter={handlePopoverMouseEnter} onMouseLeave={handlePopoverMouseLeave}>
            {arrow}
            <Paper className={classes.paper}>{popover.text}</Paper>
          </div>
        )}
      </EllipsisPopper>

      <div
        id={id}
        style={{ width }}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
        onClick={onClick}>
        <ThemeProvider theme={theme}>
          <TextField
            value={finalChidren || ''}
            variant="outlined"
            fullWidth={true}
            multiline={multiline}
            rows={rows}
            className={clsx(
              classes.root,
              lock ? classes.locked : checkClassName(
                hasInquiry,
                hasAmendment,
                hasAnswer,
                isResolved,
                isUploaded,
                classes
              ).className
            )}
            inputProps={{
              style: { textTransform: 'uppercase' }
            }}
            InputProps={{
              readOnly: readOnly || true,
              endAdornment:
                !rows || rows < 6 || rows === 8 ? (
                  <InputAdornment
                    position="end"
                    className={clsx(
                      classes.adornment,
                      multiline
                        ? rows === 8
                          ? classes.adornmentMultilineDoG
                          : classes.adornmentMultiline
                        : '',
                      rows ? classes[`adornmentRow_${rows}`] : ''
                    )}>
                    {isContinue && [3, 4, 5].includes(lines.length) && (
                      <div
                        style={{
                          fontSize: '15px',
                          color: darkGray,
                          lineHeight: '22px',
                          fontWeight: '500',
                          position: 'absolute',
                          right: '83px',
                          bottom: lines.length === 5 ? '8px' : lines.length === 4 ? '30px' : '53px'
                        }}>
                        {isContinue}
                      </div>
                    )}
                    {anchorElCopy && anchorElCopy.id === id && children?.trim() && (
                      <Icon
                        style={{ cursor: 'pointer', fontSize: 18 }}
                        onClick={(e) => onCopyClick(e, children?.trim())}>
                        file_copy
                      </Icon>
                    )}
                    {checkDisplayIcon()}
                    {anchorEl && anchorEl.id === id && allowAddInquiry && (
                      <AddCircleIcon className={clsx(classes.sizeIcon, classes.colorAddIcon)} />
                    )}
                  </InputAdornment>
                ) : (
                  <></>
                ),
              classes: {
                root: classes.root,
                input: classes.input,
                notchedOutline: isEmpty ? '' : classes.notchedOutlineNotChecked
              }
            }}
          />
        </ThemeProvider>
      </div>
    </>
  );
};

export default BLField;
