import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import * as AppActions from 'app/store/actions';
import { PERMISSION, PermissionProvider } from '@shared/permission';

import * as Actions from './store/actions';
import Textarea from './components/Textarea';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    background: '#515E6A',
    height: '100%'
  },
  root: {
    fontFamily: 'Courier New',
    width: '1170px',
    background: 'white',
    margin: '20px auto',
    padding: 50
  },
  disabledText: {
    // color: theme.palette.secondary.contrastText,
    color: 'blue',
    fontSize: '1rem',
    textTransform: 'uppercase'
  },
  disabledText1: {
    // color: theme.palette.secondary.contrastText,
    color: 'blue',
    fontSize: '1.1rem',
    display: 'block',
    lineHeight: '1.2'
  },
  gridFull: {
    border: '1px solid blue'
  },
  grid: {
    borderTop: '1px solid blue',
    borderBottom: '1px solid blue'
  },
  gridLeft: {
    borderRight: '1px solid blue'
  },
  gridRight: {
    borderRight: '1px solid blue'
  },
  gridTop: {
    borderTop: '1px solid blue'
  },
  gridBottom: {
    borderBottom: '1px solid blue'
  },
  normalText: {
    textTransform: 'uppercase'
  }
}));

const DraftPage = () => {
  const { pathname } = window.location;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [containersDetail, setContainersDetail] = useState([]);
  const [containersManifest, setContainersManifest] = useState([]);
  const [metadata, myBL, content] = useSelector(({ draftBL }) => [
    draftBL.metadata,
    draftBL.myBL,
    draftBL.content
  ]);

  const getField = (field) => {
    return metadata.field ? metadata.field[field] : '';
  };

  const getValueField = (field) => {
    return content[getField(field)] || '';
  };

  const getInqType = (field) => {
    return metadata ? metadata.inq_type[field] : '';
  };

  useEffect(() => {
    dispatch(AppActions.setDefaultSettings(_.set({}, 'layout.config.toolbar.display', true)));
    dispatch(AppActions.checkAllow(PermissionProvider({ action: PERMISSION.VIEW_ACCESS_DRAFT_BL })));
    dispatch(Actions.loadMetadata());
    dispatch(Actions.loadContent(pathname.split('/')[pathname.includes('preview') ? 4 : 3]));
  }, []);

  useEffect(() => {
    if (Object.keys(content).length && Object.keys(metadata).length) {
      setContainersDetail(getValueField('Container Detail'));
      setContainersManifest(getValueField('Container Manifest'));
    }
  }, [metadata, content]);

  return (
    <div className={classes.wrapper}>
      <div className={classes.root}>
        <div className="flex mt-2">
          <div className="flex-auto">
            <img
              src="./assets/images/logos/one_ocean_network-logo.png"
              className="object-scale-down h-40 w-50 pt-24"
            />
          </div>
          <div className="flex-auto mr-2">
            <p className={`text-2xl font-extrabold`}>COPY NON NEGOTIABLE</p>
          </div>
          <div className="flex-auto">
            <p className={`text-2xl font-extrabold`}>SEA WAY BILL</p>
          </div>
        </div>
        <Grid container className={classes.grid}>
          <Grid item xs={6} className={`${classes.gridLeft} ${classes.gridBottom}`}>
            <h1 className={classes.disabledText}>shipper/exporter </h1>
            <Textarea
              id={getField('SHIPPER/EXPORTER')}
              rows={5}
              value={`${getValueField('SHIPPER/EXPORTER')}`}
              readOnly={true}
            />
          </Grid>
          <Grid item xs={6} className={classes.gridBottom}>
            <Grid container className={classes.gridBottom}>
              <Grid item xs={6} className={`${classes.gridLeft}`}>
                <h1
                  className={classes.disabledText}
                  style={{ display: 'inline-block', marginRight: 10 }}>
                  Booking no.
                </h1>
                <span>{myBL.bkgNo}</span>
              </Grid>
              <Grid item xs={6}>
                <h1
                  className={classes.disabledText}
                  style={{ display: 'inline-block', marginRight: 10 }}>
                  sea waybill no.
                </h1>
                <span>{myBL.bkgNo && `ONYE${myBL.bkgNo}`}</span>
              </Grid>
            </Grid>
            <Grid>
              <h1 className={classes.disabledText}>
                {`export references(for the merchant's and/or Carrier's reference only. See back clause 8.(4.))`}
              </h1>
              <Grid sx={{ height: '50px' }}>
                <Textarea
                  id={getField('EXPORT REFERENCES')}
                  rows={3}
                  value={`${getValueField('EXPORT REFERENCES')}`}
                  readOnly={true}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} className={`${classes.gridLeft} ${classes.gridBottom} `}>
            <h1 className={classes.disabledText}>consignee</h1>
            <Textarea
              id={getField('CONSIGNEE')}
              rows={5}
              value={`${getValueField('CONSIGNEE')}`}
              readOnly={true}
            />
          </Grid>
          <Grid item xs={6} className={`${classes.gridBottom}`}>
            <h1 className={classes.disabledText}>Forwarding agent-references FMC NO.</h1>
            <Textarea
              id={getField('FORWARDING AGENT-REFERENCES')}
              rows={5}
              value={`${getValueField('FORWARDING AGENT-REFERENCES')}`}
              readOnly={true}
            />
          </Grid>
          <Grid item xs={6} className={`${classes.gridLeft} ${classes.gridBottom}`}>
            <Grid container>
              <Grid item xs={12} className={`${classes.gridBottom}`}>
                <h1 className={classes.disabledText}>
                  Notify party (It is agreed that no responsibility shall be attached to the Carrier
                  or its Agents for failure to notify)
                </h1>
                <Textarea
                  id={getField('NOTIFY PARTY')}
                  rows={5}
                  value={`${getValueField('NOTIFY PARTY')}`}
                  readOnly={true}
                />
              </Grid>
              <Grid item xs={6} className={`${classes.gridLeft} `}>
                <h1 className={classes.disabledText}>pre-carriage by</h1>
                <Textarea
                  id={getField('PRE-CARRIAGE BY')}
                  rows={1}
                  value={`${getValueField('PRE-CARRIAGE BY')}`}
                  readOnly={true}
                />
              </Grid>
              <Grid item xs={6} style={{ paddingTop: '0px', paddingBottom: '78px' }}>
                <h1 className={classes.disabledText}>Place of Receipt</h1>
                <Textarea
                  id={getField('PLACE OF RECEIPT')}
                  rows={1}
                  value={`${getValueField('PLACE OF RECEIPT')}`}
                  readOnly={true}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} className={classes.gridBottom}>
            <span className={classes.disabledText1}>
              {`RECEIVED by the Carrier in apparent good order and condition (unless otherwise stated
            herein) the total number or quantity of Containers or other packages or units indicated
            in the box entitled "Carrier's Receipt",to be carried subject to all the terms and
            conditions hereof from the Place of Receipt or Port of Loading to thePort of Discharge
            or Place of Delivery, as applicable. Delivery of the Goods to the Carrier for
            Carriagehereunder constitutes acceptance by the Merchant (as defined hereinafter) (i) of
            all the terms and conditions,whether printed, stamped or otherwise incorporated on this
            side and on the reverse side of this Bill of ladingand the terms and conditions of the
            Carrier's applicable tariff(s) as if they were all signed by the Merchant,and (ii) that
            any prior representations and/or agreements for or in connection with Carriage of the
            Goods aresuperseded by this Bill of Lading. If this is a negotiable (To Order/of) Bill
            of Lading, one original Bill of Lading,duly endorsed must be surrendered by the Merchant
            to the Carrier (together with any outstanding Freight) inexchange for the Goods or a
            Delivery Order or the pin codes for any applicable Electronic Release System.If this is
            a non-negotiable (straight) Bill of Lading, or where issued as a Sea Waybill, the
            Carrier shall deliverthe Goods or issue a Delivery Order or the pin codes for any
            applicable Electronic Release System (afterpayment of outstanding Freight) to the named
            consignee against the surrender of one original Bill of Lading,or in the case of a Sea
            Waybill, on production of such reasonable proof of identify as may be required by
            theCarrier, or in accordance with the national law at the Port of Discharge or Place of
            Delivery as applicable. INWITNESS WHEREOF the Carrier or their Agent has signed the
            number of Bills of Lading stated at the top,all of this tenor and date, and whenever one
            original Bill of Lading has been surrendered all other Bills ofLading shall be void.`}
            </span>
          </Grid>
          <Grid item xs={6} className={classes.gridBottom}>
            <Grid container>
              <Grid item xs={6} className={`${classes.gridLeft} ${classes.gridBottom}`}>
                <h1 className={classes.disabledText}>Ocean vessel voyage NO. Flag</h1>
                <Textarea
                  id={getField('OCEAN VESSEL VOYAGE NO. FLAG')}
                  rows={1}
                  value={`${getValueField('OCEAN VESSEL VOYAGE NO. FLAG')}`}
                  readOnly={true}
                />
              </Grid>
              <Grid item xs={6} className={`${classes.gridLeft} ${classes.gridBottom}`}>
                <h1 className={classes.disabledText}>Port of loading</h1>
                <Textarea
                  id={getField('PORT OF LOADING')}
                  rows={1}
                  value={`${getValueField('PORT OF LOADING')}`}
                  readOnly={true}
                />
              </Grid>
              <Grid item xs={6} className={`${classes.gridLeft} `}>
                <h1 className={classes.disabledText}>Port of discharge</h1>
                <Textarea
                  id={getField('PORT OF DISCHARGE')}
                  rows={1}
                  value={`${getValueField('PORT OF DISCHARGE')}`}
                  readOnly={true}
                />
              </Grid>
              <Grid item xs={6} className={`${classes.gridLeft} `}>
                <h1 className={classes.disabledText}>Place of delivery</h1>
                <Textarea
                  id={getField('PLACE OF DELIVERY')}
                  rows={1}
                  value={`${getValueField('PLACE OF DELIVERY')}`}
                  readOnly={true}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} className={classes.gridBottom}>
            <Grid item xs={12} className={classes.gridBottom}>
              <h1 className={classes.disabledText}>
                {`Final Destination(for line merchant's reference only)`}
              </h1>
              <Textarea
                id={getField('FINAL DESTINATION')}
                rows={1}
                value={`${getValueField('FINAL DESTINATION')}`}
                readOnly={true}
              />
            </Grid>
            <Grid item xs={12}>
              <h1 className={classes.disabledText}>
                Type of movement (if mixed, use description of packages and goods field)
              </h1>
              <Textarea
                id={getField('TYPE OF MOVEMENT')}
                rows={2}
                value={`${getValueField('TYPE OF MOVEMENT')}`}
                readOnly={true}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={4}>
              <h1 className={classes.disabledText} style={{ marginRight: '4.0rem' }}>
                {`(check "HM" column if hazardous material)`}
              </h1>
            </Grid>
            <Grid item xs={8}>
              <h1 className={classes.disabledText}>
                particulars declared by shipper but not acknowledged by the carrier{' '}
              </h1>
            </Grid>
          </Grid>
          <Grid container className={classes.grid}>
            <Grid item xs={3} className={classes.gridLeft}>
              <h1 className={`${classes.disabledText} text-center`}>
                cntr nos. w/seal nos. marks & numbers
              </h1>
            </Grid>
            <Grid item xs={1} className={classes.gridLeft}>
              <h1 className={`${classes.disabledText} text-center`}>
                quantity (for customs declaration only)
              </h1>
            </Grid>
            <Grid item xs={4} className={classes.gridLeft}>
              <h1 className={`${classes.disabledText} text-center`}>description of goods</h1>
            </Grid>
            <Grid item xs={2} className={classes.gridLeft}>
              <h1 className={`${classes.disabledText} text-center`}>gross weight</h1>
            </Grid>
            <Grid item xs={2}>
              <h1 className={`${classes.disabledText} text-center`}>gross measurement</h1>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              {containersDetail &&
                containersDetail.map((cd, idx) => (
                  <span key={idx} style={{ whiteSpace: 'pre' }}>
                    {`${cd[getInqType('Container Number')]}    / ${
                      cd[getInqType('Container Seal')]
                    }    /  ${cd[getInqType('Container Package')]}  /  ${
                      cd[getInqType('Container Type')]
                    }  /  ${cd[getInqType('Container Weight')]}  /  ${
                      cd[getInqType('Container Measurement')]
                    }`}
                    <br />
                  </span>
                ))}
            </Grid>
          </Grid>
          {containersManifest &&
            containersManifest.map((cm, idx) => (
              <Grid key={idx} container style={idx === 0 ? { borderTop: '1px dashed blue' } : {}}>
                <Grid item xs={3} style={{ borderRight: '1px solid blue' }}>
                  <p className={classes.normalText}>{cm[getInqType('C/M Mark')]}</p>
                </Grid>
                <Grid item xs={1} style={{ borderRight: '1px solid blue' }}>
                  <p className={classes.normalText}>{cm[getInqType('C/M Package')]}</p>
                </Grid>
                <Grid item xs={4} style={{ borderRight: '1px solid blue' }}>
                  <p className={classes.normalText}>{cm[getInqType('C/M Description')]}</p>
                </Grid>
                <Grid item xs={2} style={{ borderRight: '1px solid blue' }}>
                  <p className={classes.normalText}>{cm[getInqType('C/M Weight')]}</p>
                </Grid>
                <Grid item xs={2}>
                  <p className={classes.normalText}>{cm[getInqType('C/M Measurement')]}</p>
                </Grid>
              </Grid>
            ))}
        </Grid>
        <Grid style={{ borderBottom: '1px solid blue' }}>
          <h1 className={classes.disabledText}>Ocean Preight prepaid</h1>
        </Grid>
      </div>
    </div>
  );
};

export default DraftPage;
