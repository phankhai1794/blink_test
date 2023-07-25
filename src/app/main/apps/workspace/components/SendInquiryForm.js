import * as Actions from 'app/store/actions';
import { checkNewInquiry } from '@shared';
import { PORT_OF_DISCHARGE, PORT_OF_LOADING, VESSEL_VOYAGE_CODE, PRE_CARRIAGE_CODE, ETD, SHIPPER_NAME } from '@shared/keyword';
import { handleError } from '@shared/handleError';
import React, { useState, useEffect, useContext } from 'react';
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
import { SocketContext } from 'app/AppContext';

import * as InquiryActions from '../store/actions/inquiry';
import * as MailActions from '../store/actions/mail';
import * as FormActions from '../store/actions/form';

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
  const socket = useContext(SocketContext);

  const user = useSelector(({ user }) => user);
  const mybl = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const openEmail = useSelector(({ workspace }) => workspace.formReducer.openEmail);
  const openPreviewFiles = useSelector(({ workspace }) => workspace.formReducer.openPreviewFiles);
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const content = useSelector(({ workspace }) => workspace.inquiryReducer.content);
  const pathName = window.location.pathname;
  const success = useSelector(({ workspace }) => workspace.mailReducer.success);
  const error = useSelector(({ workspace }) => workspace.mailReducer.error);
  const suggestMails = useSelector(({ workspace }) => workspace.mailReducer.suggestMails);
  const inputMail = useSelector(({ workspace }) => workspace.mailReducer.inputMail);
  const confirmPopupType = useSelector(({ workspace }) => workspace.formReducer.confirmPopupType);
  const confirmClick = useSelector(({ workspace }) => workspace.formReducer.confirmClick);
  const tags = useSelector(({ workspace }) => workspace.mailReducer.tags);
  const listMinimize = useSelector(({ workspace }) => workspace.inquiryReducer.listMinimize);

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
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const syncData = (data, syncOptSite = "") => {
    socket.emit("sync_data", { data, syncOptSite });
  };

  const getField = (keyword) => {
    return metadata.field?.[keyword] || '';
  };
  const getValueField = (keyword) => {
    return content[getField(keyword)] || '';
  };

  const bkgNo = mybl.bkgNo;
  const vvdCode = getValueField(PRE_CARRIAGE_CODE) || getValueField(VESSEL_VOYAGE_CODE);
  const pod = getValueField(PORT_OF_DISCHARGE);
  const pol = getValueField(PORT_OF_LOADING)
  const etd = getValueField(ETD);
  let shipperName = getValueField(SHIPPER_NAME);
  shipperName = shipperName?.trim() ? `${shipperName} +` : '';

  const initiateContentState = (content) => {
    return EditorState.createWithContent(ContentState.createFromText(content));
  };

  const handleEditorState = (content) => {
    setEditorState(initiateContentState(content));
  };

  const showMessageReply = () => {
    return inquiries.some(
      (inq) =>
        inq.receiver[0] === tabValue &&
        ['ANS_SENT', 'REP_A_SENT', 'AME_SENT'].includes(inq.state) || inq.state === 'REP_SENT' && inq.creator?.accountRole === 'Guest'
    )
  }

  const convertToList = (array, tabValue) => {
    const newInq = checkNewInquiry(metadata, inquiries, tabValue, ['OPEN']);
    const newRep = checkNewInquiry(metadata, inquiries, tabValue, ['REP_Q_DRF']);
    const newAmeRep = checkNewInquiry(metadata, inquiries, tabValue, ['REP_DRF']);
    const convert = (array) => array.map((a) => `- ${a}`).join('\n');
    let header = 'New Reply';
    let subject = 'Customer BL Query';
    let msg = '';

    if ((newInq.length && newRep.length) || (newInq.length && newAmeRep.length)) {
      const countInq = newInq.length > 1;
      const countRep = [...new Set([...newRep, ...newAmeRep])].length > 1;
      msg =
        'Thank you very much for your response to our inquiries. However, there are still some pending issues that need to be clarified in the following BL fields:';
      return [
        msg,
        ` \nNew ${countInq ? 'inquiries' : 'inquiry'}:\n${convert(newInq)}\n \nNew ${countRep ? 'replies' : 'reply'}:\n${convert([...new Set([...newRep, ...newAmeRep])])}`,
        header,
        'NEW REPLY'
      ];
    } else if (newRep.length) {
      msg = 'Thank you very much for your response to our inquiries. However, there are still some pending issues that need to be clarified in the following BL fields:';
    } else if (newAmeRep.length) {
      msg = 'Thank you very much for checking BL draft. Your amendment requests are in progress; however, there are still some pending issues that need to be clarified in the following BL fields:';
      subject = 'BL Amendment Request';
    } else if (newInq.length || array.length) {
      header = 'New Inquiry';
    }
    return [msg, array.map((a) => `- ${a}`).join('\n'), header, subject];
  };

  async function fetchData() {
    const status = ['INQ_SENT', 'REP_Q_SENT', 'REP_A_DRF', 'REOPEN_Q', 'REOPEN_A'];
    let toCustomer = [], toOnshore = [], toCustomerCc = [], toOnshoreCc = [], toCustomerBcc = [], toOnshoreBcc = []

    const res = await getMail(mybl.id);
    if (res.data.length) {
      // Customer
      res.data[0]?.toCustomer?.length &&
        res.data[0].toCustomer.forEach((customer) => {
          toCustomer.push(customer.email);
        });
      res.data[0]?.toCustomerCc?.length &&
        res.data[0].toCustomerCc.forEach((customer) => {
          toCustomerCc.push(customer.email);
        });
      res.data[0]?.toCustomerBcc?.length &&
        res.data[0].toCustomerBcc.forEach((customer) => {
          toCustomerBcc.push(customer.email);
        });
      // Onshore
      res.data[0]?.toOnshore?.length &&
        res.data[0].toOnshore.forEach((onshore) => {
          toOnshore.push(onshore.email);
        });
      res.data[0]?.toOnshoreCc?.length &&
        res.data[0].toOnshoreCc.forEach((onshore) => {
          toOnshoreCc.push(onshore.email);
        });
      res.data[0]?.toOnshoreBcc?.length &&
        res.data[0].toOnshoreBcc.forEach((onshore) => {
          toOnshoreBcc.push(onshore.email);
        });
      dispatch(MailActions.setTags({ ...tags, toCustomer, toOnshore, toCustomerCc, toOnshoreCc, toCustomerBcc, toOnshoreBcc }));
    }
    toCustomer = toCustomer.join(',');
    toOnshore = toOnshore.join(',');
    toCustomerCc = toCustomerCc.join(',');
    toOnshoreCc = toOnshoreCc.join(',');
    toCustomerBcc = toCustomerBcc.join(',');
    toOnshoreBcc = toOnshoreBcc.join(',');

    // check inquiries
    let inqOnshore = [], inqCustomer = [];
    if (hasCustomer) setInqCustomer(inqCustomer = checkNewInquiry(metadata, inquiries, 'customer'));
    else setInqCustomer(inqCustomer = checkNewInquiry(metadata, inquiries, 'customer', [...status, 'REP_SENT']));

    if (hasOnshore) setInqOnshore(inqOnshore = checkNewInquiry(metadata, inquiries, 'onshore'));
    else setInqOnshore(inqOnshore = checkNewInquiry(metadata, inquiries, 'onshore', status));

    // set subject, content
    let subject = '';
    let content = '';
    let bodyHtml = '';
    if (hasOnshore || (!hasOnshore && inqOnshore.length)) {
      setTabValue('onshore');

      subject = `[Onshore - BL Query]_[${inqOnshore.length > 1 ? 'MULTIPLE INQUIRIES' : inqOnshore[0]}] ${bkgNo}: ${shipperName} T/VVD(${vvdCode}) + POD(${pod}) + POL(${pol}) + ETD(${etd})`;
      const [msg1, msg2, header] = convertToList(inqOnshore, 'onshore');
      content = pathName.includes('/guest') ? '' : `Dear Onshore,\n \n${msg1 || 'We need your assistance for BL completion.\n \nPending issue(s):'}\n${msg2}`;
      bodyHtml = draftToHtml(convertToRaw(ContentState.createFromText(content)));
      setOnshoreValue({
        ...onshoreValue,
        subject,
        content: bodyHtml,
        html: initiateContentState(content),
        header
      });
    }
    if (hasCustomer || (!hasCustomer && inqCustomer.length)) {
      setTabValue('customer');

      const [msg1, msg2, header, subj] = convertToList(inqCustomer, 'customer');
      subject = `[${subj}]_[${inqCustomer.length > 1 ? 'MULTIPLE INQUIRIES' : inqCustomer[0]}] ${bkgNo}: ${shipperName} T/VVD(${vvdCode}) + POD(${pod}) + POL(${pol}) + ETD(${etd})`;
      content = pathName.includes('/guest') ? '' : `Dear Customer,\n \n${msg1 || `We found discrepancy between SI and OPUS booking details or missing/ incomplete information on some BL's fields as follows:`}\n${msg2} `;
      bodyHtml = draftToHtml(convertToRaw(ContentState.createFromText(content)));
      setCustomerValue({
        ...customerValue,
        subject,
        content: bodyHtml,
        html: initiateContentState(content),
        header
      });
    }
    if (pathName.includes('/guest')) {
      subject = `Fwd: ${bkgNo}: ${shipperName} T/VVD(${vvdCode}) + POD(${pod}) + POL(${pol}) + ETD(${etd})`;
    }
    setForm({ ...form, subject, content: bodyHtml, toOnshore, toCustomer, toCustomerCc, toOnshoreCc, toCustomerBcc, toOnshoreBcc });
    dispatch(MailActions.setCc({ isCcCustomer: Boolean(toCustomerCc), isCcOnshore: Boolean(toOnshoreCc), isBccCustomer: Boolean(toCustomerBcc), isBccOnshore: Boolean(toOnshoreBcc) }))
    handleEditorState(content);
  }

  useEffect(() => {
    // call API suggest mail
    if (!suggestMails.length) dispatch(MailActions.suggestMail(''));
    fetchData();
    return () => {
      dispatch(MailActions.setTags({ toCustomer: [], toOnshore: [], toCustomerCc: [], toOnshoreCc: [], toCustomerBcc: [], toOnshoreBcc: [] }));
      dispatch(MailActions.inputMail({ toCustomer: '', toOnshore: '', toCustomerCc: '', toOnshoreCc: '', toCustomerBcc: '', toOnshoreBcc: '' }));
    }
  }, []);

  useEffect(() => {
    if (tabValue === 'onshore') {
      setForm({ ...form, subject: onshoreValue.subject, content: onshoreValue.content });
      setEditorState(onshoreValue.html);
    } else {
      setForm({ ...form, subject: customerValue.subject, content: customerValue.content });
      setEditorState(customerValue.html);
    }
  }, [tabValue]);

  const isRecipientValid = () => {
    if (tabValue === 'customer') {
      return Boolean(form.toCustomer);
    }
    return Boolean(form.toOnshore);
  };

  const isBodyValid = () => {
    return Boolean(form.content.replace(/<[^>]*>|\n|&nbsp;/g, ''));
  };

  const isMailVaid = (tab) => ["", "Cc", "Bcc"].some((to) => Boolean(inputMail[`to${tab}${to}`].length));

  useEffect(() => {
    if (success) {
      dispatch({
        type: MailActions.SENDMAIL_NONE
      });
      if (!hasCustomer && !hasOnshore) {
        dispatch(FormActions.toggleOpenEmail(false));
      }
      if (hasOnshore) {
        setTabValue('onshore');
      }
      if (hasCustomer) {
        setTabValue('customer');
      }

      const cloneInquiries = [...inquiries];
      cloneInquiries.forEach((q) => {
        if (q.receiver[0] === tabValue) {
          if (q.state === 'OPEN') q.state = 'INQ_SENT'; // inquiry
          else if (q.state === 'REP_Q_DRF') q.state = 'REP_Q_SENT'; // inquiry
          else if (q.state === 'REP_DRF') q.state = 'REP_SENT'; // amendment
        }
      });
      dispatch(InquiryActions.setInquiries(cloneInquiries));
      dispatch(InquiryActions.checkSend(false));

      // sync send mail
      syncData({ inquiries: cloneInquiries, listMinimize }, tabValue?.toUpperCase() || "");

      dispatch(Actions.showMessage({ message: 'Your inquiries have been sent successfully', variant: 'success' }));
    } else if (error) {
      handleError(dispatch, error);
      dispatch({
        type: MailActions.SENDMAIL_NONE
      });
    }
  }, [success, error]);

  useEffect(() => {
    if (confirmClick && confirmPopupType === 'sendMail') {
      const cloneInquiries = [...inquiries];
      const resend = Boolean(
        (tabValue === 'customer' && !hasCustomer && inqCustomer.length)
        ||
        (tabValue === 'onshore' && !hasOnshore && inqOnshore.length)
      );
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
      dispatch({ type: MailActions.SENDMAIL_LOADING });
      dispatch(
        MailActions.sendMail({
          myblId: mybl.id,
          bkgNo,
          ...formClone,
          inquiries: cloneInquiries,
          user: user,
          header,
          tab: tabValue,
          resend
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

  const sendMailClick = (resend = false) => {
    setFormError({
      ...formError,
      recipient: !isRecipientValid() ? 'Please specify at least one recipient.' : '',
      subject: !form.subject ? 'Please enter your email subject.' : '',
      content: !isBodyValid() ? 'Please enter your email content.' : ''
    });

    const to = (tabValue === 'customer') ? 'Customer' : 'Onshore';
    if (isMailVaid(to)) {
      const regex = /.*@.*com.+/;
      if (["", "Cc", "Bcc"].some((c) => regex.test(inputMail[`to${to}${c}`])))
        dispatch(Actions.showMessage({ message: 'Invalid mail address', variant: 'error' }));
      else
        dispatch(
          Actions.showMessage({ message: 'EMAIL ADDRESS DOES NOT EXIST', variant: 'error' })
        );
    } else if (
      tabValue === 'onshore'
      && !pathName.includes('/guest')
      && [...tags['toOnshore'], ...tags['toOnshoreCc'], ...tags['toOnshoreBcc']].some(
        (mail) => !/.*@one-line.com/.test(mail) && !/.*@googlegroups.com/.test(mail)
      )
    ) {
      dispatch(Actions.showMessage({ message: 'Invalid mail address', variant: 'error' }));
    } else if (
      tabValue === 'customer'
      && !pathName.includes('/guest')
      && [...tags['toCustomer']].some(
        (mail) => /.*@one-line.com/.test(mail)
      )
    ) {
      dispatch(Actions.showMessage({ message: 'Please provide the email address of your customer', variant: 'error' }));
    } else if (!isRecipientValid() || !form.subject || !isBodyValid()) {
      return;
    } else {
      if (showMessageReply()) {
        dispatch(Actions.showMessage({ message: 'There are still remaining Inquiries/Amendments that have not yet been replied', variant: 'warning' }));
      }
      dispatch(
        FormActions.openConfirmPopup({
          openConfirmPopup: true,
          confirmPopupMsg: `Are you sure you want to ${resend ? 'resend' : 'send'} this email?`,
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

  const handleSendOrResend = () => {
    let isResending = (
      (tabValue === 'customer' && !hasCustomer && inqCustomer.length)
      ||
      (tabValue === 'onshore' && !hasOnshore && inqOnshore.length)
    );
    sendMailClick(Boolean(isResending));
  }

  return (
    <>
      <Form
        title={pathName.includes('/guest') ? 'Forward Mail' : 'New Mail'}
        open={openEmail}
        toggleForm={(status) => dispatch(FormActions.toggleOpenEmail(status))}
        openFab={false}
        field={props.field}
        isPreviewFile={openPreviewFiles}
        style={previewValue === 'email' && { backgroundColor: '#fdf2f2' }}
        customActions={
          <ActionUI
            sendMailClick={handleSendOrResend}
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
            {
              Boolean(inqCustomer.length && inqOnshore.length) && <Tabs
                indicatorColor="primary"
                value={tabValue}
                onChange={handleTabChange}
                textColor="primary"
                style={{ borderBottom: '3px solid #515F6B', marginBottom: 10 }}>
                <Tab className={classes.tab} value="customer" label="Customer" />
                <Tab className={classes.tab} value="onshore" label="Onshore" />
              </Tabs>
            }
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
                fontWeight: 500,
                width: 468,
                wordBreak: 'break-word'
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
              <span style={{ display: 'block' }}>Best regards, </span>
              <span>ONE Offshore Center </span>
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
