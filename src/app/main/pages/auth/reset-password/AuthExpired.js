import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import { darken } from '@material-ui/core/styles/colorManipulator';
import { makeStyles } from '@material-ui/styles';
import { FuseAnimate } from '@fuse';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

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

function ResetPasswordPage() {
  const classes = useStyles();

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
                YOUR SESSION EXPIRED
              </Typography>

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
