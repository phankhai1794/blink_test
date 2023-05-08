import React, {useEffect, useState} from 'react';
import {Collapse, ListItem, ListItemText} from "@material-ui/core";
import {ExpandLess, ExpandMore} from "@material-ui/icons";
import {useSelector} from "react-redux";

import {CONTAINER_DETAIL, CONTAINER_MANIFEST} from "../../../../../@shared/keyword";

import ContainerDetailForm from "./ContainerDetailForm";

const ContainerDetailInquiry = ({setDataCD, setDataCM, getDataCD, getDataCM, disableInput}) => {
  const user = useSelector(({ user }) => user);
  const [openCD, setOpenCD] = useState(true);
  const [openCM, setOpenCM] = useState(true);
  const [disableEdit, setDisableEdit] = useState(false);

  useEffect(() => {
    if (user.role === 'Admin') {
      setDisableEdit(true)
    } else if (user.role === 'Guest') {
      if (disableInput !== null) setDisableEdit(disableInput);
    }
  }, [disableInput]);

  const handleClickCollapse = (isCD) => {
    isCD ? setOpenCD(!openCD) : setOpenCM(!openCM);
  };
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
            setEditContent={(value) => {
              setDataCD(value)
            }}
            originalValues={getDataCD}
            isPendingProcess={true}
            disableInput={disableEdit}
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
            setEditContent={(value) => {
              setDataCM(value)
            }}
            originalValues={getDataCM}
            isPendingProcess={true}
            disableInput={disableEdit}
          />
        </ListItem>
      </Collapse>
    </div>
  );
};

export default ContainerDetailInquiry;