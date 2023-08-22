import React, { useEffect, useState } from 'react';
import { Collapse, ListItem, ListItemText } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import {
  CONTAINER_DETAIL,
  CONTAINER_LIST,
  CONTAINER_MANIFEST,
  CONTAINER_NUMBER,
  CONTAINER_SEAL
} from '@shared/keyword';
import { parseNumberValue } from '@shared';

import * as InquiryActions from '../store/actions/inquiry';

import ContainerDetailForm from './ContainerDetailForm';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiListItem-button': {
      height: 50,
      '& .MuiListItemText-root': {
        position: 'absolute',
        left: '5rem'
      },
      '& .MuiSvgIcon-root': {
        position: 'absolute'
      },
      '& .MuiListItem-gutters': {
        paddingLeft: 0,
        paddingRight: 0
      },
      '& .MuiTypography-body1': {
        fontFamily: 'Montserrat'
      }
    }
  }
}));

const ContainerDetailInquiry = ({
  setDataCD,
  setDataCM,
  getDataCD,
  getDataCM,
  disableInput,
  isAllowEdit,
  currentQuestion
}) => {
  const user = useSelector(({ user }) => user);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [openCD, setOpenCD] = useState(false);
  const [openCM, setOpenCM] = useState(false);
  const [disableEdit, setDisableEdit] = useState(false);
  const [isShowTableCdCm, setIsShowTableCdCM] = useState([]);

  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);

  const getType = (type) => {
    return metadata.inq_type?.[type] || '';
  };
  const getField = (field) => {
    return metadata.field?.[field] || '';
  };
  const containerCheck = [getField(CONTAINER_DETAIL), getField(CONTAINER_MANIFEST)];

  useEffect(() => {
    let inqTypes = [];
    if (currentQuestion && containerCheck.includes(currentQuestion.field)) {
      inqTypes.push(currentQuestion.inqType);
      if (currentQuestion.inqGroup && currentQuestion.inqGroup.length) {
        const inqTypeGroupMap = currentQuestion.inqGroup.map((i) => i.inqType);
        inqTypes = [...inqTypes, ...inqTypeGroupMap];
      }
      const getFieldAndTypes = [];
      metadata.inq_type_options.forEach((t) => {
        if (inqTypes.includes(t.value)) {
          getFieldAndTypes.push(t);
        }
      });
      if (getFieldAndTypes.length) {
        const isChecked = [];
        getFieldAndTypes.forEach((g) => {
          if (g.field && g.field.length) {
            g.field.forEach((f) => {
              if (containerCheck.includes(f) && !isChecked.includes(f)) {
                isChecked.push(f);
              }
            });
          }
        });
        setIsShowTableCdCM(isChecked);
      }
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (user.role === 'Admin') {
      setDisableEdit(disableInput);
    } else if (user.role === 'Guest') {
      if (disableInput !== null) setDisableEdit(disableInput);
    }
  }, [disableInput]);

  const handleClickCollapse = (isCD) => {
    isCD ? setOpenCD(!openCD) : setOpenCM(!openCM);
  };

  const autoUpdateCDCM = (isEditedCD, valueUpdated) => {
    // CASE 1-1 CD CM
    if (getDataCD.length === 1 && getDataCM.length === 1) {
      const contentCM = getDataCM;
      const contentCD = getDataCD;
      if (isEditedCD) {
        if (contentCM) {
          contentCM[0][getType(CONTAINER_NUMBER)] = valueUpdated[0][getType(CONTAINER_NUMBER)];
          CONTAINER_LIST.cdNumber.map((key, index) => {
            contentCM[0][getType(CONTAINER_LIST.cmNumber[index])] = valueUpdated[0][getType(key)];
          });
          CONTAINER_LIST.cdUnit.map((key, index) => {
            contentCM[0][getType(CONTAINER_LIST.cmUnit[index])] = valueUpdated[0][getType(key)];
          });
          // contentCM[0][getType(CONTAINER_SEAL)] = valueUpdated[0][getType(CONTAINER_SEAL)];
          setDataCM(contentCM);
          dispatch(InquiryActions.setDataCmInq(contentCM));
        }
      } else {
        if (contentCD) {
          contentCD[0][getType(CONTAINER_NUMBER)] = valueUpdated[0][getType(CONTAINER_NUMBER)];
          CONTAINER_LIST.cmNumber.map((key, index) => {
            contentCD[0][getType(CONTAINER_LIST.cdNumber[index])] = valueUpdated[0][getType(key)];
          });
          CONTAINER_LIST.cmUnit.map((key, index) => {
            contentCD[0][getType(CONTAINER_LIST.cdUnit[index])] = valueUpdated[0][getType(key)];
          });
          setDataCD(contentCD);
          dispatch(InquiryActions.setDataCdInq(contentCD));
        }
      }
    } else {
      let contsNoChange = {};
      const contsNo = [];
      const cdContent = getDataCD;
      const cmContent = getDataCM;
      const fieldCDCM = isEditedCD ? getDataCD : getDataCM;
      valueUpdated.forEach((obj, index) => {
        const containerNo = fieldCDCM[index] && fieldCDCM[index][getType(CONTAINER_NUMBER)];
        const getTypeName = Object.keys(metadata.inq_type).find(
          (key) => metadata.inq_type[key] === getType(CONTAINER_NUMBER)
        );
        if (getTypeName === CONTAINER_NUMBER && containerNo !== obj[getType(CONTAINER_NUMBER)]) {
          contsNoChange[containerNo] = obj[getType(CONTAINER_NUMBER)];
          contsNo.push(obj?.[metadata?.inq_type?.[CONTAINER_NUMBER]]);
        }
      });
      if (isEditedCD) {
        if (cmContent && cmContent.length) {
          // Auto Update container no CM
          cmContent.map((item) => {
            if (item[getType(CONTAINER_NUMBER)] in contsNoChange) {
              item[getType(CONTAINER_NUMBER)] = contsNoChange[item[getType(CONTAINER_NUMBER)]];
            }
          });
          valueUpdated.forEach((cd) => {
            let cmOfCd = [
              ...new Set(
                (cmContent || []).filter(
                  (cm) =>
                    cm?.[metadata?.inq_type?.[CONTAINER_NUMBER]] ===
                    cd?.[metadata?.inq_type?.[CONTAINER_NUMBER]]
                )
              )
            ];
            if (cmOfCd.length === 1) {
              CONTAINER_LIST.cdNumber.map((key, index) => {
                cmOfCd[0][getType(CONTAINER_LIST.cmNumber[index])] = cd[getType(key)];
              });
              CONTAINER_LIST.cdUnit.map((key, index) => {
                cmOfCd[0][getType(CONTAINER_LIST.cmUnit[index])] = cd[getType(key)];
              });
            }
          });
          setDataCM(cmContent);
          dispatch(InquiryActions.setDataCmInq(cmContent));
        }
      } else if (!isEditedCD) {
        cdContent.forEach((cm) => {
          let cmOfCd = [
            ...new Set(
              (valueUpdated || []).filter(
                (cd) =>
                  cm?.[metadata?.inq_type?.[CONTAINER_NUMBER]] ===
                  cd?.[metadata?.inq_type?.[CONTAINER_NUMBER]]
              )
            )
          ];
          if (cmOfCd.length > 0) {
            CONTAINER_LIST.cmNumber.map((key, index) => {
              let total = 0;
              cmOfCd.map((cm) => {
                total += parseNumberValue(cm[getType(key)]);
              });
              cm[getType(CONTAINER_LIST.cdNumber[index])] = parseFloat(total.toFixed(3));
            });
          }
        });
        setDataCD(cdContent);
        dispatch(InquiryActions.setDataCdInq(cdContent));
      }
    }
  };

  return (
    <div style={{ width: '100%', margin: '10px 0 10px 0' }} className={classes.root}>
      {isShowTableCdCm.includes(containerCheck[0]) && (
        <>
          <ListItem button onClick={() => handleClickCollapse(true)} className={classes.collapse}>
            <ListItemText primary="Container Detail" />
            {openCD ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openCD} timeout="auto" unmountOnExit>
            <ListItem>
              <ContainerDetailForm
                container={CONTAINER_DETAIL}
                setAddContent={(value) => {
                  autoUpdateCDCM(true, value);
                  setDataCD(value);
                  dispatch(InquiryActions.setDataCdInq(value));
                }}
                setEditContent={(value) => {}}
                originalValues={getDataCD}
                isPendingProcess={true}
                disableInput={disableEdit}
                isInqCDCM={true}
                isAllowEdit={isAllowEdit}
                currentQuestion={currentQuestion}
              />
            </ListItem>
          </Collapse>
        </>
      )}

      {isShowTableCdCm.includes(containerCheck[1]) && (
        <>
          <ListItem button onClick={() => handleClickCollapse(false)}>
            <ListItemText primary="Container Manifest" />
            {openCM ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openCM} timeout="auto" unmountOnExit>
            <ListItem>
              <ContainerDetailForm
                container={CONTAINER_MANIFEST}
                setAddContent={(value) => {
                  autoUpdateCDCM(false, value);
                  setDataCM(value);
                  dispatch(InquiryActions.setDataCmInq(value));
                }}
                setEditContent={(value) => {}}
                originalValues={getDataCM}
                isPendingProcess={true}
                disableInput={disableEdit}
                isInqCDCM={true}
                isAllowEdit={isAllowEdit}
                currentQuestion={currentQuestion}
              />
            </ListItem>
          </Collapse>
        </>
      )}
    </div>
  );
};

export default ContainerDetailInquiry;
