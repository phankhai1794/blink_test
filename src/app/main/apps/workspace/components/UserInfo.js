import React from 'react';
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { cyan } from '@material-ui/core/colors';

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
  time: {
    marginTop: '0px',
    whiteSpace: 'pre'
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
      {avatar ?
        <Avatar src={avatar} /> :
        <Avatar
          style={{ background: cyan[400] }}
          src={''}
          alt="User photo">
          {name?.charAt(0).toUpperCase()}
        </Avatar>
      }
      {time ?
        <div>
          <p className={classes.name}>{name}</p>
          <div className="flex" style={{ marginLeft: '1rem' }}>
            <p className={classes.time}>
              {time}
            </p>
          </div>
        </div> :
        <div className='flex' style={{ alignItems: 'center' }}>
          <p className={classes.name}>{name}</p>
        </div>
      }
    </div>
  );
};

export default UserInfo;
