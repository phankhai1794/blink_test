import React from 'react';
import { Grid, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useState } from 'react';
import WorkSpaceData from '../WorkSpaceData';
import Inquiry from '../shared-components/Inquiry';
import Form from '../shared-components/Form';
import InquiryForm from './InquiryForm';
import AddPopover from './components/AddPopover';
import BLField from './components/BLField';
const mockQuestion = {
  paragraphAnswer: {
    title: 'OCEAN VESSEL VOYAGE NO. FlAG',
    question: {
      name: 'We found discrepancy in the routing information between SI and OPUS booking details',
      type: 'ROUTING INQUIRY/DISCREPANCY',
      answerType: 'PARAGRAPH ANSWER',
      paragraph: '',
      selectedChoice: ''
    },
    content: 'CONFIDENCE 021W',
    open: false
  },
  choiceAnwer: {
    title: 'PORT OF LOADING',
    question: {
      name: 'We found discrepancy in the routing information between SI and OPUS booking details',
      type: 'ROUTING INQUIRY/DISCREPANCY',
      answerType: 'CHOICE ANSWER',
      choices: [
        {
          id: 1,
          content: 'TOKYO, JAPPAN'
        },
        {
          id: 2,
          content: 'BUSAN, KOREA'
        }
      ],
      addOther: true,
      selectedChoice: '',
      otherChoiceContent: 'MANILA, MALAYSIA'
    },
    content: 'TOKYO,JAPAN',
    open: false
  },
  AttatchmentAnswer: {
    'PORT OF DISCHARGE': {
      title: 'PORT OF DISCHARGE',
      question: {
        name: 'We found discrepancy in the routing information between SI and OPUS booking details',
        type: 'ROUTING INQUIRY/DISCREPANCY',
        answerType: 'ATTACHMENT ANSWER',
        choices: [],
        selectedChoice: '',
        fileName: 'document.pdf'
      },
      content: 'BUSAN, KOREA',
      open: false
    }
  }
};
const mockQuestionaAnswered = {
  paragraphAnswer: {
    title: 'OCEAN VESSEL VOYAGE NO. FlAG',
    question: {
      name: 'We found discrepancy in the routing information between SI and OPUS booking details',
      type: 'ROUTING INQUIRY/DISCREPANCY',
      answerType: 'PARAGRAPH ANSWER',
      paragraph: '',
      selectedChoice: ''
    },
    content: 'CONFIDENCE 021W',
    open: false
  },
  choiceAnwer: {
    title: 'PORT OF LOADING',
    question: {
      name: 'We found discrepancy in the routing information between SI and OPUS booking details',
      type: 'ROUTING INQUIRY/DISCREPANCY',
      answerType: 'CHOICE ANSWER',
      choices: [
        {
          id: 1,
          content: 'TOKYO, JAPPAN'
        },
        {
          id: 2,
          content: 'BUSAN, KOREA'
        }
      ],
      addOther: true,
      selectedChoice: 'other',
      otherChoiceContent: 'MANILA, MALAYSIA'
    },
    content: 'TOKYO,JAPAN',
    open: false
  },
  AttatchmentAnswer: {
    'PORT OF DISCHARGE': {
      title: 'PORT OF DISCHARGE',
      question: {
        name: 'We found discrepancy in the routing information between SI and OPUS booking details',
        type: 'ROUTING INQUIRY/DISCREPANCY',
        answerType: 'ATTACHMENT ANSWER',
        choices: [],
        selectedChoice: '',
        fileName: 'document.pdf'
      },
      content: 'BUSAN, KOREA',
      open: false
    }
  }
};
const BLWorkspace = (props) => {
  const [data, setData] = useState(WorkSpaceData);
  const [tempQuestionNum, setTempQuestionNum] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openInquiryForm, setOpenInquiryForm] = useState(false);
  const [openInquiry, setOpenInquiry] = useState(false);
  {
    /* 
                form show the example of mockQuestionAnswered
                use one form is enoughh
    */
  }
  const [openInquiry2, setOpenInquiry2] = useState(false);
  const onOpenInquiry = () => {
    setOpenInquiry(true);
  };
  const onOpenInquiry2 = () => {
    setOpenInquiry2(true);
  };
  const toggleInquiry2 = (status) => {
    setOpenInquiry2(status);
  };
  //end
  const openAddPopover = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const toggleInquiryForm = (status) => {
    setOpenInquiryForm(status);
  };
  const toggleInquiry = (status) => {
    setOpenInquiry(status);
  };
  const closeAddPopover = (e) => {
    if (anchorEl === null) {
      setAnchorEl(null);
    } else {
      const { x, y, width, height } = anchorEl.getBoundingClientRect();
      if (x + width < 800) {
        if (e.clientY + 2 > y + height || e.clientY < y) {
          setAnchorEl(null);
        } else if (e.clientX > x + width + 48 || e.clientX < x) {
          setAnchorEl(null);
        }
      } else {
        if (e.clientY + 2 > y + height || e.clientY < y) {
          setAnchorEl(null);
        } else if (e.clientX > x + width || e.clientX > x + 48) {
          setAnchorEl(null);
        }
      }
    }
  };
  const handleAddTempQuestion = () => {
    setTempQuestionNum(tempQuestionNum + 1);
  };
  const filteredTitles = Object.values(data)
    .filter((item) => item.question.name === '')
    .map((item) => item.title);
  return (
    <div className="ml-20">
      <InquiryForm
        open={openInquiryForm}
        toggle={toggleInquiryForm}
        FabTitle="Inquiry Form"
        filteredTitles={filteredTitles}
        tempQuestionNum={tempQuestionNum}
        handleAddTempQuestion={handleAddTempQuestion}
      />
      {/* 
                form show the example of mockQuestionAnswered
                use one form is enoughh
             */}
      <Form
        open={openInquiry2}
        toggleForm={toggleInquiry2}
        hasAddButton={false}
        FabTitle="Inquiry"
        title={mockQuestionaAnswered.choiceAnwer.title}
      >
        <Inquiry mockQuestion={mockQuestionaAnswered.choiceAnwer} forCustomer={false} />
      </Form>
      {/* end */}
      <Form
        open={openInquiry}
        toggleForm={toggleInquiry}
        hasAddButton={false}
        FabTitle="Inquiry"
        title={mockQuestion.choiceAnwer.title}
      >
        <Inquiry mockQuestion={mockQuestion.choiceAnwer} forCustomer={false} />
      </Form>

      <AddPopover
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        onCLick={() => toggleInquiryForm(true)}
        toggleInquiryForm={() => toggleInquiryForm(true)}
      />
      <Grid container>
        <Grid item xs={5}>
          <Grid item xs={11}>
            <h3>Shipper/Exporter</h3>
            <BLField openAddPopover={openAddPopover} closeAddPopover={closeAddPopover}>
              DSV AIR & SEA CO. LTD. AS AGENT OF DSV OCEAN TRANSPORT A/S 3F IXINAL MONZEN-NAKACHO
              BLDG.2-5-4 FUKUZUMI, KOTO-KU, TOKYO,135-0032, JAPAN
            </BLField>
          </Grid>
          <Grid item xs={11}>
            <h3>Consignee</h3>
            <BLField openAddPopover={openAddPopover} closeAddPopover={closeAddPopover}>
              DSV AIR & SEA LTD. -1708 16TH FLOOR, HANSSEM BLDG 179,SEONGAM-RO. MAPO-GU SEOUL 03929
              KOREA
            </BLField>
          </Grid>
          <Grid item xs={11}>
            <h3>
              NOTIFY PARTY (It is agreed that no responsibility shall be <br></br> attached to the
              Carrier or its Agents for failure to notify)
            </h3>

            <BLField
              openAddPopover={openAddPopover}
              closeAddPopover={closeAddPopover}
              //
            >
              DSV AIR & SEA LTD. -1708 16TH FLOOR, HANSSEM BLDG 179,SEONGAM-RO. MAPO-GU SEOUL 03929
              KOREA
            </BLField>
          </Grid>
          <Grid container xs={11}>
            <Grid item xs={7}>
              <h3>PRE-CARRIAGE BY</h3>

              <BLField
                width="70%"
                openAddPopover={openAddPopover}
                closeAddPopover={closeAddPopover}
              ></BLField>
            </Grid>
            <Grid item xs={5}>
              <h3>PLACE OF RECEIPT</h3>

              <BLField openAddPopover={openAddPopover} closeAddPopover={closeAddPopover}>
                SINGAPORE
              </BLField>
            </Grid>
          </Grid>
          <Grid container xs={11}>
            <Grid item xs={7}>
              <h3>OCEAN VESSEL VOYAGE NO. FlAG</h3>

              <BLField
                width="70%"
                openAddPopover={openAddPopover}
                closeAddPopover={closeAddPopover}
                questionIsEmpty={false}
                openInquiry={onOpenInquiry}
              >
                CONFIDENCE 021W
              </BLField>
            </Grid>
            <Grid item xs={5}>
              <h3>PORT OF LOADING</h3>

              <BLField openAddPopover={openAddPopover} closeAddPopover={closeAddPopover}>
                TOKYO,JAPAN
              </BLField>
            </Grid>
            <Grid item xs={7}>
              <h3>PORT OF DISCHARGE</h3>

              <BLField
                width="70%"
                openAddPopover={openAddPopover}
                closeAddPopover={closeAddPopover}
              >
                BUSAN, KOREA
              </BLField>
            </Grid>
            <Grid item xs={5}>
              <h3>PLACE OF DELIVERY</h3>

              <BLField
                openAddPopover={openAddPopover}
                closeAddPopover={closeAddPopover}
                questionIsEmpty={false}
                selectedChoice="MANILA, MALAYSIA"
                openInquiry={onOpenInquiry2}
              >
                BUSAN
              </BLField>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6} spacing={2}>
          <Grid container spacing={10}>
            <Grid item xs={5}>
              <h3>BOOKING NO.</h3>

              <BLField openAddPopover={openAddPopover} closeAddPopover={closeAddPopover}>
                TYOBD9739500
              </BLField>
            </Grid>
            <Grid item xs={5}>
              <h3>SEA WAYBILL NO.</h3>

              <BLField openAddPopover={openAddPopover} closeAddPopover={closeAddPopover}>
                "EXPORT REFERENCES (for the merchant's and/or Carrier's reference only. See back
                clause 8. (4.))
              </BLField>
            </Grid>
          </Grid>
          <Grid item xs={10}>
            <h3>
              EXPORT REFERENCES (for the merchant's and/or Carrier's reference only. See back clause
              8. (4.))
            </h3>

            <BLField openAddPopover={openAddPopover} closeAddPopover={closeAddPopover}></BLField>
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

            <BLField openAddPopover={openAddPopover} closeAddPopover={closeAddPopover}>
              BUSAN, KOREA
            </BLField>
          </Grid>
          <Grid item xs={10}>
            <h3>
              TYPE OF MOMENT (IF MIXED, USE DESCRIPTION OF <br></br> PACKAGES AND GOODS FIELD)
            </h3>

            <BLField openAddPopover={openAddPopover} closeAddPopover={closeAddPopover}>
              R1CB118000
            </BLField>
          </Grid>
        </Grid>
      </Grid>
      <Divider className="my-32" />
      <Grid container spacing={8}>
        <Grid item xs={2}>
          <h3> Container No.1 </h3>
        </Grid>
        <Grid item xs={2}>
          <BLField openAddPopover={openAddPopover} closeAddPopover={closeAddPopover}>
            262 Packages
          </BLField>
        </Grid>
        <Grid item xs={2}>
          <BLField openAddPopover={openAddPopover} closeAddPopover={closeAddPopover}>
            1,716.000 KGS
          </BLField>
        </Grid>
        <Grid item xs={2}>
          <BLField openAddPopover={openAddPopover} closeAddPopover={closeAddPopover}>
            3,560 CBM
          </BLField>
        </Grid>
      </Grid>
      <Grid container spacing={8}>
        <Grid item xs={2}>
          <h3> Container No.2 </h3>
        </Grid>
        <Grid item xs={2}>
          <BLField openAddPopover={openAddPopover} closeAddPopover={closeAddPopover}>
            262 Packages
          </BLField>
        </Grid>
        <Grid item xs={2}>
          <BLField openAddPopover={openAddPopover} closeAddPopover={closeAddPopover}>
            1,716.000 KGS
          </BLField>
        </Grid>
        <Grid item xs={2}>
          <BLField openAddPopover={openAddPopover} closeAddPopover={closeAddPopover}>
            3,560 CBM
          </BLField>
        </Grid>
      </Grid>
    </div>
  );
};
export default BLWorkspace;
