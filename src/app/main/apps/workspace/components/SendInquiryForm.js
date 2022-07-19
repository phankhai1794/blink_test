import { useForm } from '@fuse/hooks';
import * as Actions from 'app/store/actions';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon, Button, Grid } from '@material-ui/core';
import clsx from 'clsx';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { makeStyles } from '@material-ui/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import * as mailActions from '../store/actions/mail';
import * as FormActions from '../store/actions/form';

import TagsInput from './TagsInput';
import AllInquiry from './AllInquiry';
import Form from './Form';

const SendInquiryForm = (props) => {
  const [mybl, openEmail] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.myBL,
    workspace.formReducer.openEmail
  ]);
  const [success, error, mails] = useSelector(({ workspace }) => [
    workspace.mailReducer.success,
    workspace.mailReducer.error,
    workspace.mailReducer.mails
  ]);
  const [isCustomerCc, setIsCustomerCc] = useState(false);
  const [isCustomerBcc, setIsCustomerBcc] = useState(false);
  const [isOnshoreCc, setIsOnshoreCc] = useState(false);
  const [isOnshoreBcc, setIsOnshoreBcc] = useState(false);

  const { form } = useForm({
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

  function isFormValid() {
    return form.toCustomer.length > 0 || form.toOnshore.length > 0;
  }

  const dispatch = useDispatch();

  useEffect(() => {
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
    if (openEmail && !mails.length) {
      dispatch(mailActions.suggestMail(''));
    }
  }, [openEmail]);

  const opendPreviewForm = (event) => {
    dispatch(FormActions.toggleOpenInquiryReview(true));
  };

  const sendMailClick = (event) => {
    if (isFormValid()) {
      dispatch({ type: mailActions.SENDMAIL_LOADING });
      dispatch(mailActions.sendMail({ myblId: mybl.id, ...form }));
    } else {
      alert('Please fill to Customer or Onshore fields');
    }
  };

  const handleFieldChange = (key, tags) => {
    form[key] = tags.join(',');
  };

  const handleOnChange = (event) => {
    form.content = event.target.value;
  };

  const onInputChange = (event) => {
    form.subject = event.target.value;
  };

  const useStyles = makeStyles(() => ({
    label: {
      whiteSpace: 'nowrap',
      color: '#132535',
      fontSize: 14,
      fontWeight: '400',
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
          <div style={{ display: 'flex', marginTop: 10 }}>
            <label className={clsx(classes.label)}>Subject</label>
          </div>
          <div style={{ marginTop: 5, marginRight: 5 }}>
            <input
              style={{
                padding: '5px',
                width: '100%',
                borderWidth: '0.5px',
                borderRadius: '4px',
                height: '25px',
                borderStyle: 'solid',
                borderColor: 'lightgray'
              }}
              onChange={onInputChange}
            />
          </div>
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
              borderRadius: 5,
              resize: 'vertical'
            }}
            multiline={true}
            type="text"
            defaultValue=""
            onChange={handleOnChange}></textarea>
        </>
      </Form>
    </>
  );
};

const InquiryReview = (props) => {
  const [tabSelected, setTabSelected] = useState(0);
  const [openInqReview] = useSelector(({ workspace }) => [workspace.formReducer.openInqReview]);
  const dispatch = useDispatch();

  return (
    <>
      <Form
        title={'Sending inquiry preview'}
        tabs={['Customer', 'Onshore']}
        open={openInqReview}
        toggleForm={(status) => dispatch(FormActions.toggleOpenInquiryReview(status))}
        tabChange={(newValue) => {
          setTabSelected(newValue);
        }}
        field={props.field}
        openFab={false}
        FabTitle="Inquiry Review"
        customActions={<div></div>}>
        <>
          <div style={{ height: '800px' }}>
            <AllInquiry
              user="workspace"
              receiver={tabSelected === 0 ? 'customer' : 'onshore'}
              collapse={true}
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
      fontWeight: '400',
      fontFamily: 'Montserrat'
    }
  }));
  const classes = useStyles(props);
  return (
    <Grid
      style={{ marginTop: 8 }}
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="center">
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
      {/* <Button
        style={{
          textTransform: 'none',
          fontWeight: 'bold',
          position: 'absolute',
          left: '10px',
          top: '10px'
        }}
        variant="text"
        // className={clsx('h-64', classes.button)}
        onClick={openPreviewClick}>
        <Icon style={{ color: '#1564EE' }}>visibility</Icon>
        <span className="pl-14" style={{ color: '#1564EE' }}>
          Preview Inquiries
        </span>
      </Button> */}
      <Button
        variant="text"
        size="medium"
        style={{
          textTransform: 'none',
          fontWeight: 'bold',
          width: 140,
          color: 'white',
          backgroundColor: isLoading ? '#515E6A' : '#bd1874',
          borderRadius: 20
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
