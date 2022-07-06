import React from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Button } from '@material-ui/core';
import { PERMISSION, PermissionProvider } from '@shared/permission';

import * as FormActions from '../store/actions/form';

const useStyles = makeStyles((theme) => ({
  content: {
    position: 'relative',
    left: 17,
    fontSize: 16,
    fontWeight: 600,
    fontFamily: 'Montserrat',
    lineHeight: '19.5px',
    '&:before': {
      position: 'absolute',
      top: 0,
      left: -31,
      width: 21,
      height: 21,
      content: '""',
      backgroundImage: 'url("assets/images/icons/plus.svg")',
      backgroundSize: 'cover'
    }
  }
}));

const BtnAddInquiry = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const onClick = (e) => {
    dispatch(FormActions.toggleCreateInquiry(true));
  };

  return (
    <PermissionProvider action={PERMISSION.INQUIRY_CREATE_INQUIRY}>
      <Button
        style={{
          position: 'fixed',
          bottom: 35,
          right: 35,
          width: 150,
          height: 40,
          color: '#FFFFFF',
          backgroundColor: '#BD0F72',
          borderRadius: 8,
          textTransform: 'none',
          padding: '2px 4px 2px 0px'
        }}
        variant="text"
        size="medium"
        onClick={onClick}>
        <span className={classes.content}>Add Inquiry</span>
      </Button>
    </PermissionProvider>
  );
};

export default BtnAddInquiry;
