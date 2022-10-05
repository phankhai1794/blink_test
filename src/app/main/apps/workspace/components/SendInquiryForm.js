import * as Actions from 'app/store/actions';
import { VESSEL_VOYAGE, PORT_OF_DISCHARGE, PLACE_OF_DELIVERY } from '@shared/keyword';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon, Button, Tabs, Tab, Select, MenuItem } from '@material-ui/core';
import clsx from 'clsx';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { makeStyles, withStyles } from '@material-ui/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getMail } from 'app/services/mailService';


import * as mailActions from '../store/actions/mail';
import * as FormActions from '../store/actions/form';
import * as InquiryActions from "../store/actions/inquiry";

import SubmitAnswerNotification from "./SubmitAnswerNotification";
import InputUI from './MailInputUI';
import AllInquiry from './AllInquiry';
import Form from './Form';

const colorBtnReview = '#1564EE';
const useStyles = makeStyles(() => ({
  tab: {
    fontFamily: 'Montserrat',
    textTransform: 'none',
    fontSize: '18px',
    minWidth: 120
  },
  label: {
    whiteSpace: 'nowrap',
    color: '#132535',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Montserrat'
  },
  buttonProgress: {
    color: 'red',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
  input: {
    borderWidth: '0.5px',
    borderRadius: '6px',
    borderStyle: 'solid',
    borderColor: 'lightgray',
    fontSize: 15,
    fontFamily: 'Montserrat',
    width: '100%'
  },
  menuItem: {
    '&:hover': {
      background: `#FDF2F2 !important`,
      color: '#BD0F72',
      fontWeight: '600 !important'
    }
  },
  paper: {
    borderRadius: 8
  }
}))

const StyledMenuItem = withStyles(theme => ({
  root: {
    "&:focus": {
      backgroundColor: '#FDF2F2',
      color: '#BD0F72',
      fontWeight: 600,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white
      }
    },
  }
}))(MenuItem);

