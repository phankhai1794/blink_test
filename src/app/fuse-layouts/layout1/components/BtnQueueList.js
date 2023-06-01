import React from 'react';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Tooltip, Button } from '@material-ui/core';
import FormatListBulleted from '@material-ui/icons/FormatListBulleted';
import * as InquiryActions from 'app/main/apps/workspace/store/actions/inquiry';

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
    padding: '0px 10px 0px 0px'
  }
}));


const BtnQueueList = () => {
  const { pathname } = window.location;
  const classes = useStyles();
  const dispatch = useDispatch();
  const myBL = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);
  const userType = useSelector(({ user }) => user.userType);

  const showQueueList = () => {
    userType === 'ADMIN' ?
      window.open('/apps/admin') :
      dispatch(InquiryActions.openQueueList(true));
  }

  return (
    <>
      {myBL?.state &&
        <>
          {/* <PermissionProvider
            action={PERMISSION.INQUIRY_SUBMIT_INQUIRY_ANSWER}
            extraCondition={pathname.includes('/guest') && (userType === 'CUSTOMER' || userType === 'ONSHORE')}
          > */}
          <Tooltip title='Open BL Status'>
            <Button
              variant='contained'
              className={classes.btn}
              onClick={() => showQueueList()}
              style={{ minHeight: 40, marginRight: 0 }}
            >
              <FormatListBulleted className={classes.startIconBtn} />
              BL Status
            </Button>
          </Tooltip>
          {/* </PermissionProvider> */}
        </>
      }
    </>
  );
};

export default BtnQueueList;
