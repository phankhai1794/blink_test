import React from 'react';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Tooltip, Button } from '@material-ui/core';
import FormatListBulleted from '@material-ui/icons/FormatListBulleted';
import * as InquiryActions from 'app/main/apps/workspace/store/actions/inquiry';
import { setLocalStorageItem } from 'app/main/apps/dashboards/admin/components';

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
    display: 'inline-flex'
  }
}));


const BtnQueueList = () => {
  const { pathname, search } = window.location;
  const classes = useStyles();
  const dispatch = useDispatch();
  const myBL = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);
  const userType = useSelector(({ user }) => user.userType);

  const showQueueList = () => {
    const country = new URLSearchParams(search).get('cntr');
    const param = country ? `?cntr=${country}` : "";
    userType === 'ADMIN' ?
      window.open(`/apps/admin${param}`) :
      dispatch(InquiryActions.openQueueList(true));
    localStorage.setItem('fcountry', JSON.stringify([country]));
    localStorage.removeItem('foffice');
    setLocalStorageItem('from', null);
    setLocalStorageItem('to', null);
    setLocalStorageItem('bookingNo', null);
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
              style={{ minHeight: 30, marginRight: 0, fontSize: 12, minWidth: 30, whiteSpace: 'nowrap', width: 90, height: 30 }}
            >
              <FormatListBulleted className={classes.startIconBtn} />
              <span>BL Status</span>
            </Button>
          </Tooltip>
          {/* </PermissionProvider> */}
        </>
      }
    </>
  );
};

export default BtnQueueList;
