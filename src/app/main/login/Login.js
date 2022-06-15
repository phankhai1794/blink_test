import { FuseAnimate } from '@fuse';
import { Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import * as Actions from 'app/store/actions';
import { login } from 'app/services/authService';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import JWTLoginTab from './tabs/JWTLoginTab';
import ForgotPasswordTab from './tabs/ForgotPasswordTab';

const useStyles = makeStyles((theme) => ({
  root: {
    background: 'url("assets/images/backgrounds/slider-sea.jpg")',
    backgroundSize: 'cover',
    color: theme.palette.primary.contrastText
  }
}));

function Login(props) {
  const { history, location } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = useSelector(({ user }) => user);
  const [isLoginTabViewed, setIsLoginTabViewed] = useState(true);

  function handleLogin(model) {
    login(model)
      .then((res) => {
        if (res) {
          const { userData, token, message } = res;
          const { role, userName, avatar, email, permissions } = userData;
          const userInfo = {
            displayName: userName,
            photoURL: avatar,
            role,
            email,
            permissions
          };
          const payload = { ...user, ...userInfo };

          localStorage.setItem('AUTH_TOKEN', token);
          localStorage.setItem('USER', JSON.stringify(userInfo));

          dispatch(Actions.setUser(payload));
          dispatch(Actions.showMessage({ message: message, variant: 'success' }));

          const { cachePath, cacheSearch } = location;
          history.push(cachePath ? `${cachePath + cacheSearch}` : '/');
        }
      })
      .catch((error) => {
        console.error(error);
        const { message } = error.response.data.error || error.message;
        dispatch(Actions.showMessage({ message, variant: 'error' }));
      });
  }

  useEffect(() => {
    if (
      localStorage.getItem('AUTH_TOKEN') &&
      PermissionProvider({ action: PERMISSION.VIEW_ACCESS_DASHBOARD })
    )
      history.push('/');
  }, []);

  return (
    <div
      className={clsx(classes.root, 'flex flex-col flex-1 flex-shrink-0 p-24 md:flex-row md:p-0')}>
      <div className="flex flex-col flex-grow-0 items-center text-white p-16 text-center md:p-128 md:items-start md:flex-shrink-0 md:flex-1 md:text-left">
        <FuseAnimate animation="transition.slideUpIn" delay={300}>
          <Typography variant="h3" color="inherit" className="font-light">
            Welcome to SI Portal!
          </Typography>
        </FuseAnimate>

        <FuseAnimate delay={400}>
          <Typography variant="subtitle1" color="inherit" className="max-w-512 mt-16">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ullamcorper nisl erat,
            vel convallis elit fermentum pellentesque. Sed mollis velit facilisis facilisis.
          </Typography>
        </FuseAnimate>
      </div>
      <FuseAnimate animation={{ translateX: [0, '100%'] }}>
        <Card className="w-full max-w-400 mx-auto m-16 md:m-0" square>
          <CardContent className="flex flex-col items-center justify-center p-32 md:p-48 md:pt-60 ">
            <Typography variant="h6" className="text-center md:w-full mb-24">
              {isLoginTabViewed ? 'LOGIN TO YOUR ACCOUNT' : 'FORGOT PASSWORD'}
            </Typography>
            <img
              className="h-40 p-4 mb-32"
              src="assets/images/logos/one_ocean_network-logo.png"
              alt="logo"
            />
            {isLoginTabViewed ? (
              <>
                <JWTLoginTab onLogged={handleLogin} />
                <div className="flex flex-col items-center justify-center pt-32">
                  <a
                    className="font-medium text-primary"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setIsLoginTabViewed(false)}>
                    Forgot passwords
                  </a>
                </div>
              </>
            ) : (
              <>
                <ForgotPasswordTab loginTabView={setIsLoginTabViewed} />
                <div className="flex flex-col items-center justify-center pt-32">
                  <a
                    className="font-medium text-primary"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setIsLoginTabViewed(true)}>
                    Back to login
                  </a>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </FuseAnimate>
    </div>
  );
}

export default Login;