const SendInquiryForm = (props) => {
  const dispatch = useDispatch();
  const mybl = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const openEmail = useSelector(({ workspace }) => workspace.formReducer.openEmail);
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const content = useSelector(({ workspace }) => workspace.inquiryReducer.content);

  const success = useSelector(({ workspace }) => workspace.mailReducer.success);
  const error = useSelector(({ workspace }) => workspace.mailReducer.error);
  const suggestMails = useSelector(({ workspace }) => workspace.mailReducer.suggestMails);
  const validateMail = useSelector(({ workspace }) => workspace.mailReducer.validateMail);
  const confirmPopupType = useSelector(({ workspace }) => workspace.formReducer.confirmPopupType);
  const confirmClick = useSelector(({ workspace }) => workspace.formReducer.confirmClick);

  const [isCustomerCc, setIsCustomerCc] = useState(false);
  const [isCustomerBcc, setIsCustomerBcc] = useState(false);
  const [isOnshoreCc, setIsOnshoreCc] = useState(false);
  const [isOnshoreBcc, setIsOnshoreBcc] = useState(false);
  const initialState = {
    toCustomer: '',
    toCustomerCc: '',
    toCustomerBcc: '',
    toOnshore: '',
    toOnshoreCc: '',
    toOnshoreBcc: '',
    from: '',
    subject: '',
    content: ''
  };
  const [form, setForm] = useState(initialState);
  const [tabValue, setTabValue] = useState('')
  const [previewValue, setPreviewValue] = useState('default')
  const handleChange = (event) => {
    setPreviewValue(event.target?.value || event);
  };
  const hasCustomer = inquiries.some(inq => inq.receiver[0] === 'customer')
  const hasOnshore = inquiries.some(inq => inq.receiver[0] === 'onshore')
  const [inqCustomer, setInqCustomer] = useState([])
  const [inqOnshore, setInqOnshore] = useState([])
  const [tabSelected, setTabSelected] = useState(0);
  const [customerValue, setCustomerValue] = useState({ subject: '', content: '' })
  const [onshoreValue, setOnshoreValue] = useState({ subject: '', content: '' })
  const [openNotification, setOpenNotification] = useState(false)

  const getField = (keyword) => {
    return metadata.field?.[keyword] || '';
  };
  const getValueField = (keyword) => {
    return content[getField(keyword)] || ''
  };

  const vvd = getValueField(VESSEL_VOYAGE)
  const pod = getValueField(PORT_OF_DISCHARGE)
  const del = getValueField(PLACE_OF_DELIVERY)
  const bkgNo = mybl.bkgNo

  const checkNewInquiry = (type) => {
    const list = []
    const temp = inquiries.filter(inq => inq.receiver[0] === type && (inq.state === 'OPEN' || inq.state === 'REP_DRF'))
    if (temp.length) {
      const sortDateList = temp.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      sortDateList.forEach(inq => {
        const find = metadata.field_options.find(field => field.value === inq.field)
        if (!list.includes(find.label)) list.push(find.label)
      })
    }
    return list
  }

  useEffect(() => {
    if (hasCustomer) {
      setTabValue('customer')
    }
    else if (hasOnshore) {
      setTabValue('onshore')
    }
  }, [openEmail])

  useEffect(() => {
    if (hasCustomer) {
      setInqCustomer(checkNewInquiry('customer'))
    }
    if (hasOnshore) {
      setInqOnshore(checkNewInquiry('onshore'))
    }
  }, [inquiries])

  useEffect(() => {
    let subject = ''
    let content = ''
    if (hasOnshore) {
      subject = `[Alert Onshore - BL Query]_[${inqOnshore.join(', ')}] ${bkgNo}: VVD(${vvd}) + POD(${pod}) + DEL(${del})`
      content = `Dear Onshore, \n\nWe need your assistance for BL completion.\nPending issue: [${inqOnshore.join(', ')}]`
      setOnshoreValue({ subject, content })
      setForm({ ...form, subject, content })
    }
    if (hasCustomer) {
      subject = `[Customer BL Query]_[${inqCustomer.join(', ')}] ${bkgNo}: VVD(${vvd}) + POD(${pod}) + DEL(${del})`
      content = `Dear Customer, \n\nWe found discrepancy between SI and OPUS booking details or missing/ incomplete information on some BL's fields as follows: [${inqCustomer.join(', ')}]`
      setCustomerValue({ subject, content })
      setForm({ ...form, subject, content })
    }
  }, [openEmail])

  useEffect(() => {
    if (tabValue === 'onshore') {
      setForm({ ...form, subject: onshoreValue.subject, content: onshoreValue.content })
    }
    else {
      setForm({ ...form, subject: customerValue.subject, content: customerValue.content })
    }
  }, [tabValue, inquiries])

  const isFormValid = () => {
    return form.toCustomer || form.toOnshore;
  }

  const isMailVaid = () => Object.values(validateMail).filter(e => e).length

  useEffect(() => {
    getMail(mybl.id).then((res) => {
      if (res.data.length) {
        let tags = {}, toCustomer = [], toOnshore = [];
        // Offshore
        res.data[0]?.toCustomer?.length && res.data[0].toCustomer.forEach(customer => {
          toCustomer.push(customer.email)
        });
        // Onshore
        res.data[0]?.toOnshore?.length && res.data[0].toOnshore.forEach(onshore => {
          toOnshore.push(onshore.email)
        });

        toCustomer.length && (tags.toCustomer = toCustomer);
        toOnshore.length && (tags.toOnshore = toOnshore);
        dispatch(mailActions.setTags(tags));
        setForm({ ...form, toCustomer: tags.toCustomer ? tags.toCustomer.join(',') : '', toOnshore: tags.toOnshore ? tags.toOnshore.join(',') : '' })
      }
    }).catch((error) => {
      console.error(error)
    });
    if (success) {
      setOpenNotification(true)
      dispatch({
        type: mailActions.SENDMAIL_NONE
      });
      dispatch(FormActions.toggleOpenEmail(false));
      setForm(initialState);
    } else if (error) {
      dispatch(
        Actions.showMessage({
          message: 'Mail not sent!. Please try again',
          variant: 'error'
        })
      );
      dispatch({
        type: mailActions.SENDMAIL_NONE
      });
    }
  }, [success, error]);

  useEffect(() => {
    if (confirmClick && confirmPopupType === 'sendMail') {
      const cloneInquiries = [...inquiries];
      cloneInquiries.forEach(q => {
        if (q.receiver[0] === tabValue) {
          if (q.state === 'OPEN') q.state = 'INQ_SENT'; // inquiry
          else if (q.state === 'REP_DRF') q.state = 'REP_SENT'; // amendment
        }
      });
      const formClone = JSON.parse(JSON.stringify(form));
      if (tabValue === 'onshore') {
        formClone.toCustomer = ''
        formClone.toCustomerCc = ''
        formClone.toCustomerBcc = ''
      }
      else if (tabValue === 'customer') {
        formClone.toOnshore = ''
        formClone.toOnshoreCc = ''
        formClone.toOnshoreBcc = ''
      }
      dispatch({ type: mailActions.SENDMAIL_LOADING });
      dispatch(mailActions.sendMail({ myblId: mybl.id, ...formClone, inquiries: cloneInquiries }));
      dispatch(InquiryActions.setInquiries(cloneInquiries));
      dispatch(
        FormActions.openConfirmPopup({
          openConfirmPopup: false,
          confirmClick: false,
          confirmPopupMsg: '',
          confirmPopupType: ''
        })
      );
    }
  }, [confirmClick])

  useEffect(() => {
    if (openEmail && !suggestMails.length) {
      dispatch(mailActions.suggestMail(''));
    }
  }, [openEmail]);

  const sendMailClick = () => {
    if (isMailVaid()) {
      dispatch(Actions.showMessage({ message: 'Invalid mail address', variant: 'error' }));
    }
    else if (!isFormValid()) {
      dispatch(Actions.showMessage({ message: 'Please fill to Customer or Onshore fields', variant: 'error' }));
    }
    else {
      dispatch(
        FormActions.openConfirmPopup({
          openConfirmPopup: true,
          confirmPopupMsg: 'Are you sure you want to send this email?',
          confirmPopupType: 'sendMail'
        })
      );
    }
  };

  const handleFieldChange = (key, tags) => {
    setForm({ ...form, [key]: tags.join(',') })
  };

  const handleBodyChange = (event) => {
    if (tabValue === 'customer') {
      setCustomerValue({ ...customerValue, content: event.target.value })
    }
    else {
      setOnshoreValue({ ...onshoreValue, content: event.target.value })
    }
    setForm({ ...form, content: event.target.value })
  };

  const handleSubjectChange = (event) => {
    if (tabValue === 'customer') {
      setCustomerValue({ ...customerValue, subject: event.target.value })
    }
    else {
      setOnshoreValue({ ...onshoreValue, subject: event.target.value })
    }
    setForm({ ...form, subject: event.target.value })
  };

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue)
  }

  const classes = useStyles();
  const ToCustomer = () =>
    <>
      <InputUI
        id="toCustomer"
        title="To Customer"
        isCc={isCustomerCc}
        isBcc={isCustomerBcc}
        onCc={() => {
          setIsCustomerCc(!isCustomerCc);
        }}
        onBcc={() => {
          setIsCustomerBcc(!isCustomerBcc);
        }}
        onChanged={handleFieldChange}
      />
      {isCustomerCc && <InputUI id="toCustomerCc" title="Cc" onChanged={handleFieldChange} />}
      {isCustomerBcc && (
        <InputUI id="toCustomerBcc" title="Bcc" onChanged={handleFieldChange} />
      )}
    </>

  const ToOnshore = () =>
    <>
      <InputUI
        id="toOnshore"
        title="To Onshore"
        isCc={isOnshoreCc}
        isBcc={isOnshoreBcc}
        onCc={() => {
          setIsOnshoreCc(!isOnshoreCc);
        }}
        onBcc={() => {
          setIsOnshoreBcc(!isOnshoreBcc);
        }}
        onChanged={handleFieldChange}
      />
      {isOnshoreCc && <InputUI id="toOnshoreCc" title="Cc" onChanged={handleFieldChange} />}
      {isOnshoreBcc && <InputUI id="toOnshoreBcc" title="Bcc" onChanged={handleFieldChange} />}
    </>


  const ToReceiver = () => {
    if (hasCustomer && hasOnshore) {
      return tabValue === 'customer' ? ToCustomer() : ToOnshore()
    }
    else if (hasCustomer) {
      return ToCustomer()
    }
    else if (hasOnshore) {
      return ToOnshore()
    }
    else {
      return null
    }
  }
  const countInq = (recevier) => {
    return inquiries.filter(inq => inq.receiver.includes(recevier) && (inq.state === 'OPEN' || inq.state === 'REP_DRF')).length;
  };

  const handleTabSelected = () => {
    if (countInq('customer') === 0) {
      return 'onshore'
    } else {
      return tabSelected === 0 ? 'customer' : 'onshore'
    }
  }
  return (
    <>
      <SubmitAnswerNotification
        open={openNotification}
        msg='Your answer has been sent.'
        handleClose={() => setOpenNotification(false)}
      />
      <Form
        title={'New Mail'}
        open={openEmail}
        toggleForm={(status) => dispatch(FormActions.toggleOpenEmail(status))}
        openFab={false}
        field={props.field}
        style={previewValue === 'email' && { backgroundColor: '#fdf2f2' }}
        customActions={
          <ActionUI
            sendMailClick={sendMailClick}
            previewValue={previewValue}
            handleChange={handleChange}
          ></ActionUI>
        }
        FabTitle="E-mail"
        tabs={previewValue === 'inquiry' && ['Customer', 'Onshore']}
        nums={previewValue === 'inquiry' && [countInq('customer'), countInq('onshore')]}
        tabChange={(newValue) => {
          setTabSelected(newValue);
        }}
      >
        {previewValue === 'default' &&
          <>
            {ToReceiver()}
            {hasCustomer && hasOnshore &&
              <Tabs
                indicatorColor="primary"
                value={tabValue}
                onChange={handleTabChange}
                textColor='primary'
                style={{ borderBottom: '3px solid #515F6B', marginBottom: 20, marginTop: 10 }}
              >
                <Tab
                  className={classes.tab}
                  value='customer'
                  label="Customer"
                />
                <Tab
                  className={classes.tab}
                  value='onshore'
                  label="Onshore"
                />
              </Tabs>
            }
            <div style={{ marginTop: 10 }}>
              <label className={clsx(classes.label)}>Subject</label>
            </div>
            <div style={{ marginTop: 5, display: 'flex' }}>
              <input
                style={{
                  padding: 5,
                  height: '25px',
                }}
                className={classes.input}
                value={form.subject}
                onChange={handleSubjectChange}
              />
            </div>
            <div style={{ marginTop: 10 }}>
              <label className={clsx(classes.label)}>Body</label>
            </div>
            <div style={{ display: 'flex' }}>
              <textarea
                style={{
                  padding: 10,
                  marginTop: 10,
                  minHeight: 200,
                  resize: 'none'
                }}
                className={classes.input}
                multiline="true"
                type="text"
                value={form.content}
                onChange={handleBodyChange}></textarea>
            </div>
          </>
        }
        {previewValue === 'email' &&
          <div style={{ margin: 'auto', maxWidth: 580, }}>
            <img style={{ margin: 15 }} src="assets/images/logos/one_ocean_network-logo.png" width="100px" alt="ONE" />
            <div style={{ backgroundColor: 'white', padding: 20, fontFamily: 'Montserrat', fontSize: 15, fontWeight: 500 }}>
              <p style={{ whiteSpace: 'pre-line' }}>
                {form.content}
              </p>
              <p >Please visit the link below and help us answer our inquiry. <br />
                BLink Workspace: <br />
                Access Code: </p>
              <p>
                Thank you <br />
                ONE Offshore Center</p>
            </div>
          </div>
        }
        {previewValue === 'inquiry' &&
          <AllInquiry
            user="workspace"
            receiver={handleTabSelected()}
            collapse={true}
            openInquiryReview={true}
          />
        }
      </Form>
    </>
  );
};

