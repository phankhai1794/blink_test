import { FuseAnimate } from '@fuse';
import { createMuiTheme } from '@material-ui/core/styles';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { Box, Card, CardContent, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import history from '@history';
import { useDispatch } from 'react-redux';
import { putUserPassword } from 'app/services/authService';
import * as Actions from 'app/store/actions';

import ChangePasswordTab from './ChangePasswordTab';

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

function ChangePassword() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleSubmit = async (data) => {
    try {
      const res = await putUserPassword(data);
      if (res?.status === 200) {
        dispatch(Actions.showMessage({ message: "Changed password successfully", variant: 'success' }));
        history.push("/");
      }
    } catch (err) {
      console.error(err);
      // const { message } = err.response.data || err.response.data.error || err.message || err || "Something went wrong";
      dispatch(Actions.showMessage({ message: "Incorrect current password", variant: 'error' }));
    }
  }

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
                <Typography className={classes.title}>CHANGE PASSWORD</Typography>
                <ChangePasswordTab onSubmit={handleSubmit} />
              </CardContent>
            </Card>
          </Box>
        </FuseAnimate>
      </ThemeProvider>
    </div>
  );
}

export default ChangePassword;
