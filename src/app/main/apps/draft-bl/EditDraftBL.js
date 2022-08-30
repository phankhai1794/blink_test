import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { SHIPPER, CONSIGNEE, NOTIFY, EXPORT_REF, FORWARDING, PLACE_OF_RECEIPT, PORT_OF_LOADING, PORT_OF_DISCHARGE, PLACE_OF_DELIVERY, FINAL_DESTINATION, VESSEL_VOYAGE, PRE_CARRIAGE, TYPE_OF_MOVEMENT, CONTAINER_DETAIL, CONTAINER_MANIFEST, FREIGHT_CHARGES, PLACE_OF_BILL, FREIGHTED_AS, RATE, DATE_CARGO, DATE_LADEN, COMMODITY_CODE, EXCHANGE_RATE, SERVICE_CONTRACT_NO, DOC_FORM_NO, CODE, TARIFF_ITEM, PREPAID, COLLECT, DATED } from '@shared/keyword';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { getLabelById } from '@shared';
import * as AppActions from 'app/store/actions';

import * as Actions from './store/actions';
import Label from './components/FieldLabel';
import BLField from './components/BLField';
import BLFieldForm from './components/BLFieldForm';
import Form from './components/Form';
import Inquiry from './components/Inquiry';
import SendNotification from './components/SendNotification';

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
}));

const EditDraftPage = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const metadata = useSelector(({ draftBL }) => draftBL.metadata);
  const myBL = useSelector(({ draftBL }) => draftBL.myBL);
  const currentField = useSelector(({ draftBL }) => draftBL.currentField);
  const content = useSelector(({ draftBL }) => draftBL.content);
  const draftContent = useSelector(({ draftBL }) => draftBL.draftContent);
  const reload = useSelector(({ draftBL }) => draftBL.reload);

  const role = useSelector(({ user }) => user.role);
  const [titleField, setTitleField] = useState();
  const [data, setData] = useState();

  const getField = (field) => {
    return metadata.field ? metadata.field[field] : '';
  };

  const checkIsEdited = (state) => {
    return ((role !== 'Admin' && state === 'AME_DRF') || state === 'AME_SENT');
  }

  const getValueField = (field) => {
    const temp = draftContent.find((c) => c.field === getField(field))
    if (temp && checkIsEdited(temp.state)) return temp.content.content;
    return content[getField(field)] || '';
  };

  useEffect(() => {
    dispatch(AppActions.setDefaultSettings(_.set({}, 'layout.config.toolbar.display', true)));
    dispatch(Actions.loadMetadata());
    dispatch(Actions.loadContent(window.location.pathname.split('/')[4]));
    dispatch(Actions.toggleSendDraftBl(true));
    return () => {
      dispatch(Actions.toggleSendDraftBl(false));
    };
  }, []);

  useEffect(() => {
    dispatch(Actions.loadDraftContent(window.location.pathname.split('/')[4]));
  }, [reload])

  useEffect(() => {
    if (currentField) {
      setTitleField(getLabelById(metadata['field_options'], currentField));
      setData(draftContent.find((c) => c.field === currentField))
    }
  }, [currentField, draftContent]);

  return (
    <>
      <SendNotification />
      <div className={clsx('max-w-5xl', classes.root)}>
        <Form title={titleField}>
          {data && checkIsEdited(data.state) ?
            <Inquiry question={data} /> :
            <BLFieldForm />
          }
        </Form>

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
          {/* <TableCD
            containerDetail={getValueField(CONTAINER_DETAIL)}
            id={getField(CONTAINER_DETAIL)}
          /> */}
        </Grid>

        <hr style={{ borderTop: '2px dashed #515E6A', marginTop: '2rem', marginBottom: '3rem' }} />

        <Grid container spacing={2}>
          {/* <TableCM
            containerManifest={getValueField(CONTAINER_MANIFEST)}
            id={getField(CONTAINER_MANIFEST)}
          /> */}
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
export default EditDraftPage;
