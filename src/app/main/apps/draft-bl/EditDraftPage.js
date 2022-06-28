import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Divider, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import * as AppActions from 'app/store/actions';
import { getKeyByValue } from '@shared';

import * as Actions from './store/actions';
import Label from './components/FieldLabel';
import BLField from './components/BLField';
import BLFieldForm from "./components/BLFieldForm";
import Form from './components/Form';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '1170px',
    margin: '0 auto'
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
    textAlign: 'center',
    color: '#69696E'
  },
  sendArea: {
    textAlign: 'center',
    paddingBottom: 70
  },
  titleSend: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 16,
    color: '#BD0F72',
    marginBottom: 10
  },
  btnSend: {
    width: '145px',
    background: '#BD0F72',
    borderRadius: 8,
    fontSize: 16,
    color: '#FFFFFF',
    fontStyle: 'normal',
    '&:hover': {
      background: '#BD0F72'
    }
  }
}));

const EditDraftPage = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [metadata, content, openDraftBL, currentBLField, contentEdit, contentChanged] = useSelector(({ draftBL }) => [
    draftBL.metadata,
    draftBL.content,
    draftBL.openDraftBL,
    draftBL.currentBLField,
    draftBL.contentEdit,
    draftBL.contentChanged,
  ]);
  const [titleField, setTitleField] = useState();
  const [contentField, setContentField] = useState();

  const getField = (field) => {
    return metadata.field ? metadata.field[field] : '';
  };

  const getValueField = (field) => {
    return contentEdit[getField(field)] || '';
  };

  useEffect(() => {
    dispatch(AppActions.setDefaultSettings(_.set({}, 'layout.config.toolbar.display', true)));
    dispatch(Actions.loadMetadata());
    dispatch(Actions.loadContent(window.location.pathname.split('/')[4]));
  }, []);

  useEffect(() => {
    if (currentBLField) {
      setTitleField(getKeyByValue(metadata['field'], currentBLField));
      setContentField(contentEdit[currentBLField]);
    }
  }, [currentBLField]);

  const handleGetValue = (value) => {
    setContentField(value)
  }

  const handleSave = () => {
    const newTxt = {...contentEdit};
    if (newTxt[currentBLField] === contentField) {
      dispatch(Actions.toggleDraftBLEdit(false));
      return;
    }
    newTxt[currentBLField] = contentField;
    dispatch(Actions.setNewContent(newTxt));
    //
    const newTxtChanged = {...contentChanged, [currentBLField]: contentField};
    dispatch(Actions.setNewContentChanged(newTxtChanged));
    dispatch(Actions.toggleDraftBLEdit(false));
  }

  return (
    <div className={clsx('max-w-5xl', classes.root)}>
      <Form
        open={openDraftBL}
        toggleForm={(status) => dispatch(Actions.toggleDraftBLEdit(status))}
        title={titleField}
        handleSave={handleSave}
      >
        <BLFieldForm getValueFieldChange={handleGetValue}/>
      </Form>

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
              NOTIFY PARTY (It is agreed that no responsibility shall be <br /> attached to the
              Carrier or its Agents for failure to notify
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
              <BLField id="booking_no" lock={true}>
                TYOBD9739500
              </BLField>
            </Grid>
            <Grid item xs={6} className={classes.rightPanel}>
              <Label>SEA WAYBILL NO.</Label>
              <BLField id="seal_no" lock={true}>
                ONEYTYOBD9739500
              </BLField>
            </Grid>
          </Grid>
          <Grid item>
            <Label>
              {`EXPORT REFERENCES (for the Merchant's and/or Carrier's`}
              <br />
              {`reference only. See back clause 8. (4.)`}
            </Label>
            <BLField id={getField('EXPORT REFERENCES')} multiline={true} rows={2}>
              {getValueField('EXPORT REFERENCES')}
            </BLField>
          </Grid>
          <Grid item>
            <Label>FORWARDING AGENT-REFERENCES FMC NO.</Label>
            <BLField id={getField('FORWARDING AGENT-REFERENCES')} multiline={true} rows={5}>
              {getValueField('FORWARDING AGENT-REFERENCES')}
            </BLField>
          </Grid>
          <Grid item>
            <Label>{`FINAL DESTINATION(for line merchant's reference only)`}</Label>
            <BLField id={getField('FINAL DESTINATION')}>
              {getValueField('FINAL DESTINATION')}
            </BLField>
          </Grid>
          <Grid item>
            <Label>
              {`TYPE OF MOMENT (IF MIXED, USE DESCRIPTION OF`}
              <br />
              {`PACKAGES AND GOODS FIELD`}
            </Label>
            <BLField id={getField('TYPE OF MOVEMENT')}>{getValueField('TYPE OF MOVEMENT')}</BLField>
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

      <Divider style={{ marginTop: 30 }} />

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

      <Divider style={{ margin: '30px 0' }} />

      <h2 className={classes.grayText} style={{ margin: 0 }}>
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

      <Divider style={{ marginTop: 30 }} />

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

      <Divider style={{ marginTop: 60, marginBottom: 30 }} />

      <Grid container className={classes.sendArea}>
        <Grid item xs={12} className={classes.titleSend}>
          If all data is correct please click the Send button
        </Grid>
        <Grid item xs={12}>
          <Button className={classes.btnSend}>Send</Button>
        </Grid>
      </Grid>
    </div>
  );
};
export default EditDraftPage;
