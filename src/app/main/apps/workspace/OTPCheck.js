import { verifyEmail, verifyGuest, isVerified } from 'app/services/authService';
import { FusePageSimple } from '@fuse';
import * as Actions from 'app/store/actions';
import React, { useEffect, useState, useRef } from 'react';
import OtpInput from 'react-otp-input';
import { useDispatch } from 'react-redux';
import { isEmail } from 'validator';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, InputBase, IconButton, Divider } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import BLWorkspace from './components/BLWorkspace';

const otpLength = 4;

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 5
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  divider: {
    height: 28,
    margin: 4
  },
  helpText: {
    color: 'red',
    fontSize: 12,
    paddingLeft: 10
  }
}));

const OtpCheck = ({ status }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  const [mail, setMail] = useState({ value: '', isValid: false });
  const [myBL, setMyBL] = useState({ id: '' });
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState(0);

  const handleChangeMail = (e) => {
    setMail({
      ...mail,
      value: e.target.value,
      isValid: isEmail(e.target.value)
    });
  };

  const handleCheckMail = (e) => {
    if (e.key === 'Enter') e.preventDefault();
    if (myBL.id && mail.isValid && (e.key === 'Enter' || e.key === undefined)) {
      verifyEmail({ bl: myBL.id, email: mail.value })
        .then((res) => {
          if (res) setStep(1);
        })
        .catch((error) => {
          console.error(error);
          const { message } = error.response.data.error || error.message;
          dispatch(Actions.showMessage({ message, variant: 'error' }));
        });
    }
  };

  const handleChangeCode = (code) => {
    setOtpCode(code);
  };

  useEffect(() => {
    const bl = new URLSearchParams(window.location.search).get('bl');
    if (bl) setMyBL({ ...myBL, id: bl });

    let userInfo = localStorage.getItem('USER');
    if (userInfo && localStorage.getItem('AUTH_TOKEN')) {
      const { email } = JSON.parse(userInfo);
      if (email) {
        setMail({
          ...mail,
          value: email,
          isValid: isEmail(email)
        });

        isVerified({ email, bl })
          .then(() => setStep(2))
          .catch((error) => {
            console.error(error);
          });
      }
    }
  }, []);

  useEffect(() => {
    if (otpCode.length === otpLength) {
      verifyGuest({ email: mail.value, bl: myBL.id, otpCode })
        .then((res) => {
          if (res) {
            const { role, userName, avatar, email, permissions } = res.userData;
            let userInfo = {
              displayName: userName,
              photoURL: avatar,
              role,
              email,
              permissions,
            };

            localStorage.setItem('AUTH_TOKEN', res.token);
            localStorage.setItem('USER', JSON.stringify(userInfo));
            // Auto save user data to redux store at ToolbarLayout1.js

            dispatch(Actions.hideMessage());
            setStep(2);
          }
        })
        .catch((error) => {
          console.error(error);
          const { message } = error.response.data.error || error.message;
          dispatch(Actions.showMessage({ message, variant: 'error' }));
        });
    }
  }, [otpCode]);

  return (
    <>
      {step === 2 ? (
        <div className="flex flex-col flex-1 w-full">
          <FusePageSimple
            classes={{
              contentWrapper: 'p-0 h-full',
              content: 'flex flex-col h-full',
              leftSidebar: 'w-256 border-0'
            }}
            content={<BLWorkspace myBL={myBL} user="guest" />}
            sidebarInner
            ref={pageLayout}
            innerScroll
          />
        </div>
      ) : (
        <div>
          <div style={{ margin: '12rem auto 4rem auto', textAlign: 'center' }}>
            <img src="../assets/images/logos/one_ocean_network-logo.png" alt="company logo" />
          </div>
          {step === 0 ? (
            <>
              <div style={{ margin: '2rem auto 4rem auto', width: 500 }}>
                <Paper component="form" className={classes.root}>
                  <InputBase
                    autoFocus
                    className={classes.input}
                    placeholder="Your email"
                    value={mail.value}
                    onChange={(e) => handleChangeMail(e)}
                    onKeyPress={(e) => handleCheckMail(e)}
                  />
                  <Divider className={classes.divider} orientation="vertical" />
                  <IconButton
                    color="primary"
                    className={classes.iconButton}
                    disabled={!mail.isValid}
                    onClick={(e) => handleCheckMail(e)}>
                    <ArrowForwardIcon />
                  </IconButton>
                </Paper>
                {!mail.isValid && mail.value.length > 0 ? (
                  <span className={classes.helpText}>Invalid mail !</span>
                ) : (
                  <></>
                )}
              </div>
            </>
          ) : (
            <>
              <div style={{ margin: '8rem auto', display: 'flex' }}>
                <OtpInput
                  value={otpCode}
                  onChange={handleChangeCode}
                  numInputs={otpLength}
                  shouldAutoFocus={true}
                  inputStyle={{
                    fontSize: '4rem',
                    margin: 'auto 5rem',
                    padding: '2rem',
                    borderRadius: 4,
                    border: '1px solid rgba(0,0,0,0.3)'
                  }}
                  containerStyle={{
                    margin: 'auto'
                  }}
                />
              </div>
              <div style={{ margin: '2rem auto', textAlign: 'center' }}>
                <IconButton
                  color="primary"
                  className={classes.iconButton}
                  onClick={() => setStep(0)}>
                  <ArrowBackIcon />
                </IconButton>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default OtpCheck;