const InquiryReview = (props) => {
  const [tabSelected, setTabSelected] = useState(0);
  const [openInqReview] = useSelector(({ workspace }) => [workspace.formReducer.openInqReview]);
  const [inquiries] = useSelector(({ workspace }) => [workspace.inquiryReducer.inquiries]);
  const dispatch = useDispatch();

  const countInq = (recevier) => {
    let count = 0;
    inquiries.forEach((inq) => inq.receiver.includes(recevier) && (count += 1));
    return count;
  };

  const handleTabSelected = () => {
    if (countInq('customer') === 0) {
      return 'onshore'
    } else {
      return tabSelected === 0 ? 'customer' : 'onshore'
    }
  }

  return (
    <>
      <Form
        title={'Inquiry Preview'}
        tabs={['Customer', 'Onshore']}
        nums={[countInq('customer'), countInq('onshore')]}
        open={openInqReview}
        toggleForm={(status) => dispatch(FormActions.toggleOpenInquiryReview(status))}
        tabChange={(newValue) => {
          setTabSelected(newValue);
        }}
        hasAddButton={false}
        field={props.field}
        openFab={false}
        FabTitle="Inquiry Review"
      >
        <>
          <AllInquiry
            user="workspace"
            receiver={handleTabSelected()}
            collapse={true}
            openInquiryReview={true}
          />
        </>
      </Form>
    </>
  );
};

