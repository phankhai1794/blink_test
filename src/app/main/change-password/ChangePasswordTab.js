import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import history from '@history';
import { isEmail } from 'validator';
import {
  makeStyles,
  Button,
  TextField,
  Typography,
  InputAdornment,
} from '@material-ui/core';
import Formsy from 'formsy-react';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';
import { decodeAuthParam } from 'app/services/authService';

const passwordLength = 4;
const mainColor = '#BD0F72';
const lightMainColor = '#FDF2F2';
const borderColor = '#8D9AA6';
const errColor = '#DC2626';
const iconColor = '#8D9AA6';
const colorWhite = '#ffffff';
const colorBlack = '#132535';

const useStyles = makeStyles((theme) => ({
  boldLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: mainColor
  },
  label: {
    fontWeight: 400,
    lineHeight: '17px'
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
    '& #email-helper-text, & #password-helper-text, & #newPassword-helper-text, & #confirmNewPassword-helper-text': {
      position: 'relative',
      fontSize: 14,
      color: errColor,
      paddingLeft: '15.84px'
    },
    '& #email-helper-text:before, & #password-helper-text:before, & #newPassword-helper-text:before, & #confirmNewPassword-helper-text:before': {
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
  icon: {
    color: iconColor,
    fontSize: 22,
    cursor: 'pointer'
  },
  button: {
    width: 150,
    height: 38,
    margin: '8px auto 0 auto',
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
  menuList: {
    maxHeight: 300,
    padding: 0
  },
  menuItem: {
    background: colorWhite,
    color: colorBlack,
    fontSize: 15,
    '&:hover': {
      background: `${lightMainColor} !important`,
      color: mainColor,
      fontWeight: 600
    }
  }
}));

function ChangePasswordTab({ onSubmit }) {
  const classes = useStyles();

  const [isFormValid, setIsFormValid] = useState(false);
  const [account, setAccount] = useState({
    email: { value: "" },
    password: { value: "", isValid: false, visible: false },
    newPassword: { value: "", isValid: false, visible: false },
    confirmNewPassword: { value: "", isValid: false, visible: false }
  });

  const handleChange = (e) => {
    let isValid = false;
    const { name, value } = e.target;
    if (
      (name == 'email' && isEmail(value.trim())) ||
      (name == 'password' && value.length >= passwordLength) ||
      (name == 'newPassword' && value.length >= passwordLength) ||
      (name == 'confirmNewPassword' && value.length >= passwordLength)
    )
      isValid = true;

    setAccount({
      ...account,
      [name]: { ...account[name], value, isValid }
    });
  };

  const handleVisible = (name) => {
    const { visible } = account[name];
    setAccount({
      ...account,
      [name]: { ...account[name], visible: !visible }
    });
  };

  function handleSubmit() {
    onSubmit({
      email: account.email.value,
      password: account.password.value,
      newPassword: account.newPassword.value
    });
  }

  useEffect(() => {
    const init = async () => {
      const auth = new URLSearchParams(window.location.search).get('auth');
      if (auth) { // verify auth param
        try {
          const res = await decodeAuthParam(auth);
          if (res) {
            setAccount({
              ...account,
              email: {
                ...account.email,
                value: res.email
              }
            });
            window.history.pushState({}, '', "/change-password"); // Remove token from url
          }
        } catch (error) {
          console.error(error);
          history.push('/pages/errors/error-404');
        }
      }
    }
    init();
  }, []);

  useEffect(
    () => {
      setIsFormValid(
        account.email.value.length &&
        account.password.isValid &&
        account.newPassword.isValid &&
        account.confirmNewPassword.isValid &&
        account.confirmNewPassword.value === account.newPassword.value
      )
    },
    [
      account.password.value,
      account.newPassword.value,
      account.confirmNewPassword.value
    ]
  );

  return (
    <div className="w-full">
      <Formsy onValidSubmit={handleSubmit} className="flex flex-col justify-center w-full">
        <Typography className={classes.boldLabel}>Email</Typography>
        <TextField
          id="email"
          name="email"
          value={account.email.value}
          disabled={true}
          variant="outlined"
          required
          className={classes.input}
          inputProps={{
            className: classes.inputProps
          }}
        />

        <Typography className={classes.boldLabel}>Current Password</Typography>
        <TextField
          id="password"
          name="password"
          type={account.password.visible ? 'text' : 'password'}
          placeholder="Enter current password"
          value={account.password.value}
          onChange={handleChange}
          variant="outlined"
          required
          className={clsx(
            classes.input,
            account.password.value.length && account.password.value.length < passwordLength
              ? classes.inputError
              : ''
          )}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" onClick={() => handleVisible('password')}>
                {account.password.visible ? (
                  <VisibilityOutlinedIcon className={classes.icon} />
                ) : (
                  <VisibilityOffOutlinedIcon className={classes.icon} />
                )}
              </InputAdornment>
            )
          }}
          inputProps={{
            className: classes.inputProps
          }}
          helperText={
            account.password.value.length && account.password.value.length < passwordLength
              ? `Minimum length: ${passwordLength}`
              : ''
          }
        />

        <Typography className={classes.boldLabel}>New Password</Typography>
        <TextField
          id="newPassword"
          name="newPassword"
          type={account.newPassword.visible ? 'text' : 'password'}
          placeholder="Enter new password"
          value={account.newPassword.value}
          onChange={handleChange}
          variant="outlined"
          required
          className={clsx(
            classes.input,
            account.newPassword.value.length && account.newPassword.value.length < passwordLength
              ? classes.inputError
              : ''
          )}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" onClick={() => handleVisible('newPassword')}>
                {account.newPassword.visible ? (
                  <VisibilityOutlinedIcon className={classes.icon} />
                ) : (
                  <VisibilityOffOutlinedIcon className={classes.icon} />
                )}
              </InputAdornment>
            )
          }}
          inputProps={{
            className: classes.inputProps
          }}
          helperText={
            account.newPassword.value.length && account.newPassword.value.length < passwordLength
              ? `Minimum length: ${passwordLength}`
              : ''
          }
        />

        <Typography className={classes.boldLabel}>Confirm New Password</Typography>
        <TextField
          id="confirmNewPassword"
          name="confirmNewPassword"
          type={account.confirmNewPassword.visible ? 'text' : 'password'}
          placeholder="Enter the confirmation password"
          value={account.confirmNewPassword.value}
          onChange={handleChange}
          variant="outlined"
          required
          className={clsx(
            classes.input,
            account.confirmNewPassword.value.length && account.confirmNewPassword.value.length < passwordLength && account.confirmNewPassword.value !== account.newPassword.value
              ? classes.inputError
              : ''
          )}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" onClick={() => handleVisible('confirmNewPassword')}>
                {account.confirmNewPassword.visible ? (
                  <VisibilityOutlinedIcon className={classes.icon} />
                ) : (
                  <VisibilityOffOutlinedIcon className={classes.icon} />
                )}
              </InputAdornment>
            )
          }}
          inputProps={{
            className: classes.inputProps
          }}
          helperText={
            Boolean(account.confirmNewPassword.value.length) &&
            (
              account.confirmNewPassword.value.length < passwordLength ?
                `Minimum length: ${passwordLength}` :
                (
                  account.confirmNewPassword.value !== account.newPassword.value ?
                    'The password confirmation does not match' :
                    ''
                )
            )
          }
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.button}
          aria-label="Login"
          disabled={!isFormValid}
          value="legacy">
          Change
        </Button>
      </Formsy>
    </div>
  );
}

export default ChangePasswordTab;