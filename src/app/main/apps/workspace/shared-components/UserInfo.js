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
  const { name, date, time } = props;
  const classes = useStyles();
  return (
    <div className="flex">
      <Avatar src={`../../assets/images/avatars/${name}.jpg`} />
      <div>
        <p className={classes.name}>{name}</p>
        <div className="flex" style={{ marginLeft: '1rem' }}>
          <p className={classes.normal}>{date}</p>
          <p className={classes.normal} style={{ marginLeft: '2px' }}>
            {time}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