const ActionUI = (props) => {
  const classes = useStyles();
  const { sendMailClick, previewValue, handleChange } = props;
  const isLoading = useSelector(({ workspace }) => workspace.mailReducer.isLoading);
  const openConfirmPopup = useSelector(({ workspace }) => workspace.formReducer.openConfirmPopup);

  return (
    <div
      style={{
        padding: 10,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <div style={{
        position: 'absolute',
        left: '2.5rem',
        top: '1rem',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Icon style={{ color: colorBtnReview, paddingRight: '1.2rem' }}>visibility</Icon>
        <Icon fontSize='small' style={{
          color: colorBtnReview, paddingRight: '0.5rem', position: 'absolute', left: 17, top: 10
        }}>arrow_drop_down</Icon>
        <Select
          style={{
            color: '#2F80ED',
            textTransform: 'none',
            fontFamily: 'Montserrat',
            fontWeight: 600
          }}
          value={previewValue}
          onChange={handleChange}
          IconComponent={() => null}
          disabled={openConfirmPopup}
          MenuProps={{ classes: { paper: classes.paper } }}
          disableUnderline
        >
          <StyledMenuItem value='default'>Preview</StyledMenuItem>
          <StyledMenuItem value='inquiry'> Preview Inquiries</StyledMenuItem>
          <StyledMenuItem value='email'> Preview Email Layout</StyledMenuItem>
        </Select>
      </div>
      {previewValue === 'default' ?
        <Button
          variant="contained"
          size="medium"
          color='primary'
          style={{
            textTransform: 'none',
            fontWeight: 'bold',
            width: 120,
            height: 40,
            backgroundColor: isLoading && '#515E6A',
            borderRadius: 9,
            fontFamily: 'Montserrat'
          }}
          disabled={isLoading || openConfirmPopup}
          onClick={sendMailClick}>
          Send
        </Button> :
        <Button
          variant="contained"
          size="medium"
          color='primary'
          style={{
            textTransform: 'none',
            fontWeight: 'bold',
            width: 120,
            height: 40,
            borderRadius: 9,
            fontFamily: 'Montserrat'
          }}
          onClick={() => handleChange('default')}>
          <Icon fontSize='small' style={{ paddingRight: '0.5rem' }}>keyboard_backspace</Icon>
          Back
        </Button>
      }
      {isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
    </div>
  );
};

export { SendInquiryForm, InquiryReview };
