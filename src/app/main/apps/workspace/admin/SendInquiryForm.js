import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../admin/store/actions';
import Form from '../shared-components/Form';
import { TextField, Box, Button, Grid, Icon, Dialog, Typography } from '@material-ui/core';
import TagsInput from './components/TagsInput';
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
      <Button onClick={openSendInquiryDialog}>
        <div>
          <Typography component="span" className="normal-case font-600 flex">
            {/* custom header for customer workplace only */}
            Send Inquired
          </Typography>
        </div>
      </Button>

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
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <label>To Customer</label>
              <TagsInput />
              {/* <TextField
                style={{ borderColor: '#000000', height: 40, marginTop: 5 }}
                id="full-width-text-field"
                placeholder="Customer email"
                variant="outlined"
                fullWidth // this may override your custom width
              /> */}
            </Grid>
            <Grid item xs={6}>
              <label>To Onshore</label>
              <TagsInput />
              {/* <TextField
                style={{ borderColor: '#000000', height: 40, marginTop: 5 }}
                id="full-width-text-field"
                placeholder="Onshore email"
                variant="outlined"
                fullWidth // this may override your custom width
              /> */}
            </Grid>
          </Grid>
          <Grid style={{ paddingTop: 10 }} container spacing={2}>
            <Grid item xs={6}>
              <label>From</label>
              <TagsInput />
              {/* <TextField
                style={{ borderColor: '#000000', height: 40, marginTop: 5 }}
                id="full-width-text-field"
                placeholder="From email"
                variant="outlined"
                fullWidth // this may override your custom width
              /> */}
            </Grid>
            <Grid item xs={6}></Grid>
          </Grid>

          <Grid style={{ paddingTop: 10 }} container spacing={2}>
            <Grid item xs={12}>
              <label>Subject</label>
              <TextField
                style={{ borderColor: '#000000', height: 40, marginTop: 5 }}
                id="full-width-text-field"
                placeholder=""
                variant="outlined"
                fullWidth // this may override your custom width
              />
            </Grid>
          </Grid>
          <Grid style={{ paddingTop: 10 }} container spacing={2}>
            <Grid item xs={12}>
              <label>Message</label>
              <TextField
                style={{ textAlign: 'left' }}
                style={{ borderColor: '#000000', marginTop: 5 }}
                id="full-width-text-field"
                multiline
                rows={4}
                placeholder=""
                variant="outlined"
                fullWidth // t
              />
            </Grid>
          </Grid>

          <Grid
            container
            style={{ 'justify-content': 'center', paddingTop: 20, paddingBottom: 20 }}>
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
        </>
      </Form>
    </React.Fragment>
  );
};

export default SendInquiryForm;
