import { getKeyByValue, NUMBER_INQ_BOTTOM } from '@shared';
import { CONTAINER_DETAIL, CONTAINER_MANIFEST } from '@shared/keyword';
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
import AddCircleIcon from "@material-ui/icons/AddCircle";

import * as Actions from '../store/actions';
import * as FormActions from '../store/actions/form';
import * as TransActions from '../store/actions/transaction';
import * as InquiryActions from '../store/actions/inquiry';

import Inquiry from './Inquiry';
import AllInquiry from './AllInquiry';
import Form from './Form';
import Label from './FieldLabel';
import BtnAddInquiry from './BtnAddInquiry';
import BLField from './BLField';
import InquiryForm from './InquiryForm';
import {AttachmentList,AttachFile} from './AttachmentList';
import BLProcessNotification from './BLProcessNotification';
import { InquiryReview, SendInquiryForm } from './SendInquiryForm';
import TableCD from './TableCD';
import TableCM from './TableCM';

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
    color: '#69696E'
  },
  divider: {
    margin: '30px 0'
  }
}));

const BLWorkspace = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isExpand, setIsExpand] = useState(false);
  const [newFileAttachment, setNewFileAttachment] = useState([]);

  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const content = useSelector(({ workspace }) => workspace.inquiryReducer.content);
  const myBL = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const openAttachment = useSelector(({ workspace }) => workspace.formReducer.openAttachment);
  const openAllInquiry = useSelector(({ workspace }) => workspace.formReducer.openAllInquiry);
  const openInquiryForm = useSelector(({ workspace }) => workspace.formReducer.openDialog);
  const transAutoSaveStatus = useSelector(
    ({ workspace }) => workspace.transReducer.transAutoSaveStatus
  );
  const isLoading = useSelector(({ workspace }) => workspace.transReducer.isLoading);
  const currentInq = useSelector(({ workspace }) => workspace.inquiryReducer.currentInq);
  const listMinimize = useSelector(({ workspace }) => workspace.inquiryReducer.listMinimize);
  const listInqMinimize = useSelector(({ workspace }) => workspace.inquiryReducer.listInqMinimize);
  const isShowBackground = useSelector(({ workspace }) => workspace.inquiryReducer.isShowBackground);

  const getField = (field) => {
    return metadata.field ? metadata.field[field] : '';
  };

  const getValueField = (field) => {
    return content[getField(field)] || '';
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
    dispatch(Actions.loadMetadata());

    const bkgNo = window.location.pathname.split('/')[3];
    if (bkgNo) dispatch(Actions.initBL(bkgNo));
    else if (props.myBL) dispatch(InquiryActions.setMyBL(props.myBL));

    return () => {
      dispatch(FormActions.toggleReload());
    };
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
    if (openAttachment) {setNewFileAttachment([])}
  }, [openAttachment]);

  const popupOpen = (inquiry, getField) => {
    switch (inquiry.field) {
    case 'INQUIRY_LIST':
      return {
        status: openAllInquiry,
        toggleForm: (status) => dispatch(FormActions.toggleAllInquiry(status)),
        fabTitle: 'Inquiry List',
        title: 'Inquiry List',
        field: 'INQUIRY_LIST',
        child: <AllInquiry user={props.user} />
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
        customActions: (inquiries.length > 0 && <>
          <PermissionProvider action={PERMISSION.INQUIRY_ADD_MEDIA}>
            <AttachFile
              uploadImageAttach={(files) => setNewFileAttachment(files)}
              isAttachmentList={true}
              type={'addNew'}
            >
              <AddCircleIcon style={{ color: isShowBackground ? 'rgb(189 15 114 / 56%)' : '#BD0F72', width: '50px', fontSize: '50px', cursor: isShowBackground ? 'inherit' : 'pointer' }} />
            </AttachFile>
          </PermissionProvider>
        </>),
        child: <AttachmentList user={props.user} newFileAttachment={newFileAttachment} setFileAttachment={() => setNewFileAttachment([])} />
      };
    case 'INQUIRY_FORM':
      return {
        status: openInquiryForm,
        toggleForm: (status) => dispatch(FormActions.toggleCreateInquiry(status)),
        fabTitle: 'Inquiry Form',
        title: 'Inquiry Creation',
        field: 'INQUIRY_FORM',
        child: <InquiryForm />
      };
    default:
      return {
        status: inquiry?.id === currentInq?.id,
        toggleForm: () => { },
        fabTitle: getField?.label,
        title: getField?.value ? getKeyByValue(metadata['field'], getField?.value) : '',
        field: getField?.value,
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
      const getField = metadata.field_options.find((field) => fieldId === field.value);
      return getField && getField.label;
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
    const getField = metadata.field_options.find((field) => currentInq.field === field.value);
    dispatch(InquiryActions.setField(currentInq.field));
    const popupObj = Object.keys(toggleFormType).includes(inqId)
      ? { toggleForm: toggleFormType[inqId] }
      : popupOpen(currentInq, getField);
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
              const getField = metadata.field_options.find(
                (field) => inquiry.field === field.value
              );
              if (inquiry.field === 'EMAIL') {
                return <SendInquiryForm field={'EMAIL'} key={inquiry.id} />;
              } else if (inquiry.field === 'INQUIRY_REVIEW') {
                return <InquiryReview field={'INQUIRY_REVIEW'} key={inquiry.id} />;
              } else {
                const popupObj = popupOpen(inquiry, getField);
                return (
                  <Form
                    key={inquiry.id}
                    open={popupObj.status}
                    toggleForm={popupObj.toggleForm}
                    FabTitle={popupObj.fabTitle}
                    hasAddButton={popupObj.hasAddButton}
                    field={popupObj.field}
                    popoverfooter={popupObj.popoverfooter}
                    customActions={popupObj.customActions}
                    title={popupObj.title}>
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
              <BLField id={getField('SHIPPER/EXPORTER')} multiline={true} rows={5}>
                {getValueField('SHIPPER/EXPORTER')}
              </BLField>
            </Grid>
            <Grid item>
              <Label>Consignee</Label>
              <BLField id={getField('CONSIGNEE')} multiline={true} rows={5}>
                {getValueField('CONSIGNEE')}
              </BLField>
            </Grid>
            <Grid item>
              <Label>
                {`NOTIFY PARTY (It is agreed that no responsibility shall be attached to the`}{' '}
                <br></br>
                {`Carrier or its Agents for failure to notify`}
              </Label>
              <BLField id={getField('NOTIFY PARTY')} multiline={true} rows={5}>
                {getValueField('NOTIFY PARTY')}
              </BLField>
            </Grid>
            <Grid container style={{ marginTop: '53px' }}>
              <Grid item xs={6} className={classes.leftPanel}>
                <Grid item>
                  <Label>PRE-CARRIAGE BY</Label>
                  <BLField id={getField('PRE-CARRIAGE BY')}>
                    {getValueField('PRE-CARRIAGE BY')}
                  </BLField>
                </Grid>
                <Grid item>
                  <Label>PORT OF LOADING</Label>
                  <BLField id={getField('PORT OF LOADING')}>
                    {getValueField('PORT OF LOADING')}
                  </BLField>
                </Grid>
              </Grid>
              <Grid item xs={6} className={classes.rightPanel}>
                <Grid item>
                  <Label>PLACE OF RECEIPT</Label>
                  <BLField id={getField('PLACE OF RECEIPT')}>
                    {getValueField('PLACE OF RECEIPT')}
                  </BLField>
                </Grid>
                <Grid item>
                  <Label>PORT OF DISCHARGE</Label>
                  <BLField id={getField('PORT OF DISCHARGE')}>
                    {getValueField('PORT OF DISCHARGE')}
                  </BLField>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} className={classes.rightPanel}>
            <Grid container>
              <Grid item xs={6} className={classes.leftPanel}>
                <Label>BOOKING NO.</Label>
                <BLField id="booking_no" lock={true}>{myBL.bkgNo}</BLField>
              </Grid>
              <Grid item xs={6} className={classes.rightPanel}>
                <Label>SEA WAYBILL NO.</Label>
                <BLField lock={true}>{myBL.bkgNo && `ONYE${myBL.bkgNo}`}</BLField>
              </Grid>
            </Grid>
            <Grid item>
              <Label>
                {`EXPORT REFERENCES (for the Merchant's and/or Carrier's reference only.`} <br></br>
                {`See back clause 8. (4.)`}
              </Label>
              <BLField id={getField('EXPORT REFERENCES')} multiline={true} rows={2}></BLField>
            </Grid>
            <Grid item>
              <Label>FORWARDING AGENT-REFERENCES FMC NO.</Label>
              <BLField id={getField('FORWARDING AGENT-REFERENCES')} multiline={true} rows={5}>
                {getValueField('FORWARDING AGENT-REFERENCES')}
              </BLField>
            </Grid>
            <Grid item>
              <Label>{`FINAL DESTINATION (for line merchant's reference only)`}</Label>
              <BLField id={getField('FINAL DESTINATION')}>
                {getValueField('FINAL DESTINATION')}
              </BLField>
            </Grid>
            <Grid item>
              <Label>
                {`TYPE OF MOMENT (IF MIXED, USE DESCRIPTION OF PACKAGES AND`} <br></br>
                {`GOODS FIELD)`}
              </Label>
              <BLField id={getField('TYPE OF MOVEMENT')}>
                {getValueField('TYPE OF MOVEMENT')}
              </BLField>
            </Grid>
            <Grid item>
              <Grid item>
                <Label>OCEAN VESSEL VOYAGE NO. FlAG</Label>
                <BLField id={getField('OCEAN VESSEL VOYAGE NO. FLAG')} width={`calc(50% - 15px)`}>
                  {getValueField('OCEAN VESSEL VOYAGE NO. FLAG')}
                </BLField>
              </Grid>
            </Grid>
            <Grid item xs={6} className={classes.leftPanel}>
              <Label>PLACE OF DELIVERY</Label>
              <BLField id={getField('PLACE OF DELIVERY')}>
                {getValueField('PLACE OF DELIVERY')}
              </BLField>
            </Grid>
          </Grid>
        </Grid>

        <Divider className={classes.divider} />

        <Grid container spacing={2}>
          <Grid container alignItems="center" justify="center">
            <h2 className={classes.grayText}>PARTICULARS DECLARED BY SHIPPER BUT NOT ACKNOWLEDGED BY THE CARRIER</h2>
          </Grid>
          {/* Table CD */}
          <TableCD containerDetail={getValueField(CONTAINER_DETAIL)} id={getField(CONTAINER_DETAIL)} />
        </Grid>

        <hr style={{ borderTop: '2px dashed #515E6A', marginTop: '2rem', marginBottom: '3rem' }} />

        <Grid container spacing={2}>
          {/* Table CM */}
          <TableCM containerManifest={getValueField(CONTAINER_MANIFEST)} id={getField(CONTAINER_MANIFEST)} />
        </Grid>

        <Grid container spacing={6} className='mt-20'>
          <Grid container alignItems="center" justify="center">
            <h2 className={classes.grayText}>** TO BE CONTINUED ON ATTACHED LIST **</h2>
          </Grid>
        </Grid>
        <Grid style={{padding:0}} container spacing={6}>
          <Grid style={{paddingTop:0, paddingBottom: 0}} item xs={3}>
            <Label style={{fontFamily: 'Montserrat',fontWeight:600, fontSize: 14, color: '#D93025'}}>Declared Cargo Value US $</Label>
          </Grid>
          <Grid style={{paddingTop:0, paddingBottom: 0}} item xs={9} alignItems="flex-end" justify="center">
            <Label style={{textAlign: 'right', fontFamily: 'Montserrat',fontWeight:600, fontSize: 14, color: '#D93025'}}>{"If Merchant enters a value, Carrier's limitation of liability shall not apply and the ad valorem rate will be charged"}</Label>
          </Grid>
        </Grid>
        <Divider className="my-32" />
        <Grid container spacing={6}>
          <Grid item xs={6}>
            <Grid item>
              <Label>FREIGHT & CHARGES PAYABLE AT / BY:</Label>
              <BLField></BLField>
            </Grid>
            <Grid container spacing={6}>
              <Grid item xs={6} className={classes.pbGridItem}>
                <Label>COMMODITY CODE</Label>
                <BLField></BLField>
              </Grid>
              <Grid item xs={6} className={classes.pbGridItem}>
                <Label>EXCHANGE RATE</Label>
                <BLField></BLField>
              </Grid>
              <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
                <Label>FREIGHTED AS</Label>
                <BLField></BLField>
              </Grid>
              <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
                <Label>RATE</Label>
                <BLField></BLField>
              </Grid>
              <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
                <Label>DATE CARGO RECEIVED</Label>
                <BLField></BLField>
              </Grid>
              <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
                <Label>DATE LADEN ON BOARD</Label>
                <BLField></BLField>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container spacing={6}>
              <Grid item xs={6} className={classes.pbGridItem}>
                <Label>SERVICE CONTRACT NO.</Label>
                <BLField></BLField>
              </Grid>
              <Grid item xs={6} className={classes.pbGridItem}>
                <Label>DOC FORM NO.</Label>
                <BLField></BLField>
              </Grid>
              <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
                <Label>CODE</Label>
                <BLField></BLField>
              </Grid>
              <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
                <Label>TARIFF ITEM</Label>
                <BLField></BLField>
              </Grid>
              <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
                <Label>PREPAID</Label>
                <BLField></BLField>
              </Grid>
              <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
                <Label>COLLECT</Label>
                <BLField></BLField>
              </Grid>
              <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
                <Label>PLACE OF BILL(S) ISSUE</Label>
                <BLField></BLField>
              </Grid>
              <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
                <Label>DATED</Label>
                <BLField></BLField>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
};
export default BLWorkspace;
