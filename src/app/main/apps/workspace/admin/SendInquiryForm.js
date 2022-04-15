import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from '../shared-components/Form';
import draftToHtml from 'draftjs-to-html';
import clsx from 'clsx';
import {
  TextField,
  Box,
  Button,
  Grid,
  Icon,
  Dialog,
  Typography,
  Divider,
  Tabs,
  Tab
} from '@material-ui/core';

import TagsInput from './components/TagsInput';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { makeStyles } from '@material-ui/styles';
import AllInquiry from '../shared-components/AllInquiry';
import { useForm } from '@fuse/hooks';
import * as Actions from 'app/store/actions';
import * as mailActions from './store/actions/mail.actions';
import { SENDMAIL_NONE,SENDMAIL_LOADING } from './store/actions/mail.actions';

const SendInquiryForm = (props) => {
  const [questions, title, mybl] = useSelector((state) => [
    state.workspace.question,
    state.workspace.currentField,
    state.workspace.myBL
  ]);
  const { success, error } = useSelector(({ mail }) => mail);
  const { form, handleChange, resetForm } = useForm({
    toCustomer: '',
    toOnshore: '',
    from: '',
    subject: '',
    content: ''
  });

  function isFormValid() {
    return form.email.length > 0 && form.password.length > 0;
  }

  const dispatch = useDispatch();
  const [opened, setopened] = useState(null);
  const [opendPreview, setopendPreview] = useState(null);
  useEffect(() => {
    if (success) {
      dispatch(
        Actions.showMessage({
          message: 'Mail sent successfully'
        })
      );
      dispatch({
        type: SENDMAIL_NONE
      });
      setTimeout(() => {
        setopened(false);
      }, 1000);
    } else if (error) {
      dispatch(
        Actions.showMessage({
          message: 'Mail not sent!. Please try again'
        })
      );
      dispatch({
        type: SENDMAIL_NONE
      });
    }
  }, [success, error]);

  const openSendInquiryDialog = (event) => {
    setopened(true);
  };

  const opendPreviewForm = (event) => {
    setopendPreview(true);
  };

  const sendMailClick = (event) => {
    dispatch({type: SENDMAIL_LOADING});
    dispatch(mailActions.sendMail({ myblId: mybl.id, ...form }));
  };

  const closePreviewForm = () => {
    setopendPreview(null);
  };

  const closeSendInquiry = () => {
    setopened(null);
  };

  const [value, setValue] = React.useState(0);

  const handleFieldChange = (key, tags) => {
    form[key] = tags.join(',');
    setValue(key);
  };

  const onEditorStateChange = (event, newValue) => {
    console.log(newValue);
    // this.setState({ value: newValue });
    // setValue(newValue);
  };
  const onContentStateChange = (contentState) => {
    form.content = draftToHtml(contentState);
  };

  const onInputChange = (event) => {
    console.log(value);
    form.subject = event.target.value;
    // this.setState({ value: newValue });
    // setValue(newValue);
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
    <React.Fragment>
      <div
        style={{
          paddingLeft: 15,
          paddingRight: 5,
          paddingTop: 17
        }}>
        <Button
          style={{
            width: 120,
            height: 30,
            color: 'white',
            backgroundColor: '#bd1874',
            borderRadius: 20
          }}
          variant="text"
          size="small"
          onClick={openSendInquiryDialog}>
          E-Mail
        </Button>
      </div>

      <Form
        title={'Send Inquiry'}
        open={opened}
        toggleForm={(status) => {
          closeSendInquiry();
        }}
        openFab={false}
        customActions={
          <ActionUI openPreviewClick={opendPreviewForm} sendMailClick={sendMailClick}></ActionUI>
        }
        FabTitle={''}
        title={'New Mail'}>
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
                onChange={onInputChange}></input>
            </Grid>
          </Grid>
          <div style={{ minHeight: 300, marginTop: 10 }}>
            <Editor
              // editorState={editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onContentStateChange={onContentStateChange}
              onEditorStateChange={onEditorStateChange}
            />
          </div>
          <Divider></Divider>
        </>
        {opendPreview ? (
          <Form
            title={'Sending inquiry preview'}
            tabs={['Offshore', 'Onshore']}
            open={opendPreview}
            toggleForm={(status) => {
              closePreviewForm();
            }}
            openFab={false}
            customActions={<div></div>}>
            <>
              <AllInquiry user="workspace" collapse={true} />
            </>
          </Form>
        ) : null}
      </Form>
    </React.Fragment>
  );
};

const ActionUI = (props) => {
  const dispatch = useDispatch();
  const { openPreviewClick, sendMailClick } = props;
  const { success, error,isLoading } = useSelector(({ mail }) => mail);

  return (
    <div style={{ padding: 10 }}>
      <Grid container style={{ 'justify-content': 'center', paddingTop: 20 }}>
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
          <Button
            loading={isLoading}
            style={{
              width: 120,
              color: 'white',
              marginLeft: 10,
              backgroundColor: '#bd1874',
              borderRadius: 20
            }}
            onClick={sendMailClick}>
            SEND
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default SendInquiryForm;
