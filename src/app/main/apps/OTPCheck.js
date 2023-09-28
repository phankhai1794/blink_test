import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import _ from 'lodash';
import { Box, Card, CardContent, Typography, TextField, Button } from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import Formsy from 'formsy-react';
import { useDispatch } from 'react-redux';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import OtpInput from 'react-otp-input';
import { isEmail } from 'validator';
import {
  verifyEmail,
  verifyGuest,
  isVerified,
  decodeAuthParam,
  requestCode
} from 'app/services/authService';
import * as Actions from 'app/store/actions';
import history from '@history';
import { PERMISSION, getLocalUser } from '@shared/permission';

const otpLength = 6;
const timeCodeMailDelay = 15; // second
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
  btnSubmit: {
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
  },
  resendText: {
    fontSize: 15,
    fontWeight: 500
  },
  enableResend: {
    color: `${mainColor} !important`,
    textDecoration: 'underline !important',
    cursor: 'pointer'
  },
  disableResend: {
    color: `${mainColor} !important`,
    textDecoration: 'none !important'
  }
}));

const OTP = ({ classes, handleChange }) => {
  const [code, setCode] = useState('');

  return (
    <>
      <Box style={{ marginTop: 11, marginBottom: 24 }}>
        <OtpInput
          value={code}
          onChange={(e) => {
            setCode(e);
            handleChange(e);
          }}
          numInputs={otpLength}
          isInputNum={true}
          shouldAutoFocus={true}
          // hasErrored={otpCode.value.length && !otpCode.isValid}
          // errorStyle={{ border: '1px solid #DC2626' }}
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
        {/* {Boolean(otpCode.value.length) && !otpCode.isValid && (
          <span className={classes.helperTextOTP}>
            <img
              style={{ width: 13.67, marginRight: 4.17 }}
              src="/assets/images/icons/error.svg"
            />
            Invalid access code provided
          </span>
        )} */}
      </Box>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        className={classes.btnSubmit}
        aria-label="Send"
        disabled={code.length !== otpLength}
        value="legacy">
        Send
      </Button>
    </>
  );
};

