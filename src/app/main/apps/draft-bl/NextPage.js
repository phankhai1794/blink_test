import React from 'react';
import { VESSEL_VOYAGE, CONTAINER_NUMBER, CONTAINER_SEAL, CONTAINER_PACKAGE, CONTAINER_PACKAGE_UNIT, CONTAINER_TYPE, CONTAINER_WEIGHT, CONTAINER_WEIGHT_UNIT, CONTAINER_MEASUREMENT, CONTAINER_MEASUREMENT_UNIT, CM_MARK, CM_PACKAGE, CM_PACKAGE_UNIT, CM_DESCRIPTION, CM_WEIGHT, CM_WEIGHT_UNIT, CM_MEASUREMENT, CM_MEASUREMENT_UNIT, SHIPPING_MARK, DESCRIPTION_OF_GOODS, TOTAL_PACKAGE, TOTAL_PACKAGE_UNIT, TOTAL_WEIGHT, TOTAL_WEIGHT_UNIT, TOTAL_MEASUREMENT, TOTAL_MEASUREMENT_UNIT } from '@shared/keyword';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { packageUnitsJson } from '@shared/units';

const BORDER = '1px solid #2929FF';
const WIDTH_COL_MARK = 220;
const WIDTH_COL_PKG = 163;
const WIDTH_COL_HM = 15;
const WIDTH_COL_DOG = 370;
const WIDTH_COL_WEIGHT = 191;
const WIDTH_COL_MEAS = 191;

const useStyles = makeStyles((theme) => ({
  layout: {
    marginTop: 30,
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
  tittle_L: {
    fontFamily: 'Courier, serif',
    fontSize: 35 /*2.5vw*/,
    fontWeight: 'bold',
    width: '65%',
    paddingTop: 15,
    marginLeft: 120
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
  content_L: {
    fontFamily: 'Courier, serif',
    fontSize: 16.5 /*1.7vw*/,
    lineHeight: '1.0',
    color: '#4A4A4A'
  },
  content_M: {
    fontFamily: 'Courier, serif',
    fontSize: 16.5 /*1.5vw*/,
    lineHeight: '1.0',
    whiteSpace: 'nowrap',
    color: '#4A4A4A'
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
}));

const NextPage = ({ drfMD, containersDetail, containersManifest, currentPage, totalPage }) => {
  const classes = useStyles();
  const [metadata, myBL, content, drfView] = useSelector(({ draftBL }) => [
    draftBL.metadata,
    draftBL.myBL,
    draftBL.content,
    draftBL.drfView
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

  const getPackageName = (packageCode) => packageUnitsJson.find(pkg => pkg.code === packageCode)?.description;

  const renderMDCMTable = () => {
    if (drfView === "CM") {
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
    } else {
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
    }
  }

  return (
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
            PAGE: <p className={classes.page_Count}>{currentPage}</p> OF <p className={classes.page_Count}>{totalPage}</p>
          </div>
        </div>
      </div>

      <Grid container style={{ marginTop: 15 }}>
        <Grid item xs={7} style={{ paddingLeft: 20 }}>
          VESSEL VOYAGE: {getValueField(VESSEL_VOYAGE)}
        </Grid>
        <Grid item xs={5}>
          B/L NO.: {myBL.bkgNo && `ONYE${myBL.bkgNo}`}
        </Grid>
      </Grid>

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

      {Boolean(containersDetail.length) &&
        <Grid container item>
          <Grid item style={{ width: WIDTH_COL_MARK, borderRight: BORDER }}>
            <div className={classes.content_M} style={{ paddingTop: 5 }}>
              {containersDetail.map((cd, idx) => (
                <span key={idx} style={{ whiteSpace: 'pre', lineHeight: '20px' }}>
                  {`${cd[getInqType(CONTAINER_NUMBER)] || ''}    / ${cd[getInqType(CONTAINER_SEAL)] || ''}    /  ${cd[getInqType(CONTAINER_PACKAGE)] || ''} ${getPackageName(cd[getInqType(CONTAINER_PACKAGE_UNIT)]) || ''}  /  ${cd[getInqType(CONTAINER_TYPE)] || ''}  /  ${cd[getInqType(CONTAINER_WEIGHT)] || ''} ${cd[getInqType(CONTAINER_WEIGHT_UNIT)] || ''}  /  ${cd[getInqType(CONTAINER_MEASUREMENT)] || ''} ${cd[getInqType(CONTAINER_MEASUREMENT_UNIT)] || ''}`}
                  <br />
                </span>
              ))
              }
              <span className={classes.description_payment_dash}>
                -----------------------------------------------------------------------------------------------------------------------------------------
              </span>
            </div>
          </Grid>
          <Grid item style={{ width: WIDTH_COL_PKG, borderRight: BORDER }} />
          <Grid item style={{ width: WIDTH_COL_HM, borderRight: BORDER }} />
          <Grid item style={{ width: WIDTH_COL_DOG, borderRight: BORDER }} />
          <Grid item style={{ width: WIDTH_COL_WEIGHT, borderRight: BORDER }} />
          <Grid item style={{ width: WIDTH_COL_MEAS }} />
        </Grid>
      }

      <Grid container>
        {renderMDCMTable()}
      </Grid>

      {/* If is last page */}
      {(currentPage === totalPage) &&
        <Grid container item>
          <Grid item style={{ width: WIDTH_COL_MARK, borderRight: BORDER, minHeight: '100vh' }}>
            <div className={classes.content_M} style={{ paddingTop: 5 }}>
              <span className={classes.description_payment_dash}>
                -----------------------------------------------------------------------------------------------------------------------------------------
              </span>
              <br />
              <span>
                OCEAN FREIGHT PREPAID
              </span>
            </div>
          </Grid>
          <Grid item style={{ width: WIDTH_COL_PKG, borderRight: BORDER }} />
          <Grid item style={{ width: WIDTH_COL_HM, borderRight: BORDER }} />
          <Grid item style={{ width: WIDTH_COL_DOG, borderRight: BORDER }} />
          <Grid item style={{ width: WIDTH_COL_WEIGHT, borderRight: BORDER }} />
          <Grid item style={{ width: WIDTH_COL_MEAS }} />
        </Grid>
      }
    </div>
  );
};

export default NextPage;
