import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../admin/store/actions';
import Form from '../shared-components/Form';
import { TextField, Box, Button, Grid, Icon, Dialog, Typography, Divider } from '@material-ui/core';
import TagsInput from './components/TagsInput';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const SendInquiryForm = (props) => {
  const [questions, title] = useSelector((state) => [
    state.workspace.question,
    state.workspace.currentField
  ]);
  const dispatch = useDispatch();
  const [opened, setopened] = useState(null);

  const openSendInquiryDialog = (event) => {
    setopened(true);
  };

  const closeSendInquiry = () => {
    setopened(null);
  };

  const selectedTags = (tags) => {
    console.log(tags);
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
              <label style={{ color: '#89949B', fontSize: 13 }}>To Customer </label>
            </Grid>
            <Grid style={{ paddingLeft: 2 }} item xs={11}>
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
              <label style={{ color: '#89949B', fontSize: 13 }}>To Onshore </label>
            </Grid>
            <Grid style={{ paddingLeft: 2 }} item xs={11}>
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
              <label style={{ color: '#89949B', fontSize: 13 }}>From </label>
            </Grid>
            <Grid style={{ paddingLeft: 2 }} item xs={11}>
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
              <label style={{ color: '#89949B', fontSize: 13 }}>Subject</label>
            </Grid>
            <Grid style={{ paddingLeft: 2 }} item xs={11}>
              <TextField
                style={{ borderColor: 'lightgray', height: 37 }}
                id="full-width-text-field"
                placeholder=""
                variant="outlined"
                fullWidth // this may override your custom width
              />
            </Grid>
          </Grid>
          <div style={{ minHeight: 300 }}>
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
                onClick={() => {
                  alert('clicked');
                }}>
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
          ,
        </>
      </Form>
    </React.Fragment>
  );
};

export default SendInquiryForm;
