import React from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './store/actions';
import WorkSpaceData from '../WorkSpaceData';

import { Grid, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import InquiryCreated from '../shared-components/InquiryCreated';
import Form from '../shared-components/Form';
import InquiryForm from './InquiryForm';
import AddPopover from './components/AddPopover';
import BLField from './components/BLField';

const useStyles = makeStyles((theme) => ({
  ptGridItem: {
    paddingTop: '0 !important',
  },
  pbGridItem: {
    paddingBottom: '0 !important',
  },
  grayText: {
    color: '#69696E'
  }
}));

const BLWorkspace = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const data = WorkSpaceData;

  const [openInquiry, currentField] = useSelector((state) => 
  [state.workspace.openInquiry,  state.workspace.currentField])

  return (
    <div className="px-52">
      <InquiryForm FabTitle="Inquiry Form"/>
  
      <Form
        open={openInquiry}
        toggleForm={(status) => dispatch(Actions.toggleInquiry(status))}
        hasAddButton={false}
        FabTitle="Inquiry"
        field={currentField ? currentField : ""}
        title={currentField ? data[currentField].title : ""}
      >
        <InquiryCreated user="workspace" />
      </Form>

      <AddPopover/>
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <Grid item>
            <h3>Shipper/Exporter</h3>
            <BLField id="shipper">
              DSV AIR & SEA CO. LTD. AS AGENT OF DSV OCEAN TRANSPORT A/S 3F IXINAL MONZEN-NAKACHO
              BLDG.2-5-4 FUKUZUMI, KOTO-KU, TOKYO,135-0032, JAPAN
            </BLField>
          </Grid>
          <Grid item>
            <h3>Consignee</h3>
            <BLField  id="consignee">
              DSV AIR & SEA LTD. -1708 16TH FLOOR, HANSSEM BLDG 179,SEONGAM-RO. MAPO-GU SEOUL 03929
              KOREA
            </BLField>
          </Grid>
          <Grid item>
            <h3>
              NOTIFY PARTY (It is agreed that no responsibility shall be <br></br> attached to the
              Carrier or its Agents for failure to notify)
            </h3>
            <BLField id="notify">
              DSV AIR & SEA LTD. -1708 16TH FLOOR, HANSSEM BLDG 179,SEONGAM-RO. MAPO-GU SEOUL 03929
              KOREA
            </BLField>
          </Grid>
          <Grid container spacing={6}>
            <Grid item xs={6} className={classes.pbGridItem}>
              <h3>PRE-CARRIAGE BY</h3>
              <BLField id="pre_carriage"></BLField>
            </Grid>
            <Grid item xs={6} className={classes.pbGridItem}>
              <h3>PLACE OF RECEIPT</h3>
              <BLField id="place_of_receipt">SINGAPORE</BLField>
            </Grid>
            <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
              <h3>OCEAN VESSEL VOYAGE NO. FlAG</h3>
              <BLField id="ocean_vessel">
                CONFIDENCE 021W
              </BLField>
            </Grid>
            <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
              <h3>PORT OF LOADING</h3>
              <BLField id="port_of_loading">
                TOKYO,JAPAN
              </BLField>
            </Grid>
            <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
              <h3>PORT OF DISCHARGE</h3>
              <BLField id="port_of_discharge">
                BUSAN, KOREA
              </BLField>
            </Grid>
            <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
              <h3>PLACE OF DELIVERY</h3>
              <BLField id="place_of_delivery" selectedChoice="MANILA, MALAYSIA">
                BUSAN
              </BLField>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={6}>
            <Grid item xs={6}>
              <h3>BOOKING NO.</h3>
              <BLField id="booking_no">
                TYOBD9739500
              </BLField>
            </Grid>
            <Grid item xs={6}>
              <h3>SEA WAYBILL NO.</h3>
              <BLField  >
                "EXPORT REFERENCES (for the merchant's and/or Carrier's reference only. See back
                clause 8. (4.))
              </BLField>
            </Grid>
          </Grid>
          <Grid item>
            <h3>
              EXPORT REFERENCES (for the merchant's and/or Carrier's reference only. See back clause
              8. (4.))
            </h3>
            <BLField></BLField>
          </Grid>
          <Grid item className="mt-32">
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
          <Grid item>
            <h3>FINAL DESTINATION(for line merchant's reference only)</h3>
            <BLField id="final_destination">
              BUSAN, KOREA
            </BLField>
          </Grid>
          <Grid item>
            <h3>
              TYPE OF MOMENT (IF MIXED, USE DESCRIPTION OF <br></br> PACKAGES AND GOODS FIELD)
            </h3>
            <BLField  >
              R1CB118000
            </BLField>
          </Grid>
        </Grid>
      </Grid>

      <Divider className="my-32" />

      <Grid container spacing={4}>
        <Grid item xs={2}>
          <h3 className="my-0">CONTAINER NO.</h3>
        </Grid>
        <Grid item xs={2}>
          <h3 className="my-0">SEAL NO.</h3>
        </Grid>
        <Grid item xs={2}>
          <h3 className="my-0">PACKAGE</h3>
        </Grid>
        <Grid item xs={1}>
          <h3 className="my-0">MODE</h3>
        </Grid>
        <Grid item xs={1}>
          <h3 className="my-0">TYPE</h3>
        </Grid>
        <Grid item xs={2}>
          <h3 className="my-0">MEASUREMENT</h3>
        </Grid>
        <Grid item xs={2}>
          <h3 className="my-0">WEIGHT</h3>
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={2}>
          <BLField>SEGU5048074</BLField>
        </Grid>
        <Grid item xs={2}>
          <BLField>JPC074647</BLField>
        </Grid>
        <Grid item xs={2}>
          <BLField></BLField>
        </Grid>
        <Grid item xs={1}>
          <BLField>FCL / FCL</BLField>
        </Grid>
        <Grid item xs={1}>
          <BLField>40HQ</BLField>
        </Grid>
        <Grid item xs={2}>
          <BLField>3,560 CBM</BLField>
        </Grid>
        <Grid item xs={2}>
          <BLField>1,716.000 KGS</BLField>
        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={2}>
          <BLField>SEGU5048074</BLField>
        </Grid>
        <Grid item xs={2}>
          <BLField>JPC074647</BLField>
        </Grid>
        <Grid item xs={2}>
          <BLField></BLField>
        </Grid>
        <Grid item xs={1}>
          <BLField>FCL / FCL</BLField>
        </Grid>
        <Grid item xs={1}>
          <BLField>40HQ</BLField>
        </Grid>
        <Grid item xs={2}>
          <BLField>3,560 CBM</BLField>
        </Grid>
        <Grid item xs={2}>
          <BLField>1,716.000 KGS</BLField>
        </Grid>
      </Grid>

      <Divider className="my-32" />

      <h2 className={classes.grayText}>PARTICULARS DECLARED BY SHIPPER BUT NOT ACKNOWLEDGED BY THE CARRIER</h2>
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <Grid item>
            <h3>CNTR. NOS. W/SEAL NOS. MARKS & NUMBERS</h3>
            <BLField>
              DSV AIR & SEA CO. LTD. AS AGENT OF DSV OCEAN TRANSPORT A/S 3F IXINAL MONZEN-NAKACHO
              BLDG.2-5-4 FUKUZUMI, KOTO-KU, TOKYO,135-0032, JAPAN
            </BLField>
          </Grid>
          <Grid item>
            <h3>QUANTITY (FOR CUSTOMERS DECLARATION ONLY)</h3>
            <BLField>12 PALLETS</BLField>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid item>
            <h3>CNTR. NOS. W/SEAL NOS. MARKS & NUMBERS</h3>
            <BLField>
              DSV AIR & SEA CO. LTD. AS AGENT OF DSV OCEAN TRANSPORT A/S 3F IXINAL MONZEN-NAKACHO
              BLDG.2-5-4 FUKUZUMI, KOTO-KU, TOKYO,135-0032, JAPAN
            </BLField>
          </Grid>
          <Grid container spacing={6}>
            <Grid item xs={6}>
              <h3>GROSS WEIGHT</h3>
              <BLField>509.000KGS</BLField>
            </Grid>
            <Grid item xs={6}>
              <h3>GROSS MEASUREMENT</h3>
              <BLField>19.888CBM</BLField>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          alignItems="center"
          justify="center"
        >
          <h2 className={classes.grayText}>** TO BE CONTINUED ON ATTACHED LIST **</h2>
        </Grid>
      </Grid>

      <Divider className="my-32" />

      <Grid container spacing={6}>
        <Grid item xs={6}>
          <Grid item>
            <h3>FREIGHT & CHARGES PAYABLE AT / BY:</h3>
            <BLField>TOKYO, TOKYO SEUOL</BLField>
          </Grid>
          <Grid container spacing={6}>
            <Grid item xs={6} className={classes.pbGridItem}>
              <h3>COMMODITY CODE</h3>
              <BLField></BLField>
            </Grid>
            <Grid item xs={6} className={classes.pbGridItem}>
              <h3>EXCHANGE RATE</h3>
              <BLField></BLField>
            </Grid>
            <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
              <h3>FREIGHTED AS</h3>
              <BLField></BLField>
            </Grid>
            <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
              <h3>RATE</h3>
              <BLField></BLField>
            </Grid>
            <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
              <h3>DATE CARGO RECEIVED</h3>
              <BLField></BLField>
            </Grid>
            <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
              <h3>DATE LADEN ON BOARD</h3>
              <BLField>31 AUG 2021</BLField>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={6}>
            <Grid item xs={6} className={classes.pbGridItem}>
              <h3>SERVICE CONTRACT NO.</h3>
              <BLField></BLField>
            </Grid>
            <Grid item xs={6} className={classes.pbGridItem}>
              <h3>DOC FORM NO.</h3>
              <BLField></BLField>
            </Grid>
            <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
              <h3>CODE</h3>
              <BLField></BLField>
            </Grid>
            <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
              <h3>TARIFF ITEM</h3>
              <BLField></BLField>
            </Grid>
            <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
              <h3>PREPAID</h3>
              <BLField></BLField>
            </Grid>
            <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
              <h3>COLLECT</h3>
              <BLField></BLField>
            </Grid>
            <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
              <h3>PLACE OF BILL(S) ISSUE</h3>
              <BLField>TOKYO</BLField>
            </Grid>
            <Grid item xs={6} className={clsx(classes.ptGridItem, classes.pbGridItem)}>
              <h3>DATED</h3>
              <BLField>31 AUG 2021</BLField>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
export default BLWorkspace;
