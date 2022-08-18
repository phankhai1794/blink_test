import * as Actions from 'app/store/actions';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon, Button, Grid } from '@material-ui/core';
import clsx from 'clsx';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { makeStyles } from '@material-ui/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getMail } from 'app/services/mailService';
import { loadComment } from 'app/services/inquiryService';

import * as mailActions from '../store/actions/mail';
import * as FormActions from '../store/actions/form';

import TagsInput from './TagsInput';
import AllInquiry from './AllInquiry';
import Form from './Form';
import ReceiverProvider from './ReceiverProvider';

const colorBtnReview = '#1564EE';

const SendInquiryForm = (props) => {
  const dispatch = useDispatch();
  const [mybl, openEmail, inquiries] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.myBL,
    workspace.formReducer.openEmail,
    workspace.inquiryReducer.inquiries,
  ]);
  const [success, error, suggestMails, validateMail] = useSelector(({ workspace }) => [
    workspace.mailReducer.success,
    workspace.mailReducer.error,
    workspace.mailReducer.suggestMails,
    workspace.mailReducer.validateMail,

  ]);
  const [isCustomerCc, setIsCustomerCc] = useState(false);
  const [isCustomerBcc, setIsCustomerBcc] = useState(false);
  const [isOnshoreCc, setIsOnshoreCc] = useState(false);
  const [isOnshoreBcc, setIsOnshoreBcc] = useState(false);
  const initialState = useState({
    toCustomer: '',
    toCustomerCc: '',
    toCustomerBcc: '',
    toOnshore: '',
    toOnshoreCc: '',
    toOnshoreBcc: '',
    from: '',
    subject: '',
    content: ''
  });

  const [form, setForm] = useState(initialState);
  const [inqHasComment, setInqHasComment] = useState([]);

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
      dispatch(
        Actions.showMessage({
          message: 'Mail sent successfully',
          variant: 'success'
        })
      );
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

    for (let i in inquiries) {
      loadComment(inquiries[i].id)
        .then((res) => {
          if (res.length) {
            const listInqId = inqHasComment;
            listInqId.push(inquiries[i].id);
            setInqHasComment(listInqId);
          }
        })
        .catch((error) => console.error(error));
    };
  }, [success, error]);
  useEffect(() => {
    if (openEmail && !suggestMails.length) {
      dispatch(mailActions.suggestMail(''));
    }
  }, [openEmail]);

  const opendPreviewForm = (event) => {
    if (inquiries.length) {
      dispatch(FormActions.toggleOpenInquiryReview(true));
      dispatch(FormActions.toggleSaveInquiry(true));
    } else {
      dispatch(Actions.showMessage({ message: 'Inquiry List is empty!', variant: 'info' }));
    }
  };

  const sendMailClick = (event) => {
    if (isMailVaid()) {
      dispatch(Actions.showMessage({ message: 'Invalid mail address', variant: 'error' }));
    }
    else if (!isFormValid()) {
      dispatch(Actions.showMessage({ message: 'Please fill to Customer or Onshore fields', variant: 'error' }));
    }
    else {
      dispatch({ type: mailActions.SENDMAIL_LOADING });
      dispatch(mailActions.sendMail({ myblId: mybl.id, ...form, replyInqs: inqHasComment }));
    }
  };

  const handleFieldChange = (key, tags) => {
    setForm({ ...form, [key]: tags.join(',') })
  };

  const handleOnChange = (event) => {
    setForm({ ...form, content: event.target.value })
  };

  const onInputChange = (event) => {
    setForm({ ...form, subject: event.target.value })
  };

  const useStyles = makeStyles(() => ({
    label: {
      whiteSpace: 'nowrap',
      color: '#132535',
      fontSize: 14,
      fontWeight: '600',
      fontFamily: 'Montserrat'
    }
  }));

  const classes = useStyles(props);
  return (
    <>
      <Form
        title={'New Mail'}
        open={openEmail}
        toggleForm={(status) => dispatch(FormActions.toggleOpenEmail(status))}
        openFab={false}
        field={props.field}
        customActions={
          <ActionUI openPreviewClick={opendPreviewForm} sendMailClick={sendMailClick}></ActionUI>
        }
        FabTitle="E-mail">
        <>
          <ReceiverProvider receiver='customer'>
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
          </ReceiverProvider>
          <ReceiverProvider receiver='onshore'>
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
          </ReceiverProvider>
          <div style={{ display: 'flex', marginTop: 10 }}>
            <label className={clsx(classes.label)}>Subject</label>
          </div>
          <div style={{ marginTop: 5, display: 'flex' }}>
            <input
              style={{
                paddingTop: '5px',
                paddingLeft: '5px',
                paddingBottom: '5px',
                width: '100%',
                borderWidth: '0.5px',
                borderRadius: '6px',
                height: '25px',
                borderStyle: 'solid',
                borderColor: 'lightgray'
              }}
              value={form.subject}
              onChange={onInputChange}
            />
          </div>
          <div style={{ marginTop: 5, display: 'flex' }}>
            <textarea
              style={{
                width: '100%',
                paddingTop: 10,
                paddingLeft: 5,
                marginTop: 10,
                minHeight: 250,
                borderWidth: '0.5px',
                borderStyle: 'solid',
                borderColor: 'lightgray',
                borderRadius: 6,
                resize: 'none'
              }}
              multiline="true"
              type="text"
              defaultValue=""
              onChange={handleOnChange}></textarea>
          </div>
        </>
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
          <div style={{ height: '800px' }}>
            <AllInquiry
              user="workspace"
              receiver={handleTabSelected()}
              collapse={true}
              openInquiryReview={true}
            />
          </div>
        </>
      </Form>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  buttonProgress: {
    color: 'red',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
}));

