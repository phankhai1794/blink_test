import { getKeyByValue } from '@shared';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import * as AppActions from 'app/store/actions';

import * as Actions from '../store/actions';
import * as FormActions from '../store/actions/form';
import * as TransActions from '../store/actions/transaction';

import Inquiry from './Inquiry';
import AllInquiry from './AllInquiry';
import Form from './Form';
import Label from './FieldLabel';
import BLField from './BLField';
import InquiryForm from './InquiryForm';

import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import _ from 'lodash';
import { Grid, Divider } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: '150px',
    paddingRight: '200px'
  },
  leftPanel: {
    paddingRight: '35px'
  },
  rightPanel: {
    paddingLeft: '35px'
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
  const [content, setContent] = useState({});
  const [currentField, metadata, myBL] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.currentField,
    workspace.inquiryReducer.metadata,
    workspace.inquiryReducer.myBL
  ]);
  const [openInquiry, openAllInquiry, reload, success, fail] = useSelector(({ workspace }) => [
    workspace.formReducer.openInquiry,
    workspace.formReducer.openAllInquiry,
    workspace.formReducer.reload,
    workspace.formReducer.success,
    workspace.formReducer.fail
  ]);

  const { transAutoSaveStatus } = useSelector(({ workspace }) => workspace.transReducer);

  const getField = (field) => {
    return metadata.field ? metadata.field[field] : '';
  };

  const getValueField = (field) => {
    return content[getField(field)] || '';
  };

  useEffect(() => {
    if (success) {
      dispatch(FormActions.displaySuccess(false));
      dispatch(
        AppActions.showMessage({ message: 'Save inquiry successfully', variant: 'success' })
      );
    }
    if (fail.open) {
      dispatch(FormActions.displayFail(false, ''));
      dispatch(AppActions.showMessage({ message: fail.message, variant: 'error' }));
    }
    if (myBL.id) {
      dispatch(Actions.loadInquiry(myBL.id));
    }
  }, [reload, myBL]);

  useEffect(() => {
    if (myBL.id) {
      dispatch(TransActions.setStatusTransaction('start'));
      Actions.loadBlInfo(myBL.id, setContent);
    }
  }, [myBL]);

  useEffect(() => {
    setInterval(() => {
      if (myBL.id && transAutoSaveStatus === 'start') {
        dispatch(TransActions.BlTrans(myBL.id, content));
      }
    }, 30000);
  }, [transAutoSaveStatus]);

  useEffect(() => {
    dispatch(AppActions.setDefaultSettings(_.set({}, 'layout.config.toolbar.display', true)));
    dispatch(
      AppActions.checkAllow(PermissionProvider({ action: PERMISSION.VIEW_ACCESS_WORKSPACE }))
    );
    dispatch(Actions.loadMetadata());

    const bkgNo = window.location.pathname.split('/')[3];
    dispatch(Actions.initBL(bkgNo));
  }, []);

  return (
    <div className={classes.root}>
      <InquiryForm FabTitle="Inquiry Form" />

      <Form
        open={openInquiry}
        toggleForm={(status) => dispatch(FormActions.toggleInquiry(status))}
        hasAddButton={openAllInquiry}
        FabTitle="Inquiry"
        field={currentField || ''}
        title={
          openAllInquiry
            ? 'All Inquiries'
            : currentField
              ? getKeyByValue(metadata['field'], currentField)
              : ''
        }>
        {openAllInquiry ? <AllInquiry user="workspace" /> : <Inquiry user="workspace" />}
      </Form>

      <Grid container>
        <Grid item xs={6} className={classes.leftPanel}>
          <Grid item>
            <BLField
              label="Shipper/Exporter"
              id={getField('SHIPPER/EXPORTER')}
              multiline={true}
              rows={5}>
              {getValueField('SHIPPER/EXPORTER')}
            </BLField>
          </Grid>
          <Grid item>
            <BLField label="Consignee" id={getField('CONSIGNEE')} multiline={true} rows={5}>
              {getValueField('CONSIGNEE')}
            </BLField>
          </Grid>
          <Grid item>
            <BLField
              label={
                <>
                  {`NOTIFY PARTY (It is agreed that no responsibility shall be`} <br></br>
                  {`attached to the Carrier or its Agents for failure to notify`})
                </>
              }
              id={getField('NOTIFY PARTY')}
              multiline={true}
              rows={5}>
              {getValueField('NOTIFY PARTY')}
            </BLField>
          </Grid>
          <Grid container style={{ marginTop: '60px' }}>
            <Grid item xs={6} className={classes.leftPanel}>
              <Grid item>
                <BLField label="PRE-CARRIAGE BY" id={getField('PRE-CARRIAGE BY')}></BLField>
              </Grid>
              <Grid item>
                <BLField label="PORT OF LOADING" id={getField('PORT OF LOADING')}>
                  {getValueField('PORT OF LOADING')}
                </BLField>
              </Grid>
            </Grid>
            <Grid item xs={6} className={classes.rightPanel}>
              <Grid item>
                <BLField label="PLACE OF RECEIPT" id={getField('PLACE OF RECEIPT')}>
                  {getValueField('PLACE OF RECEIPT')}
                </BLField>
              </Grid>
              <Grid item>
                <BLField label="PORT OF DISCHARGE" id={getField('PORT OF DISCHARGE')}>
                  {getValueField('PORT OF DISCHARGE')}
                </BLField>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6} className={classes.rightPanel}>
          <Grid container>
            <Grid item xs={6} className={classes.leftPanel}>
              <BLField label="BOOKING NO." id="booking_no" lock={true}>
                TYOBD9739500
              </BLField>
            </Grid>
            <Grid item xs={6} className={classes.rightPanel}>
              <BLField label="SEA WAYBILL NO.">ONEYTYOBD9739500</BLField>
            </Grid>
          </Grid>
          <Grid item>
            <BLField
              label={
                <>
                  {`EXPORT REFERENCES (for the Merchant's and/or Carrier's`} <br></br>
                  {`reference only. See back clause 8. (4.)`})
                </>
              }
              id={getField('EXPORT REFERENCES')}
              multiline={true}
              rows={2}></BLField>
          </Grid>
          <Grid item>
            <BLField
              label="FORWARDING AGENT-REFERENCES FMC NO."
              id={getField('FORWARDING AGENT-REFERENCES')}
              multiline={true}
              rows={5}>
              {getValueField('FORWARDING AGENT-REFERENCES')}
            </BLField>
          </Grid>
          <Grid item>
            <BLField
              label={`FINAL DESTINATION(for line merchant's reference only)`}
              id={getField('FINAL DESTINATION')}>
              {getValueField('FINAL DESTINATION')}
            </BLField>
          </Grid>
          <Grid item>
            <BLField
              label={
                <>
                  TYPE OF MOMENT (IF MIXED, USE DESCRIPTION OF <br></br> PACKAGES AND GOODS FIELD)
                </>
              }
              id={getField('TYPE OF MOVEMENT')}>
              {getValueField('TYPE OF MOVEMENT')}
            </BLField>
          </Grid>
          <Grid item>
            <Grid item>
              <BLField
                label="OCEAN VESSEL VOYAGE NO. FlAG"
                id={getField('OCEAN VESSEL VOYAGE NO. FLAG')}
                width={`calc(50% - 35px)`}>
                {getValueField('OCEAN VESSEL VOYAGE NO. FLAG')}
              </BLField>
            </Grid>
          </Grid>
          <Grid item xs={6} className={classes.leftPanel}>
            <BLField label="PLACE OF DELIVERY" id={getField('PLACE OF DELIVERY')}>
              {getValueField('PLACE OF DELIVERY')}
            </BLField>
          </Grid>
        </Grid>
      </Grid>

      <Divider className={classes.divider} />

      <Grid container spacing={4}>
        <Grid item xs={2}>
          <Label className="my-0">CONTAINER NO.</Label>
        </Grid>
        <Grid item xs={2}>
          <Label className="my-0">SEAL NO.</Label>
        </Grid>
        <Grid item xs={2}>
          <Label className="my-0">PACKAGE</Label>
        </Grid>
        <Grid item xs={1}>
          <Label className="my-0">MODE</Label>
        </Grid>
        <Grid item xs={1}>
          <Label className="my-0">TYPE</Label>
        </Grid>
        <Grid item xs={2}>
          <Label className="my-0">MEASUREMENT</Label>
        </Grid>
        <Grid item xs={2}>
          <Label className="my-0">WEIGHT</Label>
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={2}>
          <BLField>SEGU5048074</BLField>
        </Grid>
        <Grid item xs={2}>
          <BLField>JPC074647</BLField>
        </Grid>
        <Grid item xs={2}>
          <BLField></BLField>
        </Grid>
        <Grid item xs={1}>
          <BLField>FCL / FCL</BLField>
        </Grid>
        <Grid item xs={1}>
          <BLField>40HQ</BLField>
        </Grid>
        <Grid item xs={2}>
          <BLField>3,560 CBM</BLField>
        </Grid>
        <Grid item xs={2}>
          <BLField>1,716.000 KGS</BLField>
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={2}>
          <BLField>SEGU5048074</BLField>
        </Grid>
        <Grid item xs={2}>
          <BLField>JPC074647</BLField>
        </Grid>
        <Grid item xs={2}>
          <BLField></BLField>
        </Grid>
        <Grid item xs={1}>
          <BLField>FCL / FCL</BLField>
        </Grid>
        <Grid item xs={1}>
          <BLField>40HQ</BLField>
        </Grid>
        <Grid item xs={2}>
          <BLField>3,560 CBM</BLField>
        </Grid>
        <Grid item xs={2}>
          <BLField>1,716.000 KGS</BLField>
        </Grid>
      </Grid>

      <Divider className="my-32" />

      <h2 className={classes.grayText}>
        PARTICULARS DECLARED BY SHIPPER BUT NOT ACKNOWLEDGED BY THE CARRIER
      </h2>
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <Grid item>
            <Label>CNTR. NOS. W/SEAL NOS. MARKS & NUMBERS</Label>
            <BLField>
              DSV AIR & SEA CO. LTD. AS AGENT OF DSV OCEAN TRANSPORT A/S 3F IXINAL MONZEN-NAKACHO
              BLDG.2-5-4 FUKUZUMI, KOTO-KU, TOKYO,135-0032, JAPAN
            </BLField>
          </Grid>
          <Grid item>
            <Label>QUANTITY (FOR CUSTOMERS DECLARATION ONLY)</Label>
            <BLField>12 PALLETS</BLField>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid item>
            <Label>CNTR. NOS. W/SEAL NOS. MARKS & NUMBERS</Label>
            <BLField>
              DSV AIR & SEA CO. LTD. AS AGENT OF DSV OCEAN TRANSPORT A/S 3F IXINAL MONZEN-NAKACHO
              BLDG.2-5-4 FUKUZUMI, KOTO-KU, TOKYO,135-0032, JAPAN
            </BLField>
          </Grid>
          <Grid container spacing={6}>
            <Grid item xs={6}>
              <Label>GROSS WEIGHT</Label>
              <BLField>509.000KGS</BLField>
            </Grid>
            <Grid item xs={6}>
              <Label>GROSS MEASUREMENT</Label>
              <BLField>19.888CBM</BLField>
            </Grid>
          </Grid>
        </Grid>
        <Grid container alignItems="center" justify="center">
          <h2 className={classes.grayText}>** TO BE CONTINUED ON ATTACHED LIST **</h2>
        </Grid>
      </Grid>

      <Divider className="my-32" />

      <Grid container spacing={6}>
        <Grid item xs={6}>
          <Grid item>
            <Label>FREIGHT & CHARGES PAYABLE AT / BY:</Label>
            <BLField>TOKYO, TOKYO SEUOL</BLField>
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
              <BLField>31 AUG 2021</BLField>
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
              <BLField>TOKYO</BLField>
            </Grid>
            <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
              <Label>DATED</Label>
              <BLField>31 AUG 2021</BLField>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
export default BLWorkspace;
