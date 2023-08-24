import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Tooltip, Button } from '@material-ui/core';
import FormatListBulleted from '@material-ui/icons/FormatListBulleted';

import useShowQueueListCallback from './useShowQueueListCallback';

const useStyles = makeStyles((theme) => ({
  btn: {
    textTransform: 'none',
    color: '#FFFF',
    backgroundColor: '#BD0F73',
    margin: '0px 8px',
    borderRadius: '8px',
    fontFamily: 'Montserrat',
    '&:hover': {
      backgroundColor: '#BD0F73'
    }
  },
  startIconBtn: {
    position: 'relative',
    width: 15,
    height: 15,
    display: 'inline-block',
    top: 3
  }
}));

const BtnQueueList = () => {
  const classes = useStyles();
  const myBL = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);
  const { showQueueList } = useShowQueueListCallback();

  return (
    <>
      {myBL?.state && (
        <>
          {/* <PermissionProvider
            action={PERMISSION.INQUIRY_SUBMIT_INQUIRY_ANSWER}
            extraCondition={pathname.includes('/guest') && (userType === 'CUSTOMER' || userType === 'ONSHORE')}
          > */}
          <Tooltip title="Open BL Status">
            <Button
              variant="contained"
              className={classes.btn}
              onClick={() => showQueueList()}
              style={{
                minHeight: 30,
                marginRight: 0,
                fontSize: 12,
                minWidth: 30,
                whiteSpace: 'nowrap',
                width: 90,
                height: 30
              }}>
              <div style={{ textAlign: 'center' }}>
                <FormatListBulleted className={classes.startIconBtn} />
                <span style={{ display: 'inline-block' }}>BL Status</span>
              </div>
            </Button>
          </Tooltip>
          {/* </PermissionProvider> */}
        </>
      )}
    </>
  );
};

export default BtnQueueList;
