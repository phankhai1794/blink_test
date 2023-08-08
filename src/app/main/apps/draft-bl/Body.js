import React from 'react';
import { Grid } from '@material-ui/core';
import { formatNoneContNo } from '@shared';
import { packageUnitsJson, containerTypeUnit } from '@shared/units';
import { CONTAINER_NUMBER, CONTAINER_SEAL, CONTAINER_PACKAGE, CONTAINER_PACKAGE_UNIT, CONTAINER_TYPE, CONTAINER_WEIGHT, CONTAINER_WEIGHT_UNIT, CONTAINER_MEASUREMENT, CONTAINER_MEASUREMENT_UNIT, CM_MARK, CM_PACKAGE, CM_DESCRIPTION, CM_WEIGHT, CM_WEIGHT_UNIT, CM_MEASUREMENT, CM_MEASUREMENT_UNIT, CD_MOVE_TYPE } from '@shared/keyword';

const BORDER = '1px solid #2929FF';
const WIDTH_COL_MARK = 220;
const WIDTH_COL_PKG = 163;
const WIDTH_COL_HM = 15;
const WIDTH_COL_DOG = 370;
const WIDTH_COL_WEIGHT = 191;
const WIDTH_COL_MEAS = 191;

const Body = ({ isFirstPage, classes, data, getInqType, getPackageName }) => {
  return (
    <Grid container style={isFirstPage ? { maxHeight: 265, overflow: 'hidden' } : {}} >
      <Grid container item>
        <Grid item style={{ width: WIDTH_COL_MARK, borderRight: BORDER }}>
          <div className={classes.content_M} style={{ paddingTop: 5 }}>
            {Boolean(data[0].length) &&
              data[0].map((cd, idx) => (
                cd.dashLine ?
                  <span className={classes.description_payment_dash}>
                    -----------------------------------------------------------------------------------------------------------------------------------------
                  </span> :
                  <>
                    <span key={idx} style={{ whiteSpace: 'pre', lineHeight: '20px' }}>
                      {cd.autoGenNewLine ?
                        `                  ${cd[getInqType(CONTAINER_SEAL)]}` :
                        `${formatNoneContNo(cd[getInqType(CONTAINER_NUMBER)])}    /  ${cd[getInqType(CONTAINER_SEAL)] || ''}    /  ${cd[getInqType(CONTAINER_PACKAGE)] || ''} ${getPackageName(cd[getInqType(CONTAINER_PACKAGE_UNIT)], cd[getInqType(CONTAINER_PACKAGE)]) || ''}    /  ${cd[getInqType(CD_MOVE_TYPE)] || ''}    /  ${cd[getInqType(CONTAINER_TYPE)] ? containerTypeUnit.find(contType => contType.value === cd[getInqType(CONTAINER_TYPE)]).label : ''}    /  ${cd[getInqType(CONTAINER_WEIGHT)] || ''}${cd[getInqType(CONTAINER_WEIGHT_UNIT)] || ''}    /  ${cd[getInqType(CONTAINER_MEASUREMENT)] || ''}${cd[getInqType(CONTAINER_MEASUREMENT_UNIT)] || ''}`
                      }
                    </span>
                    <br />
                  </>
              ))
            }
          </div>
        </Grid>
        <Grid item style={{ width: WIDTH_COL_PKG, borderRight: BORDER }} />
        <Grid item style={{ width: WIDTH_COL_HM, borderRight: BORDER }} />
        <Grid item style={{ width: WIDTH_COL_DOG, borderRight: BORDER }} />
        <Grid item style={{ width: WIDTH_COL_WEIGHT, borderRight: BORDER }} />
        <Grid item style={{ width: WIDTH_COL_MEAS }} />
      </Grid>

      <Grid container item>
        {Boolean(data[1].length) &&
          data[1].map((cm, index) => (
            <Grid container item key={index} className={classes.content_L} style={{ whiteSpace: 'pre', lineHeight: '20px' }}>
              <Grid item style={{ width: WIDTH_COL_MARK, borderRight: BORDER, textAlign: 'left', paddingTop: 20, ...(index === 0 && { paddingTop: 5 }) }}>
                {cm[getInqType(CM_MARK)]?.join("\n")}
              </Grid>
              <Grid item style={{ width: WIDTH_COL_PKG, borderRight: BORDER, textAlign: 'center', paddingTop: 20, ...(index === 0 && { paddingTop: 5 }) }}>
                {cm[getInqType(CM_PACKAGE)] &&
                  <Grid item style={{ textAlign: 'end' }}>
                    <span>{cm[getInqType(CM_PACKAGE)][0]}</span>
                    <br />
                    <span>
                      {
                        getPackageName(
                          packageUnitsJson.find(pkg => pkg.description === cm[getInqType(CM_PACKAGE)][1])?.code || "",
                          cm[getInqType(CM_PACKAGE)][0]
                        )
                      }
                    </span>
                  </Grid >
                }
              </Grid >
              <Grid style={{ width: WIDTH_COL_HM, borderRight: BORDER, boxSizing: 'border-box' }}></Grid>
              <Grid item style={{ width: WIDTH_COL_DOG, borderRight: BORDER, paddingLeft: 3, paddingTop: 20, ...(index === 0 && { paddingTop: 5 }) }}>
                {cm[getInqType(CM_DESCRIPTION)]?.join("\n")}
              </Grid>
              <Grid item style={{ width: WIDTH_COL_WEIGHT, borderRight: BORDER, textAlign: 'end', paddingTop: 20, ...(index === 0 && { paddingTop: 5 }) }}>
                {`${cm[getInqType(CM_WEIGHT)] || ''}${cm[getInqType(CM_WEIGHT_UNIT)] || ''}`}
              </Grid>
              <Grid item style={{ width: WIDTH_COL_MEAS, textAlign: 'end', paddingTop: 20, ...(index === 0 && { paddingTop: 5 }) }}>
                {`${cm[getInqType(CM_MEASUREMENT)] || ''}${cm[getInqType(CM_MEASUREMENT_UNIT)] || ''}`}
              </Grid>
            </Grid>
          ))
        }
      </Grid>

      {Boolean(data[2].length) &&
        <Grid container item>
          <Grid item style={{ width: WIDTH_COL_MARK, borderRight: BORDER }}>
            <div className={classes.content_M} style={{ paddingTop: 5 }}>
              {data[2].map(line => (
                line.dashLine ?
                  <>
                    <span className={classes.description_payment_dash}>
                      -----------------------------------------------------------------------------------------------------------------------------------------
                    </span>
                    <br />
                  </> :
                  <>
                    <span style={{ width: 950 }}>
                      {line}
                    </span>
                    <br />
                  </>
              ))
              }
            </div>
          </Grid>
          <Grid item style={{ width: WIDTH_COL_PKG, borderRight: BORDER }} />
          <Grid item style={{ width: WIDTH_COL_HM, borderRight: BORDER }} />
          <Grid item style={{ width: WIDTH_COL_DOG, borderRight: BORDER }} />
          <Grid item style={{ width: WIDTH_COL_WEIGHT, borderRight: BORDER }} />
          <Grid item style={{ width: WIDTH_COL_MEAS }} />
        </Grid>
      }

      {Boolean(data[3].length) &&
        <Grid container item>
          <Grid
            item
            style={{
              width: WIDTH_COL_MARK,
              borderRight: BORDER,
              // ...(!isFirstPage && { minHeight: '100vh' })
              minHeight: '100vh'
            }}
          >
            <div className={classes.content_M} style={{ paddingTop: 5 }}>
              {data[3].map(line => (
                line.dashLine ?
                  <>
                    <span className={classes.description_payment_dash}>
                      -----------------------------------------------------------------------------------------------------------------------------------------
                    </span>
                    <br />
                  </> :
                  <>
                    <span style={{ width: 950, lineHeight: '20px' }}>
                      {line}
                    </span>
                    <br />
                  </>
              ))
              }
            </div>
          </Grid>
          <Grid item style={{ width: WIDTH_COL_PKG, borderRight: BORDER }} />
          <Grid item style={{ width: WIDTH_COL_HM, borderRight: BORDER }} />
          <Grid item style={{ width: WIDTH_COL_DOG, borderRight: BORDER }} />
          <Grid item style={{ width: WIDTH_COL_WEIGHT, borderRight: BORDER }} />
          <Grid item style={{ width: WIDTH_COL_MEAS }} />
        </Grid>
      }
    </Grid>
  );
};

export default Body;