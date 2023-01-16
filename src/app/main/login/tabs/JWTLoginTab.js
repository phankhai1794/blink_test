import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { isEmail } from 'validator';
import {
  makeStyles,
  Button,
  TextField,
  Typography,
  Box,
  InputAdornment,
  MenuItem
} from '@material-ui/core';
import Formsy from 'formsy-react';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';
import { COUNTRIES } from '@shared';

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
  icon: {
    color: iconColor,
    fontSize: 22,
    cursor: 'pointer'
  },
  btnLogin: {
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
  },
  menuItemSelected: {
    background: `${lightMainColor} !important`,
    color: mainColor,
    fontSize: 15,
    fontWeight: 600
  }
}));

function JWTLoginTab({ onLogged, country }) {
  const defaultCountry = country && COUNTRIES.filter(c => c.value === country).length ? country : COUNTRIES[0].value;

  const classes = useStyles();
  const [isFormValid, setIsFormValid] = useState(false);
  const [account, setAccount] = useState({
    email: { value: '', isValid: false },
    password: { value: '', isValid: false, visible: false },
    country: { value: defaultCountry, selected: true }
  });

  const handleChange = (e) => {
    let isValid = false;
    const { name, value } = e.target;
    if (
      (name == 'email' && isEmail(value.trim())) ||
      (name == 'password' && value.length >= passwordLength)
    )
      isValid = true;

    setAccount({
      ...account,
      [name]: { ...account[name], value, isValid }
    });
  };

  const handleVisible = () => {
    const { visible } = account.password;
    setAccount({
      ...account,
      password: { ...account.password, visible: !visible }
    });
  };

  const handleSelect = (e) => {
    const { name, value } = e.target;
    localStorage.setItem('country', value);
    setAccount({
      ...account,
      [name]: { ...account[name], value }
    });
  };

  function handleSubmit() {
    onLogged({
      email: account.email.value.trim(),
      password: account.password.value,
      country: account.country.value
    });
  }

  useEffect(() => {
    setIsFormValid(account.email.isValid && account.password.isValid);
  }, [account.email.isValid, account.password.isValid]);

  useEffect(() => {
    if (!localStorage.getItem('country')) {
      localStorage.setItem('country', defaultCountry);
    }
  }, []);

  return (
    <div className="w-full">
      <Formsy onValidSubmit={handleSubmit} className="flex flex-col justify-center w-full">
        <Typography className={classes.boldLabel}>Email</Typography>
        <TextField
          id="email"
          name="email"
          placeholder="Enter your email"
          value={account.email.value}
          onChange={handleChange}
          variant="outlined"
          required
          className={clsx(
            classes.input,
            account.email.value.length && !account.email.isValid ? classes.inputError : ''
          )}
          inputProps={{
            className: classes.inputProps
          }}
          helperText={account.email.value.length && !account.email.isValid ? 'Invalid email' : ''}
        />

        <Box className="flex justify-between">
          <Typography className={classes.boldLabel}>Password</Typography>
          {/* <Typography className={clsx(classes.boldLabel, classes.label)}>
            Forgot Password?
          </Typography> */}
        </Box>
        <TextField
          id="password"
          name="password"
          type={account.password.visible ? 'text' : 'password'}
          placeholder="Enter your password"
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
              <InputAdornment position="end" onClick={handleVisible}>
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

        <Typography className={classes.boldLabel}>Country</Typography>
        <TextField
          id="country"
          name="country"
          select
          value={account.country.value}
          onChange={handleSelect}
          variant="outlined"
          required
          className={classes.input}
          inputProps={{
            className: classes.inputProps
          }}
          SelectProps={{
            MenuProps: {
              classes: { list: classes.menuList },
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left'
              },
              // transformOrigin: {
              //   vertical: "top",
              //   horizontal: "left"
              // },
              getContentAnchorEl: null
            }
          }}>
          {COUNTRIES.map((country) => (
            <MenuItem
              key={country.value}
              value={country.value}
              className={
                country.value === account.country.value
                  ? classes.menuItemSelected
                  : classes.menuItem
              }>
              {country.name}
            </MenuItem>
          ))}
        </TextField>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={classes.btnLogin}
          aria-label="Login"
          disabled={!isFormValid}
          value="legacy">
          Log In
        </Button>
      </Formsy>
    </div>
  );
}

export default JWTLoginTab;
