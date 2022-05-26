import React from 'react';
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: '0px',
    marginLeft: '1rem',
    fontSize: '20px',
    marginTop: '0rem',
    color: theme.palette.primary.main
  },
  name: {
    marginBottom: '0px',
    marginLeft: '1rem',
    marginTop: '0px'
  },
  normal: {
    marginTop: '0px'
  },
  message: {
    marginLeft: '1rem',
    marginTop: '0rem'
  }
}));

const UserInfo = (props) => {
  const { name, time, avatar } = props;
  const classes = useStyles();
  return (
    <div className="flex">
      <Avatar src={avatar} />
      <div>
        <p className={classes.name}>{name}</p>
        <div className="flex" style={{ marginLeft: '1rem' }}>
          <p className={classes.normal}>
            {time}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
