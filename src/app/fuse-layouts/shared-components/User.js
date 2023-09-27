import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import history from '@history';
import { makeStyles } from '@material-ui/styles';
import * as AppActions from 'app/store/actions';
import { PERMISSION, PermissionProvider, getLocalUser } from '@shared/permission';

import UserProfile from './UserProfile';

const useStyles = makeStyles((theme) => ({
  fitAvatar: {
    // zoom out to show full logo in avatar
    '& > img': {
      objectFit: 'contain'
    }
  }
}));

function User(props) {
  const { search } = window.location;
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(({ user }) => user);
  const [allowAccess, validToken] = useSelector(({ header }) => [
    header.allowAccess,
    header.validToken
  ]);

  useEffect(() => {
    if (!user.displayName || !validToken) {
      if (!allowAccess) {
        const bl = new URLSearchParams(search).get('bl');
        if (bl) window.location.reload();
        else history.push('/login');
      }

      let userInfo = JSON.parse(getLocalUser());
      if (userInfo) {
        let payload = {
          ...user,
          role: userInfo.role,
          displayName: userInfo.displayName,
          photoURL: userInfo.photoURL,
          email: userInfo.email,
          countries: userInfo.countries || [],
          office: userInfo.office || []
        };
        dispatch(AppActions.setUser(payload));
      }
    }
  }, [user.displayName, allowAccess]);

  return (
    <PermissionProvider action={PERMISSION.VIEW_SHOW_USER_MENU}>
      <UserProfile classes={classes} />
    </PermissionProvider>
  );
}

export default User;
