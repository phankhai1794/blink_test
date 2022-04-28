import React from 'react';
import { AppBar, Avatar, Typography } from '@material-ui/core';
import { cyan } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/styles';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    '&.user': {
      '& .username, & .email': {
        transition: theme.transitions.create('opacity', {
          duration: theme.transitions.duration.shortest,
          easing: theme.transitions.easing.easeInOut
        })
      }
    }
  },
  avatar: {
    width: 80,
    height: 80,
    position: 'absolute',
    top: 72,
    fontSize: 50,
    background: cyan[500],
    boxSizing: 'content-box',
    left: '50%',
    transform: 'translateX(-50%)',
    transition: theme.transitions.create('all', {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut
    }),
    '& > img': {
      borderRadius: '50%',
      objectFit: 'contain' // zoom out to show full logo
    }
  }
}));

function UserNavbarHeader(props) {
  const user = useSelector(({ user }) => user);

  const classes = useStyles();

  return (
    <AppBar
      position="static"
      color="primary"
      elevation={0}
      classes={{ root: classes.root }}
      className="user relative flex flex-col items-center justify-center pt-24 pb-64 mb-32 z-0"
    >
      <Typography className="username text-16 whitespace-no-wrap" color="inherit">
        {user.displayName}
      </Typography>
      <Avatar className={classes.avatar} src={user.photoURL ? user.photoURL : ''} alt="User photo">
        {!user.photoURL ? user.displayName.charAt(0).toUpperCase() : ''}
      </Avatar>
    </AppBar>
  );
}

export default UserNavbarHeader;
