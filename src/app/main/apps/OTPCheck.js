import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Box, Card, CardContent, Typography, TextField, Button } from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import Formsy from 'formsy-react';
import { useDispatch } from 'react-redux';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import OtpInput from 'react-otp-input';
import { isEmail } from 'validator';
import { verifyEmail, verifyGuest, isVerified } from 'app/services/authService';
import * as Actions from 'app/store/actions';

const otpLength = 6;
const mainColor = '#BD0F72';
const borderColor = '#8D9AA6';
const errColor = '#DC2626';
const colorWhite = '#ffffff';
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
    borderRadius: '8px',
    boxShadow: 'none',
    marginTop: 40
  },
  cardContent: {
    marginTop: 40,
    marginLeft: 55,
    marginRight: 55,
    padding: '0 !important'
  },
  title: {
    color: mainColor,
    fontWeight: 600,
    fontSize: 20,
    marginBottom: 24,
    lineHeight: '24px'
  },
  boldLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: mainColor
  },
  input: {
    marginTop: 11,
    marginBottom: 16,
    '& fieldset': {
      border: `1px solid ${borderColor} !important`,
      borderRadius: '8px'
    },
    '&:hover fieldset': {
      borderColor: `${mainColor} !important`
    },
    '&:focus-within fieldset': {
      border: `1px solid ${mainColor} !important`
    },
    '& #email-helper-text, & #password-helper-text': {
      position: 'relative',
      fontSize: 14,
      color: errColor,
      paddingLeft: '15.84px'
    },
    '& #email-helper-text:before, & #password-helper-text:before': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '13.67px',
      height: '13.67px',
      content: '""',
      backgroundImage: 'url("assets/images/icons/error.svg")',
      backgroundSize: 'cover'
    }
  },
  inputError: {
    '& fieldset': {
      border: `1px solid ${errColor} !important`
    },
    '&:hover fieldset': {
      borderColor: `${errColor} !important`
    },
    '&:focus-within fieldset': {
      border: `1px solid ${errColor} !important`
    }
  },
  inputProps: {
    fontSize: 14,
    height: 40,
    padding: '0 16px',
    lineHeight: '40px',
    '& ~ svg': {
      fontSize: 24,
      paddingRight: 10
    }
  },
  helperTextOTP: {
    display: 'flex',
    alignItems: 'center',
    color: '#DC2626',
    paddingTop: 4
  },
  btnLogin: {
    width: 150,
    height: 38,
    margin: '8px auto 16px auto',
    padding: 0,
    textTransform: 'none',
    color: colorWhite,
    fontWeight: 600,
    fontSize: 14,
    background: mainColor,
    borderRadius: 8,
    '&:hover': {
      background: mainColor
    }
  },
  btnBack: {
    width: 18,
    margin: '0 auto',
    cursor: 'pointer'
  }
}));

