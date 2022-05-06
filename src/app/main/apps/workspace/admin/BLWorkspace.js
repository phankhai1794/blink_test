import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import _ from 'lodash';

import { useDispatch, useSelector } from 'react-redux';
import * as AppActions from 'app/store/actions';
import * as Actions from './store/actions';
import * as FormActions from './store/actions/form';

import { Grid, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Inquiry from '../shared-components/Inquiry';
import AllInquiry from '../shared-components/AllInquiry';
import Form from '../shared-components/Form';
import { getKeyByValue, displayToast } from '@shared';
import InquiryForm from './InquiryForm';
import AddPopover from './components/AddPopover';
import BLField from './components/BLField';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import { getBlInfo } from 'app/services/myBLService';

const useStyles = makeStyles((theme) => ({
  ptGridItem: {
    paddingTop: '0 !important'
  },
  pbGridItem: {
    paddingBottom: '0 !important'
  },
  grayText: {
    color: '#69696E'
  }
}));

const BLWorkspace = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [content, setContent] = useState({});
  const [currentField, metadata, myBL] = useSelector((state) => [
    state.workspace.inquiryReducer.currentField,
    state.workspace.inquiryReducer.metadata,
    state.workspace.inquiryReducer.myBL
  ]);
  const [minimize, openInquiry, openAllInquiry, reload, success, fail] = useSelector((state) => [
    state.workspace.formReducer.minimize,
    state.workspace.formReducer.openInquiry,
    state.workspace.formReducer.openAllInquiry,
    state.workspace.formReducer.reload,
    state.workspace.formReducer.success,
    state.workspace.formReducer.fail
  ]);
  const getField = (field) => {
    return metadata.field ? metadata.field[field] : '';
  };

  const getValueField = (field) => {
    return content[getField(field)] || '';
  };
  useEffect(() => {
    if (success) {
      dispatch(FormActions.displaySuccess(false));
      displayToast('success', 'Save inquiry successfully');
    }
    if (fail.open) {
      dispatch(FormActions.displayFail(false, ''));
      displayToast('error', fail.message);
    }
    if (myBL.id) {
      dispatch(Actions.loadInquiry(myBL.id));
    }
  }, [reload, myBL]);

  useEffect(() => {
    if (myBL.id) {
      getBlInfo(myBL.id).then((res) => {
        setContent(res.myBL);
      });
    }
  }, [myBL]);

  useEffect(() => {
    dispatch(
      AppActions.checkAllow(PermissionProvider({ action: PERMISSION.VIEW_ACCESS_WORKSPACE }))
    );
    dispatch(Actions.loadMetadata());

    const bkgNo = window.location.pathname.split('/')[3];
    dispatch(Actions.initBL(bkgNo));
  }, []);

  return (
    <div className="px-52">
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
        }
      >
        {openAllInquiry ? <AllInquiry user="workspace" /> : <Inquiry user="workspace" />}
      </Form>

      {!minimize && <AddPopover />}
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <Grid item>
            <h3>Shipper/Exporter</h3>
            <BLField id={getField('SHIPPER/EXPORTER')} multiline={true} rows={5}>
              {getValueField('SHIPPER/EXPORTER')}
            </BLField>
          </Grid>
          <Grid item>
            <h3>Consignee</h3>
            <BLField id={getField('CONSIGNEE')} multiline={true} rows={5}>
              {getValueField('CONSIGNEE')}
            </BLField>
          </Grid>
          <Grid item>
            <h3>
              NOTIFY PARTY (It is agreed that no responsibility shall be <br></br> attached to the
              Carrier or its Agents for failure to notify)
            </h3>
            <BLField id={getField('NOTIFY PARTY')} multiline={true} rows={5}>
              {getValueField('NOTIFY PARTY')}
            </BLField>
          </Grid>
          <Grid container spacing={6}>
            <Grid item xs={6} className={classes.pbGridItem}>
              <h3>PRE-CARRIAGE BY</h3>
              <BLField id={getField('PRE-CARRIAGE BY')}></BLField>
            </Grid>
            <Grid item xs={6} className={classes.pbGridItem}>
              <h3>PLACE OF RECEIPT</h3>
              <BLField id={getField('PLACE OF RECEIPT')}>
                {getValueField('PLACE OF RECEIPT')}
              </BLField>
            </Grid>
            <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
              <h3>OCEAN VESSEL VOYAGE NO. FlAG</h3>
              <BLField id={getField('OCEAN VESSEL VOYAGE NO. FLAG')}>
                {getValueField('OCEAN VESSEL VOYAGE NO. FLAG')}
              </BLField>
            </Grid>
            <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
              <h3>PORT OF LOADING</h3>
              <BLField id={getField('PORT OF LOADING')}>{getValueField('PORT OF LOADING')}</BLField>
            </Grid>
            <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
              <h3>PORT OF DISCHARGE</h3>
              <BLField id={getField('PORT OF DISCHARGE')}>
                {getValueField('PORT OF DISCHARGE')}
              </BLField>
            </Grid>
            <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
              <h3>PLACE OF DELIVERY</h3>
              <BLField id={getField('PLACE OF DELIVERY')}>
                {getValueField('PLACE OF DELIVERY')}
              </BLField>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={6}>
            <Grid item xs={6}>
              <h3>BOOKING NO.</h3>
              <BLField id="booking_no">TYOBD9739500</BLField>
            </Grid>
            <Grid item xs={6}>
              <h3>SEA WAYBILL NO.</h3>
              <BLField>ONEYTYOBD9739500</BLField>
            </Grid>
          </Grid>
          <Grid item>
            <h3>
              EXPORT REFERENCES (for the merchant's and/or Carrier's reference only. See back clause
              8. (4.))
            </h3>
            <BLField id={getField('EXPORT REFERENCES')} multiline={true} rows={2}></BLField>
          </Grid>
          <Grid item>
            <h3>FORWARDING AGENT-REFERENCES FMC NO.</h3>
            <BLField id={getField('FORWARDING AGENT-REFERENCES')} multiline={true} rows={5}>
              {getValueField('FORWARDING AGENT-REFERENCES')}
            </BLField>
          </Grid>
          <Grid item>
            <h3>FINAL DESTINATION(for line merchant's reference only)</h3>
            <BLField id={getField('FINAL DESTINATION')}>
              {getValueField('FINAL DESTINATION')}
            </BLField>
          </Grid>
          <Grid item>
            <h3>
              TYPE OF MOMENT (IF MIXED, USE DESCRIPTION OF <br></br> PACKAGES AND GOODS FIELD)
            </h3>
            <BLField id={getField('TYPE OF MOVEMENT')}>{getValueField('TYPE OF MOVEMENT')}</BLField>
          </Grid>
        </Grid>
      </Grid>

      <Divider className="mt-60 mb-32" />

      <Grid container spacing={4}>
        <Grid item xs={2}>
          <h3 className="my-0">CONTAINER NO.</h3>
        </Grid>
        <Grid item xs={2}>
          <h3 className="my-0">SEAL NO.</h3>
        </Grid>
        <Grid item xs={2}>
          <h3 className="my-0">PACKAGE</h3>
        </Grid>
        <Grid item xs={1}>
          <h3 className="my-0">MODE</h3>
        </Grid>
        <Grid item xs={1}>
          <h3 className="my-0">TYPE</h3>
        </Grid>
        <Grid item xs={2}>
          <h3 className="my-0">MEASUREMENT</h3>
        </Grid>
        <Grid item xs={2}>
          <h3 className="my-0">WEIGHT</h3>
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
            <h3>CNTR. NOS. W/SEAL NOS. MARKS & NUMBERS</h3>
            <BLField>
              DSV AIR & SEA CO. LTD. AS AGENT OF DSV OCEAN TRANSPORT A/S 3F IXINAL MONZEN-NAKACHO
              BLDG.2-5-4 FUKUZUMI, KOTO-KU, TOKYO,135-0032, JAPAN
            </BLField>
          </Grid>
          <Grid item>
            <h3>QUANTITY (FOR CUSTOMERS DECLARATION ONLY)</h3>
            <BLField>12 PALLETS</BLField>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid item>
            <h3>CNTR. NOS. W/SEAL NOS. MARKS & NUMBERS</h3>
            <BLField>
              DSV AIR & SEA CO. LTD. AS AGENT OF DSV OCEAN TRANSPORT A/S 3F IXINAL MONZEN-NAKACHO
              BLDG.2-5-4 FUKUZUMI, KOTO-KU, TOKYO,135-0032, JAPAN
            </BLField>
          </Grid>
          <Grid container spacing={6}>
            <Grid item xs={6}>
              <h3>GROSS WEIGHT</h3>
              <BLField>509.000KGS</BLField>
            </Grid>
            <Grid item xs={6}>
              <h3>GROSS MEASUREMENT</h3>
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
            <h3>FREIGHT & CHARGES PAYABLE AT / BY:</h3>
            <BLField>TOKYO, TOKYO SEUOL</BLField>
          </Grid>
          <Grid container spacing={6}>
            <Grid item xs={6} className={classes.pbGridItem}>
              <h3>COMMODITY CODE</h3>
              <BLField></BLField>
            </Grid>
            <Grid item xs={6} className={classes.pbGridItem}>
              <h3>EXCHANGE RATE</h3>
              <BLField></BLField>
            </Grid>
            <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
              <h3>FREIGHTED AS</h3>
              <BLField></BLField>
            </Grid>
            <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
              <h3>RATE</h3>
              <BLField></BLField>
            </Grid>
            <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
              <h3>DATE CARGO RECEIVED</h3>
              <BLField></BLField>
            </Grid>
            <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
              <h3>DATE LADEN ON BOARD</h3>
              <BLField>31 AUG 2021</BLField>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={6}>
            <Grid item xs={6} className={classes.pbGridItem}>
              <h3>SERVICE CONTRACT NO.</h3>
              <BLField></BLField>
            </Grid>
            <Grid item xs={6} className={classes.pbGridItem}>
              <h3>DOC FORM NO.</h3>
              <BLField></BLField>
            </Grid>
            <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
              <h3>CODE</h3>
              <BLField></BLField>
            </Grid>
            <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
              <h3>TARIFF ITEM</h3>
              <BLField></BLField>
            </Grid>
            <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
              <h3>PREPAID</h3>
              <BLField></BLField>
            </Grid>
            <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
              <h3>COLLECT</h3>
              <BLField></BLField>
            </Grid>
            <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
              <h3>PLACE OF BILL(S) ISSUE</h3>
              <BLField>TOKYO</BLField>
            </Grid>
            <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
              <h3>DATED</h3>
              <BLField>31 AUG 2021</BLField>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
export default BLWorkspace;
