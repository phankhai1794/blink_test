import React, { useEffect, useState } from 'react';
import history from '@history';
import _ from 'lodash';
import { SHIPPER, CONSIGNEE, NOTIFY, EXPORT_REF, FORWARDER, PLACE_OF_RECEIPT, PORT_OF_LOADING, PORT_OF_DISCHARGE, PLACE_OF_DELIVERY, FINAL_DESTINATION, VESSEL_VOYAGE, PRE_CARRIAGE, TYPE_OF_MOVEMENT, CONTAINER_DETAIL, CONTAINER_MANIFEST, FREIGHT_CHARGES, PLACE_OF_BILL, FREIGHTED_AS, RATE, DATE_CARGO, DATE_LADEN, EXCHANGE_RATE, SERVICE_CONTRACT_NO, DOC_FORM_NO, CODE, TARIFF_ITEM, PREPAID, COLLECT, DATED, CONTAINER_NUMBER, CONTAINER_SEAL, CONTAINER_PACKAGE, CONTAINER_PACKAGE_UNIT, CONTAINER_TYPE, CONTAINER_WEIGHT, CONTAINER_WEIGHT_UNIT, CONTAINER_MEASUREMENT, CONTAINER_MEASUREMENT_UNIT, CM_MARK, CM_PACKAGE, CM_PACKAGE_UNIT, CM_DESCRIPTION, CM_WEIGHT, CM_WEIGHT_UNIT, CM_MEASUREMENT, CM_MEASUREMENT_UNIT, BOOKING_NO, BL_TYPE, SHIPPING_MARK, DESCRIPTION_OF_GOODS, TOTAL_PACKAGE, TOTAL_PACKAGE_UNIT, TOTAL_WEIGHT, TOTAL_WEIGHT_UNIT, TOTAL_MEASUREMENT, TOTAL_MEASUREMENT_UNIT, RD_TERMS, NO_CONTENT_AMENDMENT, TOTAL_PREPAID, RATING_DETAIL } from '@shared/keyword';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import * as AppActions from 'app/store/actions';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import { Grid } from '@material-ui/core';
import { isJsonText, formatDate, MAX_CHARS, MAX_ROWS_CD, lineBreakAtBoundary, checkMaxRows, getTotalValueMDView, formatNoneContNo, findSumFromArray } from '@shared';
import { packageUnitsJson } from '@shared/units';

import * as Actions from './store/actions';
import Rider from './Rider';

const BORDER = '1px solid #2929FF';
const BORDER_BOLD = '2px solid #2929FF';
const WIDTH_COL_MARK = 220;
const WIDTH_COL_PKG = 163;
const WIDTH_COL_HM = 15;
const WIDTH_COL_DOG = 370;
const WIDTH_COL_WEIGHT = 191;
const WIDTH_COL_MEAS = 191;

