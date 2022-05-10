import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, TextField, Typography } from '@material-ui/core';
import { darken } from '@material-ui/core/styles/colorManipulator';
import { makeStyles } from '@material-ui/styles';
import { FuseAnimate } from '@fuse';
import { useForm } from '@fuse/hooks';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import jwt from 'jwt-decode'
import axios from '@shared/axios';
import { displayToast } from '@shared';
const useStyles = makeStyles((theme) => ({
  root: {
    background:
      'radial-gradient(' +
      darken(theme.palette.primary.dark, 0.5) +
      ' 0%, ' +
      theme.palette.primary.dark +
      ' 80%)',
    color: theme.palette.primary.contrastText
  }
}));

function ResetPasswordPage(props) {
  const classes = useStyles();
  const [sessionToken, setSessionToken] = useState('');


  const { form, handleChange, setInForm } = useForm({
    username: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });


  useEffect(() => {

    try {
      const accessToken = new URLSearchParams(props.location.search).get('access_token');
      const payload = jwt(accessToken)
      if (payload.exp < Date.now() / 1000) throw new Error('Token expired')

      setInForm('email', payload.email);
      setInForm('username', payload.username)

      setSessionToken(accessToken);

    } catch (error) {
      props.history.push('/auth/session-expired');
    }

  }, {})

  function isFormValid() {
    return (
      form.email.length > 0 &&
      form.password.length > 3 &&
      form.password === form.passwordConfirm
    );
  }

  function handleSubmit(ev) {
    const { username, password } = form;
    axios({ Authorization: `Bearer ${sessionToken}` })
      .put('/authentication/update-password', { username, password })
      .then(data => {
        displayToast('success', 'Password updated successfully')
      })
      .catch(err => {
        displayToast('error', 'Something went wrong, please try later!')
      })
      .finally(() => {
        props.history.push('/login');
      })


    ev.preventDefault();
  }

  return (
    <div
      className={clsx(
        classes.root,
        'flex flex-col flex-auto flex-shrink-0 items-center justify-center p-32'
      )}
    >
      <div className="flex flex-col items-center justify-center w-full">
        <FuseAnimate animation="transition.expandIn">
          <Card className="w-full max-w-384">
            <CardContent className="flex flex-col items-center justify-center p-32">
              <img className="w-128 m-32" src="assets/images/logos/fuse.svg" alt="logo" />

              <Typography variant="h6" className="mt-16 mb-32">
                RESET YOUR PASSWORD
              </Typography>

              <form
                name="resetForm"
                noValidate
                className="flex flex-col justify-center w-full"
                onSubmit={handleSubmit}
              >
                <TextField
                  className="mb-16"
                  label="Email"
                  autoFocus
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  variant="outlined"
                  required
                  fullWidth
                  disabled={true}
                />

                <TextField
                  className="mb-16"
                  label="Password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  variant="outlined"
                  required
                  fullWidth
                />

                <TextField
                  className="mb-16"
                  label="Password (Confirm)"
                  type="password"
                  name="passwordConfirm"
                  value={form.passwordConfirm}
                  onChange={handleChange}
                  variant="outlined"
                  required
                  fullWidth
                />

                <Button
                  variant="contained"
                  color="primary"
                  className="w-224 mx-auto mt-16"
                  aria-label="Reset"
                  disabled={!isFormValid()}
                  type="submit"
                >
                  RESET MY PASSWORD
                </Button>
              </form>

              <div className="flex flex-col items-center justify-center pt-32 pb-24">
                <Link className="font-medium" to="/login">
                  Go back to login
                </Link>
              </div>
            </CardContent>
          </Card>
        </FuseAnimate>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
