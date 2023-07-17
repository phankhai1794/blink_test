import { FuseAnimate } from '@fuse';
import { createMuiTheme } from '@material-ui/core/styles';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { Box, Card, CardContent, Typography } from '@material-ui/core';
import * as Actions from 'app/store/actions';
import { login } from 'app/services/authService';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import JWTLoginTab from './tabs/JWTLoginTab';
import ForgotPasswordTab from './tabs/ForgotPasswordTab';

const mainColor = '#BD0F72';
const theme = createMuiTheme({
  typography: {
    fontFamily: 'Montserrat'
  }
});

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    background: 'url("assets/images/backgrounds/login.svg")',
    backgroundSize: 'cover',
    backgroundPosition: 'bottom',
    color: theme.palette.primary.contrastText
  },
  container: {
    position: 'absolute',
    top: 60,
    left: '50%',
    transform: 'translateX(-50%) !important'
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'center'
  },
  logo: {
    width: '106.25px',
    height: '50px'
  },
  card: {
    width: '480px',
    borderRadius: '8px',
    boxShadow: 'none',
    marginTop: 40
  },
  cardContent: {
    margin: '40px 55px',
    padding: '0 !important'
  },
  title: {
    color: mainColor,
    fontWeight: 600,
    fontSize: 20,
    marginBottom: 24,
    lineHeight: '24px'
  }
}));

function Login(props) {
  const { history, location } = props;
  const { cachePath, cacheSearch } = location;
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = useSelector(({ user }) => user);
  const [isLoginTabViewed, setIsLoginTabViewed] = useState(true);

  function handleLogin(model) {
    login(model)
      .then((res) => {
        if (res) {
          const { userData, token, message } = res;
          const { userType, role, userName, avatar, email, permissions, countries } = userData;
          const userInfo = {
            displayName: userName,
            photoURL: avatar,
            userType,
            role,
            email,
            permissions,
            countries: countries || []
          };
          const payload = { ...user, ...userInfo };

          localStorage.setItem('AUTH_TOKEN', token);
          localStorage.setItem('USER', JSON.stringify(userInfo));

          dispatch(Actions.setUser(payload));
          dispatch(Actions.checkAuthToken(true));
          dispatch(Actions.showMessage({ message: message, variant: 'success' }));

          let prevUrl = sessionStorage.getItem('prevUrl');
          if (prevUrl) {
            prevUrl = JSON.parse(prevUrl);
            prevUrl = `${prevUrl.cachePath + prevUrl.cacheSearch}`;
          } else prevUrl = "/";

          history.push(prevUrl);
        }
      })
      .catch((error) => {
        console.error(error);
        const { message } = error.response.data.error || error.message;
        dispatch(Actions.showMessage({ message, variant: 'error' }));
      });
  }

  useEffect(() => {
    // TODO: verify token by API
    // if (
    //   localStorage.getItem('AUTH_TOKEN') &&
    //   PermissionProvider({ action: PERMISSION.VIEW_ACCESS_DASHBOARD })
    // )
    //   history.push('/');
  }, []);

  return (
    <div
      className={clsx(classes.root, 'flex flex-col flex-1 flex-shrink-0 p-24 md:flex-row md:p-0')}>
      <ThemeProvider theme={theme}>
        <FuseAnimate animation={{ translateY: ['0%', '-100%'] }}>
          <Box className={classes.container}>
            <Box className={classes.wrapper}>
              <img
                className={classes.logo}
                src="assets/images/logos/one_logo.svg"
                alt="logo"
              />
            </Box>
            <Card className={classes.card}>
              <CardContent
                className={clsx(classes.cardContent, 'flex flex-col items-center justify-center')}>
                <Typography className={classes.title}>
                  {isLoginTabViewed ? 'LOGIN TO YOUR ACCOUNT' : 'FORGOT PASSWORD'}
                </Typography>
                {isLoginTabViewed ? (
                  <>
                    <JWTLoginTab onLogged={handleLogin} country={new URLSearchParams(cacheSearch).get('cntr')} />
                    {/* <div className="flex flex-col items-center justify-center pt-32">
                      <a
                        className="font-medium text-primary"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setIsLoginTabViewed(false)}>
                        Forgot passwords
                      </a>
                    </div> */}
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
          </Box>
        </FuseAnimate>
      </ThemeProvider>
    </div>
  );
}

export default Login;
