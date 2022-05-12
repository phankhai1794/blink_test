import { FuseAnimate } from '@fuse';
import { Card, CardContent, Tab, Tabs, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import * as AppAction from 'app/store/actions';
import { login } from 'app/services/authService';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ForgotPasswordTab from './tabs/ForgotPasswordTab';
import JWTLoginTab from './tabs/JWTLoginTab';

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
  const [selectedTab, setSelectedTab] = useState(0);
  const [isLoginTabViewed, setIsLoginTabViewed] = useState(true);

  function handleTabChange(event, value) {
    setSelectedTab(value);
  }

  function handleLogin(model) {
    const { username, password } = model;
    login({ username, password })
      .then((res) => {
        if (res) {
          const { userData, token, message } = res;
          const { role, userName, avatar, permissions } = userData;
          const userInfo = {
            displayName: userName,
            photoURL: avatar,
            role,
            permissions
          };
          const payload = { ...user, ...userInfo };

          localStorage.setItem('AUTH_TOKEN', token);
          localStorage.setItem('USER', JSON.stringify(userInfo));

          dispatch(AppAction.setUser(payload));
          dispatch(AppAction.showMessage({message: message, variant: 'success'}));

          const { cachePath, cacheSearch } = location;
          history.push(cachePath ? `${cachePath + cacheSearch}` : '/');
        }
      })
      .catch((error) => {
        console.log('Error: ', error);
        const { message } = error.response.data.error;
        dispatch(AppAction.showMessage({message: message, variant: 'error'}));
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
      className={clsx(classes.root, 'flex flex-col flex-1 flex-shrink-0 p-24 md:flex-row md:p-0')}
    >
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
      {
        isLoginTabViewed ? (
          <FuseAnimate animation={{ translateX: [0, '100%'] }}>
            <Card className="w-full max-w-400 mx-auto m-16 md:m-0" square>
              <CardContent className="flex flex-col items-center justify-center p-32 md:p-48 md:pt-60 ">
                <Typography variant="h6" className="text-center md:w-full mb-24">
                  LOGIN TO YOUR ACCOUNT
                </Typography>

                <Tabs
                  value={selectedTab}
                  onChange={handleTabChange}
                  variant="fullWidth"
                  className="mb-32"
                >
                  <Tab
                    icon={
                      <img
                        className="h-40 p-4 rounded-12"
                        src="assets/images/logos/one_ocean_network-logo.png"
                        alt="logo"
                      />
                    }
                    className="min-w-0"
                  />
                </Tabs>

                {selectedTab === 0 && <JWTLoginTab onLogged={handleLogin} />}

                <div className="flex flex-col items-center justify-center pt-32">
                  <a className="font-medium text-primary" onClick={() => setIsLoginTabViewed(false)} >
                    Forgot passwords
                  </a>
                  <span className="font-medium">Don't have an account?</span>
                  <Link className="font-medium" to="/register">
                    Create an account
                  </Link>
                  <Link className="font-medium mt-8" to="/">
                    Back to Dashboard
                  </Link>
                </div>
              </CardContent>
            </Card>
          </FuseAnimate>
        ) : (
          <FuseAnimate animation={{ translateX: [0, '100%'] }}>
            <Card className="w-full max-w-400 mx-auto m-16 md:m-0" square>
              <CardContent className="flex flex-col items-center justify-center p-32 md:p-48 md:pt-60 ">
                <Typography variant="h6" className="text-center md:w-full mb-24">
                  Forgot password
                </Typography>

                <Tabs
                  value={selectedTab}
                  onChange={handleTabChange}
                  variant="fullWidth"
                  className="mb-32"
                >
                  <Tab
                    icon={
                      <img
                        className="h-40 p-4 rounded-12"
                        src="assets/images/logos/one_ocean_network-logo.png"
                        alt="logo"
                      />
                    }
                    className="min-w-0"
                  />
                </Tabs>

                {selectedTab === 0 && <ForgotPasswordTab onLogged={handleLogin} loginTabView={setIsLoginTabViewed} />}

                <div className="flex flex-col items-center justify-center pt-32">
                  <span className="font-medium">Don't have an account?</span>
                  <Link className="font-medium" to="/register">
                    Create an account
                  </Link>
                  <a className="font-medium text-primary" onClick={() => setIsLoginTabViewed(true)} >
                    Back to login
                  </a>
                </div>
              </CardContent>
            </Card>
          </FuseAnimate>
        )
      }
    </div>
  );
}

export default Login;
