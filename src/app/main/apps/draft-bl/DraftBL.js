import React, { useEffect, useState } from 'react';
import history from '@history';
import _ from 'lodash';
import { SHIPPER, CONSIGNEE, NOTIFY, EXPORT_REF, FORWARDING, PLACE_OF_RECEIPT, PORT_OF_LOADING, PORT_OF_DISCHARGE, PLACE_OF_DELIVERY, FINAL_DESTINATION, VESSEL_VOYAGE, PRE_CARRIAGE, TYPE_OF_MOVEMENT, CONTAINER_DETAIL, CONTAINER_MANIFEST, FREIGHT_CHARGES, PLACE_OF_BILL, FREIGHTED_AS, RATE, DATE_CARGO, DATE_LADEN, COMMODITY_CODE, EXCHANGE_RATE, SERVICE_CONTRACT_NO, DOC_FORM_NO, CODE, TARIFF_ITEM, PREPAID, COLLECT, DATED, CONTAINER_NUMBER, CONTAINER_SEAL, CONTAINER_PACKAGE, CONTAINER_PACKAGE_UNIT, CONTAINER_TYPE, CONTAINER_WEIGHT, CONTAINER_WEIGHT_UNIT, CONTAINER_MEASUREMENT, CONTAINER_MEASUREMENT_UNIT, CM_MARK, CM_PACKAGE, CM_PACKAGE_UNIT, CM_DESCRIPTION, CM_WEIGHT, CM_WEIGHT_UNIT, CM_MEASUREMENT, CM_MEASUREMENT_UNIT } from '@shared/keyword';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import * as AppActions from 'app/store/actions';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import { Grid } from '@material-ui/core';

import * as Actions from './store/actions';

