const WorkSpaceData = {
  'shipper': {
    // dont neet title now, but maybe used in the future
    title: 'Shipper/Exporter',
    
    content:
      'DSV AIR & SEA CO. LTD. AS AGENT OF DSV OCEAN TRANSPORT A/S 3F IXINAL MONZEN-NAKACHO BLDG.2-5-4 FUKUZUMI, KOTO-KU, TOKYO,135-0032, JAPAN',
    open: false
  },
  'consignee': {
    title: 'Consignee',
    
    content:
      'DSV AIR & SEA LTD. -1708 16TH FLOOR, HANSSEM BLDG 179,SEONGAM-RO. MAPO-GU SEOUL 03929 KOREA',
    open: false
  },
  'notify':
    {
      title:
        'NOTIFY PARTY (It is agreed that no responsibility shall be attached to the Carrier or its Agents for failure to notify)',
      question: {
        name: '',
        type: '',
        choices: [],
        selectedChoice: ''
      },
      content:
        'DSV AIR & SEA LTD. -1708 16TH FLOOR, HANSSEM BLDG 179,SEONGAM-RO. MAPO-GU SEOUL 03929 KOREA',
      open: false
    },
  'pre_carriage': {
    title: 'PRE-CARRIAGE BY',
    
    content: '',
    open: false
  },
  'place_of_receipt': {
    title: 'PLACE OF RECEIPT',
    question: {
      name: 'We found discrepancy in the routing information between SI and OPUS booking details',
      type: 'ROUTING INQUIRY/DISCREPANCY',
      answerType: 'CHOICE ANSWER',
      choices: [
        {
          id: 1,
          content: 'SINGAPORE'
        },
        {
          id: 2,
          content: 'INDONESIA'
        }
      ],
      array: [],
      selectedChoice: ''
    },
    content: 'SINGAPORE',
    open: false
  },
  'ocean_vessel': {
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
  'port_of_loading': {
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
  'port_of_discharge': {
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
  },
  'place_of_delivery': {
    title: 'PLACE OF DELIVERY',
    
    content: 'BUSAN',
    open: false
  },
  'booking_no': {
    title: 'BOOKING NO.',
    
    content: 'TYOBD9739500',
    open: false
  },
  'SEA WAYBILL NO.': {
    title: 'SEA WAYBILL NO.',
    
    content: 'ONEYTOBD9739500',
    open: false
  },
  "EXPORT REFERENCES (for the merchant's and/or Carrier's reference only. See back clause 8. (4.))":
    {
      title:
        "EXPORT REFERENCES (for the merchant's and/or Carrier's reference only. See back clause 8. (4.))",
      question: {
        name: '',
        type: '',
        choices: [],
        selectedChoice: ''
      },
      content: '',
      open: false
    },
  "final_destination": {
    title: "FINAL DESTINATION(for line merchant's reference only)",
    
    content: 'BUSAN, KOREA',
    open: false
  },
  'TYPE OF MOMENT (IF MIXED, USE DESCRIPTION OF <br></br> PACKAGES AND GOODS FIELD)': {
    title: 'TYPE OF MOMENT (IF MIXED, USE DESCRIPTION OF <br></br> PACKAGES AND GOODS FIELD)',
    
    content: 'R1CB118000',
    open: false
  },
  'Container No.1-1': {
    title: 'Container No.1-1',
    
    content: '262 Packages',
    open: false
  },
  'Container No.1-2': {
    title: 'Container No.1-2',
    
    content: '1,716.000 KGS',
    open: false
  },
  'Container No.1-3': {
    title: 'Container No.1-3',
    
    content: '3,560 CBM',
    open: false
  },
  'Container No.2-1': {
    title: 'Container No.2-1',
    
    content: '262 Packages',
    open: false
  },
  'Container No.2-2': {
    title: 'Container No.2-2',
    
    content: '1,716.000 KGS',
    open: false
  },
  'Container No.2-3': {
    title: 'Container No.2-3',
    
    content: '3,560 CBM',
    open: false
  }
};

export default WorkSpaceData;
