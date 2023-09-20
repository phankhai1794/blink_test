import { checkNewInquiry, formatDate, isJsonText, NUMBER_INQ_BOTTOM } from '@shared';
import { FuseLoading } from '@fuse';
import {
  BL_TYPE,
  CONSIGNEE,
  CONTAINER_DETAIL,
  CONTAINER_MANIFEST,
  DATE_CARGO,
  DATE_LADEN,
  DATED,
  EXPORT_REF,
  FINAL_DESTINATION,
  FORWARDER,
  FREIGHT_CHARGES,
  NOTIFY,
  PLACE_OF_BILL,
  PLACE_OF_DELIVERY,
  PLACE_OF_RECEIPT,
  PORT_OF_DISCHARGE,
  PORT_OF_LOADING,
  PRE_CARRIAGE,
  SHIPPER,
  TYPE_OF_MOVEMENT,
  VESSEL_VOYAGE,
  ALSO_NOTIFY,
  RD_TERMS,
  FREIGHT_TERM,
  DESCRIPTION_OF_GOODS,
  NO_CONTENT_AMENDMENT,
  SHIPPING_MARK,
  DESCRIPTION_OF_GOODS1,
  DESCRIPTION_OF_GOODS2, CONTAINER_NUMBER, SEQ,
} from '@shared/keyword';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import * as AppActions from 'app/store/actions';
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import _ from 'lodash';
import {Button, Chip, Divider, Grid, Icon, IconButton} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import * as Actions from '../store/actions';
import * as FormActions from '../store/actions/form';
import * as InquiryActions from '../store/actions/inquiry';
import * as MailActions from '../store/actions/mail';

import Inquiry from './Inquiry';
import AllInquiry from './AllInquiry';
import AmendmentEditor from './AmendmentEditor';
import Form from './Form';
import Label from './FieldLabel';
import BtnAddInquiry from './BtnAddInquiry';
import BLField from './BLField';
import { AttachFileList, AttachmentList } from './AttachmentList';
import BLProcessNotification from './BLProcessNotification';
import { SendInquiryForm } from './SendInquiryForm';
import TableCD from './TableCD';
import TableCM from './TableCM';
import ListNotification from './ListNotification';
import QueueList from './QueueList';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '1170px',
    margin: '0 auto',
    paddingTop: 10,
    paddingBottom: 113
  },
  leftPanel: {
    paddingRight: '15px'
  },
  rightPanel: {
    paddingLeft: '15px'
  },
  ptGridItem: {
    paddingTop: '0 !important'
  },
  pbGridItem: {
    paddingBottom: '0 !important'
  },
  grayText: {
    fontSize: 18,
    fontWeight: 600,
    fontFamily: 'Montserrat',
    color: '#69696E'
  },
  divider: {
    margin: '30px 0'
  },
  note: {
    fontWeight: 600,
    fontSize: 13,
    lineHeight: '14px',
    color: '#DC2626'
  },
  button: {
    textTransform: 'none',
    fontWeight: 'bold',
    fontFamily: 'Montserrat',
    marginLeft: 5
  },
  buttonEditSeq: {
    padding: '10px 28.5px',
    color: '#FFFFFF',
    fontSize: 12,
    borderRadius: 8,
    lineHeight: '20px',
    backgroundColor: '#BD0F72',
    '&:hover': {
      backgroundColor: '#BD0F72'
    }
  },
  styleEditSeq: {
    '& .MuiIconButton-root:hover': {
      backgroundColor: 'transparent'
    },
    '& .MuiButtonBase-root .icon-edit-seq': {
      fontSize: 17
    }
  }
}));