const InputUI = (props) => {
  const { id, title, type, onChanged, isCc, isBcc, onCc, onBcc } = props;
  const useStyles = makeStyles(() => ({
    label: {
      whiteSpace: 'nowrap',
      color: '#132535',
      fontSize: 14,
      fontWeight: '600',
      fontFamily: 'Montserrat'
    }
  }));
  const classes = useStyles(props);
  return (
    <Grid
      style={{ marginTop: 8 }}
      container
      direction="row">
      <Grid item xs={1}>
        {title === 'Cc' || title === 'Bcc' ? (
          <div
            style={{
              paddingLeft: '7px',
              paddingRight: '7px',
              width: 'fit-content',
              background: '#FFFFFF',
              border: '1px solid #BD0F72',
              borderRadius: '4px',
              justifyContent: 'center'
            }}>
            <label
              style={{
                fontStyle: 'normal',
                fontWeight: '500',
                fontSize: '14px',
                lineHeight: '17px',
                width: '100%',
                fontFamily: 'Montserrat',
                color: '#BD0F72'
              }}
              className={clsx(classes.label)}>
              {title}
            </label>
          </div>
        ) : (
          <label style={{ fontSize: 14 }} className={clsx(classes.label)}>
            {title}
          </label>
        )}
      </Grid>
      <Grid style={{ paddingLeft: 20 }} item xs={11}>
        <TagsInput
          id={id}
          tagLimit={10}
          type={title}
          isCc={isCc}
          isBcc={isBcc}
          onCc={onCc}
          onBcc={onBcc}
          onChanged={onChanged}
        />
      </Grid>
    </Grid>
  );
};

const ActionUI = (props) => {
  const classes = useStyles();
  const { openPreviewClick, sendMailClick } = props;
  const [isLoading] = useSelector(({ workspace }) => [workspace.mailReducer.isLoading]);

  return (
    <div
      style={{
        padding: 10,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <Button
        style={{
          textTransform: 'none',
          position: 'absolute',
          left: '10px',
          top: '10px',
          fontFamily: 'Montserrat'
        }}
        variant="text"
        onClick={openPreviewClick}>
        <Icon fontSize='small' style={{ color: colorBtnReview, paddingRight: '0.5rem' }}>visibility</Icon>
        <span className="pl-14" style={{ color: colorBtnReview, fontSize: '16px' }}>
          Preview Inquiries
        </span>
      </Button>
      <Button
        variant="text"
        size="medium"
        style={{
          textTransform: 'none',
          fontWeight: 'bold',
          width: 140,
          color: 'white',
          backgroundColor: isLoading ? '#515E6A' : '#bd1874',
          borderRadius: 20,
          fontFamily: 'Montserrat'
        }}
        disabled={isLoading}
        onClick={sendMailClick}>
        Send
      </Button>
      {isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
    </div>
  );
};

export { SendInquiryForm, InquiryReview };