const BODER_COLOR = '1px solid #2929FF';
const BODER_COLOR_BOLD = '2px solid #2929FF';
const useStyles = makeStyles((theme) => ({
  wrapper: {
    background: '#515E6A',
    paddingTop: 30,
    paddingBottom: 30
  },
  layout: {
    width: 1150,
    minHeight: 1756,
    background: '#fff',
    padding: '0 30px 30px 30px',
    margin: 'auto'
  },
  general: {
    marginTop: 15,
    borderBottom: BODER_COLOR
  },
  leftCol: {
    width: '55%',
    borderTop: BODER_COLOR,
    borderRight: BODER_COLOR
  },
  rightCol: {
    width: '45%',
    borderTop: BODER_COLOR
  },
  flexContainer: {
    borderBottom: BODER_COLOR
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
    borderRight: BODER_COLOR
  },
  tittle_S: {
    fontFamily: 'Arial, serif',
    fontSize: 10 /*1vw*/,
    color: 'rgb(0, 0, 255)',
    paddingTop: 1.2
  },
  tittle_M: {
    fontFamily: 'Arial, serif',
    fontSize: 13 /*1vw*/,
    color: 'rgb(0, 0, 255) !important',
    paddingTop: 2
  },
  tittle_M_GRAY: {
    fontFamily: 'Arial, serif',
    fontSize: 13 /*1vw*/,
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
  tittle_Break_Line: {
    fontFamily: 'Courier, serif',
    fontSize: 20 /*1vw*/,
    paddingTop: 2,
    color: '#4A4A4A'
  },
  billType: {
    color: '#000',
    fontFamily: 'Courier, serif',
    fontSize: 27 /*1.8vw*/,
    fontWeight: 'bold'
  },
  content_M: {
    fontFamily: 'Courier, serif',
    fontSize: 16.5 /*1.5vw*/,
    lineHeight: '1.0',
    whiteSpace: 'nowrap',
    color: '#4A4A4A'
  },
  content_L: {
    fontFamily: 'Courier, serif',
    fontSize: 16.5 /*1.7vw*/,
    lineHeight: '1.0',
    color: '#4A4A4A'
  },
  declaration_M: {
    fontFamily: 'Arial, serif',
    fontSize: 13 /*1vw*/,
    color: 'rgb(0, 0, 255)',
    lineHeight: '1.1',
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
    top: 15,
    paddingBottom: '15px'
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
  },
  consignee: {
    display: 'block',
    minHeight: 150 /*10vw*/,
    lineHeight: 'initial',
    whiteSpace: 'pre-wrap',
  },
  notify: {
    minHeight: 150 /*10vw*/,
    display: 'block',
    lineHeight: 'initial',
    whiteSpace: 'pre-wrap',
    borderBottom: BODER_COLOR
  },
  exportFef: {
    minHeight: 79,
  },
  forwarding: {
    display: 'block',
    minHeight: 90,
    lineHeight: 'initial',
    whiteSpace: 'pre-wrap',
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
    fontSize: 9,
    letterSpacing: 3
  },
  note: {
    fontSize: 13,
    lineHeight: '14px',
    color: '#DC2626',
  },
  line_Usd: {
    fontSize: 13,
    lineHeight: '14px',
    color: '#0000FE',
  },
}));

const DraftPage = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [containersDetail, setContainersDetail] = useState([]);
  const [containersManifest, setContainersManifest] = useState([]);
  const [metadata, myBL, orgContent] = useSelector(({ draftBL }) => [
    draftBL.metadata,
    draftBL.myBL,
    draftBL.orgContent
  ]);

  const getField = (field) => {
    return metadata.field ? metadata.field[field] : '';
  };

  const getValueField = (field) => {
    return orgContent[getField(field)] || '';
  };

  const getInqType = (field) => {
    return metadata ? metadata.inq_type[field] : '';
  };

  useEffect(() => {
    const { pathname, search } = window.location;
    if (pathname.includes('/draft-bl') && !pathname.includes('/preview')) dispatch(AppActions.setDefaultSettings(_.set({}, 'layout.config.toolbar.display', true)));
    if (pathname.includes('/draft-bl/preview')) {
      const isAllow = PermissionProvider({ action: PERMISSION.VIEW_ACCESS_DRAFT_BL });
      if (!isAllow) history.push({ pathname: '/login', cachePath: pathname, cacheSearch: search });
    } else
      dispatch(
        AppActions.checkAllow(PermissionProvider({ action: PERMISSION.VIEW_ACCESS_DRAFT_BL }))
      );

    dispatch(Actions.loadMetadata());
    dispatch(Actions.loadContent(props.myBL?.id));
  }, []);

  useEffect(() => {
    if (Object.keys(orgContent).length && Object.keys(metadata).length) {
      setContainersDetail(getValueField(CONTAINER_DETAIL));
      setContainersManifest(getValueField(CONTAINER_MANIFEST));
    }
  }, [metadata, orgContent]);

  return (
    <div className={classes.wrapper}>
      <div className={classes.layout}>
        <div className={classes.header_1} style={{ display: 'flex' }}>
          <img className={classes.logo} src="assets/images/logos/one_logo.svg" />
          <div
            className={classes.tittle_L}
            style={{ color: 'rgb(0, 0, 255)', textAlign: 'center' }}>
            ORIGINAL NON NEGOTIABLE
          </div>
          <div style={{ width: '30%', paddingTop: 15 }}>
            <span className={classes.billType}>SEAWAY BILL</span>
          </div>
        </div>

        <Grid container style={{ display: 'flex', marginTop: 15 }}>
          <Grid item xs={7} style={{
            borderTop: BODER_COLOR,
            borderBottom: BODER_COLOR,
            borderRight: BODER_COLOR,
          }}>
            <div className={classes.tittle_M}>SHIPPER/EXPORTER</div>
            <div className={classes.content_L} style={{ width: '70%' }}>
              <span className={classes.shipper}>{getValueField(SHIPPER)}</span>
            </div>
          </Grid>
          <Grid container item xs={5} style={{
            borderTop: BODER_COLOR,
            borderBottom: BODER_COLOR,
          }}>
            <Grid container item style={{
              borderBottom: BODER_COLOR,
              maxHeight: '70px'
            }}>
              <Grid item xs={6} style={{
                borderRight: BODER_COLOR,
              }}>
                <div className={classes.tittle_M}>BOOKING NO.</div>
                <div className={clsx(classes.content_L, classes.bkgNo)} data-type="textarea">
                  {myBL.bkgNo}
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className={classes.tittle_M}>B/L NO.</div>
                <div className={clsx(classes.content_L, classes.blNo)}>
                  {myBL.bkgNo && `ONYE${myBL.bkgNo}`}
                </div>
              </Grid>
            </Grid>
            <Grid item>
              <div className={classes.tittle_S} style={{ minHeight: 20 }}>
                {`EXPORT REFERENCES(for the Merchant's and/or Carrier's reference only. See back clause 8. (4).)`}
              </div>
              <div className={clsx(classes.content_L, classes.exportFef)}>
                {getValueField(EXPORT_REF)}
              </div>
            </Grid>
          </Grid>

          <Grid container item style={{
            display: 'flex',
            borderBottom: BODER_COLOR,
          }}>
            <Grid container item xs={7} style={{
              borderRight: BODER_COLOR,
            }}>
              <Grid item xs={12} style={{
                borderBottom: BODER_COLOR,
              }}>
                <div className={classes.tittle_M}>CONSIGNEE</div>
                <span className={clsx(classes.consignee, classes.content_L)} style={{ width: '70%' }}>
                  {getValueField(CONSIGNEE)}
                </span>
              </Grid>
              <Grid item xs={12}>
                <div className={classes.tittle_M}>
                  {`NOTIFY PARTY (It is agreed that no responsibility shall be attached to the Carrier or its Agents for failure to notify)`}
                </div>
                <span className={clsx(classes.notify, classes.content_L)}>
                  {getValueField(NOTIFY)}
                </span>
              </Grid>

              <Grid container item>
                <Grid item xs={6} style={{
                  borderRight: BODER_COLOR,
                }}>
                  <div className={classes.tittle_M}>PRE-CARRIAGE BY</div>
                  <span className={clsx(classes.content_L, classes.singleLine)}>
                    {getValueField(PRE_CARRIAGE)}
                  </span>
                </Grid>
                <Grid item xs={6}>
                  <div className={classes.tittle_M}>PLACE OF RECEIPT</div>
                  <span className={clsx(classes.content_L, classes.singleLine)}>
                    {getValueField(PLACE_OF_RECEIPT)}
                  </span>
                </Grid>
              </Grid>
            </Grid>

            <Grid container item xs={5}>
              <Grid item>
                <div className={classes.tittle_S} style={{ width: '80%' }}>
                  FORWARDING AGENT-REFERENCES FMC NO.
                </div>
                <span className={clsx(classes.content_L, classes.forwarding)}>
                  {getValueField(FORWARDING)}
                </span>
              </Grid>
              <Grid item style={{ borderTop: BODER_COLOR }}>
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
              </Grid>
            </Grid>
          </Grid>

          <Grid container item style={{ borderBottom: BODER_COLOR_BOLD }}>
            <Grid container item xs={12} style={{ borderBottom: BODER_COLOR }}>
              <Grid container item xs={7} style={{ borderRight: BODER_COLOR }}>
                <Grid item xs={6} style={{ borderRight: BODER_COLOR }}>
                  <div className={classes.tittle_M}>OCEAN VESSEL VOYAGE NO. FLAG</div>
                  <span className={clsx(classes.content_L, classes.singleLine)}>
                    {getValueField(VESSEL_VOYAGE)}
                  </span>
                </Grid>
                <Grid item xs={6}>
                  <div className={classes.tittle_M}>PORT OF LOADING</div>
                  <span className={clsx(classes.content_L, classes.singleLine)}>
                    {getValueField(PORT_OF_LOADING)}
                  </span>
                </Grid>
              </Grid>
              <Grid container item xs={5}>
                <Grid item>
                  <div className={classes.tittle_M}>{`FINAL DESTINATION(for the Merchant's reference only)`}</div>
                  <span className={clsx(classes.content_L, classes.singleLine)}>
                    {getValueField(FINAL_DESTINATION)}
                  </span>
                </Grid>
              </Grid>
            </Grid>

            <Grid container item xs={12}>
              <Grid container item xs={7} style={{ borderRight: BODER_COLOR }}>
                <Grid item xs={6} style={{ borderRight: BODER_COLOR }}>
                  <div className={classes.tittle_M}>PORT OF DISCHARGE</div>
                  <span className={clsx(classes.content_L, classes.singleLine)}>
                    {getValueField(PORT_OF_DISCHARGE)}
                  </span>
                </Grid>
                <Grid item xs={6}>
                  <div className={classes.tittle_M}>PLACE OF DELIVERY</div>
                  <span className={clsx(classes.content_L, classes.singleLine)}>
                    {getValueField(PLACE_OF_DELIVERY)}
                  </span>
                </Grid>
              </Grid>

              <Grid container item xs={5}>
                <Grid item >
                  <div className={classes.tittle_S}>
                    TYPE OF MOVEMENT(IF MIXED, USE DESCRIPTION OF PACKAGES AND GOODS FIELD)
                  </div>
                  <span className={clsx(classes.content_L, classes.singleLine)}>
                    {getValueField(TYPE_OF_MOVEMENT)}
                  </span>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid container item style={{ borderBottom: BODER_COLOR, minHeight: '35px' }}>
            <Grid item xs={4}>
              <div className={classes.declaration_L}>
                {`(CHECK "HM" COLUMN IF HAZARDOUS MATERIAL)`}
              </div>
            </Grid>
            <Grid item xs={8}>
              <div className={classes.declaration_L}>
                PARTICULARS DECLARED BY SHIPPER BUT NOT ACKNOWLEDGED BY THE CARRIER
              </div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid container item style={{ borderBottom: BODER_COLOR }}>
              <Grid item xs={2} style={{ borderRight: BODER_COLOR, display: 'flex', textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
                <div className={classes.tittle_S}>
                  <span className={classes.tittle_S}>CNTR. NOS. W/SEAL NOS.</span>
                  <br />
                  <span className={classes.tittle_S}>{`MARKS & NUMBERS`}</span>
                </div>
              </Grid>
              <Grid item xs={2} style={{ borderRight: BODER_COLOR, display: 'flex', textAlign: 'center', alignItems: 'center', justifyContent: 'center'}}>
                <div className={classes.declaration_L}>
                  <div className={classes.tittle_S}>
                    <span className={classes.tittle_S}>QUANTITY</span>
                    <br />
                    <span className={classes.tittle_S}>(FOR CUSTOMS</span>
                    <br />
                    <span className={classes.tittle_S}>DECLARATION ONLY)</span>
                  </div>
                </div>
              </Grid>
              <Grid item xs={1} style={{ borderRight: BODER_COLOR,  display: 'flex', textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
                <div className={classes.declaration_L}>
                  <div className={classes.tittle_S}>
                    <span className={classes.tittle_S}>H</span>
                    <br />
                    <span className={classes.tittle_S}>M</span>
                  </div>
                </div>
              </Grid>
              <Grid item xs={3} style={{ borderRight: BODER_COLOR, display: 'flex', textAlign: 'center', alignItems: 'center', justifyContent: 'center'}}>
                <div className={classes.declaration_L}>
                  <div className={classes.tittle_S}>
                    DESCRIPTION OF GOODS
                  </div>
                </div>
              </Grid>
              <Grid item xs={2} style={{ borderRight: BODER_COLOR, display: 'flex', textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
                <div className={classes.declaration_L}>
                  <div className={classes.tittle_S}>
                    GROSS WEIGHT
                  </div>
                </div>
              </Grid>
              <Grid item xs={2} style={{ display: 'flex', textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>
                <div className={classes.declaration_L}>
                  <div className={classes.tittle_S}>
                    GROSS MEASUREMENT
                  </div>
                </div>
              </Grid>
            </Grid>

            {/* Container First Line */}
            <Grid container item>
              <Grid item xs={2} style={{ borderRight: BODER_COLOR, textAlign: 'center' }}>
                <div className={classes.content_M}
                  style={{ width: '251px', paddingTop: 5 }}>
                  {containersDetail &&
                    containersDetail.map((cd, idx) => (
                      <span key={idx} style={{ whiteSpace: 'pre' }}>
                        {`${cd[getInqType(CONTAINER_NUMBER)] || ''}    / ${cd[getInqType(CONTAINER_SEAL)] || ''}    /  ${cd[getInqType(CONTAINER_PACKAGE)] || ''} ${cd[getInqType(CONTAINER_PACKAGE_UNIT)] || ''}  /  ${cd[getInqType(CONTAINER_TYPE) || '']}  /  ${cd[getInqType(CONTAINER_WEIGHT)] || ''} ${cd[getInqType(CONTAINER_WEIGHT_UNIT)] || ''}  /  ${cd[getInqType(CONTAINER_MEASUREMENT)] || ''} ${cd[getInqType(CONTAINER_MEASUREMENT_UNIT)] || ''}`}
                        <br />
                      </span>
                    ))}
                  <span className={classes.description_payment_dash}>
                    -----------------------------------------------------------------------------------------------------------------------------------------
                  </span>
                </div>
              </Grid>
              <Grid item xs={2} style={{ borderRight: BODER_COLOR, textAlign: 'center' }} />
              <Grid item xs={1} style={{ borderRight: BODER_COLOR, textAlign: 'center' }} />
              <Grid item xs={3} style={{ borderRight: BODER_COLOR, textAlign: 'center' }} />
              <Grid item xs={2} style={{ borderRight: BODER_COLOR, textAlign: 'center' }} />
              <Grid item xs={2} style={{ textAlign: 'center' }} />
            </Grid>

            <Grid container item style={{ minHeight: '200px' }}>
              {containersManifest?.length ?
                containersManifest.map((cm, index) => (
                  <Grid container item key={index} className={classes.content_L}>
                    <Grid item xs={2} style={{ borderRight: BODER_COLOR,textAlign: 'left', paddingTop: '8px', paddingRight:'5px' }}>
                      {cm[getInqType(CM_MARK)]}
                    </Grid>
                    <Grid item xs={2} style={{ borderRight: BODER_COLOR, textAlign: 'center', padding: '8px' }}>
                      <Grid item style={{ textAlign: 'end' }}>
                        <span>{cm[getInqType(CM_PACKAGE)]}</span>
                        <br />
                        <span>{cm[getInqType(CM_PACKAGE_UNIT)]}</span>
                      </Grid>
                    </Grid>
                    <Grid item xs={1} style={{ borderRight: BODER_COLOR, textAlign: 'center', padding: '8px' }}>
                    </Grid>
                    <Grid item xs={3} style={{ borderRight: BODER_COLOR, padding: '8px', whiteSpace: 'pre' }}>
                      {cm[getInqType(CM_DESCRIPTION)]}
                    </Grid>
                    <Grid item xs={2} style={{ borderRight: BODER_COLOR, textAlign: 'end', padding: '8px' }}>
                      {`${cm[getInqType(CM_WEIGHT)]} ${cm[getInqType(CM_WEIGHT_UNIT)]}`}
                    </Grid>
                    <Grid item xs={2} style={{ textAlign: 'end', padding: '8px' }}>
                      {`${cm[getInqType(CM_MEASUREMENT)]} ${cm[getInqType(CM_MEASUREMENT_UNIT)]}`}
                    </Grid>
                  </Grid>
                )) :
                <Grid container item className={classes.content_L}>
                  <Grid item xs={2} style={{ borderRight: BODER_COLOR, textAlign: 'center', padding: '8px' }} />
                  <Grid item xs={2} style={{ borderRight: BODER_COLOR, textAlign: 'center', padding: '8px' }} />
                  <Grid item xs={1} style={{ borderRight: BODER_COLOR, textAlign: 'center', padding: '8px' }} />
                  <Grid item xs={3} style={{ borderRight: BODER_COLOR, padding: '8px' }} />
                  <Grid item xs={2} style={{ borderRight: BODER_COLOR, textAlign: 'end', padding: '8px' }} />
                  <Grid item xs={2} style={{ textAlign: 'end', padding: '8px' }} />
                </Grid>}
            </Grid>
          </Grid>

          <Grid container justify="center">
            <span className={classes.tittle_Break_Line}>** TO BE CONTINUED ON ATTACHED LIST **</span>
          </Grid>

          <Grid container style={{ display: 'flex', alignItems: 'center', paddingTop: '12px', paddingBottom: '12px' }}>
            <span className={classes.note}>Declared Cargo Value US $</span>
            <span className={classes.line_Usd}>&emsp;_____________________&emsp;</span>
            <span className={classes.note}>
              {
                "If Merchant enters a value, Carrier's limitation of liability shall not apply and the ad valorem rate will be charged"
              }
            </span>
          </Grid>

          <Grid container style={{ borderTop: BODER_COLOR_BOLD, borderBottom: BODER_COLOR }}>
            <Grid container item xs={10}>
              <Grid container item>
                <Grid item xs={4}
                  style={{
                    borderRight: BODER_COLOR,
                    borderBottom: BODER_COLOR,
                  }}>
                  <div className={classes.tittle_M}>FREIGHT & CHARGES PAYABLE AT / BY:</div>
                  <div className={classes.content_L} style={{ minHeight: '35px' }}>
                    <span>{getValueField(FREIGHT_CHARGES)}</span>
                  </div>
                </Grid>
                <Grid container item xs={6}
                  style={{
                    borderRight: BODER_COLOR,
                    borderBottom: BODER_COLOR,
                    textAlign: 'center'
                  }}>
                  <Grid item xs={4} style={{ borderRight: BODER_COLOR, textAlign: 'center' }}>
                    <div className={classes.tittle_M} style={{ minWidth: '160px' }} >SERVICE CONTRACT NO.</div>
                    <div className={classes.content_L} style={{ minHeight: '35px' }}>
                      <span>{getValueField(SERVICE_CONTRACT_NO)}</span>
                    </div>
                  </Grid>
                  <Grid item xs={4} style={{ borderRight: BODER_COLOR, textAlign: 'center' }}>
                    <div className={classes.tittle_M} >DOC FORM NO.</div>
                    <div className={classes.content_L} style={{ minHeight: '35px' }}>
                      <span>{getValueField(DOC_FORM_NO)}</span>
                    </div>
                  </Grid>
                  <Grid item xs={4} style={{ textAlign: 'center' }}>
                    <div className={classes.tittle_M}>COMMODITY CODE</div>
                    <div className={classes.content_L} style={{ minHeight: '35px' }}>
                      <span>{getValueField(COMMODITY_CODE)}</span>
                    </div>
                  </Grid>
                </Grid>
                <Grid item xs={2}
                  style={{
                    borderRight: BODER_COLOR,
                    borderBottom: BODER_COLOR,
                  }}>
                  <div className={classes.tittle_M}>EXCHANGE RATE</div>
                  <div className={classes.content_L} style={{ minHeight: '35px' }}>
                    <span>{getValueField(EXCHANGE_RATE)}</span>
                  </div>
                </Grid>
              </Grid>

              <Grid container item style={{ borderRight: BODER_COLOR }}>
                <Grid container item xs={10}
                  style={{
                    borderLeft: BODER_COLOR,
                  }}>
                  <Grid item xs={2} style={{ textAlign: 'center' }}>
                    <div className={classes.tittle_M} style={{ borderBottom: BODER_COLOR }}>
                      CODE
                    </div>
                    <div className={classes.content_L} style={{ minHeight: '250px' }}>
                      <span>{getValueField(CODE)}</span>
                    </div>
                  </Grid>
                  <Grid item xs={2} style={{ borderRight: BODER_COLOR, textAlign: 'center' }}>
                    <div className={classes.tittle_M} style={{ borderBottom: BODER_COLOR }}>
                      TARIFF ITEM
                    </div>
                    <div className={classes.content_L}>
                      <span>{getValueField(TARIFF_ITEM)}</span>
                    </div>
                  </Grid>
                  <Grid item xs={2} style={{ borderRight: BODER_COLOR, textAlign: 'center' }}>
                    <div className={classes.tittle_M} style={{ borderBottom: BODER_COLOR }}>
                      FREIGHTED AS
                    </div>
                    <div className={classes.content_L}>
                      <span>{getValueField(FREIGHTED_AS)}</span>
                    </div>
                  </Grid>
                  <Grid item xs={2} style={{ borderRight: BODER_COLOR, textAlign: 'center' }}>
                    <div className={classes.tittle_M} style={{ borderBottom: BODER_COLOR }}>
                      RATE
                    </div>
                    <div className={classes.content_L}>
                      <span>{getValueField(RATE)}</span>
                    </div>
                  </Grid>
                  <Grid item xs={2} style={{ borderRight: BODER_COLOR, textAlign: 'center' }}>
                    <div className={classes.tittle_M} style={{ borderBottom: BODER_COLOR }}>
                      PREPAID
                    </div>
                    <div className={classes.content_L}>
                      <span>{getValueField(PREPAID)}</span>
                    </div>
                  </Grid>
                  <Grid item xs={2} style={{ textAlign: 'center' }}>
                    <div className={classes.tittle_M} style={{ borderBottom: BODER_COLOR }}>
                      COLLECT
                    </div>
                    <div className={classes.content_L}>
                      <span>{getValueField(COLLECT)}</span>
                    </div>
                  </Grid>
                </Grid>

                <Grid container item xs={2} style={{ borderLeft: BODER_COLOR }}>

                </Grid>
              </Grid>
            </Grid>

            <Grid container item xs={2} direction='column'>
              <Grid item style={{ borderBottom: BODER_COLOR }}>
                <div className={classes.tittle_M_GRAY} style={{ minHeight: '150px' }}>[1] ORIGINAL BILLS(S) HAVE BEEN SIGNED</div>
              </Grid>

              <Grid item style={{ borderBottom: BODER_COLOR }}>
                <div className={classes.tittle_M}>DATE CARGO RECEIVED</div>
                <div className={classes.content_L} style={{ minHeight: '25px' }}>
                  <span>{getValueField(DATE_CARGO)}</span>
                </div>
              </Grid>
              <Grid item style={{ borderBottom: BODER_COLOR }}>
                <div className={classes.tittle_M}>DATE LADEN ON BOARD</div>
                <div className={classes.content_L} style={{ minHeight: '25px' }}>
                  <span>{getValueField(DATE_LADEN)}</span>
                </div>
              </Grid>
              <Grid item style={{ borderBottom: BODER_COLOR }}>
                <div className={classes.tittle_M}>PLACE OF BILL(S) ISSUE</div>
                <div className={classes.content_L} style={{ minHeight: '25px' }}>
                  <span>{getValueField(PLACE_OF_BILL)}</span>
                </div>
              </Grid>
              <Grid item>
                <div className={classes.tittle_M}>DATED</div>
                <div className={classes.content_L} style={{ minHeight: '25px' }}>
                  <span>{getValueField(DATED)}</span>
                </div>
              </Grid>
            </Grid>
          </Grid>

          <Grid container item xs={10}>
            <Grid container item xs={10}>
              <Grid item xs={8} style={{ minHeight: '100px', borderRight: BODER_COLOR }} >
                <div className={classes.tittle_M} >
                  {'The printed terms and conditions on this Bill are available at its website at www.one-line.com'}
                </div>
              </Grid>
              <Grid item xs={2} style={{ borderRight: BODER_COLOR }}>
                <div className={classes.tittle_M} style={{ borderBottom: BODER_COLOR, minHeight: '100px' }}>
                </div>
              </Grid>
              <Grid item xs={2} style={{ borderRight: BODER_COLOR }}>
                <div className={classes.tittle_M} style={{ borderBottom: BODER_COLOR, minHeight: '100px' }}>
                </div>
              </Grid>
            </Grid>
            <Grid item xs={2} style={{ display: 'flex' }}>
              <div className={classes.tittle_M}>
                SIGNED BY:
              </div>
              <span></span>
            </Grid>
          </Grid>

          <Grid item xs={2} style={{ display: 'flex', flexDirection: 'column-reverse' }}>
            <div className={classes.tittle_M}>
              , as agent for and on behalf of
            </div>
            <span></span>
          </Grid>
        </Grid>
      </div>
    </div >
  );
};

export default DraftPage;