const useStyles = makeStyles((theme) => ({
  wrapper: {
    background: '#515E6A',
    paddingTop: 30,
    paddingBottom: 30
  },
  layout: {
    width: 1150,
    height: 1732.2,
    overflow: 'hidden',
    background: '#fff',
    padding: '0 30px 30px 30px',
    margin: 'auto'
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
  tittle_M_gray: {
    fontFamily: 'Arial, serif',
    fontSize: 13 /*1vw*/,
    paddingTop: 2
  },
  tittle_L: {
    fontFamily: 'Courier, serif',
    fontSize: 35 /*2.5vw*/,
    fontWeight: 'bold',
    width: '65%',
    paddingTop: 15,
    marginLeft: 120
  },
  tittle_break_line: {
    fontFamily: 'Courier, serif',
    fontSize: 20 /*1vw*/,
    paddingTop: 2,
    color: '#4A4A4A'
  },
  page_Number: {
    color: '#000',
    fontFamily: 'Courier, serif',
    fontSize: 15,
    textAlign: 'right',
  },
  page_Count: {
    display: 'inline-block',
    margin: 0,
    width: 30
  },
  blType: {
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
  header: {
    position: 'relative',
    top: 15,
    paddingBottom: 10
  },
  logo: {
    width: 135 /*10vw*/,
    padding: 7
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
    borderBottom: BORDER
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
  th: {
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
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
  line_usd: {
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
  const [metadata, myBL, content, drfView] = useSelector(({ draftBL }) => [
    draftBL.metadata,
    draftBL.myBL,
    draftBL.content,
    draftBL.drfView
  ]);
  const [isInBound, setIsInBound] = useState({ MD: true, CM: true });
  const [totalPage, setTotalPage] = useState(1);

  const getField = (field) => {
    return metadata.field ? metadata.field[field] : '';
  };

  const getValueField = (field) => {
    if (content[getField(field)] === NO_CONTENT_AMENDMENT) {
      return '';
    }
    return content[getField(field)] || '';
  };

  const getInqType = (field) => {
    return metadata ? metadata.inq_type[field] : '';
  };

  const getPackageName = (packageCode) => packageUnitsJson.find(pkg => pkg.code === packageCode)?.description;

  const drfMD = getTotalValueMDView(drfView, containersDetail, getInqType);

  useEffect(() => {
    const { pathname, search } = window.location;
    if (pathname.includes('/draft-bl')) {
      if (pathname.includes('/preview')) {
        const isAllow = PermissionProvider({ action: PERMISSION.VIEW_ACCESS_DRAFT_BL });
        if (!isAllow) history.push({ pathname: '/login', cachePath: pathname, cacheSearch: search });
      } else {
        dispatch(AppActions.setDefaultSettings(_.set({}, 'layout.config.toolbar.display', true)));
        dispatch(AppActions.checkAllow(PermissionProvider({ action: PERMISSION.VIEW_ACCESS_DRAFT_BL })));
        dispatch(Actions.setInquiries(props.myBL?.id));
      }

      dispatch(Actions.loadMetadata());
      dispatch(Actions.loadContent(props.myBL?.id));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(content).length && Object.keys(metadata).length) {
      setContainersDetail(getValueField(CONTAINER_DETAIL));
      setContainersManifest(getValueField(CONTAINER_MANIFEST));
    }
  }, [metadata, content]);

  useEffect(() => {
    if (containersDetail.length) {
      // MD view
      let totalMark = getValueField(SHIPPING_MARK).split("\n").map(line => lineBreakAtBoundary(line, MAX_CHARS.mark)).join("\n");
      let totalPackage = `${getValueField(TOTAL_PACKAGE)}\n${getPackageName(getValueField(TOTAL_PACKAGE_UNIT))}`.split("\n").map(line => lineBreakAtBoundary(line, MAX_CHARS.package)).join("\n");
      let totalDescription = getValueField(DESCRIPTION_OF_GOODS).split("\n").map(line => lineBreakAtBoundary(line, MAX_CHARS.description)).join("\n");

      // CM view
      let cmMark = "";
      let cmPackage = "";
      let cmDescription = "";
      containersManifest.forEach(cm => {
        cmMark += lineBreakAtBoundary(cm[getInqType(CM_MARK)], MAX_CHARS.mark) + "\n";
        cmPackage += `${cm[getInqType(CM_PACKAGE)]}\n${getPackageName(cm[getInqType(CM_PACKAGE_UNIT)])}`.split("\n").map(line => lineBreakAtBoundary(line, MAX_CHARS.package)).join("\n");
        cmDescription += lineBreakAtBoundary(cm[getInqType(CM_DESCRIPTION)], MAX_CHARS.description) + "\n";
      });

      setIsInBound({
        MD: checkMaxRows(
          containersDetail.length + 1, // 1 more dash line
          totalMark,
          totalPackage,
          totalDescription
        ),
        CM: checkMaxRows(
          containersDetail.length + containersManifest.length + 1, // 1 more dash line
          cmMark.trim().replace(/^\s+|\s+$/g, ''),
          cmPackage.trim().replace(/^\s+|\s+$/g, ''),
          cmDescription.trim().replace(/^\s+|\s+$/g, '')
        )
      });
    }
  }, [containersDetail, containersManifest]);

  const renderMDCMTable = () => {
    if (drfView === "CM" && isInBound[drfView] && containersManifest.length) {
      return containersManifest.map((cm, index) => (
        <Grid container item key={index} className={classes.content_L}>
          <Grid item style={{ width: WIDTH_COL_MARK, borderRight: BORDER, textAlign: 'left', paddingTop: 20, ...(index === 0 && { paddingTop: 5 }) }}>
            {cm[getInqType(CM_MARK)]}
          </Grid>
          <Grid item style={{ width: WIDTH_COL_PKG, borderRight: BORDER, textAlign: 'center', paddingTop: 20, ...(index === 0 && { paddingTop: 5 }) }}>
            <Grid item style={{ textAlign: 'end' }}>
              <span>{cm[getInqType(CM_PACKAGE)]}</span>
              <br />
              <span>{getPackageName(cm[getInqType(CM_PACKAGE_UNIT)])}</span>
            </Grid>
          </Grid>
          <Grid style={{ width: WIDTH_COL_HM, borderRight: BORDER, boxSizing: 'border-box' }}></Grid>
          <Grid item style={{ width: WIDTH_COL_DOG, borderRight: BORDER, paddingLeft: 3, paddingTop: 20, ...(index === 0 && { paddingTop: 5 }) }}>
            {cm[getInqType(CM_DESCRIPTION)]}
          </Grid>
          <Grid item style={{ width: WIDTH_COL_WEIGHT, borderRight: BORDER, textAlign: 'end', paddingTop: 20, ...(index === 0 && { paddingTop: 5 }) }}>
            {`${cm[getInqType(CM_WEIGHT)]} ${cm[getInqType(CM_WEIGHT_UNIT)]}`}
          </Grid>
          <Grid item style={{ width: WIDTH_COL_MEAS, textAlign: 'end', paddingTop: 20, ...(index === 0 && { paddingTop: 5 }) }}>
            {`${cm[getInqType(CM_MEASUREMENT)]} ${cm[getInqType(CM_MEASUREMENT_UNIT)]}`}
          </Grid>
        </Grid>
      ))
    } else if (drfView === "MD" && isInBound[drfView]) {
      return <Grid container item className={classes.content_L}>
        <Grid item style={{ width: WIDTH_COL_MARK, borderRight: BORDER, textAlign: 'left', paddingTop: 5, whiteSpace: 'pre-wrap' }}>
          {getValueField(SHIPPING_MARK)}
        </Grid>
        <Grid item style={{ width: WIDTH_COL_PKG, borderRight: BORDER, textAlign: 'center', paddingTop: 5 }}>
          <Grid item style={{ textAlign: 'end' }}>
            <span>{drfMD[TOTAL_PACKAGE]}</span>
            <br />
            <span>{getPackageName(drfMD[TOTAL_PACKAGE_UNIT])}</span>
          </Grid>
        </Grid>
        <Grid item style={{ width: WIDTH_COL_HM, borderRight: BORDER }}></Grid>
        <Grid item style={{ width: WIDTH_COL_DOG, borderRight: BORDER, paddingLeft: 3, paddingTop: 5, whiteSpace: 'pre-wrap' }}>
          {getValueField(DESCRIPTION_OF_GOODS)}
        </Grid>
        <Grid item style={{ width: WIDTH_COL_WEIGHT, borderRight: BORDER, textAlign: 'end', paddingTop: 5 }}>
          {`${drfMD[TOTAL_WEIGHT]} ${drfMD[TOTAL_WEIGHT_UNIT]}`}
        </Grid>
        <Grid item style={{ width: WIDTH_COL_MEAS, textAlign: 'end', paddingTop: 5 }}>
          {`${drfMD[TOTAL_MEASUREMENT]} ${drfMD[TOTAL_MEASUREMENT_UNIT]}`}
        </Grid>
      </Grid>
    } else {
      return <Grid container item className={classes.content_L}>
        <Grid item style={{ width: WIDTH_COL_MARK, borderRight: BORDER, textAlign: 'center', padding: '8px' }} />
        <Grid item style={{ width: WIDTH_COL_PKG, borderRight: BORDER, textAlign: 'center', padding: '8px' }} />
        <Grid item style={{ width: WIDTH_COL_HM, borderRight: BORDER, boxSizing: 'border-box' }} />
        <Grid item style={{ width: WIDTH_COL_DOG, borderRight: BORDER, padding: '8px' }} />
        <Grid item style={{ width: WIDTH_COL_WEIGHT, borderRight: BORDER, textAlign: 'end', padding: '8px' }} />
        <Grid item style={{ width: WIDTH_COL_MEAS, textAlign: 'end', padding: '8px' }} />
      </Grid>
    }
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.layout}>
        <div className={classes.header} style={{ display: 'flex' }}>
          <img className={classes.logo} src="assets/images/logos/one_logo.svg" />
          <div
            className={classes.tittle_L}
            style={{ color: 'rgb(0, 0, 255)', textAlign: 'center' }}>
            DRAFT - NON NEGOTIABLE
          </div>
          <div style={{ width: '30%', paddingTop: 15 }}>
            <div className={classes.page_Number}>
              PAGE: <p className={classes.page_Count}>1</p> OF <p className={classes.page_Count}>{totalPage}</p>
            </div>
            <span className={classes.blType}>
              {getValueField(BL_TYPE) ? getValueField(BL_TYPE) === "W" ? "SEAWAY BILL" : "ORIGINAL B/L" : ""}
            </span>
          </div>
        </div>

        <Grid container style={{ display: 'flex', marginTop: 15 }}>
          <Grid item xs={7} style={{
            borderTop: BORDER,
            borderBottom: BORDER,
            borderRight: BORDER,
          }}>
            <div className={classes.tittle_M}>SHIPPER/EXPORTER</div>
            <div className={classes.content_L} style={{ width: '70%' }}>
              <span className={classes.shipper}>
                {(getValueField(SHIPPER) && isJsonText(getValueField(SHIPPER))) ?
                  ((JSON.parse(getValueField(SHIPPER)).name === NO_CONTENT_AMENDMENT) ? ''
                    : `${JSON.parse(getValueField(SHIPPER)).name}\n${JSON.parse(getValueField(SHIPPER)).address}`)
                  : getValueField(SHIPPER).replace(NO_CONTENT_AMENDMENT, '')}
              </span>
            </div>
          </Grid>
          <Grid container item xs={5} style={{
            borderTop: BORDER,
            borderBottom: BORDER,
          }}>
            <Grid container item style={{
              borderBottom: BORDER,
              maxHeight: '70px'
            }}>
              <Grid item xs={6} style={{
                borderRight: BORDER,
              }}>
                <div className={classes.tittle_M}>BOOKING NO.</div>
                <div className={clsx(classes.content_L, classes.bkgNo)} data-type="textarea">
                  {getValueField(BOOKING_NO)}
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
            borderBottom: BORDER,
          }}>
            <Grid container item xs={7} style={{
              borderRight: BORDER,
            }}>
              <Grid item xs={12} style={{
                borderBottom: BORDER,
              }}>
                <div className={classes.tittle_M}>CONSIGNEE</div>
                <span className={clsx(classes.consignee, classes.content_L)} style={{ width: '70%' }}>
                  {(getValueField(CONSIGNEE) && isJsonText(getValueField(CONSIGNEE))) ?
                    ((JSON.parse(getValueField(CONSIGNEE)).name === NO_CONTENT_AMENDMENT) ? ''
                      : `${JSON.parse(getValueField(CONSIGNEE)).name}\n${JSON.parse(getValueField(CONSIGNEE)).address}`)
                    : getValueField(CONSIGNEE).replace(NO_CONTENT_AMENDMENT, '')}
                </span>
              </Grid>
              <Grid item xs={12}>
                <div className={classes.tittle_M}>
                  {`NOTIFY PARTY (It is agreed that no responsibility shall be attached to the Carrier or its Agents for failure to notify)`}
                </div>
                <span className={clsx(classes.notify, classes.content_L)}>
                  {(getValueField(NOTIFY) && isJsonText(getValueField(NOTIFY))) ?
                    ((JSON.parse(getValueField(NOTIFY)).name === NO_CONTENT_AMENDMENT) ? ''
                      : `${JSON.parse(getValueField(NOTIFY)).name}\n${JSON.parse(getValueField(NOTIFY)).address}`)
                    : getValueField(NOTIFY).replace(NO_CONTENT_AMENDMENT, '')}
                </span>
              </Grid>

              <Grid container item>
                <Grid item xs={6} style={{
                  borderRight: BORDER,
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
                  {getValueField(FORWARDER)}
                </span>
              </Grid>
              <Grid item style={{ borderTop: BORDER }}>
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

          <Grid container item style={{ borderBottom: BORDER_BOLD }}>
            <Grid container item xs={12} style={{ borderBottom: BORDER }}>
              <Grid container item xs={7} style={{ borderRight: BORDER }}>
                <Grid item xs={6} style={{ borderRight: BORDER }}>
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
              <Grid container item xs={7} style={{ borderRight: BORDER }}>
                <Grid item xs={6} style={{ borderRight: BORDER }}>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className={classes.content_L}>
                      {getValueField(TYPE_OF_MOVEMENT)}
                    </span>
                    <span className={classes.content_L}>
                      {getValueField(RD_TERMS)}
                    </span>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid container item style={{ minHeight: 35 }}>
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
            <Grid container item style={{ borderTop: BORDER, borderBottom: BORDER }}>
              <Grid item className={classes.th} style={{ width: WIDTH_COL_MARK, borderRight: BORDER }}>
                <div className={classes.tittle_S}>
                  <span className={classes.tittle_S}>CNTR. NOS. W/SEAL NOS.</span>
                  <br />
                  <span className={classes.tittle_S}>{`MARKS & NUMBERS`}</span>
                </div>
              </Grid>
              <Grid item className={classes.th} style={{ width: WIDTH_COL_PKG, borderRight: BORDER }}>
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
              <Grid item className={classes.th} style={{ width: WIDTH_COL_HM, borderRight: BORDER }}>
                <div className={classes.declaration_L}>
                  <div className={classes.tittle_S}>
                    <span className={classes.tittle_S}>H</span>
                    <br />
                    <span className={classes.tittle_S}>M</span>
                  </div>
                </div>
              </Grid>
              <Grid item className={classes.th} style={{ width: WIDTH_COL_DOG, borderRight: BORDER }}>
                <div className={classes.declaration_L}>
                  <div className={classes.tittle_S}>
                    DESCRIPTION OF GOODS
                  </div>
                </div>
              </Grid>
              <Grid item className={classes.th} style={{ width: WIDTH_COL_WEIGHT, borderRight: BORDER }}>
                <div className={classes.declaration_L}>
                  <div className={classes.tittle_S}>
                    GROSS WEIGHT
                  </div>
                </div>
              </Grid>
              <Grid item className={classes.th} style={{ width: WIDTH_COL_MEAS }}>
                <div className={classes.declaration_L}>
                  <div className={classes.tittle_S}>
                    GROSS MEASUREMENT
                  </div>
                </div>
              </Grid>
            </Grid>

            <Grid container style={!isInBound[drfView] ? { height: 320 } : {}}>
              <Grid container item>
                <Grid item style={{ width: WIDTH_COL_MARK, borderRight: BORDER }}>
                  <div className={classes.content_M} style={{ paddingTop: 5 }}>
                    {containersDetail &&
                      containersDetail.map((cd, idx) => (
                        (idx < MAX_ROWS_CD) && <span key={idx} style={{ whiteSpace: 'pre', lineHeight: '20px' }}>
                          {`${formatNoneContNo(cd[getInqType(CONTAINER_NUMBER)])}    / ${cd[getInqType(CONTAINER_SEAL)] || ''}    /  ${cd[getInqType(CONTAINER_PACKAGE)] || ''} ${getPackageName(cd[getInqType(CONTAINER_PACKAGE_UNIT)]) || ''}  /  ${cd[getInqType(CONTAINER_TYPE)] || ''}  /  ${cd[getInqType(CONTAINER_WEIGHT)] || ''} ${cd[getInqType(CONTAINER_WEIGHT_UNIT)] || ''}  /  ${cd[getInqType(CONTAINER_MEASUREMENT)] || ''} ${cd[getInqType(CONTAINER_MEASUREMENT_UNIT)] || ''}`}
                          <br />
                        </span>
                      ))
                    }
                    {containersDetail.length <= MAX_ROWS_CD &&
                      <span className={classes.description_payment_dash}>
                        -----------------------------------------------------------------------------------------------------------------------------------------
                      </span>
                    }
                  </div>
                </Grid>
                <Grid item style={{ width: WIDTH_COL_PKG, borderRight: BORDER }} />
                <Grid item style={{ width: WIDTH_COL_HM, borderRight: BORDER }} />
                <Grid item style={{ width: WIDTH_COL_DOG, borderRight: BORDER }} />
                <Grid item style={{ width: WIDTH_COL_WEIGHT, borderRight: BORDER }} />
                <Grid item style={{ width: WIDTH_COL_MEAS }} />
              </Grid>

              <Grid container item style={isInBound[drfView] ? { minHeight: 200 } : {}}>
                {renderMDCMTable()}
              </Grid>
            </Grid>
          </Grid>

          <Grid container justify="center">
            <span className={classes.tittle_break_line}>** TO BE CONTINUED ON ATTACHED LIST **</span>
          </Grid>

          <Grid container style={{ display: 'flex', alignItems: 'center', paddingTop: '12px', paddingBottom: '12px' }}>
            <span className={classes.note}>Declared Cargo Value US $</span>
            <span className={classes.line_usd}>&emsp;_____________________&emsp;</span>
            <span className={classes.note}>
              {"If Merchant enters a value, Carrier's limitation of liability shall not apply and the ad valorem rate will be charged"}
            </span>
          </Grid>

          <Grid container style={{ borderTop: BORDER_BOLD, borderBottom: BORDER }}>
            <Grid container item xs={10}>
              <Grid container item>
                <Grid item xs={4}
                  style={{
                    borderRight: BORDER,
                    borderBottom: BORDER,
                  }}>
                  <div className={classes.tittle_M}>FREIGHT & CHARGES PAYABLE AT / BY:</div>
                  <div className={classes.content_L} style={{ minHeight: '35px' }}>
                    <span>{getValueField(FREIGHT_CHARGES)}</span>
                  </div>
                </Grid>
                <Grid container item xs={6}
                  style={{
                    borderRight: BORDER,
                    borderBottom: BORDER,
                    textAlign: 'center'
                  }}>
                  <Grid item xs={4} style={{ borderRight: BORDER, textAlign: 'center' }}>
                    <div className={classes.tittle_M} style={{ minWidth: '160px' }} >SERVICE CONTRACT NO.</div>
                    <div className={classes.content_L} style={{ minHeight: '35px' }}>
                      <span>{getValueField(SERVICE_CONTRACT_NO)}</span>
                    </div>
                  </Grid>
                  <Grid item xs={4} style={{ borderRight: BORDER, textAlign: 'center' }}>
                    <div className={classes.tittle_M} >DOC FORM NO.</div>
                    <div className={classes.content_L} style={{ minHeight: '35px' }}>
                      <span>{getValueField(DOC_FORM_NO)}</span>
                    </div>
                  </Grid>
                  <Grid item xs={4} style={{ textAlign: 'center' }}>
                    <div className={classes.tittle_M}>COMMODITY CODE</div>
                    <div className={classes.content_L} style={{ minHeight: '35px' }} />
                  </Grid>
                </Grid>
                <Grid item xs={2}
                  style={{
                    borderRight: BORDER,
                    borderBottom: BORDER,
                  }}>
                  <div className={classes.tittle_M}>EXCHANGE RATE</div>
                  <div className={classes.content_L} style={{ minHeight: '35px' }}>
                    <span>{getValueField(EXCHANGE_RATE)}</span>
                  </div>
                </Grid>
              </Grid>

              <Grid container item style={{ borderRight: BORDER }}>
                <Grid container item xs={10}
                  style={{
                    borderLeft: BORDER,
                  }}>
                  <Grid item xs={2} style={{ textAlign: 'center' }}>
                    <div className={classes.tittle_M} style={{ borderBottom: BORDER }}>
                      CODE
                    </div>
                    <div className={classes.content_L} style={{ minHeight: '250px' }}>
                      {getValueField(RATING_DETAIL) &&
                        <span style={{
                          position: 'relative',
                          textTransform: 'none',
                          whiteSpace: 'pre-wrap	',
                          wordWrap: 'break-word	',
                          display: 'flex',
                          alignItems: 'flex-end',
                          textAlign: 'start',
                          width: 360
                        }}>
                          {getValueField(RATING_DETAIL).code}
                        </span>}
                    </div>
                  </Grid>
                  <Grid item xs={2} style={{ borderRight: BORDER, textAlign: 'center' }}>
                    <div className={classes.tittle_M} style={{ borderBottom: BORDER }}>
                      TARIFF ITEM
                    </div>
                    <div className={classes.content_L}>
                      <span>{getValueField(TARIFF_ITEM)}</span>
                    </div>
                  </Grid>
                  <Grid item xs={2} style={{ borderRight: BORDER, textAlign: 'center' }}>
                    <div className={classes.tittle_M} style={{ borderBottom: BORDER }}>
                      FREIGHTED AS
                    </div>
                    <div className={classes.content_L}>
                      {getValueField(RATING_DETAIL) &&
                        <span style={{
                          position: 'relative',
                          textTransform: 'none',
                          whiteSpace: 'pre-wrap	',
                          wordWrap: 'break-word	',
                          display: 'flex',
                          alignItems: 'flex-end',
                          textAlign: 'end',
                          justifyContent: 'flex-end',
                        }}>
                          {getValueField(RATING_DETAIL).freightedAs}
                        </span>}
                    </div>
                  </Grid>
                  <Grid item xs={2} style={{ borderRight: BORDER, textAlign: 'center' }}>
                    <div className={classes.tittle_M} style={{ borderBottom: BORDER }}>
                      RATE
                    </div>
                    <div className={classes.content_L}>
                      {getValueField(RATING_DETAIL) &&
                        <span style={{
                          position: 'relative',
                          textTransform: 'none',
                          whiteSpace: 'pre-wrap	',
                          wordWrap: 'break-word	',
                          display: 'flex',
                          alignItems: 'flex-end',
                          textAlign: 'center',
                          justifyContent: 'space-around',
                        }}>
                          {getValueField(RATING_DETAIL).rate}
                        </span>}
                    </div>
                  </Grid>
                  <Grid item xs={2} style={{ borderRight: BORDER, textAlign: 'center' }}>
                    <div className={classes.tittle_M} style={{ borderBottom: BORDER }}>
                      PREPAID
                    </div>
                    <div className={classes.content_L} >
                      {getValueField(RATING_DETAIL) && getValueField(RATING_DETAIL).prepaid.map(item => {
                        if (item.currencyCode) {
                          return (
                            <div role='group'>
                              <span style={{
                                position: 'relative',
                                textTransform: 'none',
                                display: 'inline-block',
                                float: 'left'
                              }}>
                                {item.currencyCode}
                              </span>
                              <span style={{
                                position: 'relative',
                                textTransform: 'none',
                                display: 'inline-block',
                                float: 'right'
                              }}>
                                {item.prepaidValue.toFixed(2)}
                              </span>
                              <br></br>
                            </div>
                          )
                        } else {
                          return <br></br>
                        }
                      })}
                    </div>
                  </Grid>
                  <Grid item xs={2} style={{ textAlign: 'center' }}>
                    <div className={classes.tittle_M} style={{ borderBottom: BORDER }}>
                      COLLECT
                    </div>
                    <div className={classes.content_L}>
                      {getValueField(RATING_DETAIL) && getValueField(RATING_DETAIL).collect.map(item => {
                        if (item.currencyCode) {
                          return (
                            <div role='group'>
                              <span style={{
                                position: 'relative',
                                textTransform: 'none',
                                display: 'inline-block',
                                float: 'left'
                              }}>
                                {item.currencyCode}
                              </span>
                              <span style={{
                                position: 'relative',
                                textTransform: 'none',
                                display: 'inline-block',
                                float: 'right'
                              }}>
                                {item.prepaidValue.toFixed(2)}
                              </span>
                              <br></br>
                            </div>
                          )
                        } else {
                          return <br></br>
                        }
                      })}
                    </div>
                  </Grid>
                </Grid>

                <Grid container item xs={2} style={{ borderLeft: BORDER }}>
                  {getValueField(RATING_DETAIL) &&
                    <span style={{
                      position: 'relative',
                      textTransform: 'none',
                      whiteSpace: 'pre-wrap	',
                      wordWrap: 'break-word	',
                      display: 'flex',
                      alignItems: 'flex-start',
                      textAlign: 'start',
                      fontFamily: 'Courier, serif',
                      fontSize: 16.5 /*1.7vw*/,
                      lineHeight: '1.0',
                      color: '#4A4A4A',
                      top: 4,
                    }}>
                      {"\n" + getValueField(RATING_DETAIL).exchangeRate}
                    </span>
                  }
                </Grid>
              </Grid>
            </Grid>

            <Grid container item xs={2} direction='column'>
              <Grid item style={{ borderBottom: BORDER }}>
                <div className={classes.tittle_M_gray} style={{ minHeight: '150px' }}>[1] ORIGINAL BILLS(S) HAVE BEEN SIGNED</div>
              </Grid>

              <Grid item style={{ borderBottom: BORDER }}>
                <div className={classes.tittle_M}>DATE CARGO RECEIVED</div>
                <div className={classes.content_L} style={{ minHeight: '25px' }}>
                  <span>{getValueField(DATE_CARGO) && formatDate(getValueField(DATE_CARGO), 'DD MMM YYYY')}</span>
                </div>
              </Grid>
              <Grid item style={{ borderBottom: BORDER }}>
                <div className={classes.tittle_M}>DATE LADEN ON BOARD</div>
                <div className={classes.content_L} style={{ minHeight: '25px' }}>
                  <span>{getValueField(DATE_LADEN) && formatDate(getValueField(DATE_LADEN), 'DD MMM YYYY')}</span>
                </div>
              </Grid>
              <Grid item style={{ borderBottom: BORDER }}>
                <div className={classes.tittle_M}>PLACE OF BILL(S) ISSUE</div>
                <div className={classes.content_L} style={{ minHeight: '25px' }}>
                  <span>{getValueField(PLACE_OF_BILL)}</span>
                </div>
              </Grid>
              <Grid item>
                <div className={classes.tittle_M}>DATED</div>
                <div className={classes.content_L} style={{ minHeight: '25px' }}>
                  <span>{getValueField(DATED) && formatDate(getValueField(DATED), 'DD MMM YYYY')}</span>
                </div>
              </Grid>
            </Grid>
          </Grid>

          <Grid container item xs={10}>
            <Grid container item xs={10}>
              <Grid item xs={8} style={{ minHeight: '100px', borderRight: BORDER }} >
                <div>
                  <div className={classes.tittle_M} style={{ width: 400, float: 'left' }}>
                    {'The printed terms and conditions on this Bill are available at its website at www.one-line.com'}
                  </div>

                  <div className={classes.tittle_M} style={{ float: 'right', paddingRight: 10 }} >
                    TOTAL
                  </div>
                </div>
                {getValueField(TOTAL_PREPAID).freightTerm === 'PREPAID' && getValueField(TOTAL_PREPAID).currency !== '' &&
                  <div className={classes.content_L} style={{ position: 'relative', top: '69.5%', textTransform: 'none', whiteSpace: 'pre-wrap	', wordWrap: 'break-word	', width: 800, float: 'left' }} >
                    {`TOTAL PREPAID IN PAYMENT CURRENT ${getValueField(TOTAL_PREPAID).currency}   ${getValueField(TOTAL_PREPAID).total}    ${getValueField(TOTAL_PREPAID).loc}`}
                  </div>
                }
              </Grid>
              <Grid item xs={2} style={{ borderRight: BORDER }}>
                <div className={classes.content_M} style={{ borderBottom: BORDER, minHeight: '100px' }}>
                  {getValueField(RATING_DETAIL) && Object.entries(findSumFromArray(getValueField(RATING_DETAIL).prepaid)).map(([key, value], idx) => {
                    return (
                      <div key={idx + key} role='group'>
                        <span style={{ float: 'left' }}>{key}</span>
                        <span style={{ float: 'right' }}>{value.toFixed(2)}</span>
                        <br></br>
                      </div>
                    )
                  })}
                </div>
              </Grid>
              <Grid item xs={2} style={{ borderRight: BORDER }}>
                <div className={classes.content_M} style={{ borderBottom: BORDER, minHeight: '100px' }}>
                  {getValueField(RATING_DETAIL) && Object.entries(findSumFromArray(getValueField(RATING_DETAIL).collect)).map(([key, value], idx) => {
                    return (
                      <div key={idx + key} role='group'>
                        <span style={{ float: 'left' }}>{key}</span>
                        <span style={{ float: 'right' }}>{value.toFixed(2)}</span>
                        <br></br>
                      </div>
                    )
                  })}
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

      {!isInBound[drfView] &&
        <Rider
          drfMD={drfMD}
          containersDetail={containersDetail}
          containersManifest={containersManifest}
          setTotalPage={setTotalPage}
        />
      }
    </div >
  );
};

export default DraftPage;
