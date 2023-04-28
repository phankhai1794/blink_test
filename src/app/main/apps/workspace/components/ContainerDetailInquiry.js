import React, {useState} from 'react';
import {Collapse, ListItem, ListItemText} from "@material-ui/core";
import {ExpandLess, ExpandMore} from "@material-ui/icons";

import {CONTAINER_DETAIL, CONTAINER_MANIFEST} from "../../../../../@shared/keyword";

import ContainerDetailForm from "./ContainerDetailForm";

const ContainerDetailInquiry = ({setDataCD, setDataCM}) => {
  const [openCD, setOpenCD] = useState(true);
  const [openCM, setOpenCM] = useState(true);

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
            isPendingProcess={true}
            disableInput={false}
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
            isPendingProcess={true}
            disableInput={false}
          />
        </ListItem>
      </Collapse>
    </div>
  );
};

export default ContainerDetailInquiry;