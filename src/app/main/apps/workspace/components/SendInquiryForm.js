import * as Actions from 'app/store/actions';
import { checkNewInquiry } from '@shared';
import { PRE_CARRIAGE, PORT_OF_DISCHARGE, PLACE_OF_DELIVERY } from '@shared/keyword';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Icon,
  Button,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  FormHelperText
} from '@material-ui/core';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { makeStyles, withStyles } from '@material-ui/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getMail } from 'app/services/mailService';
import parse from 'html-react-parser';

import * as mailActions from '../store/actions/mail';
import * as FormActions from '../store/actions/form';

import SubmitAnswerNotification from './SubmitAnswerNotification';
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
}));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: '#FDF2F2',
      color: '#BD0F72',
      fontWeight: 600,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white
      }
    }
  }
}))(MenuItem);

const HelperText = withStyles((theme) => ({
  root: {
    fontStyle: 'italic',
    fontFamily: 'Montserrat',
    fontSize: 13
  }
}))(FormHelperText);

const SendInquiryForm = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const mybl = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const openEmail = useSelector(({ workspace }) => workspace.formReducer.openEmail);
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const content = useSelector(({ workspace }) => workspace.inquiryReducer.content);

  const success = useSelector(({ workspace }) => workspace.mailReducer.success);
  const error = useSelector(({ workspace }) => workspace.mailReducer.error);
  const suggestMails = useSelector(({ workspace }) => workspace.mailReducer.suggestMails);
  const inputMail = useSelector(({ workspace }) => workspace.mailReducer.inputMail);
  const confirmPopupType = useSelector(({ workspace }) => workspace.formReducer.confirmPopupType);
  const confirmClick = useSelector(({ workspace }) => workspace.formReducer.confirmClick);
  const tags = useSelector(({ workspace }) => workspace.mailReducer.tags);
  const user = useSelector(({ user }) => user);

  const initialState = {
    toCustomer: '',
    toCustomerCc: '',
    toCustomerBcc: '',
    toOnshore: '',
    toOnshoreCc: '',
    toOnshoreBcc: '',
    subject: '',
    content: ''
  };
  const [form, setForm] = useState(initialState);
  const [tabValue, setTabValue] = useState('');
  const [previewValue, setPreviewValue] = useState('default');
  const handleChange = (event) => {
    setPreviewValue(event.target?.value || event);
  };
  const [formError, setFormError] = useState({ subject: '', content: '' });
  const hasCustomer = inquiries.some(
    (inq) =>
      inq.receiver[0] === 'customer' &&
      ['OPEN', 'REP_Q_DRF', 'AME_DRF', 'REP_DRF'].includes(inq.state)
  );
  const hasOnshore = inquiries.some(
    (inq) =>
      inq.receiver[0] === 'onshore' &&
      ['OPEN', 'REP_Q_DRF', 'AME_DRF', 'REP_DRF'].includes(inq.state)
  );
  const [inqCustomer, setInqCustomer] = useState([]);
  const [inqOnshore, setInqOnshore] = useState([]);
  const [tabSelected, setTabSelected] = useState(0);
  const [customerValue, setCustomerValue] = useState({ subject: '', content: '' });
  const [onshoreValue, setOnshoreValue] = useState({ subject: '', content: '' });
  const [openNotification, setOpenNotification] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const getField = (keyword) => {
    return metadata.field?.[keyword] || '';
  };
  const getValueField = (keyword) => {
    return content[getField(keyword)] || '';
  };

  const preVvd = getValueField(PRE_CARRIAGE);
  const pod = getValueField(PORT_OF_DISCHARGE);
  const del = getValueField(PLACE_OF_DELIVERY);
  const bkgNo = mybl.bkgNo;

  const initiateContentState = (content) => {
    return EditorState.createWithContent(ContentState.createFromText(content));
  };

  const handleEditorState = (content) => {
    setEditorState(initiateContentState(content));
  };

  const convertToList = (array, tabValue) => {
    const newInq = checkNewInquiry(metadata, inquiries, tabValue, ['OPEN']);
    const newRep = checkNewInquiry(metadata, inquiries, tabValue, ['REP_Q_DRF']);
    const newAmeRep = checkNewInquiry(metadata, inquiries, tabValue, ['REP_DRF']);
    const convert = (array) => array.map((a) => `- ${a}`).join('\n');
    let header = 'BL has been updated';
    let msg = ''
    if (newInq.length && newRep.length || newInq.length && newAmeRep.length) {
      msg =
        'Thank you very much for your response to our inquiries. However, there are still some pending issues that need to be clarified in the following BL fields:';
      return [
        msg,
        ` \nNew inquiry:\n${convert(newInq)}\n \nNew reply:\n${convert([...new Set([...newRep, ...newAmeRep])])}`,
        header
      ];
    } else if (newInq.length) {
      header = 'New Inquiry';
    } else if (newRep.length) {
      msg = 'Thank you very much for your response to our inquiries. However, there are still some pending issues that need to be clarified in the following BL fields:';
      header = 'New Reply';
    } else if (newAmeRep.length) {
      msg = 'Thank you very much for checking BL draft. Your amendment requests are in progress; however, there are still some pending issues that need to be clarified in the following BL fields:';
      header = 'You have received a reply';
    }
    return [msg, array.map((a) => `- ${a}`).join('\n'), header];
  };

  useEffect(() => {
    if (hasCustomer) {
      setTabValue('customer');
    } else if (hasOnshore) {
      setTabValue('onshore');
    }
  }, [openEmail]);

  useEffect(() => {
    if (hasCustomer) setInqCustomer(checkNewInquiry(metadata, inquiries, 'customer'));
    if (hasOnshore) setInqOnshore(checkNewInquiry(metadata, inquiries, 'onshore'));
  }, [inquiries]);

  useEffect(() => {
    let subject = '';
    let content = '';
    let bodyHtml = '';
    if (hasOnshore) {
      subject = `[Onshore - BL Query]_[${inqOnshore.length > 1 ? 'MULTIPLE INQUIRIES' : inqOnshore[0]}] ${bkgNo}: VVD(${preVvd}) + POD(${pod}) + DEL(${del})`;
      const [msg1, msg2, header] = convertToList(inqOnshore, 'onshore');
      content = `Dear Onshore,\n \n${msg1 || 'We need your assistance for BL completion. Pending issues:'}\n${msg2}`;
      bodyHtml = draftToHtml(convertToRaw(ContentState.createFromText(content)));
      setOnshoreValue({
        ...onshoreValue,
        subject,
        content: bodyHtml,
        html: initiateContentState(content),
        header
      });
      setForm({ ...form, subject, content: bodyHtml });
      handleEditorState(content);
    }
    if (hasCustomer) {
      subject = `[Customer BL Query]_[${inqCustomer.length > 1 ? 'MULTIPLE INQUIRIES' : inqCustomer[0]}] ${bkgNo}: VVD(${preVvd}) + POD(${pod}) + DEL(${del})`;
      const [msg1, msg2, header] = convertToList(inqCustomer, 'customer');
      content = `Dear Customer,\n \n${msg1 || `We found discrepancy between SI and OPUS booking details or missing/ incomplete information on some BL's fields as follows:`}\n${msg2} `;
      bodyHtml = draftToHtml(convertToRaw(ContentState.createFromText(content)));
      setCustomerValue({
        ...customerValue,
        subject,
        content: bodyHtml,
        html: initiateContentState(content),
        header
      });
      setForm({ ...form, subject, content: bodyHtml });
      handleEditorState(content);
    }
  }, [openEmail]);

  useEffect(() => {
    if (tabValue === 'onshore') {
      setForm({ ...form, subject: onshoreValue.subject, content: onshoreValue.content });
      setEditorState(onshoreValue.html);
    } else {
      setForm({ ...form, subject: customerValue.subject, content: customerValue.content });
      setEditorState(customerValue.html);
    }
  }, [tabValue, inquiries]);

  const isRecipientValid = () => {
    if (tabValue === 'customer') {
      return Boolean(form.toCustomer);
    }
    return Boolean(form.toOnshore);
  };

  const isBodyValid = () => {
    return Boolean(form.content.replace(/<[^>]*>|\n|&nbsp;/g, ''));
  };

  const isMailVaid = () => Object.values(inputMail).filter((e) => e).length;

  useEffect(() => {
    getMail(mybl.id)
      .then((res) => {
        if (res.data.length) {
          let toCustomer = [],
            toOnshore = [];
          // Offshore
          res.data[0]?.toCustomer?.length &&
            res.data[0].toCustomer.forEach((customer) => {
              toCustomer.push(customer.email);
            });
          // Onshore
          res.data[0]?.toOnshore?.length &&
            res.data[0].toOnshore.forEach((onshore) => {
              toOnshore.push(onshore.email);
            });
          dispatch(mailActions.setTags({ ...tags, toCustomer, toOnshore }));
          setForm({ ...form, toCustomer: toCustomer.join(','), toOnshore: toOnshore.join(',') });
        }
      })
      .catch((error) => {
        console.error(error);
      });
    if (success) {
      setOpenNotification(true);
      dispatch({
        type: mailActions.SENDMAIL_NONE
      });
      if (!hasCustomer && !hasOnshore) {
        dispatch(FormActions.toggleOpenEmail(false));
      } else if (!hasCustomer) {
        setTabValue('onshore');
      } else {
        setTabValue('customer');
      }
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
      const formClone = JSON.parse(JSON.stringify(form));
      let header = '';
      if (tabValue === 'onshore') {
        formClone.toCustomer = '';
        formClone.toCustomerCc = '';
        formClone.toCustomerBcc = '';
        header = onshoreValue.header;
      } else if (tabValue === 'customer') {
        formClone.toOnshore = '';
        formClone.toOnshoreCc = '';
        formClone.toOnshoreBcc = '';
        header = customerValue.header;
      }
      dispatch({ type: mailActions.SENDMAIL_LOADING });
      dispatch(
        mailActions.sendMail({
          myblId: mybl.id,
          bkgNo,
          ...formClone,
          inquiries: cloneInquiries,
          user: user,
          header,
          tab: tabValue
        })
      );
      dispatch(
        FormActions.openConfirmPopup({
          openConfirmPopup: false,
          confirmClick: false,
          confirmPopupMsg: '',
          confirmPopupType: ''
        })
      );
    }
  }, [confirmClick]);

  useEffect(() => {
    if (openEmail && !suggestMails.length) {
      dispatch(mailActions.suggestMail(''));
    }
  }, [openEmail]);

  const sendMailClick = () => {
    setFormError({
      ...formError,
      recipient: !isRecipientValid() ? 'Please specify at least one recipient.' : '',
      subject: !form.subject ? 'Please enter your email subject.' : '',
      content: !isBodyValid() ? 'Please enter your email content.' : ''
    });
    if (isMailVaid()) {
      const to = tabValue === 'customer' ? 'Customer' : 'Onshore';
      const regex = /.*@.*com.+/;
      if (
        regex.test(inputMail[`to${to}`]) ||
        regex.test(inputMail[`to${to}Cc`]) ||
        regex.test(inputMail[`to${to}Bcc`])
      )
        dispatch(Actions.showMessage({ message: 'Invalid mail address', variant: 'error' }));
      else
        dispatch(
          Actions.showMessage({ message: 'EMAIL ADDRESS DOES NOT EXIST', variant: 'error' })
        );
    } else if (!isRecipientValid() || !form.subject || !isBodyValid()) {
      return;
    } else {
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
    setForm({ ...form, [key]: tags.join(',') });
  };

  const handleBodyChange = (content) => {
    if (tabValue === 'customer') {
      setCustomerValue({ ...customerValue, content });
    } else {
      setOnshoreValue({ ...onshoreValue, content });
    }
    setForm({ ...form, content });
  };

  const handleSubjectChange = (event) => {
    if (tabValue === 'customer') {
      setCustomerValue({ ...customerValue, subject: event.target.value });
    } else {
      setOnshoreValue({ ...onshoreValue, subject: event.target.value });
    }
    setForm({ ...form, subject: event.target.value });
  };

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
  };

  const onEditorStateChange = (evt) => {
    handleBodyChange(draftToHtml(convertToRaw(evt.getCurrentContent())).replace('<p></p>', '<br>'));
    setEditorState(evt);
    if (tabValue === 'customer') {
      setCustomerValue({ ...customerValue, html: evt });
    } else {
      setOnshoreValue({ ...onshoreValue, html: evt });
    }
  };

  const countInq = (receiver) => {
    return inquiries.filter(
      (inq) =>
        (inq.receiver.includes(receiver) && (inq.state === 'OPEN' || inq.state === 'REP_Q_DRF')) ||
        (receiver === 'customer' && inq.process === 'draft' && inq.state === 'REP_DRF')
    ).length;
  };

  const handleTabSelected = () => {
    if (countInq('customer') === 0) {
      return 'onshore';
    } else {
      return tabSelected === 0 ? 'customer' : 'onshore';
    }
  };

  return (
    <>
      <SubmitAnswerNotification
        open={openNotification}
        iconType={<img src={`/assets/images/icons/vector.svg`} />}
        msg="Your inquires have been sent successfully."
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
            handleChange={handleChange}></ActionUI>
        }
        FabTitle="E-mail"
        tabs={previewValue === 'inquiry' && ['Customer', 'Onshore']}
        nums={previewValue === 'inquiry' && [countInq('customer'), countInq('onshore')]}
        tabSelected={tabSelected}
        tabChange={(newValue) => {
          setTabSelected(newValue);
        }}>
        {previewValue === 'default' && (
          <>
            <FormControl style={{ width: '100%' }} error={Boolean(formError.recipient)}>
              <div
                style={{
                  borderBottom: formError.recipient ? '1px solid #DC2626' : '1px solid #BAC3CB'
                }}>
                <InputUI
                  id={tabValue === 'customer' ? 'Customer' : 'Onshore'}
                  onChanged={handleFieldChange}
                />
              </div>
              {formError.recipient && <HelperText>{formError.recipient}</HelperText>}
            </FormControl>
            {hasCustomer && hasOnshore && (
              <Tabs
                indicatorColor="primary"
                value={tabValue}
                onChange={handleTabChange}
                textColor="primary"
                style={{ borderBottom: '3px solid #515F6B', marginBottom: 10 }}>
                <Tab className={classes.tab} value="customer" label="Customer" />
                <Tab className={classes.tab} value="onshore" label="Onshore" />
              </Tabs>
            )}
            <FormControl
              style={{ width: '100%', padding: '5px 0', marginBottom: 10 }}
              error={Boolean(formError.subject)}>
              <input
                value={form.subject}
                onChange={handleSubjectChange}
                placeholder="Subject"
                style={{
                  border: 'none',
                  fontSize: 15,
                  fontFamily: 'Montserrat',
                  height: '25px',
                  width: '100%',
                  borderBottom: formError.subject ? '1px solid #DC2626' : '1px solid #BAC3CB'
                }}
              />
              {formError.subject && <HelperText>{formError.subject}</HelperText>}
            </FormControl>
            <FormControl style={{ width: '100%' }} error={Boolean(formError.content)}>
              <Editor
                editorState={editorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={onEditorStateChange}
                toolbar={{
                  options: [
                    'inline',
                    'blockType',
                    'fontFamily',
                    'list',
                    'textAlign',
                    'colorPicker',
                    'remove',
                    'history'
                  ],
                  inline: {
                    options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace']
                  },
                  list: {
                    options: ['unordered', 'ordered']
                  }
                }}
              />
              {formError.content && <HelperText>{formError.content}</HelperText>}
            </FormControl>
          </>
        )}
        {previewValue === 'email' && (
          <div style={{ margin: 'auto', maxWidth: 580 }}>
            <img
              style={{ margin: 15 }}
              src="assets/images/logos/one_ocean_network-logo.png"
              width="100px"
              alt="ONE"
            />
            <div
              style={{
                backgroundColor: 'white',
                padding: 20,
                fontFamily: 'Montserrat',
                fontSize: 15,
                fontWeight: 500
              }}>
              <div className="preview_editor-content">{parse(form.content)}</div>
              <p>Please visit the link below and help advise us information for further checking</p>
              <div style={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled
                  style={{
                    borderRadius: 8,
                    padding: '9px 30px',
                    textAlign: 'center',
                    fontSize: 14,
                    fontFamily: 'Montserrat',
                    color: 'white',
                    background: '#BD0F72',
                    textTransform: 'none'
                  }}>
                  View Link
                </Button>
              </div>
              <br />
              <span>Thank you for choosing ONE</span>
            </div>
          </div>
        )}
        {previewValue === 'inquiry' && (
          <AllInquiry
            user="workspace"
            receiver={handleTabSelected()}
            collapse={true}
            openInquiryReview={true}
          />
        )}
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
      <div
        style={{
          position: 'absolute',
          left: '2.5rem',
          top: '1rem',
          display: 'flex',
          alignItems: 'center'
        }}>
        <Icon style={{ color: colorBtnReview, paddingRight: '1.2rem' }}>visibility</Icon>
        <Icon
          fontSize="small"
          style={{
            color: colorBtnReview,
            paddingRight: '0.5rem',
            position: 'absolute',
            left: 17,
            top: 10
          }}>
          arrow_drop_down
        </Icon>
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
          disableUnderline>
          <StyledMenuItem value="default">Preview</StyledMenuItem>
          <StyledMenuItem value="inquiry"> Preview List</StyledMenuItem>
          <StyledMenuItem value="email"> Preview Email Layout</StyledMenuItem>
        </Select>
      </div>
      {previewValue === 'default' ? (
        <Button
          variant="contained"
          size="medium"
          color="primary"
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
        </Button>
      ) : (
        <Button
          variant="contained"
          size="medium"
          color="primary"
          style={{
            textTransform: 'none',
            fontWeight: 'bold',
            width: 120,
            height: 40,
            borderRadius: 9,
            fontFamily: 'Montserrat'
          }}
          onClick={() => handleChange('default')}>
          <Icon fontSize="small" style={{ paddingRight: '0.5rem' }}>
            keyboard_backspace
          </Icon>
          Back
        </Button>
      )}
      {isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
    </div>
  );
};

export { SendInquiryForm };
