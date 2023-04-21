import {checkNewInquiry, formatDate, isJsonText, NUMBER_INQ_BOTTOM} from '@shared';
import {FuseLoading} from '@fuse';
import {
  BL_TYPE,
  COMMODITY_CODE,
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
  FREIGHT_TERM
} from '@shared/keyword';
import {PERMISSION, PermissionProvider} from '@shared/permission';
import * as AppActions from 'app/store/actions';
import React, {useContext, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import _ from 'lodash';
import {Chip, Divider, Grid} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import {makeStyles} from '@material-ui/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import {getBlInfo} from 'app/services/myBLService';
import {getPermissionByRole} from 'app/services/authService';
import {SocketContext} from 'app/AppContext';

import * as Actions from '../store/actions';
import * as FormActions from '../store/actions/form';
import * as TransActions from '../store/actions/transaction';
import * as InquiryActions from '../store/actions/inquiry';
import * as DraftActions from '../store/actions/draft-bl';
import * as mailActions from '../store/actions/mail';

import Inquiry from './Inquiry';
import AllInquiry from './AllInquiry';
import AmendmentEditor from './AmendmentEditor';
import Form from './Form';
import Label from './FieldLabel';
import BtnAddInquiry from './BtnAddInquiry';
import BLField from './BLField';
import {AttachFileList, AttachmentList} from './AttachmentList';
import BLProcessNotification from './BLProcessNotification';
import {SendInquiryForm} from './SendInquiryForm';
import TableCD from './TableCD';
import TableCM from './TableCM';
import ListNotification from './ListNotification';
import SubmitAnswerNotification from "./SubmitAnswerNotification";
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
  const openAttachment = useSelector(({ workspace }) => workspace.formReducer.openAttachment);
  const openAllInquiry = useSelector(({ workspace }) => workspace.formReducer.openAllInquiry);
  const openAmendmentList = useSelector(({ workspace }) => workspace.formReducer.openAmendmentList);
  const openInquiryForm = useSelector(({ workspace }) => workspace.formReducer.openDialog);
  const openAmendmentForm = useSelector(({ workspace }) => workspace.formReducer.openAmendmentForm);
  const confirmPopupType = useSelector(({ workspace }) => workspace.formReducer.confirmPopupType);
  const [confirmClick, form] = useSelector(({ workspace }) => [workspace.formReducer.confirmClick, workspace.formReducer.form]);
  const [inqCustomer, setInqCustomer] = useState([]);
  const [inqOnshore, setInqOnshore] = useState([]);
  const isLoadingTrans = useSelector(({ workspace }) => workspace.transReducer.isLoading);
  const currentInq = useSelector(({ workspace }) => workspace.inquiryReducer.currentInq);
  const listMinimize = useSelector(({ workspace }) => workspace.inquiryReducer.listMinimize);
  const listInqMinimize = useSelector(({ workspace }) => workspace.inquiryReducer.listInqMinimize);
  const openNotification = useSelector(({ workspace }) => workspace.formReducer.openNotificationSubmitAnswer);
  const openNotificationReply = useSelector(({ workspace }) => workspace.formReducer.openNotificationDeleteReply);
  const openNotificationBLWarning = useSelector(({ workspace }) => workspace.formReducer.openNotificationBLWarning);
  const openNotificationSubmitPreview = useSelector(({ workspace }) => workspace.formReducer.openNotificationSubmitPreview);
  const openPreviewListSubmit = useSelector(({ workspace }) => workspace.formReducer.openPreviewListSubmit);
  const openNotificationAmendment = useSelector(({ workspace }) => workspace.formReducer.openNotificationDeleteAmendment);
  const objectNewAmendment = useSelector(({ workspace }) => workspace.inquiryReducer.objectNewAmendment);
  const isLoading = useSelector(({ workspace }) => workspace.formReducer.isLoading);
  const openEmail = useSelector(({ workspace }) => workspace.formReducer.openEmail);

  const isShowBackground = useSelector(
    ({ workspace }) => workspace.inquiryReducer.isShowBackground
  );
  const enableSend = useSelector(({ workspace }) => workspace.inquiryReducer.enableSend);
  const currentField = useSelector(({ workspace }) => workspace.inquiryReducer.currentField);
  const socket = useContext(SocketContext);
  const openQueueList = useSelector(({ workspace }) => workspace.inquiryReducer.openQueueList);

  const getField = (keyword) => {
    return metadata.field?.[keyword] || '';
  };

  const getValueField = (keyword) => {
    return content[getField(keyword)] || '';
  };

  socket.on('msg_processing', async (data) => {
    const userInfo = localStorage.getItem('USER') ? JSON.parse(localStorage.getItem('USER')) : {};
    if (userInfo?.displayName && data.processingBy.length) {
      console.log('processingBy: ', data.processingBy);
      let permissions = [];
      if (userInfo.displayName === data.processingBy[0]) { // if to be the first user
        permissions = await getPermissionByRole(userInfo.role);
        dispatch(AppActions.setDefaultSettings(_.set({}, 'layout.config.toolbar.display', true)));
      } else {
        permissions = await getPermissionByRole('Viewer');

        if (userInfo.displayName === data.processingBy[data.processingBy.length - 1]) {
          dispatch(FormActions.toggleOpenBLWarning({ status: true, userName: data.processingBy[0] }));
        }
      }
      sessionStorage.setItem('permissions', JSON.stringify(permissions));
    }
  });

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
        dispatch(mailActions.autoSendMail(myBL, inquiries, inqCustomer, inqOnshore, metadata, content, form));
      }

    }
  }, [confirmClick, form])

  useEffect(() => {
    const unloadCallback = (event) => {
      if (!isLoadingTrans) {
        dispatch(TransActions.BlTrans(myBL.id, content));
      }
      return '';
    };
    window.addEventListener('beforeunload', unloadCallback);
    return () => window.removeEventListener('beforeunload', unloadCallback);
  }, [isLoadingTrans]);


  const checkBLSameRequest = async (bl) => {
    const userInfo = JSON.parse(localStorage.getItem('USER'));
    if (bl && userInfo) {
      socket.emit('user_processing_in', {
        mybl: bl,
        type: 'warning_duplicate',
        userName: userInfo.displayName,
        role: userInfo.role,
        userType: userInfo.userType
      });
    }
  };

  useEffect(() => {
    dispatch(AppActions.setDefaultSettings(_.set({}, 'layout.config.toolbar.display', true)));
    dispatch(DraftActions.setProcess(props.process));
    dispatch(Actions.loadMetadata());

    const bkgNo = window.location.pathname.split('/')[3];
    if (bkgNo) {
      dispatch(Actions.initBL(bkgNo));
      checkBLSameRequest(bkgNo);
    }
    else if (props.myBL) {
      dispatch(FormActions.increaseLoading())
      checkBLSameRequest(props.myBL?.id);
      getBlInfo(props.myBL?.id).then(res => {
        const { id, state, bkgNo } = res.myBL;
        dispatch(InquiryActions.setMyBL({ id, state, bkgNo }));
        dispatch(FormActions.decreaseLoading())
      });
    }

    return () => {
      dispatch(FormActions.resetLoading());
      const userInfo = JSON.parse(localStorage.getItem('USER'));
      if (userInfo) {
        socket.emit('user_processing_out', {
          mybl: bkgNo,
          type: 'warning_duplicate',
          userName: userInfo.displayName,
          role: userInfo.role,
          userType: userInfo.userType
        });
      }

      if (userInfo && userInfo.role === 'Admin') {
        getPermissionByRole('Admin').then(data => {
          const assignPermissionViewer = {
            ...userInfo,
            permissions: data
          };
          localStorage.setItem('USER', JSON.stringify(assignPermissionViewer));
        }).catch(err => {
          console.log(err)
        })
      }
    }
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

  const popupOpen = (inquiry, curField) => {
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
        title: metadata?.field_options.find((f) => f.value === currentField)?.label,
        field: 'AMENDMENT_FORM',
        child: <AmendmentEditor getUpdatedAt={() => { }} />
      };
    default:
      return {
        status: inquiry?.id === currentInq?.id,
        nums: user.role === 'Admin' ? [countInq(inquiries.filter((q) => q.field === inquiry.field), 'customer'), countInq(inquiries.filter((q) => q.field === inquiry.field), 'onshore')] : [],
        toggleForm: () => { },
        fabTitle: curField?.label,
        title: curField?.label,
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

  const renderMsgNoti = () => {
    if (openNotification) {
      return 'Your answer has been submitted successfully.'
    } else if (openNotificationReply) {
      return 'Your reply has been deleted.'
    } else if (openNotificationAmendment) {
      return 'Your amendment has been deleted.'
    } else if (openNotificationBLWarning.status) {
      return (
        <>
          <img style={{ verticalAlign: 'middle', paddingBottom: 2, paddingLeft: 5, paddingRight: 5, }} src={`/assets/images/icons/warning.svg`} />
          <span>{`The BL is opening by [${openNotificationBLWarning.userName}].`}</span>
        </>
      )
    } else if (openNotificationSubmitPreview) {
      return (
        // not used, change to toast
        <>
          <div>Your inquiries and amendments</div>
          <div>have been sent successfully.</div>
        </>
      )
    }
  };

  const renderMsgNoti2 = () => {
    if (openNotificationBLWarning.status) {
      return `Please wait for ${openNotificationBLWarning.userName} complete his/her work!`
    };
    return 'Thank you!'
  };

  const renderIconType = () => {
    if (openNotification || openNotificationReply || openNotificationAmendment || openNotificationSubmitPreview) {
      return <img src={`/assets/images/icons/vector.svg`} />;
    }
    return null
  }

  return (
    <>
      <BLProcessNotification />
      {isLoading > 0 ? <FuseLoading /> :
        <>
          {openQueueList && <QueueList />}
          <ListNotification />
          <SubmitAnswerNotification
            open={openNotification ||
              openNotificationReply ||
              openNotificationAmendment ||
              openNotificationBLWarning.status ||
              openNotificationSubmitPreview}
            msg={renderMsgNoti()}
            // msg2={`Please wait for ${openNotificationBLWarning.userName} complete his/her work!`}
            msg2={renderMsgNoti2()}
            iconType={renderIconType()}
            handleClose={() => {
              dispatch(FormActions.toggleOpenNotificationSubmitAnswer(false));
              dispatch(FormActions.toggleOpenNotificationDeleteReply(false));
              dispatch(FormActions.toggleOpenNotificationDeleteAmendment(false));
              dispatch(FormActions.toggleOpenBLWarning(false));
              dispatch(FormActions.toggleOpenNotificationPreviewSubmit(false));
            }}
          />
          <div className={clsx('max-w-5xl', classes.root)}>
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
                      `${JSON.parse(getValueField(SHIPPER)).name}\n${JSON.parse(getValueField(SHIPPER)).address}`
                      : getValueField(SHIPPER)}
                  </BLField>
                </Grid>
                <Grid item>
                  <Label>Consignee</Label>
                  <BLField id={getField(CONSIGNEE)} multiline={true} rows={5}>
                    {(getValueField(CONSIGNEE) && isJsonText(getValueField(CONSIGNEE))) ?
                      `${JSON.parse(getValueField(CONSIGNEE)).name}\n${JSON.parse(getValueField(CONSIGNEE)).address}`
                      : getValueField(CONSIGNEE)}
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
                      `${JSON.parse(getValueField(NOTIFY)).name}\n${JSON.parse(getValueField(NOTIFY)).address}`
                      : getValueField(NOTIFY)}
                  </BLField>
                </Grid>
                <Grid item>
                  <Label>ALSO NOTIFY</Label>
                  <BLField id={getField(ALSO_NOTIFY)} multiline={true} rows={5}>
                    {getValueField(ALSO_NOTIFY)}
                  </BLField>
                </Grid>
                <Grid container style={{ marginTop: '53px' }}>
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
                      {['oceanBill', 'B'].includes(getValueField(BL_TYPE)) ? 'BILL OF LADING' : 'SEAWAY BILL'}
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
                id={getField(CONTAINER_DETAIL)}
              />
            </Grid>

            <hr style={{ borderTop: '2px dashed #515E6A', marginTop: '2rem', marginBottom: '3rem' }} />

            <Grid container spacing={2}>
              <TableCM
                containerDetail={getValueField(CONTAINER_DETAIL)}
                containerManifest={getValueField(CONTAINER_MANIFEST)}
              />
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
                  <BLField id={getField(FREIGHT_CHARGES)}>
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
                      <Label>COMMODITY CODE</Label>
                      <BLField id={getField(COMMODITY_CODE)}>
                        {getValueField(COMMODITY_CODE)}
                      </BLField>
                    </Grid>
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
