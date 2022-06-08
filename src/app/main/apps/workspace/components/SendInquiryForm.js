import { useForm } from '@fuse/hooks';
import * as Actions from 'app/store/actions';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import draftToHtml from 'draftjs-to-html';
import clsx from 'clsx';
import { Button, Grid, Divider } from '@material-ui/core';
import { Editor } from 'react-draft-wysiwyg';
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

  const { form } = useForm({
    toCustomer: '',
    toOnshore: '',
    from: '',
    subject: '',
    content: ''
  });

  function isFormValid() {
    return form.toCustomer.length > 0 || form.toOnshore.length > 0;
  }

  const dispatch = useDispatch();
  const [opendPreview, setOpendPreview] = useState(null);
  const [tabSelected, setTabSelected] = useState(0);

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

  const openSendInquiryDialog = (event) => {
    dispatch(FormActions.toggleOpenEmail(true));
    if (!mails.length) {
      dispatch(mailActions.suggestMail(''));
    }
  };

  const opendPreviewForm = (event) => {
    setOpendPreview(true);
  };

  const sendMailClick = (event) => {
    if (isFormValid()) {
      dispatch({ type: mailActions.SENDMAIL_LOADING });
      dispatch(mailActions.sendMail({ myblId: mybl.id, ...form }));
    } else {
      alert('Please fill to Customer or Onshore fields');
    }
  };

  const closePreviewForm = () => {
    setOpendPreview(null);
  };

  const handleFieldChange = (key, tags) => {
    form[key] = tags.join(',');
  };

  const onContentStateChange = (contentState) => {
    form.content = draftToHtml(contentState);
  };

  const onInputChange = (event) => {
    form.subject = event.target.value;
  };

  const useStyles = makeStyles(() => ({
    label: {
      whiteSpace: 'nowrap',
      color: '#4a4a4a',
      fontSize: 14,
      fontFamily: 'Roboto, Helvetica Neue, Arial, sans-serif'
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
        customActions={
          <ActionUI openPreviewClick={opendPreviewForm} sendMailClick={sendMailClick}></ActionUI>
        }
        FabTitle="e-mail">
        <>
          <Grid
            style={{ marginTop: 8 }}
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center">
            <Grid item xs={1}>
              <label style={{ fontSize: 14 }} className={clsx(classes.label)}>
                To Customer
              </label>
            </Grid>
            <Grid style={{ paddingLeft: 15 }} item xs={11}>
              <TagsInput id={'toCustomer'} tagLimit={10} onChanged={handleFieldChange} />
            </Grid>
          </Grid>
          <Grid
            style={{ marginTop: 8 }}
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center">
            <Grid item xs={1}>
              <label className={clsx(classes.label)}>To Onshore</label>
            </Grid>
            <Grid style={{ paddingLeft: 15 }} item xs={11}>
              <TagsInput id={'toOnshore'} tagLimit={10} onChanged={handleFieldChange} />
            </Grid>
          </Grid>
          <Grid
            style={{ marginTop: 8 }}
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center">
            <Grid item xs={1}>
              <label className={clsx(classes.label)}>From</label>
            </Grid>
            <Grid style={{ paddingLeft: 15 }} item xs={11}>
              <TagsInput id={'from'} tagLimit={1} onChanged={handleFieldChange} />
            </Grid>
          </Grid>
          <Grid
            style={{ marginTop: 8 }}
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center">
            <Grid item xs={1}>
              <label className={clsx(classes.label)}>Subject</label>
            </Grid>
            <Grid style={{ paddingLeft: 15 }} item xs={11}>
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
            </Grid>
          </Grid>
          <div style={{ minHeight: 300, marginTop: 10 }}>
            <Editor
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onContentStateChange={onContentStateChange}
            />
          </div>
          <Divider />
        </>
        {opendPreview ? (
          <Form
            title={'Sending inquiry preview'}
            tabs={['Customer', 'Onshore']}
            open={opendPreview}
            toggleForm={(status) => {
              closePreviewForm();
            }}
            tabChange={(newValue) => {
              setTabSelected(newValue);
            }}
            openFab={false}
            customActions={<div></div>}>
            <>
              <div style={{ height: '800px' }}>
                <AllInquiry
                  user="workspace"
                  receiver={tabSelected == 0 ? 'customer' : 'onshore'}
                  collapse={true}
                />
              </div>
            </>
          </Form>
        ) : null}
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

const ActionUI = (props) => {
  const classes = useStyles();
  const { openPreviewClick, sendMailClick } = props;
  const [isLoading] = useSelector(({ workspace }) => [workspace.mailReducer.isLoading]);

  return (
    <div style={{ padding: 10 }}>
      <Grid container justify="center" style={{ paddingTop: 20 }}>
        <Grid>
          <Button
            style={{
              width: 120,
              color: 'white',
              backgroundColor: '#092D33',
              marginRight: 10,
              borderRadius: 20
            }}
            onClick={openPreviewClick}>
            Preview
          </Button>
        </Grid>
        <Grid>
          <div>
            <Button
              style={{
                width: 120,
                color: 'white',
                marginLeft: 10,
                backgroundColor: isLoading ? '#515E6A' : '#bd1874',
                borderRadius: 20
              }}
              disabled={isLoading}
              onClick={sendMailClick}>
              SEND
            </Button>
            {isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default SendInquiryForm;
