import { NUMBER_INQ_BOTTOM } from '@shared';
import { SHIPPER, CONSIGNEE, NOTIFY, EXPORT_REF, FORWARDING, PLACE_OF_RECEIPT, PORT_OF_LOADING, PORT_OF_DISCHARGE, PLACE_OF_DELIVERY, FINAL_DESTINATION, VESSEL_VOYAGE, PRE_CARRIAGE, TYPE_OF_MOVEMENT, CONTAINER_DETAIL, CONTAINER_MANIFEST, FREIGHT_CHARGES, PLACE_OF_BILL, FREIGHTED_AS, RATE, DATE_CARGO, DATE_LADEN, COMMODITY_CODE, EXCHANGE_RATE, SERVICE_CONTRACT_NO, DOC_FORM_NO, CODE, TARIFF_ITEM, PREPAID, COLLECT, DATED } from '@shared/keyword';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import * as AppActions from 'app/store/actions';
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import _ from 'lodash';
import { Grid, Divider, Chip } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import * as Actions from '../store/actions';
import * as FormActions from '../store/actions/form';
import * as TransActions from '../store/actions/transaction';
import * as InquiryActions from '../store/actions/inquiry';
import * as DraftActions from '../store/actions/draft-bl';

import Inquiry from './Inquiry';
import AllInquiry from './AllInquiry';
import AmendmentEditor from './AmendmentEditor';
import Form from './Form';
import Label from './FieldLabel';
import BtnAddInquiry from './BtnAddInquiry';
import BLField from './BLField';
import { AttachmentList, AttachFileList } from './AttachmentList';
import BLProcessNotification from './BLProcessNotification';
import { InquiryReview, SendInquiryForm } from './SendInquiryForm';
import TableCD from './TableCD';
import TableCM from './TableCM';
import AttachmentListNotification from './AttachmentListNotification';
import SubmitAnswerNotification from "./SubmitAnswerNotification";

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
  const openInquiryForm = useSelector(({ workspace }) => workspace.formReducer.openDialog);
  const openAmendmentForm = useSelector(({ workspace }) => workspace.formReducer.openAmendmentForm);
  const reload = useSelector(({ workspace }) => workspace.formReducer.reload);

  const transAutoSaveStatus = useSelector(
    ({ workspace }) => workspace.transReducer.transAutoSaveStatus
  );
  const isLoading = useSelector(({ workspace }) => workspace.transReducer.isLoading);
  const currentInq = useSelector(({ workspace }) => workspace.inquiryReducer.currentInq);
  const listMinimize = useSelector(({ workspace }) => workspace.inquiryReducer.listMinimize);
  const listInqMinimize = useSelector(({ workspace }) => workspace.inquiryReducer.listInqMinimize);
  const isShowBackground = useSelector(
    ({ workspace }) => workspace.inquiryReducer.isShowBackground
  );
  const enableSend = useSelector(({ workspace }) => workspace.inquiryReducer.enableSend);

  const getField = (keyword) => {
    return metadata.field?.[keyword] || '';
  };

  const getValueField = (keyword) => {
    return content[getField(keyword)] || '';
  };

  useEffect(() => {
    const unloadCallback = (event) => {
      if (!isLoading) {
        dispatch(TransActions.BlTrans(myBL.id, content));
      }
      return '';
    };

    window.addEventListener('beforeunload', unloadCallback);
    return () => window.removeEventListener('beforeunload', unloadCallback);
  }, [isLoading]);

  useEffect(() => {
    setInterval(() => {
      if (myBL.id && transAutoSaveStatus === 'start') {
        dispatch(TransActions.BlTrans(myBL.id, content));
      }
    }, 60000);
  }, [transAutoSaveStatus, myBL]);

  useEffect(() => {
    dispatch(AppActions.setDefaultSettings(_.set({}, 'layout.config.toolbar.display', true)));
    dispatch(DraftActions.setProcess(props.process));

    const bkgNo = window.location.pathname.split('/')[3];
    if (bkgNo) dispatch(Actions.initBL(bkgNo));
    else if (props.myBL) dispatch(InquiryActions.setMyBL(props.myBL));

    return () => {
      dispatch(FormActions.toggleReload());
    };
  }, []);

  useEffect(() => {
    dispatch(Actions.loadMetadata());
  }, [reload])

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

  const countInq = (inqs, recevier) => {
    let count = 0;
    inqs.forEach((inq) => inq.receiver.includes(recevier) && (count += 1));
    return count;
  };

  const handleTabSelected = (inqs) => {
    if (countInq(inqs, 'customer') === 0) {
      return 'onshore'
    } else {
      return tabSelected === 0 ? 'customer' : 'onshore'
    }
  }

  const popupOpen = (inquiry, curField) => {
    switch (inquiry.field) {
    case 'INQUIRY_LIST':
      return {
        status: openAllInquiry,
        tabs: user.role === 'Admin' ? ['Customer', 'Onshore'] : [],
        nums: user.role === 'Admin' ? [countInq(inquiries, 'customer'), countInq(inquiries, 'onshore')] : [],
        toggleForm: (status) => dispatch(FormActions.toggleAllInquiry(status)),
        fabTitle: 'Inquiry List',
        title: 'Inquiry List',
        field: 'INQUIRY_LIST',
        showBtnSend: true,
        disableSendBtn: disableSendBtn,
        child: <AllInquiry user={props.user} receiver={handleTabSelected(inquiries)} field={'INQUIRY_LIST'} />
      };
    case 'ATTACHMENT_LIST':
      return {
        status: openAttachment,
        toggleForm: (status) => dispatch(FormActions.toggleAttachment(status)),
        fabTitle: 'Attachment List',
        title: 'Attachment List',
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
        child: <Inquiry user={props.user} receiver={handleTabSelected(inquiries.filter((q, index) => q.field === inquiry.field))} />
      };
    case 'AMENDMENT_FORM':
      return {
        status: openAmendmentForm,
        nums: [],
        toggleForm: (status) => dispatch(FormActions.toggleCreateAmendment(status)),
        fabTitle: 'Amendment Form',
        title: 'Amendment Creation',
        field: 'AMENDMENT_FORM',
        child: <AmendmentEditor />
      };
    default:
      return {
        status: inquiry?.id === currentInq?.id,
        nums: user.role === 'Admin' ? [countInq(inquiries.filter((q) => q.field === inquiry.field), 'customer'), countInq(inquiries.filter((q) => q.field === inquiry.field), 'onshore')] : [],
        toggleForm: () => { },
        fabTitle: curField?.label,
        title: curField?.label,
        field: curField?.value,
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

  return (
    <>
      <BLProcessNotification />
      <AttachmentListNotification />
      <SubmitAnswerNotification />
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
                return <SendInquiryForm field={'EMAIL'} key={inquiry.id} />;
              } else if (inquiry.field === 'INQUIRY_REVIEW') {
                return <InquiryReview field={'INQUIRY_REVIEW'} key={inquiry.id} />;
              } else {
                const popupObj = popupOpen(inquiry, field);
                return (
                  <Form
                    user={props.user}
                    tabs={popupObj.tabs || null}
                    nums={popupObj.nums || null}
                    key={inquiry.id}
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
                {getValueField(SHIPPER)}
              </BLField>
            </Grid>
            <Grid item>
              <Label>Consignee</Label>
              <BLField id={getField(CONSIGNEE)} multiline={true} rows={5}>
                {getValueField(CONSIGNEE)}
              </BLField>
            </Grid>
            <Grid item>
              <Label>
                {`NOTIFY PARTY (It is agreed that no responsibility shall be attached to the`}{' '}
                <br></br>
                {`Carrier or its Agents for failure to notify`}
              </Label>
              <BLField id={getField(NOTIFY)} multiline={true} rows={5}>
                {getValueField(NOTIFY)}
              </BLField>
            </Grid>
            <Grid container style={{ marginTop: '53px' }}>
              <Grid item xs={6} className={classes.leftPanel}>
                <Grid item>
                  <Label>PRE-CARRIAGE BY</Label>
                  <BLField id={getField(PRE_CARRIAGE)}>
                    {getValueField(PRE_CARRIAGE)}
                  </BLField>
                </Grid>
                <Grid item>
                  <Label>PORT OF LOADING</Label>
                  <BLField id={getField(PORT_OF_LOADING)}>
                    {getValueField(PORT_OF_LOADING)}
                  </BLField>
                </Grid>
              </Grid>
              <Grid item xs={6} className={classes.rightPanel}>
                <Grid item>
                  <Label>PLACE OF RECEIPT</Label>
                  <BLField id={getField(PLACE_OF_RECEIPT)}>
                    {getValueField(PLACE_OF_RECEIPT)}
                  </BLField>
                </Grid>
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
                <BLField lock={true}>{myBL.bkgNo || ""}</BLField>
              </Grid>
              <Grid item xs={6} className={classes.rightPanel}>
                <Label>SEA WAYBILL NO.</Label>
                <BLField lock={true}>{(myBL.bkgNo && `ONYE${myBL.bkgNo}`) || ""}</BLField>
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
              <BLField id={getField(FORWARDING)} multiline={true} rows={5}>
                {getValueField(FORWARDING)}
              </BLField>
            </Grid>
            <Grid item>
              <Label>{`FINAL DESTINATION (for line merchant's reference only)`}</Label>
              <BLField id={getField(FINAL_DESTINATION)}>
                {getValueField(FINAL_DESTINATION)}
              </BLField>
            </Grid>
            <Grid item>
              <Label>
                {`TYPE OF MOMENT (IF MIXED, USE DESCRIPTION OF PACKAGES AND`} <br></br>
                {`GOODS FIELD)`}
              </Label>
              <BLField id={getField(TYPE_OF_MOVEMENT)}>
                {getValueField(TYPE_OF_MOVEMENT)}
              </BLField>
            </Grid>
            <Grid item>
              <Grid item>
                <Label>OCEAN VESSEL VOYAGE NO. FlAG</Label>
                <BLField id={getField(VESSEL_VOYAGE)} width={`calc(50% - 15px)`}>
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
            containerManifest={getValueField(CONTAINER_MANIFEST)}
            id={getField(CONTAINER_MANIFEST)}
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
                <Grid item>
                  <Label>COMMODITY CODE</Label>
                  <BLField id={getField(COMMODITY_CODE)}>
                    {getValueField(COMMODITY_CODE)}
                  </BLField>
                </Grid>
                <Grid item>
                  <Label>FREIGHTED AS</Label>
                  <BLField id={getField(FREIGHTED_AS)}>
                    {getValueField(FREIGHTED_AS)}
                  </BLField>
                </Grid>
                <Grid item>
                  <Label>DATE CARGO RECEIVED</Label>
                  <BLField id={getField(DATE_CARGO)}>
                    {getValueField(DATE_CARGO)}
                  </BLField>
                </Grid>
              </Grid>
              <Grid item xs={6} className={classes.rightPanel}>
                <Grid item>
                  <Label>EXCHANGE RATE</Label>
                  <BLField id={getField(EXCHANGE_RATE)}>
                    {getValueField(EXCHANGE_RATE)}
                  </BLField>
                </Grid>
                <Grid item>
                  <Label>RATE</Label>
                  <BLField id={getField(RATE)}>
                    {getValueField(RATE)}
                  </BLField>
                </Grid>
                <Grid item>
                  <Label>DATE LADEN ON BOARD</Label>
                  <BLField id={getField(DATE_LADEN)}>
                    {getValueField(DATE_LADEN)}
                  </BLField>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} className={classes.rightPanel}>
            <Grid container>
              <Grid item xs={6} className={classes.leftPanel}>
                <Grid item>
                  <Label>SERVICE CONTRACT NO.</Label>
                  <BLField id={getField(SERVICE_CONTRACT_NO)}>
                    {getValueField(SERVICE_CONTRACT_NO)}
                  </BLField>
                </Grid>
                <Grid item>
                  <Label>CODE</Label>
                  <BLField id={getField(CODE)}>
                    {getValueField(CODE)}
                  </BLField>
                </Grid>
                <Grid item>
                  <Label>PREPAID</Label>
                  <BLField id={getField(PREPAID)}>
                    {getValueField(PREPAID)}
                  </BLField>
                </Grid>
                <Grid item>
                  <Label>PLACE OF BILL(S) ISSUE</Label>
                  <BLField id={getField(PLACE_OF_BILL)}>
                    {getValueField(PLACE_OF_BILL)}
                  </BLField>
                </Grid>
              </Grid>
              <Grid item xs={6} className={classes.rightPanel}>
                <Grid item>
                  <Label>DOC FORM NO.</Label>
                  <BLField id={getField(DOC_FORM_NO)}>
                    {getValueField(DOC_FORM_NO)}
                  </BLField>
                </Grid>
                <Grid item>
                  <Label>TARIFF ITEM</Label>
                  <BLField id={getField(TARIFF_ITEM)}>
                    {getValueField(TARIFF_ITEM)}
                  </BLField>
                </Grid>
                <Grid item>
                  <Label>COLLECT</Label>
                  <BLField id={getField(COLLECT)}>
                    {getValueField(COLLECT)}
                  </BLField>
                </Grid>
                <Grid item>
                  <Label>DATED</Label>
                  <BLField id={getField(DATED)}>
                    {getValueField(DATED)}
                  </BLField>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
};
export default BLWorkspace;
