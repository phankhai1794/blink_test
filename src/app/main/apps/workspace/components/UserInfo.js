import React, { useState } from 'react';
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { cyan } from '@material-ui/core/colors';
import Popover from '@material-ui/core/Popover';

const useStyles = makeStyles((theme) => ({
  name: {
    marginBottom: '0px',
    marginLeft: '1rem',
    marginTop: '0px',
    fontSize: '18px',
    color: '#515F6B',
    fontWeight: 600
  },
  time: {
    marginTop: '0px',
    whiteSpace: 'pre',
    color: '#666',
    fontSize: 13
  },
  message: {
    marginLeft: '1rem',
    marginTop: '0rem'
  },
  styleMark: {
    color: 'gray'
  }
}));

const MailInfo = ({ emails }) => {
  const [anchorEl, setAnchorEl] = useState(false);

  const closeEmailList = () => {
    setAnchorEl(null);
  };
  return (
    <Popover
      // classes={{ paper: classes.mailList }}
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={closeEmailList}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}>
      <div>
        <span>from</span>
      </div>
      {[
        { label: 'To', value: emails.to },
        { label: 'Cc', value: emails.cc },
        { label: 'Bcc', value: emails.bcc }
      ].map(({ label, value }, index) => (
        <>
          {value.length ? (
            <div>
              <span>{label}</span>
            </div>
          ) : null}
        </>
      ))}
    </Popover>
  );
};

const UserInfo = (props) => {
  const { name, time, avatar, state, status, emails } = props;
  const classes = useStyles();

  return (
    <div className="flex">
      {avatar ? (
        <Avatar src={avatar} />
      ) : (
        <Avatar style={{ background: cyan[400] }} src={''} alt="User photo">
          {name?.charAt(0).toUpperCase()}
        </Avatar>
      )}
      {time ? (
        <div>
          <p className={classes.name}>{name}</p>
          <div className="flex" style={{ marginLeft: '1rem' }}>
            <p className={classes.time}>
              {time}
              {![
                'REOPEN_A',
                'REOPEN_Q',
                'COMPL',
                'RESOLVED',
                'UPLOADED',
                'REP_DRF_DELETED',
                'REP_SENT_DELETED'
              ].includes(state) &&
                status === 'UPDATE' && <span className={classes.styleMark}> - Edited</span>}
              {(['REP_DRF_DELETED', 'REP_SENT_DELETED'].includes(state) ||
                status === 'DELETED') && <span className={classes.styleMark}> - Deleted</span>}
              {['INQ_SENT'].includes(state) && `| to ${emails}`}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex" style={{ alignItems: 'center' }}>
          <p className={classes.name}>{name}</p>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
