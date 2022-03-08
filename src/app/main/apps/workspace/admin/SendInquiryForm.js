import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../admin/store/actions';
import Form from '../shared-components/Form';
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
import InquirySaved from '../shared-components/InquirySaved';

const SendInquiryForm = (props) => {
  const [questions, title] = useSelector((state) => [
    state.workspace.question,
    state.workspace.currentField
  ]);
  const dispatch = useDispatch();
  const [opened, setopened] = useState(null);
  const [opendPreview, setopendPreview] = useState(null);

  const openSendInquiryDialog = (event) => {
    setopened(true);
  };

  const opendPreviewForm = (event) => {
    setopendPreview(true);
  };
  const closePreviewForm = () => {
    setopendPreview(null);
  };

  const closeSendInquiry = () => {
    setopened(null);
  };

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <React.Fragment>
      <div
        style={{
          paddingLeft: 5,
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
        hiddenActions={true}
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
              <label style={{ color: '#89949B', fontSize: 13, fontFamily: 'sans-serif' }}>
                To Customer{' '}
              </label>
            </Grid>
            <Grid style={{ paddingLeft: 5 }} item xs={11}>
              <TagsInput />
            </Grid>
          </Grid>
          <Grid
            style={{ marginTop: 8 }}
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center">
            <Grid item xs={1}>
              <label style={{ color: '#89949B', fontSize: 13, fontFamily: 'sans-serif' }}>
                To Onshore{' '}
              </label>
            </Grid>
            <Grid style={{ paddingLeft: 5 }} item xs={11}>
              <TagsInput />
            </Grid>
          </Grid>
          <Grid
            style={{ marginTop: 8 }}
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center">
            <Grid item xs={1}>
              <label style={{ color: '#89949B', fontSize: 13, fontFamily: 'sans-serif' }}>
                From{' '}
              </label>
            </Grid>
            <Grid style={{ paddingLeft: 5 }} item xs={11}>
              <TagsInput />
            </Grid>
          </Grid>
          <Grid
            style={{ marginTop: 8 }}
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center">
            <Grid item xs={1}>
              <label style={{ color: '#89949B', fontSize: 13, fontFamily: 'sans-serif' }}>
                Subject
              </label>
            </Grid>
            <Grid style={{ paddingLeft: 5 }} item xs={11}>
              <input
                style={{
                  padding: '5px',
                  width: '100%',
                  borderWidth: '0.5px',
                  borderRadius: '4px',
                  height: '25px',
                  borderStyle: 'solid',
                  borderColor: 'lightgray'
                }}></input>
            </Grid>
          </Grid>
          <div style={{ minHeight: 300, marginTop: 10 }}>
            <Editor
              // editorState={editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              // onEditorStateChange={this.onEditorStateChange}
            />
          </div>
          <Divider></Divider>
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
                onClick={opendPreviewForm}>
                Preview
              </Button>
            </Grid>
            <Grid>
              <Button
                style={{
                  width: 120,
                  color: 'white',
                  marginLeft: 10,
                  backgroundColor: '#bd1874',
                  borderRadius: 20
                }}
                onClick={() => {
                  alert('clicked');
                }}>
                SEND
              </Button>
            </Grid>
          </Grid>
        </>
        {opendPreview ? (
          <Form
            title={'Send Inquiry'}
            open={opendPreview}
            toggleForm={(status) => {
              closePreviewForm();
            }}
            openFab={false}
            hiddenActions={true}>
            <>
              <Box style={{ position: 'absolute', 
              zIndex: 1, 
              top: 50, 
              left: 0, 
              right: 0 }} sx={{}}>
                <Tabs
                  indicatorColor="secondary"
                  style={{ margin: 0, backgroundColor:'#102536' }}
                  value={value}
                  onChange={handleChange}>
                  <Tab style={{color: 'white'}} label="Customer" />
                  <Tab style={{color: 'white'}} label="Onshore" />
                </Tabs>
              </Box>
              <InquirySaved user="guestspace" />
            </>
          </Form>
        ) : null}
      </Form>
    </React.Fragment>
  );
};

export default SendInquiryForm;
