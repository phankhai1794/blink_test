import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import history from '@history';
import { makeStyles } from '@material-ui/styles';
import * as AppActions from 'app/store/actions';
import { PERMISSION, PermissionProvider } from '@shared/permission';

import UserProfile from './UserProfile';

const useStyles = makeStyles((theme) => ({
  fitAvatar: {
    // zoom out to show full logo in avatar
    '& > img': {
      objectFit: 'contain'
    }
  },
}))

function User(props) {
  const { pathname, search } = window.location;
  const classes = useStyles();;
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
        if (bl) window.location.reload(); // history.push(`/guest?bl=${bl}`);
        else history.push('/login');
      }

      let userInfo = JSON.parse(localStorage.getItem('USER'));
      if (userInfo) {
        let payload = {
          ...user,
          userType: userInfo.userType,
          role: userInfo.role,
          displayName: userInfo.displayName,
          photoURL: userInfo.photoURL,
          email: userInfo.email,
          permissions: userInfo.permissions,
          countries: userInfo.countries || []
        };
        dispatch(AppActions.setUser(payload));
      }
    }
  }, [user.displayName, allowAccess]);

  return (
    <PermissionProvider
      action={PERMISSION.VIEW_SHOW_USER_MENU}
      extraCondition={!pathname.includes('/guest')}>
      <UserProfile classes={classes} />
    </PermissionProvider>
  );
}

export default User;