const OtpCheck = ({ children }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [myBL, setMyBL] = useState({ id: '' });
  const [mail, setMail] = useState({ value: '', isValid: false });
  const [otpCode, setOtpCode] = useState({ value: '', isValid: false, firstTimeInput: true });
  const [step, setStep] = useState(0);

  const handleChangeMail = (e) => {
    setMail({
      ...mail,
      value: e.target.value,
      isValid: isEmail(e.target.value)
    });
  };

  const handleCheckMail = () => {
    verifyEmail({ email: mail.value, bl: myBL.id })
      .then((res) => {
        if (res) setStep(1);
      })
      .catch((error) => {
        console.error(error);
        const { message } = error.response.data.error || error.message;
        dispatch(Actions.showMessage({ message, variant: 'error' }));
      });
  };

  const handleChangeCode = (code) =>
    setOtpCode({ ...otpCode, value: code, isValid: Boolean(/^\d+$/.test(code)) });

  const handleSendCode = () => {
    verifyGuest({ email: mail.value, bl: myBL.id, otpCode: otpCode.value })
      .then((res) => {
        if (res) {
          const { role, userName, avatar, email, permissions } = res.userData;
          let userInfo = {
            displayName: userName,
            photoURL: avatar,
            role,
            email,
            permissions
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
  };

  useEffect(() => {
    const { search } = window.location;
    const bl = new URLSearchParams(search).get('bl');
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
            if (error.response?.data?.error.status === 403) {
              const { message } = error.response.data.error || error.message;
              dispatch(Actions.showMessage({ message, variant: 'error' }));
            }
          });
      }
    }
  }, []);

  useEffect(() => {
    if (otpCode.value.length === otpLength && otpCode.firstTimeInput) {
      handleSendCode();
      setOtpCode({ ...otpCode, firstTimeInput: false });
    }
  }, [otpCode.value]);

  return (
    <>
      {step === 2 ? <>{children}</> : (
        <div
          className={clsx(
            classes.root,
            'flex flex-col flex-1 flex-shrink-0 p-24 md:flex-row md:p-0'
          )}>
          <ThemeProvider theme={theme}>
            <FuseAnimate animation={{ translateY: ['0%', '-100%'] }}>
              <Box className={classes.container}>
                <Box className={classes.wrapper}>
                  <img className={classes.logo} src="assets/images/logos/one_logo.svg" alt="logo" />
                </Box>
                <Card className={classes.card} style={step == 0 ? { width: 480 } : { width: 550 }}>
                  <CardContent
                    className={clsx(
                      classes.cardContent,
                      'flex flex-col items-center justify-center'
                    )}
                    style={step == 0 ? { marginBottom: 24 } : { marginBottom: 26 }}>
                    {step === 0 ? (
                      <Formsy
                        onValidSubmit={handleCheckMail}
                        className="flex flex-col justify-center w-full">
                        <Typography className={classes.boldLabel}>Your Email</Typography>
                        <TextField
                          id="email"
                          name="email"
                          placeholder="Enter your email"
                          value={mail.value}
                          onChange={handleChangeMail}
                          variant="outlined"
                          required
                          className={clsx(
                            classes.input,
                            mail.value.length && !mail.isValid ? classes.inputError : ''
                          )}
                          inputProps={{
                            className: classes.inputProps
                          }}
                          helperText={mail.value.length && !mail.isValid ? 'Invalid email' : ''}
                        />
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          className={classes.btnLogin}
                          aria-label="Login"
                          disabled={!mail.isValid}
                          value="legacy">
                          Next
                        </Button>
                      </Formsy>
                    ) : (
                      <Formsy
                        onValidSubmit={handleSendCode}
                        className="flex flex-col justify-center w-full">
                        <Typography className={classes.boldLabel}>Access Code</Typography>
                        <Box style={{ marginTop: 11, marginBottom: 24 }}>
                          <OtpInput
                            value={otpCode.value}
                            onChange={handleChangeCode}
                            numInputs={otpLength}
                            isInputNum={true}
                            shouldAutoFocus={true}
                            hasErrored={otpCode.value.length && !otpCode.isValid}
                            errorStyle={{ border: '1px solid #DC2626' }}
                            inputStyle={{
                              width: 38,
                              height: 38,
                              fontSize: '2rem',
                              borderRadius: 4,
                              padding: 0,
                              margin: 0,
                              border: '1px solid #8D9AA6'
                            }}
                            separator={<span style={{ width: 40 }}></span>}
                          />
                          {Boolean(otpCode.value.length) && !otpCode.isValid && (
                            <span className={classes.helperTextOTP}>
                              <img
                                style={{ width: 13.67, marginRight: 4.17 }}
                                src="/assets/images/icons/error.svg"
                              />
                              Invalid access code provided
                            </span>
                          )}
                        </Box>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          className={classes.btnLogin}
                          aria-label="Send"
                          disabled={
                            otpCode.value.length != otpLength ||
                            (otpCode.value.length == otpLength && !otpCode.isValid)
                          }
                          value="legacy">
                          Send
                        </Button>
                        <img
                          className={classes.btnBack}
                          src="/assets/images/icons/left-arrow.svg"
                          onClick={() => setStep(0)}
                        />
                      </Formsy>
                    )}
                  </CardContent>
                </Card>
              </Box>
            </FuseAnimate>
          </ThemeProvider>
        </div>
      )}
    </>
  );
};

export default OtpCheck;
