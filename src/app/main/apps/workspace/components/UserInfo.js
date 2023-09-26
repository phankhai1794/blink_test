import React, { useState } from 'react';
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { cyan } from '@material-ui/core/colors';
import Popover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';

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
  },
  mailPaper: {
    minWidth: 300,
    padding: 5
  }
}));

const MailInfo = (props) => {
  const { anchorEl, setAnchorEl, emails } = props;

  const classes = useStyles();

  const closeEmailList = () => {
    setAnchorEl(null);
  };
  return (
    <Popover
      classes={{ paper: classes.mailPaper }}
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
      <div style={{ display: 'flex', margin: '10px 16px', gap: '20px' }}>
        <span style={{ width: 30 }}>from:</span>
        <span>Offshore</span>
      </div>
      {[
        { label: 'to:', value: ['minhntvuo@gmail.com'] || emails.to },
        {
          label: 'cc:',
          value: ['abc@gmail.com', 'abc1@@gmail.com', 'abc2@gmail.com'] || emails.cc
        },
        { label: 'bcc:', value: [] || emails.bcc }
      ].map(({ label, value }, index) => (
        <>
          {value.length ? (
            <div style={{ display: 'flex', margin: '10px 16px', gap: '20px' }}>
              <span style={{ width: 30 }}>{label}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {value.map((v) => (
                  <span>{v}</span>
                ))}
              </div>
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
  const [anchorEl, setAnchorEl] = useState(false);
  const showMailInfo = (event) => {
    setAnchorEl(event.currentTarget);
  };
  return (
    <div className="flex">
      <MailInfo anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
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
              <>
                {['INQ_SENT', 'REP_Q_SENT'].includes(state) && ` | to ${emails}`}
                <IconButton style={{ padding: 1 }} onClick={showMailInfo}>
                  <Icon size="small">expand_more</Icon>
                </IconButton>
              </>
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
