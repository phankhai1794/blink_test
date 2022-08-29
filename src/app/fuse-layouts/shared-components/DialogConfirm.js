import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import CloseOutlined from '@material-ui/icons/CloseOutlined';
import { useSelector } from 'react-redux';
import { draftConfirm } from '@shared';

import { useDispatch } from 'react-redux';
import * as Actions from 'app/store/actions';

function DialogConfirm(props) {
  const { handleClose, open } = props;
  const myBL = useSelector(({ draftBL }) => draftBL.myBL);
  const [checkUpdate, setCheckUpdate] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    myBL.state === draftConfirm && setCheckUpdate(true)
  }, [myBL.state])

  return (
    <Dialog onClose={handleClose} onClick={handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth="md" style={{ fontSize: '16px', fontFamily: 'Montserrat' }}>
      <DialogContent style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <DialogContent id="alert-dialog-title" className='text-center font-bold'>
            <p style={{ color: '#bd1874' }}>Do you want to confirm the draft?</p>
        </DialogContent>
          <DialogActions>
            <Button
              style={{
                  color: 'white',
                  backgroundColor: '#BD0F72',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'Montserrat',
                  width: '120px',
                  height: '40px',
              }}
              variant="contained"
              onClick={()=> dispatch(Actions.openDialog({  
                  children: (
                    <React.Fragment>
                      <DialogContent 
                          style={{
                              display: 'flex',
                              alignItems: 'center',
                              flexDirection: 'column',
                              fontSize: '16px',
                              fontFamily: 'Montserrat',
                              width: '406px',
                              height: '180px',
                              left: '517px',
                              top:'336px',
                              borderRadius: '8px', 
                            }}
                      >
                        <img src="assets/images/icons/confirmed-icon.svg" /> 
                        <DialogContent id="alert-dialog-title_completed" className='text-center font-bol' style={{ overflow: "hidden" }}>
                          <p style={{ color: '#BD0F72' }}>Your B/L is confirmed!</p>
                          <p style = {{ fontSize: '15px', fontWeight: '500'}}> Thank you!</p>
                        </DialogContent>
                        <DialogActions style = {{ alignItems: 'center'}}>
                          <Button 
                            onClick={()=> dispatch(Actions.closeDialog())}
                            style={{
                                width: '120px',
                                height: '40px',
                                color: '#FFFFFF',
                                backgroundColor: '#BD0F72',
                                border: '1px solid #BD0F72',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontFamily: 'Montserrat',
                                textTransform: 'capitalize',
                              }}
                          >
                            Close
                          </Button>
                        </DialogActions>
                      </DialogContent>
                    </React.Fragment>
                        )
              }))}
              className='normal-case'>
              <span>Yes</span>
            </Button>
            <Button
              style={{
                  width: '120px',
                  height: '40px',
                  color: '#BD0F72',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #BD0F72',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontFamily: 'Montserrat' 
              }}
              variant="contained"
              onClick={handleClose}
              className='normal-case'>
              <span>No</span>
            </Button>
          </DialogActions>
        </DialogContent>
  </Dialog >
  );
}

export default DialogConfirm;