const OtpCheck = ({ children }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const processUrl = window.location.pathname.includes('draft') ? 'draft' : 'pending';

  const permissions = sessionStorage.getItem('permissions');
  const permissionsConfirmDrfBL = Boolean(
    (JSON.parse(permissions) || []).find(
      (p) => `${p.controller}_${p.action}` === PERMISSION.DRAFTBL_CONFIRM_DRAFT_BL && p.enable
    )
  );
  const [canConfirmDraftBL, setCanConfirmDraftBL] = useState(permissionsConfirmDrfBL);

  const [myBL, setMyBL] = useState({ id: '' });
  const [mail, setMail] = useState({ value: '', isValid: false, isSubmitted: false });
  const [otpCode, setOtpCode] = useState({ value: '', firstTimeInput: true, resendAfter: 0 });
  const [step, setStep] = useState(0);
  const [auth, setAuth] = useState();

  const catchError = (error) => {
    console.error(error);
    const { message } = error.response.data.error || error.message;

    if (message.includes('not ready yet'))
      dispatch(Actions.showMessage({ message, variant: 'warning' }));
    else if (!['forbidden', 'invalid token'].includes(message?.toLowerCase()))
      dispatch(Actions.showMessage({ message, variant: 'error' }));
  };

  const handleChangeMail = ({ target }) => {
    const { value } = target;
    setMail({
      ...mail,
      value,
      isValid: isEmail(value?.trim() || '')
    });
  };

  const validateTimeSendCode = ({ bl, requestAt }) => {
    let isValidTime = true;
    const blId = new URLSearchParams(window.location.search).get('bl');
    const secondsLeft = Math.abs(new Date() - new Date(requestAt)) / 1000;
    if (blId === bl && secondsLeft < timeCodeMailDelay) isValidTime = false;
    return [isValidTime, secondsLeft];
  };

  const handleCheckMail = () => {
    const email = mail.value?.trim() || '';
    setOtpCode({ ...otpCode, resendAfter: timeCodeMailDelay });
    setMail({ ...mail, value: email, isSubmitted: true });

    verifyEmail({ email, bl: myBL.id, processUrl, auth })
      .then((res) => {
        if (res) {
          localStorage.setItem(
            'sentCode',
            JSON.stringify({
              bl: myBL.id,
              mail: email,
              requestAt: new Date()
            })
          );
          localStorage.setItem('lastEmail', email);
          setStep(1);
        }
      })
      .catch((error) => {
        catchError(error);
        setMail({ ...mail, isSubmitted: false });
      });
  };

  const handleRequestCode = () => {
    if (otpCode.resendAfter <= 0) {
      requestCode({ email: mail.value, bl: myBL.id })
        .then(({ message }) => {
          localStorage.setItem(
            'sentCode',
            JSON.stringify({
              bl: myBL.id,
              mail: mail.value,
              requestAt: new Date()
            })
          );
          setOtpCode({ ...otpCode, resendAfter: timeCodeMailDelay });
          dispatch(Actions.showMessage({ message, variant: 'success' }));
        })
        .catch((error) => {
          catchError(error);
        });
    }
  };

  const handleChangeCode = (code) => setOtpCode({ ...otpCode, value: code });

  const handleSuccess = (res) => {
    const { userType, role, userName, avatar, email, permissions } = res.userData;
    let userInfo = {
      displayName: userName,
      photoURL: avatar,
      role,
      email
    };

    if (res.token) localStorage.setItem('GUEST_TOKEN', res.token);
    localStorage.setItem('GUEST', JSON.stringify(userInfo));

    sessionStorage.setItem('userType', userType);
    sessionStorage.setItem('permissions', JSON.stringify(permissions));

    dispatch(Actions.setUser({ ...userInfo, permissions, userType }));
    dispatch(Actions.hideMessage());

    const { pathname, search } = window.location;
    if (res.draft && pathname.includes('guest')) {
      history.push(`/draft-bl${search}`);
    } else setStep(2);
  };

  const handleSendCode = () => {
    verifyGuest({ email: mail.value, bl: myBL.id, otpCode: otpCode.value, processUrl, auth })
      .then((res) => {
        if (res) handleSuccess(res);
      })
      .catch((error) => {
        catchError(error);
      });
  };

  useEffect(() => {
    const init = async () => {
      const { search } = window.location;
      const bl = new URLSearchParams(search).get('bl');
      if (bl) setMyBL({ ...myBL, id: bl });

      // verify token on url
      const authParam = new URLSearchParams(search).get('auth');
      if (bl && authParam) {
        // verify token on url
        try {
          setAuth(authParam);
          const decode = await decodeAuthParam(authParam);
          if (decode) {
            setMail({
              ...mail,
              value: decode.email,
              isValid: isEmail(decode.email)
            });
          }
        } catch (error) {
          catchError(error);
        }
      }

      // verify token in localStorage
      let userInfo = getLocalUser();
      if (userInfo && localStorage.getItem('GUEST_TOKEN')) {
        try {
          const res = await isVerified({ bl, processUrl, auth: authParam });
          if (res) handleSuccess(res);
        } catch (error) {
          // catchError(error);
          setCanConfirmDraftBL(false);
          dispatch(
            Actions.setDefaultSettings(_.set({}, 'layout.config.toolbar.display', false))
          );

          // check request code delay time
          let sentCode = localStorage.getItem('sentCode');
          if (sentCode) {
            sentCode = JSON.parse(sentCode);
            if (sentCode.bl === bl) {
              const [__, secondsLeft] = validateTimeSendCode(sentCode);
              if (secondsLeft <= timeCodeMailDelay) {
                setOtpCode({
                  ...otpCode,
                  resendAfter: timeCodeMailDelay - parseInt(secondsLeft)
                });
                setMail({ ...mail, value: sentCode.mail, isValid: isEmail(sentCode.mail) });
                setStep(1);
              } else setStep(0);
            }
          } else setStep(0);
        }
      }

      // refill email when code expires
      // let lastEmail = localStorage.getItem('lastEmail');
      // if (lastEmail && !['null', 'undefined'].includes(lastEmail))
      //   setMail({ ...mail, value: lastEmail, isValid: isEmail(lastEmail) });
    };

    init();
  }, []);

  useEffect(() => {
    if (otpCode.value.length === otpLength && otpCode.firstTimeInput) {
      handleSendCode();
      setOtpCode({ ...otpCode, firstTimeInput: false });
    }
  }, [otpCode.value]);

  useEffect(() => {
    // countdown timer resend access code
    const timer = () => setOtpCode({ ...otpCode, resendAfter: otpCode.resendAfter - 1 });
    if (otpCode.resendAfter <= 0) return;

    const countdown = setInterval(timer, 1000);
    return () => clearInterval(countdown);
  }, [otpCode.resendAfter]);

  return (
    <>
      {step === 2 || (history.location.state?.skipVerification && canConfirmDraftBL) ? (
        <>{children}</>
      ) : (
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
                        <Typography className={classes.boldLabel}>
                          Please enter your email address for verification
                        </Typography>
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
                          className={classes.btnSubmit}
                          aria-label="Login"
                          disabled={!mail.isValid || mail.isSubmitted}
                          value="legacy">
                          Next
                        </Button>
                      </Formsy>
                    ) : (
                      <Formsy
                        onValidSubmit={handleSendCode}
                        className="flex flex-col justify-center w-full">
                        <Typography className={classes.boldLabel}>Enter your code</Typography>
                        <Typography className={classes.resendText}>
                          {`We just emailed ${mail.value} with a 6-digit code. If you don't see it, please check your spam folder or `}
                          <a
                            className={
                              otpCode.resendAfter > 0 ? classes.disableResend : classes.enableResend
                            }
                            onClick={() => handleRequestCode()}>
                            resend code{otpCode.resendAfter > 0 && `(${otpCode.resendAfter})`}
                          </a>
                          {'.'}
                        </Typography>

                        <OTP classes={classes} handleChange={handleChangeCode} />

                        <img
                          className={classes.btnBack}
                          src="/assets/images/icons/left-arrow.svg"
                          onClick={() => {
                            setMail({ ...mail, isSubmitted: false });
                            setOtpCode({ value: '', firstTimeInput: true });
                            setStep(0);
                          }}
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