const BLWorkspace = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(({ user }) => user);
  const [isExpand, setIsExpand] = useState(false);
  const [newFileAttachment, setNewFileAttachment] = useState([]);
  const [disableSendBtn, setDisableSendBtn] = useState(true);
  const [tabSelected, setTabSelected] = useState(0);

  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const content = useSelector(({ workspace }) => workspace.inquiryReducer.content);
  const myBL = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const openPreviewFiles = useSelector(({ workspace }) => workspace.formReducer.openPreviewFiles);
  const openAttachment = useSelector(({ workspace }) => workspace.formReducer.openAttachment);
  const openAllInquiry = useSelector(({ workspace }) => workspace.formReducer.openAllInquiry);
  const openAmendmentList = useSelector(({ workspace }) => workspace.formReducer.openAmendmentList);
  const openInquiryForm = useSelector(({ workspace }) => workspace.formReducer.openDialog);
  const openAmendmentForm = useSelector(({ workspace }) => workspace.formReducer.openAmendmentForm);
  const confirmPopupType = useSelector(({ workspace }) => workspace.formReducer.confirmPopupType);
  const [confirmClick, form] = useSelector(({ workspace }) => [workspace.formReducer.confirmClick, workspace.formReducer.form]);
  const [inqCustomer, setInqCustomer] = useState([]);
  const [inqOnshore, setInqOnshore] = useState([]);
  const [isEditSeq, setEditSeq] = useState(false);
  const [mapContSeq, setMapContSeq] = useState([])
  const [error, setError] = useState({valid: false, message: ''});
  const currentInq = useSelector(({ workspace }) => workspace.inquiryReducer.currentInq);
  const listMinimize = useSelector(({ workspace }) => workspace.inquiryReducer.listMinimize);
  const listInqMinimize = useSelector(({ workspace }) => workspace.inquiryReducer.listInqMinimize);
  const openPreviewListSubmit = useSelector(({ workspace }) => workspace.formReducer.openPreviewListSubmit);
  const objectNewAmendment = useSelector(({ workspace }) => workspace.inquiryReducer.objectNewAmendment);
  const isLoading = useSelector(({ workspace }) => workspace.formReducer.isLoading);
  const openEmail = useSelector(({ workspace }) => workspace.formReducer.openEmail);
  const drfView = useSelector(({ draftBL }) => draftBL.drfView);

  const isShowBackground = useSelector(
    ({ workspace }) => workspace.inquiryReducer.isShowBackground
  );
  const enableSend = useSelector(({ workspace }) => workspace.inquiryReducer.enableSend);
  const currentField = useSelector(({ workspace }) => workspace.inquiryReducer.currentField);
  const openQueueList = useSelector(({ workspace }) => workspace.inquiryReducer.openQueueList);

  const getField = (keyword) => {
    return metadata.field?.[keyword] || '';
  };

  const getValueField = (keyword) => {
    let result = '';
    if (keyword === DESCRIPTION_OF_GOODS) {
      const line1 = content[getField(DESCRIPTION_OF_GOODS1)] ? `${content[getField(DESCRIPTION_OF_GOODS1)]}\n` : '';
      const line2 = content[getField(DESCRIPTION_OF_GOODS2)] ? `${content[getField(DESCRIPTION_OF_GOODS2)]}\n` : '';
      result = `${line1}${line2}${content[getField(keyword)]}`
    } else result = content[getField(keyword)] || '';
    return result || '';
  };

  useEffect(() => {
    setInqCustomer(checkNewInquiry(metadata, inquiries, 'customer') || []);
    setInqOnshore(checkNewInquiry(metadata, inquiries, 'onshore') || []);
  }, [inquiries]);

  // TODO: TBU Logic after create new reply amendment
  useEffect(() => {
    const checkByField = (amendmentField, inq) => {
      return (inq.process === 'draft' && inq.field === amendmentField)
    };
    if (objectNewAmendment?.newAmendment?.field) {
      const optionsInquires = [...inquiries];
      const oldAmendmentIndex = optionsInquires.findIndex(inq => (inq.id === objectNewAmendment.oldAmendmentId || checkByField(objectNewAmendment.newAmendment.field, inq)));
      if (oldAmendmentIndex !== -1) {
        const tempID = optionsInquires[oldAmendmentIndex]?.id
        optionsInquires[oldAmendmentIndex] = { ...optionsInquires[oldAmendmentIndex], ...objectNewAmendment.newAmendment }
        optionsInquires[oldAmendmentIndex].id = tempID;
        dispatch(InquiryActions.setInquiries(optionsInquires));
      }
    }
  }, [objectNewAmendment])

  useEffect(() => {
    if (confirmClick && confirmPopupType === 'autoSendMail') {
      dispatch(
        FormActions.openConfirmPopup({
          openConfirmPopup: false,
          confirmClick: false,
          confirmPopupMsg: '',
          form: {},
          confirmPopupType: ''
        })
      );
      if (inqOnshore.length == 0 && inqCustomer.length == 0) {
        dispatch(AppActions.showMessage({ message: 'No inquiries to Send Mail.', variant: 'error' }));
      } else {
        dispatch(MailActions.autoSendMail(myBL, inquiries, inqCustomer, inqOnshore, metadata, content, form));
      }

    }
  }, [confirmClick, form])

  useEffect(() => {
    dispatch(AppActions.setDefaultSettings(_.set({}, 'layout.config.toolbar.display', true)));
    dispatch(Actions.loadMetadata());

    return () => dispatch(FormActions.resetLoading());
  }, []);

  const expandRef = useRef();
  useEffect(() => {
    const handlerEvent = (event) => {
      if (expandRef.current && !expandRef.current.contains(event.target)) {
        setIsExpand(false);
      }
    };
    document.addEventListener('mousedown', handlerEvent);
    return () => document.removeEventListener('mousedown', handlerEvent);
  }, []);

  useEffect(() => {
    if (openAttachment) {
      setNewFileAttachment([]);
    }
  }, [openAttachment]);

  useEffect(() => {
    setDisableSendBtn(!enableSend)
  }, [enableSend]);

  // scroll to top if surpass document height when change view
  useEffect(() => {
    const bl = document.getElementById('blwork')
    const boundingRect = bl.getBoundingClientRect()

    if (window.innerHeight > boundingRect.bottom) {
      bl.scrollIntoView()
    }
  }, [drfView])

  const countInq = (inqs, process, recevier) => {
    return inqs.filter((inq) => inq.process === process && inq.receiver.includes(recevier)).length;
  };

  const handleTabSelected = (inqs, process = 'pending') => {
    if (countInq(inqs, process, 'customer') === 0) {
      return 'onshore'
    } else {
      return tabSelected === 0 ? 'customer' : 'onshore'
    }
  }

  const renderTitle = () => {
    if (openAllInquiry) return 'Inquiries List';
    else if (openAmendmentList) return 'Amendments List';
    else if (openPreviewListSubmit) return 'Preview List';
  }

  const containerCheck = [getField(CONTAINER_DETAIL), getField(CONTAINER_MANIFEST)];
  const popupOpen = (inquiry, curField) => {
    let labelInquiry = curField && curField.label;
    if (curField && ['containerDetail', 'containerManifest'].includes(curField.keyword)) {
      labelInquiry = 'Container Detail - Container Manifest';
    }
    let labelAmendment = '';
    if (currentField) {
      labelAmendment = metadata?.field_options.find((f) => f.value === currentField)?.label;
      if (containerCheck.includes(currentField)) {
        labelAmendment = 'Container Detail - Container Manifest';
      }
    }
    switch (inquiry.field) {
    case 'INQUIRY_LIST':
      return {
        status: openAllInquiry || openAmendmentList || openPreviewListSubmit,
        tabs: user.role === 'Admin' ? ['Customer', 'Onshore'] : [],
        nums: user.role === 'Admin' ? [countInq(inquiries.filter((q) => !['RESOLVED', 'COMPL', 'UPLOADED'].includes(q.state)), openAllInquiry ? 'pending' : 'draft', 'customer'), countInq(inquiries.filter((q) => !['RESOLVED', 'COMPL', 'UPLOADED'].includes(q.state)), openAllInquiry ? 'pending' : 'draft', 'onshore')] : [],
        toggleForm: (status) => {
          dispatch(FormActions.toggleAllInquiry(status));
          dispatch(FormActions.toggleAmendmentsList(status))
          dispatch(FormActions.togglePreviewSubmitList(status))
        },
        fabTitle: renderTitle(),
        title: renderTitle(),
        field: 'INQUIRY_LIST',
        showBtnSend: true,
        disableSendBtn: disableSendBtn,
        child: <AllInquiry user={props.user} receiver={handleTabSelected(inquiries, openAllInquiry ? 'pending' : 'draft')} field={'INQUIRY_LIST'} />
      };
    case 'ATTACHMENT_LIST':
      return {
        status: openAttachment,
        toggleForm: (status) => dispatch(FormActions.toggleAttachment(status)),
        fabTitle: 'Attachments List',
        title: 'Attachments List',
        hasAddButton: false,
        field: 'ATTACHMENT_LIST',
        popoverfooter: true,
        customActions: inquiries.length > 0 && (
          <>
            <PermissionProvider action={PERMISSION.INQUIRY_ADD_MEDIA}>
              <AttachFileList
                uploadImageAttach={(files) => setNewFileAttachment(files)}
                isAttachmentList={true}
                type={'addNew'}>
                <AddCircleIcon
                  style={{
                    color: isShowBackground ? 'rgb(189 15 114 / 56%)' : '#BD0F72',
                    width: '50px',
                    fontSize: '50px',
                    cursor: isShowBackground ? 'inherit' : 'pointer'
                  }}
                />
              </AttachFileList>
            </PermissionProvider>
          </>
        ),
        child: (
          <AttachmentList
            user={props.user}
            newFileAttachment={newFileAttachment}
            setFileAttachment={() => setNewFileAttachment([])}
          />
        )
      };
    case 'INQUIRY_FORM':
      return {
        status: openInquiryForm,
        nums: user.role === 'Admin' ? [countInq(inquiries.filter((q) => q.field === inquiry.field), 'customer'), countInq(inquiries.filter((q) => q.field === inquiry.field), 'onshore')] : [],
        toggleForm: (status) => dispatch(FormActions.toggleCreateInquiry(status)),
        fabTitle: 'Inquiry Form',
        title: 'Inquiry Creation',
        field: 'INQUIRY_FORM',
        child: <Inquiry user={props.user} receiver={handleTabSelected(inquiries.filter(q => q.field === inquiry.field))} />
      };
    case 'AMENDMENT_FORM':
      return {
        status: openAmendmentForm,
        nums: [],
        toggleForm: (status) => dispatch(FormActions.toggleCreateAmendment(status)),
        fabTitle: 'Amendment Form',
        title: labelAmendment,
        field: 'AMENDMENT_FORM',
        child: <AmendmentEditor getUpdatedAt={() => { }} setDefaultAction={() => { }} />
      };
    default:
      return {
        status: inquiry?.id === currentInq?.id,
        nums: user.role === 'Admin' ? [countInq(inquiries.filter((q) => q.field === inquiry.field), 'customer'), countInq(inquiries.filter((q) => q.field === inquiry.field), 'onshore')] : [],
        toggleForm: () => { },
        fabTitle: curField?.label,
        title: labelInquiry,
        field: curField?.value,
        showBtnSend: true,
        disableSendBtn: disableSendBtn,
        child: <Inquiry user={props.user} />
      };
    }
  };

  const handleExpand = () => setIsExpand(!isExpand);

  const getFabTitle = (inqId) => {
    const listTitle = {
      inquiryList: 'Inquiry List',
      attachmentList: 'Attachment',
      email: 'E-mail',
      inquiryForm: 'Inquiry Form',
      inquiryReview: 'Inquiry Review'
    };
    if (Object.keys(listTitle).includes(inqId)) {
      return listTitle[inqId];
    } else {
      const fieldId = listMinimize.find((inq) => inq.id === inqId).field;
      const field = metadata.field_options.find((f) => fieldId === f.value);
      return field && field.label;
    }
  };

  const handleClose = (inqId) => {
    const index = listInqMinimize.findIndex((inp) => inp === inqId);
    listInqMinimize.splice(index, 1);
    dispatch(InquiryActions.setListInqMinimize(listInqMinimize));
  };

  const openMinimize = (inqId) => {
    const toggleFormType = {
      email: (status) => dispatch(FormActions.toggleOpenEmail(status)),
      inquiryReview: (status) => dispatch(FormActions.toggleOpenInquiryReview(status))
    };
    const currentInq = listMinimize.find((q) => q.id === inqId);
    const field = metadata.field_options.find((f) => currentInq.field === f.value);
    dispatch(InquiryActions.setField(currentInq.field));
    const popupObj = Object.keys(toggleFormType).includes(inqId)
      ? { toggleForm: toggleFormType[inqId] }
      : popupOpen(currentInq, field);
    if (currentInq) {
      dispatch(InquiryActions.setOneInq(currentInq));
      popupObj.toggleForm(true);
      if (currentInq.field === 'INQUIRY_LIST') {
        dispatch(FormActions.toggleSaveInquiry(true));
      }
    }
    setIsExpand(false);
  };

  const resetContentSeq = () => {
    const cloneContent = {...content};
    if (Object.keys(cloneContent).length) {
      const contentCM = cloneContent[getField(CONTAINER_MANIFEST)];
      const mapContSeqList = [];
      contentCM.forEach(c => {
        mapContSeqList.push({
          contNo: c?.[metadata?.inq_type?.[CONTAINER_NUMBER]],
          seq: c?.[metadata?.inq_type?.[SEQ]] + '' || '',
        })
      })
      setMapContSeq(mapContSeqList);
    }
  }

  useEffect(() => {
    resetContentSeq();
  }, [content]);

  const enableEditSeq = (isCancelOrSave, isSave) => {
    if (isCancelOrSave) {
      if (!isSave) {
        // cancel
        resetContentSeq();
        setError({valid: false, message: ''})
        setEditSeq(false);
      } else {
        // save
        if (error && error.valid) {
          return;
        }
        const cloneContent = {...content};
        let contentCM = cloneContent[getField(CONTAINER_MANIFEST)];
        if (contentCM.length && mapContSeq.length) {
          contentCM = contentCM.map(m => {
            const findSeqByContNo = mapContSeq.find(c => c.contNo === m?.[metadata?.inq_type?.[CONTAINER_NUMBER]]);
            if (findSeqByContNo) {
              return {
                ...m,
                [metadata?.inq_type?.[SEQ]]: findSeqByContNo.seq || ''
              }
            }
            return {
              ...m,
              [metadata?.inq_type?.[SEQ]]: ''
            }
          })
          // sort by seq
          contentCM.sort((a, b) => {
            if (a?.[metadata?.inq_type?.[SEQ]] && b?.[metadata?.inq_type?.[SEQ]]) {
              return parseInt(a?.[metadata?.inq_type?.[SEQ]]) - parseInt(b?.[metadata?.inq_type?.[SEQ]])
            }
          })
          const contentCmUpdate = {
            ...cloneContent,
            [getField(CONTAINER_MANIFEST)]: contentCM
          }
          dispatch(InquiryActions.setContent(contentCmUpdate));
        }
        setEditSeq(false);
      }
    } else {
      // edit seq
      setEditSeq(true);
    }
  }

  function findDuplicateStrings(arr) {
    const seenStrings = [];
    const duplicates = [];
    for (const str of arr) {
      if (seenStrings.includes(str)) {
        duplicates.push(str);
      } else {
        seenStrings.push(str);
      }
    }
    return duplicates;
  }

  const checkDuplicateSeq = (contMap) => {
    const excludeContNo = [];
    const listSeq = [];
    let isDuplicate = false;
    if (contMap.length) {
      contMap.forEach(m => {
        if (!excludeContNo.includes(m.contNo)) {
          excludeContNo.push(m.contNo);
          listSeq.push(m.seq);
        }
      })
      isDuplicate = findDuplicateStrings(listSeq).length > 0;
    }
    return {isDuplicate, excludeContNo}
  }

  const validateInput = (valInput, contMap) => {
    const cmContent = content[getField(CONTAINER_MANIFEST)];
    const regInteger = /^\s*[1-9]\d{0,2}(,?\d{3})*\s*$/g;
    const {isDuplicate, excludeContNo} = checkDuplicateSeq(contMap);
    if (contMap && contMap.length) {
      let isNotError = true;
      if (isDuplicate) {
        setError({ valid: true, message: 'Duplicate sequence number' })
      }
      for (let i = 0; i < contMap.length; i++) {
        let isErrorCheck = true;
        const getSeq = contMap[i]?.seq;
        if (getSeq.trim() === '') {
          setError({ valid: true, message: 'Please enter sequence number' })
        } else if (!getSeq.trim().match(regInteger)) {
          setError({ valid: true, message: 'Invalid number' })
        } else if (parseInt(getSeq.trim()) > parseInt(excludeContNo.length)) {
          setError({ valid: true, message: `The maximum value is not greater than ${cmContent.length}` })
        } else {
          isErrorCheck = false;
        }
        if (isErrorCheck) {
          isNotError = false;
          break;
        }
      }
      if (isNotError && !isDuplicate) {
        setError({ valid: false, message: '' });
      }
    }
  }

  return (
    <>
      <BLProcessNotification />
      {isLoading > 0 ? <FuseLoading /> :
        <>
          {openQueueList && <QueueList />}
          <ListNotification />
          <div id='blwork' className={clsx('max-w-5xl', classes.root)}>
            <div style={{ position: 'fixed', right: '2rem', bottom: '5rem', zIndex: 999 }}>
              {isExpand && (
                <div
                  ref={expandRef}
                  className="flex flex-col p-4 rounded-8 shadow"
                  style={{ marginBottom: '-0.5rem' }}>
                  {listInqMinimize.map((inq, index) => {
                    if (index >= NUMBER_INQ_BOTTOM)
                      return (
                        <Chip
                          key={index}
                          className="flex justify-between mt-4"
                          label={getFabTitle(inq)}
                          onClick={() => openMinimize(inq)}
                          onDelete={() => handleClose(inq)}
                          color="primary"
                        />
                      );
                  })}
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  position: 'fixed',
                  right: '2rem',
                  bottom: '1rem',
                  zIndex: 999
                }}>
                {listMinimize.map((inquiry) => {
                  const field = metadata.field_options.find(f => inquiry.field === f.value);
                  if (inquiry.field === 'EMAIL') {
                    return openEmail && <SendInquiryForm field={'EMAIL'} key={inquiry.id} />;
                  } else {
                    const popupObj = popupOpen(inquiry, field);
                    return (
                      <Form
                        isPreviewFile={openPreviewFiles}
                        user={props.user}
                        tabs={popupObj.tabs || null}
                        nums={popupObj.nums || null}
                        key={inquiry.id}
                        tabSelected={tabSelected}
                        tabChange={(newValue) => {
                          setTabSelected(newValue);
                        }}
                        open={popupObj.status}
                        toggleForm={popupObj.toggleForm}
                        FabTitle={popupObj.fabTitle}
                        hasAddButton={popupObj.hasAddButton}
                        field={popupObj.field}
                        popoverfooter={popupObj.popoverfooter}
                        customActions={popupObj.customActions}
                        title={popupObj.title}
                        showBtnSend={popupObj.showBtnSend}
                        disableSendBtn={popupObj.disableSendBtn}>
                        {popupObj.child}
                      </Form>
                    );
                  }
                })}
                {listInqMinimize.length > NUMBER_INQ_BOTTOM && (
                  <div className="flex items-center pl-1" onClick={handleExpand}>
                    <span>
                      <strong>{NUMBER_INQ_BOTTOM}</strong>/{listInqMinimize.length}
                    </span>
                    {isExpand ? <ExpandMore /> : <ExpandLess />}
                  </div>
                )}
              </div>
            </div>

            <BtnAddInquiry />

            <Grid container>
              <Grid item xs={6} className={classes.leftPanel}>
                <Grid item>
                  <Label>Shipper/Exporter</Label>
                  <BLField id={getField(SHIPPER)} multiline={true} rows={5}>
                    {(getValueField(SHIPPER) && isJsonText(getValueField(SHIPPER))) ?
                      ((JSON.parse(getValueField(SHIPPER)).name === NO_CONTENT_AMENDMENT) ? ''
                        : `${JSON.parse(getValueField(SHIPPER)).name}\n${JSON.parse(getValueField(SHIPPER)).address}`)
                      : getValueField(SHIPPER).replace(NO_CONTENT_AMENDMENT, '')}
                  </BLField>
                </Grid>
                <Grid item>
                  <Label>Consignee</Label>
                  <BLField id={getField(CONSIGNEE)} multiline={true} rows={5}>
                    {(getValueField(CONSIGNEE) && isJsonText(getValueField(CONSIGNEE))) ?
                      ((JSON.parse(getValueField(CONSIGNEE)).name === NO_CONTENT_AMENDMENT) ? ''
                        : `${JSON.parse(getValueField(CONSIGNEE)).name}\n${JSON.parse(getValueField(CONSIGNEE)).address}`)
                      : getValueField(CONSIGNEE).replace(NO_CONTENT_AMENDMENT, '')}
                  </BLField>
                </Grid>
                <Grid item>
                  <Label>
                    {`NOTIFY PARTY (It is agreed that no responsibility shall be attached to the`}{' '}
                    <br></br>
                    {`Carrier or its Agents for failure to notify)`}
                  </Label>
                  <BLField id={getField(NOTIFY)} multiline={true} rows={5}>
                    {(getValueField(NOTIFY) && isJsonText(getValueField(NOTIFY))) ?
                      ((JSON.parse(getValueField(NOTIFY)).name === NO_CONTENT_AMENDMENT) ? ''
                        : `${JSON.parse(getValueField(NOTIFY)).name}\n${JSON.parse(getValueField(NOTIFY)).address}`)
                      : getValueField(NOTIFY).replace(NO_CONTENT_AMENDMENT, '')}
                  </BLField>
                </Grid>
                <Grid item>
                  <Label>ALSO NOTIFY</Label>
                  <BLField id={getField(ALSO_NOTIFY)} multiline={true} rows={5}>
                    {getValueField(ALSO_NOTIFY)}
                  </BLField>
                </Grid>
                <Grid item>
                  <Label>SHIPPING MARK</Label>
                  <BLField id={getField(SHIPPING_MARK)} multiline={true} rows={5}>
                    {getValueField(SHIPPING_MARK)}
                  </BLField>
                </Grid>
                <Grid item>
                  <Label>DESCRIPTION OF GOODS</Label>
                  <BLField id={getField(DESCRIPTION_OF_GOODS)} multiline={true} rows={8}>
                    {getValueField(DESCRIPTION_OF_GOODS)}
                  </BLField>
                </Grid>
              </Grid>
              <Grid item xs={6} className={classes.rightPanel}>
                <Grid container>
                  <Grid item xs={6} className={classes.leftPanel}>
                    <Label>BOOKING NO.</Label>
                    <BLField lock={true} disableClick={true}>{myBL.bkgNo || ""}</BLField>
                  </Grid>
                  <Grid item xs={6} className={classes.rightPanel}>
                    <Label>BL TYPE</Label>
                    <BLField id={getField(BL_TYPE)}>
                      {['oceanBill', 'B'].includes(getValueField(BL_TYPE)) ? 'ORIGINAL B/L' : 'SEA WAYBILL'}
                    </BLField>
                  </Grid>
                </Grid>
                <Grid item>
                  <Label>
                    {`EXPORT REFERENCES (for the Merchant's and/or Carrier's reference only.`} <br></br>
                    {`See back clause 8. (4.)`}
                  </Label>
                  <BLField id={getField(EXPORT_REF)} multiline={true} rows={2}>
                    {getValueField(EXPORT_REF)}
                  </BLField>
                </Grid>
                <Grid item>
                  <Label>FORWARDING AGENT-REFERENCES FMC NO.</Label>
                  <BLField id={getField(FORWARDER)} multiline={true} rows={5}>
                    {getValueField(FORWARDER)}
                  </BLField>
                </Grid>
                <Grid item>
                  <Label>{`FINAL DESTINATION (for the Merchant's reference only)`}</Label>
                  <BLField id={getField(FINAL_DESTINATION)}>
                    {getValueField(FINAL_DESTINATION)}
                  </BLField>
                </Grid>
                <Grid item>
                  <Label>
                    {`TYPE OF MOVEMENT (IF MIXED, USE DESCRIPTION OF PACKAGES AND`} <br></br>
                    {`GOODS FIELD)`}
                  </Label>
                  <BLField id={getField(TYPE_OF_MOVEMENT)}>
                    {getValueField(TYPE_OF_MOVEMENT)}
                  </BLField>
                </Grid>
                <Grid container>
                  <Grid item xs={6} className={classes.leftPanel}>
                    <Label>R/D TERM</Label>
                    <BLField id={getField(RD_TERMS)}>
                      {getValueField(RD_TERMS)}
                    </BLField>
                  </Grid>
                  <Grid item xs={6} className={classes.rightPanel}>
                    <Label>PRE-CARRIAGE BY</Label>
                    <BLField id={getField(PRE_CARRIAGE)}>
                      {getValueField(PRE_CARRIAGE)}
                    </BLField>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={6} className={classes.leftPanel}>
                    <Label>PLACE OF RECEIPT</Label>
                    <BLField id={getField(PLACE_OF_RECEIPT)}>
                      {getValueField(PLACE_OF_RECEIPT)}
                    </BLField>
                  </Grid>
                  <Grid item xs={6} className={classes.rightPanel}>
                    <Label>OCEAN VESSEL VOYAGE NO. FlAG</Label>
                    <BLField id={getField(VESSEL_VOYAGE)}>
                      {getValueField(VESSEL_VOYAGE)}
                    </BLField>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={6} className={classes.leftPanel}>
                    <Grid item>
                      <Label>PORT OF LOADING</Label>
                      <BLField id={getField(PORT_OF_LOADING)}>
                        {getValueField(PORT_OF_LOADING)}
                      </BLField>
                    </Grid>
                  </Grid>
                  <Grid item xs={6} className={classes.rightPanel}>
                    <Grid item>
                      <Label>PORT OF DISCHARGE</Label>
                      <BLField id={getField(PORT_OF_DISCHARGE)}>
                        {getValueField(PORT_OF_DISCHARGE)}
                      </BLField>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6} className={classes.leftPanel}>
                  <Label>PLACE OF DELIVERY</Label>
                  <BLField id={getField(PLACE_OF_DELIVERY)}>
                    {getValueField(PLACE_OF_DELIVERY)}
                  </BLField>
                </Grid>
              </Grid>
            </Grid>

            <Divider className={classes.divider} />

            <Grid container spacing={2}>
              <Grid container alignItems="center" justify="center">
                <h2 className={classes.grayText}>
                  PARTICULARS DECLARED BY SHIPPER BUT NOT ACKNOWLEDGED BY THE CARRIER
                </h2>
              </Grid>
              <TableCD
                containerDetail={getValueField(CONTAINER_DETAIL)}
                containerManifest={getValueField(CONTAINER_MANIFEST)}
                id={getField(CONTAINER_DETAIL)}
              />
            </Grid>

            <hr style={{ borderTop: '2px dashed #515E6A', marginTop: '2rem', marginBottom: '3rem' }} />

            <Grid container spacing={2} style={{ position: 'relative' }} className={classes.styleEditSeq}>
              {user.role === 'Admin' ? (isEditSeq ? (
                <>
                  <div style={{ width: 60, height: 35, position: 'absolute', zIndex: '9999', top: 65, left: 18 }}>
                    <img
                        style={{ width: 20, cursor: 'pointer' }}
                        src="/assets/images/icons/checkbox.svg"
                        onClick={() => enableEditSeq(true, true)}
                    />
                    <img
                        style={{ width: 20, cursor: 'pointer', marginLeft: 5 }}
                        src="/assets/images/icons/slashes.svg"
                        onClick={() => enableEditSeq(true, false)}
                    />
                  </div>
                </>
              ) : (
                <IconButton
                  onClick={() => {
                    enableEditSeq(false, true)
                  }}
                  className="w-16 h-16 p-0"
                  style={{ width: 60, height: 35, position: 'absolute', zIndex: '9999', top: 60, left: 10 }}
                >
                  <Icon className="text-16 arrow-icon icon-edit-seq" color="disabled">
                    edit_mode
                  </Icon>
                </IconButton>
              )) : ``}
              <TableCM
                containerDetail={getValueField(CONTAINER_DETAIL)}
                containerManifest={getValueField(CONTAINER_MANIFEST)}
                isEditSeq={isEditSeq}
                mapContSeq={mapContSeq}
                setMapContSeq={(val) => {
                  if (Object.keys(val).length) {
                    let contMap = [];
                    if (mapContSeq.length) {
                      contMap = mapContSeq.map(m => {
                        if (val.contNo === m.contNo) {
                          return {
                            ...m,
                            seq: val.seq
                          }
                        }
                        return {
                          ...m
                        }
                      })
                    }
                    validateInput(val, contMap)
                    setMapContSeq(contMap)
                  }
                }}
              />
              {error && error.valid && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <ErrorOutlineIcon
                    style={{ height: '25px', width: '25px', color: '#DC2626', marginRight: 5 }} />
                  <span style={{ color: 'red' }}>{error.message}</span>
                </div>
              )}
            </Grid>

            <Grid container className="mt-20">
              <Grid container justify="center">
                <h2 className={classes.grayText}>** TO BE CONTINUED ON ATTACHED LIST **</h2>
              </Grid>
            </Grid>
            <Grid
              container
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className={classes.note}>Declared Cargo Value US $</span>
              <span className={classes.note}>
                {
                  "If Merchant enters a value, Carrier's limitation of liability shall not apply and the ad valorem rate will be charged"
                }
              </span>
            </Grid>


            <Divider style={{ marginTop: 30, marginBottom: 0 }} />

            <Grid container>
              <Grid item xs={6} className={classes.leftPanel}>
                <Grid item>
                  <Label>FREIGHT & CHARGES PAYABLE AT / BY:</Label>
                  <BLField id={getField(FREIGHT_CHARGES)} multiline={true}>
                    {getValueField(FREIGHT_CHARGES)}
                  </BLField>
                </Grid>
                <Grid container>
                  <Grid item xs={6} className={classes.leftPanel}>
                    <Label>DATE CARGO RECEIVED</Label>
                    <BLField id={getField(DATE_CARGO)}>
                      {getValueField(DATE_CARGO) && formatDate(getValueField(DATE_CARGO), 'DD MMM YYYY')}
                    </BLField>
                  </Grid>
                  <Grid item xs={6} className={classes.rightPanel}>
                    <Label>DATE LADEN ON BOARD</Label>
                    <BLField id={getField(DATE_LADEN)}>
                      {getValueField(DATE_LADEN) && formatDate(getValueField(DATE_LADEN), 'DD MMM YYYY')}
                    </BLField>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6} className={classes.rightPanel}>
                <Grid container>
                  <Grid item xs={6} className={classes.leftPanel}>
                    <Grid item>
                      <Label>FREIGHT TERM</Label>
                      <BLField id={getField(FREIGHT_TERM)}>
                        {getValueField(FREIGHT_TERM)}
                      </BLField>
                    </Grid>
                    <Grid item>
                      <Label>PLACE OF BILL(S) ISSUE</Label>
                      <BLField id={getField(PLACE_OF_BILL)}>
                        {getValueField(PLACE_OF_BILL)}
                      </BLField>
                    </Grid>
                  </Grid>
                  <Grid item xs={6} className={classes.leftPanel}>
                    <Grid item>
                      <Label>DATED</Label>
                      <BLField id={getField(DATED)}>
                        {getValueField(DATED) && formatDate(getValueField(DATED), 'DD MMM YYYY')}
                      </BLField>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </>
      }
    </>
  );
};
export default BLWorkspace;
