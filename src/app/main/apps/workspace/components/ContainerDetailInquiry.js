import React, {useEffect, useState} from 'react';
import {Collapse, ListItem, ListItemText} from "@material-ui/core";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";

import {CONTAINER_DETAIL, CONTAINER_LIST, CONTAINER_MANIFEST, CONTAINER_NUMBER} from "../../../../../@shared/keyword";
import {parseNumberValue} from "../../../../../@shared";
import * as InquiryActions from "../store/actions/inquiry";

import ContainerDetailForm from "./ContainerDetailForm";

const ContainerDetailInquiry = ({setDataCD, setDataCM, getDataCD, getDataCM, disableInput}) => {
  const user = useSelector(({ user }) => user);
  const dispatch = useDispatch();
  const [openCD, setOpenCD] = useState(true);
  const [openCM, setOpenCM] = useState(true);
  const [disableEdit, setDisableEdit] = useState(false);

  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);

  const getType = (type) => {
    return metadata.inq_type?.[type] || '';
  };

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
          dispatch(InquiryActions.setDataCdInq(contentCM));
        }
      }
    }
    else {
      let contsNoChange = {};
      const contsNo = [];
      const cdContent = getDataCD;
      const cmContent = getDataCM;
      const fieldCDCM = isEditedCD ? getDataCD : getDataCM;
      valueUpdated.forEach((obj, index) => {
        const containerNo = fieldCDCM[index] && fieldCDCM[index][getType(CONTAINER_NUMBER)];
        const getTypeName = Object.keys(metadata.inq_type).find(key => metadata.inq_type[key] === getType(CONTAINER_NUMBER));
        if (getTypeName === CONTAINER_NUMBER && containerNo !== obj[getType(CONTAINER_NUMBER)]) {
          contsNoChange[containerNo] = obj[getType(CONTAINER_NUMBER)];
          contsNo.push(obj?.[metadata?.inq_type?.[CONTAINER_NUMBER]]);
        }
      })
      if (isEditedCD) {
        if (cmContent && cmContent.length) {
          // Auto Update container no CM
          cmContent.map(item => {
            if (item[getType(CONTAINER_NUMBER)] in contsNoChange) {
              item[getType(CONTAINER_NUMBER)] = contsNoChange[item[getType(CONTAINER_NUMBER)]];
            }
          })
          valueUpdated.forEach(cd => {
            let cmOfCd = [...new Set((cmContent || []).filter(cm =>
                cm?.[metadata?.inq_type?.[CONTAINER_NUMBER]] === cd?.[metadata?.inq_type?.[CONTAINER_NUMBER]]
            ))]
            console.log('cmOfCd', cmOfCd)
            if (cmOfCd.length === 1) {
              CONTAINER_LIST.cdNumber.map((key, index) => {
                cmOfCd[0][getType(CONTAINER_LIST.cmNumber[index])] = cd[getType(key)];
              });
              CONTAINER_LIST.cdUnit.map((key, index) => {
                cmOfCd[0][getType(CONTAINER_LIST.cmUnit[index])] = cd[getType(key)];
              });
            }
          })
          setDataCM(cmContent);
          dispatch(InquiryActions.setDataCmInq(cmContent));
        }
      } else if (!isEditedCD) {
        cdContent.forEach(cm => {
          let cmOfCd = [...new Set((valueUpdated || []).filter(cd =>
              cm?.[metadata?.inq_type?.[CONTAINER_NUMBER]] === cd?.[metadata?.inq_type?.[CONTAINER_NUMBER]]
          ))]
          if (cmOfCd.length > 0) {
            CONTAINER_LIST.cmNumber.map((key, index) => {
              let total = 0;
              cmOfCd.map((cm) => {
                total += parseNumberValue(cm[getType(key)]);
              });
              cm[getType(CONTAINER_LIST.cdNumber[index])] = parseFloat(total.toFixed(3));
            });
          }
        })
        setDataCD(cdContent);
        dispatch(InquiryActions.setDataCdInq(cdContent));
      }
    }
  }

  return (
    <div style={{ width: '100%', marginTop: '10px' }}>
      <ListItem button onClick={() => handleClickCollapse(true)}>
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
          />
        </ListItem>
      </Collapse>

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
          />
        </ListItem>
      </Collapse>
    </div>
  );
};

export default ContainerDetailInquiry;