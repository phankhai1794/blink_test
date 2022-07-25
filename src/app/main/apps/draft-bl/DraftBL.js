import React, { useEffect, useState } from 'react';
import history from '@history';
import _ from 'lodash';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import * as AppActions from 'app/store/actions';
import { PERMISSION, PermissionProvider } from '@shared/permission';

import * as Actions from './store/actions';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    background: '#515E6A',
    paddingTop: 30,
    paddingBottom: 30
  },
  layout: {
    width: 1259,
    minHeight: 1756,
    background: '#fff',
    padding: '0 30px 30px 30px',
    margin: 'auto'
  },
  general: {
    marginTop: 15,
    borderBottom: '1px solid #ac9ef6'
  },
  leftCol: {
    width: '55%',
    borderTop: '1px solid #ac9ef6',
    borderRight: '1px solid #ac9ef6'
  },
  rightCol: {
    width: '45%',
    borderTop: '1px solid #ac9ef6'
  },
  flexContainer: {
    borderBottom: '1px solid #ac9ef6'
  },
  drawLine: {
    position: 'absolute',
    zIndex: '-1px',
    left: 30,
    height: '50%',
    width: 1259
  },
  line: {
    height: '100%',
    borderRight: '1px solid #ac9ef6'
  },
  tittle_S: {
    fontFamily: 'Arial, serif',
    fontSize: 13 /*1vw*/,
    color: 'rgb(0, 0, 255)',
    paddingTop: 3.2
  },
  tittle_M: {
    fontFamily: 'Arial, serif',
    fontSize: 13 /*1vw*/,
    color: 'rgb(0, 0, 255) !important',
    paddingTop: 2
  },
  tittle_L: {
    fontFamily: 'Courier, serif',
    fontSize: 35 /*2.5vw*/,
    fontWeight: 'bold',
    width: '60.5%',
    paddingTop: 15,
    marginLeft: 120
  },
  billType: {
    color: '#000',
    fontFamily: 'Courier, serif',
    fontSize: 27 /*1.8vw*/,
    fontWeight: 'bold'
  },
  content_M: {
    fontFamily: 'Courier, serif',
    fontSize: 20.5 /*1.5vw*/,
    lineHeight: '1.0',
    whiteSpace: 'nowrap'
  },
  content_L: {
    fontFamily: 'Courier, serif',
    fontSize: 20.5 /*1.7vw*/
  },
  declaration_M: {
    fontFamily: 'Arial, serif',
    fontSize: 13 /*1vw*/,
    color: 'rgb(0, 0, 255)',
    lineHeight: '1.1',
    borderBottom: '1px solid #ac9ef6',
    padding: 1.5
  },
  declaration_L: {
    fontFamily: 'Arial, serif',
    fontSize: 13,
    color: 'rgb(0, 0, 255)'
  },
  /* ################################################################## */
  header_1: {
    position: 'relative',
    top: 15
  },
  bkgNo: {
    display: 'block',
    lineHeight: 'initial',
    minHeight: 25.5 /*2vw*/
  },
  blNo: {
    display: 'block',
    lineHeight: 'initial'
  },
  shipper: {
    display: 'block',
    minHeight: 150 /*10vw*/,
    lineHeight: 'initial',
    whiteSpace: 'pre-wrap',
    borderBottom: '1px solid #ac9ef6'
  },
  consignee: {
    display: 'block',
    minHeight: 150 /*10vw*/,
    lineHeight: 'initial',
    whiteSpace: 'pre-wrap',
    borderBottom: '1px solid #ac9ef6'
  },
  notify: {
    minHeight: 150 /*10vw*/,
    display: 'block',
    lineHeight: 'initial',
    whiteSpace: 'pre-wrap',
    borderBottom: '1px solid #ac9ef6'
  },
  exportFef: {
    minHeight: 79,
    borderBottom: '1px solid #ac9ef6'
  },
  forwarding: {
    display: 'block',
    minHeight: 149,
    lineHeight: 'initial',
    whiteSpace: 'pre-wrap',
    borderBottom: '1px solid #ac9ef6'
  },
  singleLine: {
    minHeight: 45 /*3vw*/,
    display: 'block',
    lineHeight: 'initial'
  },
  /* ################################# */
  logo: {
    width: 135 /*10vw*/,
    padding: 7
  },
  cont_details_description_1: {
    paddingTop: 5
  },
  description_payment_dash: {
    fontFamily: 'Courier, serif',
    fontSize: 20,
    letterSpacing: 3
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

  const breakCMPackage = (value) => {
    let [first, ...rest] = value.split(' ');
    rest = rest.join(' ');
    return `${first}\n${rest}`;
  };

  useEffect(() => {
    const { pathname, search } = window.location;
    if (pathname.includes('/draft-bl/preview')) {
      const isAllow = PermissionProvider({ action: PERMISSION.VIEW_ACCESS_DRAFT_BL });
      if (!isAllow) history.push({ pathname: '/login', cachePath: pathname, cacheSearch: search });
    } else
      dispatch(
        AppActions.checkAllow(PermissionProvider({ action: PERMISSION.VIEW_ACCESS_DRAFT_BL }))
      );

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
      <div className={classes.layout}>
        <div className={classes.header_1} style={{ display: 'flex' }}>
          <img className={classes.logo} src="assets/images/logos/one_logo.svg" />
          <a
            className={classes.tittle_L}
            style={{ textDecoration: 'underline', color: 'rgb(0, 0, 255)' }}>
            COPY NON NEGOTIABLE
          </a>
          <div style={{ width: '30%', paddingTop: 15 }}>
            <span className={classes.billType}>SEAWAY BILL</span>
          </div>
        </div>
        <div className={classes.general} style={{ display: 'flex' }}>
          <div className={classes.leftCol}>
            <div className={classes.tittle_M}>SHIPPER/EXPORTER</div>
            <div className={classes.content_L}>
              <span className={classes.shipper}>{getValueField('SHIPPER/EXPORTER')}</span>
            </div>
            <div className={classes.tittle_M}>CONSIGNEE</div>
            <span className={clsx(classes.consignee, classes.content_L)}>
              {getValueField('CONSIGNEE')}
            </span>
            <div className={classes.tittle_M}>
              {`NOTIFY PARTY (It is agreed that no responsibility shall be attached to the Carrier or its Agents for failure to notify)`}
            </div>
            <span className={clsx(classes.notify, classes.content_L)}>
              {getValueField('NOTIFY PARTY')}
            </span>
            <div className={classes.flexContainer} style={{ display: 'flex' }}>
              <div style={{ width: '50%', borderRight: '1px solid #ac9ef6' }}>
                <div className={classes.tittle_M}>PRE-CARRIAGE BY</div>
                <span className={clsx(classes.content_L, classes.singleLine)}>
                  {getValueField('PRE-CARRIAGE BY')}
                </span>
              </div>
              <div style={{ width: '50%' }}>
                <div className={classes.tittle_M}>PLACE OF RECEIPT</div>
                <span className={clsx(classes.content_L, classes.singleLine)}>
                  {getValueField('PLACE OF RECEIPT')}
                </span>
              </div>
            </div>
            <div className={classes.flexContainer} style={{ display: 'flex' }}>
              <div style={{ width: '50%', borderRight: '1px solid #ac9ef6' }}>
                <div className={classes.tittle_M}>OCEAN VESSEL VOYAGE NO. FLAG</div>
                <span className={clsx(classes.content_L, classes.singleLine)}>
                  {getValueField('OCEAN VESSEL VOYAGE NO. FLAG')}
                </span>
              </div>
              <div style={{ width: '50%' }}>
                <div className={classes.tittle_M}>PORT OF LOADING</div>
                <span className={clsx(classes.content_L, classes.singleLine)}>
                  {getValueField('PORT OF LOADING')}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex' }}>
              <div style={{ width: '50%', borderRight: '1px solid #ac9ef6' }}>
                <div className={classes.tittle_M}>PORT OF DISCHARGE</div>
                <span className={clsx(classes.content_L, classes.singleLine)}>
                  {getValueField('PORT OF DISCHARGE')}
                </span>
              </div>
              <div style={{ width: '50%' }}>
                <div className={classes.tittle_M}>PLACE OF DELIVERY</div>
                <span className={clsx(classes.content_L, classes.singleLine)}>
                  {getValueField('PLACE OF DELIVERY')}
                </span>
              </div>
            </div>
          </div>
          <div className={classes.rightCol}>
            <div className={classes.flexContainer} style={{ display: 'flex' }}>
              <div style={{ width: '50%', borderRight: '1px solid #ac9ef6' }}>
                <div className={classes.tittle_M}>BOOKING NO.</div>
                <div className={clsx(classes.content_L, classes.bkgNo)} data-type="textarea">
                  {myBL.bkgNo}
                </div>
              </div>
              <div>
                <div className={classes.tittle_M}>B/L NO.</div>
                <div className={clsx(classes.content_L, classes.blNo)}>
                  {myBL.bkgNo && `ONYE${myBL.bkgNo}`}
                </div>
              </div>
            </div>
            <div className={classes.tittle_S} style={{ minHeight: 20 }}>
              {`EXPORT REFERENCES(for the Merchant's and/or Carrier's reference only. See back clause 8. (4).)`}
            </div>
            <div className={clsx(classes.content_L, classes.exportFef)}>
              {getValueField('EXPORT REFERENCES')}
            </div>
            <div className={classes.tittle_S} style={{ width: '65%' }}>
              FORWARDING AGENT-REFERENCES (FMC NO.)
            </div>
            <span className={clsx(classes.content_L, classes.forwarding)}>
              {getValueField('FORWARDING AGENT-REFERENCES')}
            </span>
            <div className={classes.declaration_M}>
              {`RECEIVED by the Carrier in apparent good order and condition (unless otherwise stated herein) the total
                number or quantity of Containers or other packages or units indicated in the box entitled "Carrier's
                Receipt", to be carried subject to all the terms and conditions hereof from the Place of Receipt or Port of
                Loading to the Port of Discharge or Place of Delivery, as applicable. Delivery of the Goods
                to the Carrier for Carriage hereunder constitutes acceptance by the Merchant (as defined hereinafter)
                (i) of all the terms and conditions, whether printed, stamped or otherwise incorporated on this side and on the
                reverse side of this Bill of lading and the terms and conditions of the Carrier's applicable tariff(s) as if
                they were all signed by the Merchant, and (ii) that any prior representations and/or agreements for or in
                connection with Carriage of the Goods are superseded by this Bill of Lading. If where issued as a
                Sea Waybill, the Carrier shall deliver the Goods or issue a Delivery Order or the pin codes for any applicable
                Electronic Release System (after payment of outstanding Freight) to the named consignee against the surrender
                of one original Bill of Lading, on production of such reasonable proof of
                identify as may be required by the Carrier, or in accordance with the national law at the Port of Discharge or
                Place of Delivery as applicable. In their Agent has signed the number of Bills of
                Lading stated at the top, and whenever one original Bill of Lading has
                been surrendered all other Bills of Lading shall be void.`}
            </div>
            <div
              className={
                classes.tittle_S
              }>{`FINAL DESTINATION(for the Merchant's reference only)`}</div>
            <div
              className={classes.content_L}
              style={{ minHeight: 50, borderBottom: '1px solid #ac9ef6' }}>
              <span className={clsx(classes.content_L, classes.singleLine)}>
                {getValueField('FINAL DESTINATION')}
              </span>
            </div>
            <div className={classes.tittle_S}>
              TYPE OF MOVEMENT(IF MIXED, USE DESCRIPTION OF PACKAGES AND GOODS FIELD)
            </div>
            <div className={clsx(classes.content_L, classes.singleLine)}>
              {getValueField('TYPE OF MOVEMENT')}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', borderBottom: '1px solid #ac9ef6' }}>
          <div className={classes.declaration_L} style={{ width: '40%' }}>
            {`(CHECK "HM" COLUMN IF HAZARDOUS MATERIAL)`}
          </div>
          <div className={classes.declaration_L} style={{ width: '40%' }}>
            PARTICULARS DECLARED BY SHIPPER BUT NOT ACKNOWLEDGED BY THE CARRIER
          </div>
        </div>
        <div style={{ display: 'flex', borderBottom: '1px solid #ac9ef6' }}>
          <div
            className={classes.tittle_S}
            style={{ width: '251px', borderRight: '1px solid #ac9ef6', textAlign: 'center' }}>
            <span className={classes.tittle_S}>CNTR. NOS. W/SEAL NOS.</span>
            <br />
            <span className={classes.tittle_S}>{`MARKS & NUMBERS`}</span>
          </div>
          <div
            className={classes.tittle_S}
            style={{ width: '164px', borderRight: '1px solid #ac9ef6', textAlign: 'center' }}>
            <span className={classes.tittle_S}>QUANTITY</span>
            <br />
            <span className={classes.tittle_S}>(FOR CUSTOMS</span>
            <br />
            <span className={classes.tittle_S}>DECLARATION ONLY)</span>
          </div>
          <div
            className={classes.tittle_S}
            style={{ width: '464px', borderRight: '1px solid #ac9ef6', textAlign: 'center' }}>
            DESCRIPTION OF GOODS
          </div>
          <div
            className={classes.tittle_S}
            style={{ width: '188px', borderRight: '1px solid #ac9ef6', textAlign: 'center' }}>
            GROSS WEIGHT
          </div>
          <div className={classes.tittle_S} style={{ width: '188px', textAlign: 'center' }}>
            GROSS MEASUREMENT
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div
            className={classes.content_M}
            style={{ width: '251px', paddingTop: 5, borderRight: '1px solid #ac9ef6' }}>
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
            <span className={classes.description_payment_dash}>
              ------------------------------------------------------------------------------------
            </span>
          </div>
          <div style={{ width: '164px', borderRight: '1px solid #ac9ef6' }}></div>
          <div style={{ width: '464px', borderRight: '1px solid #ac9ef6' }}></div>
          <div style={{ width: '188px', borderRight: '1px solid #ac9ef6' }}></div>
          <div style={{ width: '188px' }}></div>
        </div>
        {containersManifest &&
          containersManifest.map((cm, idx) => (
            <div key={idx} style={{ display: 'flex' }}>
              <div
                className={classes.content_M}
                style={{
                  width: '251px',
                  borderRight: '1px solid #ac9ef6',
                  whiteSpace: 'pre-wrap'
                }}>
                {cm[getInqType('C/M Mark')]}
                {idx !== containersManifest.length - 1 && (
                  <>
                    <br />
                    <br />
                  </>
                )}
              </div>
              <div
                className={classes.content_M}
                style={{
                  width: '164px',
                  borderRight: '1px solid #ac9ef6',
                  textAlign: 'right',
                  whiteSpace: 'pre-wrap'
                }}>
                {breakCMPackage(cm[getInqType('C/M Package')])}
                {idx !== containersManifest.length - 1 && (
                  <>
                    <br />
                    <br />
                  </>
                )}
              </div>
              <div
                className={classes.content_M}
                style={{
                  width: '459px',
                  borderRight: '1px solid #ac9ef6',
                  paddingLeft: 5,
                  whiteSpace: 'pre-wrap'
                }}>
                {cm[getInqType('C/M Description')]}
                {idx !== containersManifest.length - 1 && (
                  <>
                    <br />
                    <br />
                  </>
                )}
              </div>
              <div
                className={classes.content_M}
                style={{
                  width: '188px',
                  borderRight: '1px solid #ac9ef6',
                  textAlign: 'right',
                  whiteSpace: 'pre-wrap'
                }}>
                {cm[getInqType('C/M Weight')]}
                {idx !== containersManifest.length - 1 && (
                  <>
                    <br />
                    <br />
                  </>
                )}
              </div>
              <div
                className={classes.content_M}
                style={{ width: '188px', textAlign: 'right', whiteSpace: 'pre-wrap' }}>
                {cm[getInqType('C/M Measurement')]}
                {idx !== containersManifest.length - 1 && (
                  <>
                    <br />
                    <br />
                  </>
                )}
              </div>
            </div>
          ))}
        <div style={{ display: 'flex' }}>
          <div
            className={classes.content_M}
            style={{ width: '251px', paddingTop: 5, borderRight: '1px solid #ac9ef6' }}>
            <span className={classes.description_payment_dash}>
              ------------------------------------------------------------------------------------
            </span>
            <br />
            <span>OCEAN FREIGHT COLLECT</span>
            <br />
            <br />
          </div>
          <div style={{ width: '164px', borderRight: '1px solid #ac9ef6' }}></div>
          <div style={{ width: '464px', borderRight: '1px solid #ac9ef6' }}></div>
          <div style={{ width: '188px', borderRight: '1px solid #ac9ef6' }}></div>
          <div style={{ width: '188px' }}></div>
        </div>
      </div>
    </div>
  );
};

export default DraftPage;
