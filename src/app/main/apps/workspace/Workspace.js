import React from 'react';
import { Button, Grid, Divider, Drawer } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import PopoverTextField from './components/PopoverTextField';
import { useState } from 'react';
import WorkSpaceData from './WorkSpaceData';
import QuestionBoxViewOnly from './components/QuestionBoxViewOnly';
import TemporaryDrawer from './components/TemporaryDrawer';
import Link from '@material-ui/core/Link';
import BasicCard from './components/DrawerTest';
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#f5f8fa'
  },
  input: {
    fontFamily: 'Courier New'
  },
  popover: {
    pointerEvents: 'none'
  },
  circlePopover: {
    '& > div': {
      borderRadius: '200px'
    }
  },
  popoverContent: {
    pointerEvents: 'auto'
  },
  root: {
    backgroundColor: '#f5f8fa'
  },
  input: {
    fontFamily: 'Courier New'
  }
}));
/*
MOCK DATA STRUCTURE
const data = [
    {
        id: 1,
        content: "PlACE OF RECEIPT",
        questions:
            {
                name: "place of receipt",
                type: "Multiplechoice data",
                choices: [
                    {
                        id: 1,
                        content: "Malaysia"
                    },
                    {
                        id: 2,
                        content: "Indonesia"
                    }
                ],
                addOther: false
            },
    },
    ...
]
*/
const Workspace = (props) => {
  const classes = useStyles(props);
  const [data, setData] = useState(WorkSpaceData);
  const [defaultTitle, setDefaultTitle] = useState('');
  const [openDrawer, setOpenDrawer] = useState('');
  const onSave = (savedQuestion, title) => {
    let newData = data;
    newData[title] = {
      ...data[title],
      question: savedQuestion,
      content:
        savedQuestion.selectedChoice === undefined || savedQuestion.selectedChoice === ''
          ? data[title].content
          : savedQuestion.selectedChoice
    };

    setData(newData);
  };
  const onSaveContentOnly = (newContent, title) => {
    setData({
      ...data,
      title: {
        ...data[title],
        content: newContent
      }
    });
  };
  const getDataPopover = (title) => {
    let newData = data;
    newData[defaultTitle] = {
      ...data[defaultTitle],
      open: false
    };
    newData[title] = {
      ...data[title],
      open: true
    };
    setData(newData);
    setDefaultTitle(title);
  };
  const toggleDrawer = (title) => {
    setDefaultTitle(title);
    setOpenDrawer(true);
    let newData = data;
    newData[title] = {
      ...data[title],
      open: true
    };

    setData(newData);
  };
  const closeDrawer = () => {
    setOpenDrawer(false);
  };
  return (
    <div className="ml-20" style={{ fontFamily: 'Courier New' }}>
      <TemporaryDrawer
        data={data}
        openDrawer={openDrawer}
        defaultTitle={defaultTitle}
        getDataPopover={getDataPopover}
        closeDrawer={closeDrawer}
      />
      <Grid container>
        <Grid item xs={5}>
          <Grid item xs={11}>
            <h3>Shipper/Exporter </h3>
            <PopoverTextField
              toggleDrawer={toggleDrawer}
              onSave={onSave}
              data={data}
              onSaveContentOnly={onSaveContentOnly}
              title="Shipper/Exporter"
            ></PopoverTextField>
          </Grid>
          <Grid item xs={11}>
            <h3>Consignee</h3>
            <PopoverTextField
              toggleDrawer={toggleDrawer}
              data={data}
              onSave={onSave}
              onSaveContentOnly={onSaveContentOnly}
              title="Consignee"
            ></PopoverTextField>
          </Grid>
          <Grid item xs={11}>
            <h3>
              NOTIFY PARTY (It is agreed that no responsibility shall be <br></br> attached to the
              Carrier or its Agents for failure to notify)
            </h3>
            <PopoverTextField
              toggleDrawer={toggleDrawer}
              data={data}
              onSave={onSave}
              onSaveContentOnly={onSaveContentOnly}
              title="NOTIFY PARTY (It is agreed that no responsibility shall be <br></br> attached to the Carrier or its Agents for failure to notify)"
            ></PopoverTextField>
          </Grid>
          <Grid container xs={11}>
            <Grid item xs={7}>
              <h3>PRE-CARRIAGE BY</h3>
              <PopoverTextField
                toggleDrawer={toggleDrawer}
                fullWidth={false}
                data={data}
                onSave={onSave}
                onSaveContentOnly={onSaveContentOnly}
                title="PRE-CARRIAGE BY"
              ></PopoverTextField>
            </Grid>
            <Grid item xs={5}>
              <h3>PLACE OF RECEIPT</h3>
              <PopoverTextField
                toggleDrawer={toggleDrawer}
                data={data}
                onSave={onSave}
                onSaveContentOnly={onSaveContentOnly}
                title="PLACE OF RECEIPT"
              ></PopoverTextField>
            </Grid>
          </Grid>
          <Grid container xs={11}>
            <Grid item xs={7}>
              <h3>OCEAN VESSEL VOYAGE NO. FlAG</h3>
              <PopoverTextField
                toggleDrawer={toggleDrawer}
                fullWidth={false}
                data={data}
                onSave={onSave}
                onSaveContentOnly={onSaveContentOnly}
                title="OCEAN VESSEL VOYAGE NO. FlAG"
              ></PopoverTextField>
            </Grid>
            <Grid item xs={5}>
              <h3>PORT OF LOADING</h3>
              <PopoverTextField
                toggleDrawer={toggleDrawer}
                data={data}
                onSave={onSave}
                onSaveContentOnly={onSaveContentOnly}
                title="PORT OF LOADING"
              ></PopoverTextField>
            </Grid>
            <Grid item xs={7}>
              <h3>PORT OF DISCHARGE</h3>
              <PopoverTextField
                toggleDrawer={toggleDrawer}
                fullWidth={false}
                data={data}
                onSave={onSave}
                onSaveContentOnly={onSaveContentOnly}
                title="PORT OF DISCHARGE"
              ></PopoverTextField>
            </Grid>
            <Grid item xs={5}>
              <h3>PLACE OF DELIVERY</h3>
              <PopoverTextField
                toggleDrawer={toggleDrawer}
                data={data}
                onSave={onSave}
                onSaveContentOnly={onSaveContentOnly}
                title="PLACE OF DELIVERY"
              ></PopoverTextField>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6} spacing={2}>
          <Grid container spacing={10}>
            <Grid item xs={5}>
              <h3>BOOKING NO.</h3>
              <PopoverTextField
                toggleDrawer={toggleDrawer}
                data={data}
                onSave={onSave}
                onSaveContentOnly={onSaveContentOnly}
                title="BOOKING NO."
              ></PopoverTextField>
            </Grid>
            <Grid item xs={5}>
              <h3>SEA WAYBILL NO.</h3>
              <PopoverTextField
                toggleDrawer={toggleDrawer}
                data={data}
                onSave={onSave}
                onSaveContentOnly={onSaveContentOnly}
                title="SEA WAYBILL NO."
              ></PopoverTextField>
            </Grid>
          </Grid>
          <Grid item xs={10}>
            <h3>
              EXPORT REFERENCES (for the merchant's and/or Carrier's reference only. See back clause
              8. (4.))
            </h3>
            <PopoverTextField
              toggleDrawer={toggleDrawer}
              data={data}
              onSave={onSave}
              onSaveContentOnly={onSaveContentOnly}
              title="EXPORT REFERENCES (for the merchant's and/or Carrier's reference only. See back clause 8. (4.))"
            >
              <Grid sx={{ height: '50px' }}></Grid>
            </PopoverTextField>
          </Grid>
          <Grid item xs={10} className="mt-32">
            <span>
              RECEIVED by the Carrier in apparent good order and condition (unless otherwise stated
              herein) the total number or quantity of Containers or other packages or units
              indicated in the box entitled "Carrier's Receipt",to be carried subject to all the
              terms and conditions hereof from the Place of Receipt or Port of Loading to thePort of
              Discharge or Place of Delivery, as applicable. Delivery of the Goods to the Carrier
              for Carriagehereunder constitutes acceptance by the Merchant (as defined hereinafter)
              (i) of all the terms and conditions,whether printed, stamped or otherwise incorporated
              on this side and on the reverse side of this Bill of ladingand the terms and
              conditions of the Carrier's applicable tariff(s) as if they were all signed by the
              Merchant,and (ii) that any prior representations and/or agreements for or in
              connection with Carriage of the Goods aresuperseded by this Bill of Lading. If this is
              a negotiable (To Order/of) Bill of Lading, one original Bill of Lading,duly endorsed
              must be surrendered by the Merchant to the Carrier (together with any outstanding
              Freight) inexchange for the Goods or a Delivery Order or the pin codes for any
              applicable Electronic Release System.If this is a non-negotiable (straight) Bill of
              Lading, or where issued as a Sea Waybill, the Carrier shall deliverthe Goods or issue
              a Delivery Order or the pin codes for any applicable Electronic Release System
              (afterpayment of outstanding Freight) to the named consignee against the surrender of
              one original Bill of Lading,or in the case of a Sea Waybill, on production of such
              reasonable proof of identify as may be required by theCarrier, or in accordance with
              the national law at the Port of Discharge or Place of Delivery as applicable.
              INWITNESS WHEREOF the Carrier or their Agent has signed the number of Bills of Lading
              stated at the top,all of this tenor and date, and whenever one original Bill of Lading
              has been surrendered all other Bills ofLading shall be void.
            </span>
          </Grid>
          <Grid item xs={10}>
            <h3>FINAL DESTINATION(for line merchant's reference only)</h3>
            <PopoverTextField
              toggleDrawer={toggleDrawer}
              data={data}
              onSave={onSave}
              onSaveContentOnly={onSaveContentOnly}
              title="FINAL DESTINATION(for line merchant's reference only)"
            >
              <Grid sx={{ height: '50px' }}></Grid>
            </PopoverTextField>
          </Grid>
          <Grid item xs={10}>
            <h3>
              TYPE OF MOMENT (IF MIXED, USE DESCRIPTION OF <br></br> PACKAGES AND GOODS FIELD)
            </h3>
            <PopoverTextField
              toggleDrawer={toggleDrawer}
              data={data}
              onSave={onSave}
              onSaveContentOnly={onSaveContentOnly}
              title="TYPE OF MOMENT (IF MIXED, USE DESCRIPTION OF <br></br> PACKAGES AND GOODS FIELD)"
            >
              <Grid sx={{ height: '50px' }}></Grid>
            </PopoverTextField>
          </Grid>
        </Grid>
      </Grid>
      <Divider className="my-32" />
      <Grid container spacing={8}>
        <Grid item xs={2}>
          <h3> Container No.1 </h3>
        </Grid>
        <Grid item xs={2}>
          <PopoverTextField
            toggleDrawer={toggleDrawer}
            data={data}
            onSave={onSave}
            onSaveContentOnly={onSaveContentOnly}
            title="Container No.1-1"
          ></PopoverTextField>
        </Grid>
        <Grid item xs={2}>
          <PopoverTextField
            toggleDrawer={toggleDrawer}
            data={data}
            onSave={onSave}
            onSaveContentOnly={onSaveContentOnly}
            title="Container No.1-2"
          ></PopoverTextField>
        </Grid>
        <Grid item xs={2}>
          <PopoverTextField
            toggleDrawer={toggleDrawer}
            data={data}
            onSave={onSave}
            onSaveContentOnly={onSaveContentOnly}
            title="Container No.1-3"
          ></PopoverTextField>
        </Grid>
      </Grid>
      <Grid container spacing={8}>
        <Grid item xs={2}>
          <h3> Container No.2 </h3>
        </Grid>
        <Grid item xs={2}>
          <PopoverTextField
            toggleDrawer={toggleDrawer}
            data={data}
            onSave={onSave}
            onSaveContentOnly={onSaveContentOnly}
            title="Container No.2-1"
          ></PopoverTextField>
        </Grid>
        <Grid item xs={2}>
          <PopoverTextField
            toggleDrawer={toggleDrawer}
            data={data}
            onSave={onSave}
            onSaveContentOnly={onSaveContentOnly}
            title="Container No.2-2"
          ></PopoverTextField>
        </Grid>
        <Grid item xs={2}>
          <PopoverTextField
            toggleDrawer={toggleDrawer}
            data={data}
            onSave={onSave}
            onSaveContentOnly={onSaveContentOnly}
            title="Container No.2-3"
          ></PopoverTextField>
        </Grid>
      </Grid>
    </div>
  );
};
export default Workspace;
