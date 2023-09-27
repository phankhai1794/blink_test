import React, { useState } from 'react';
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { cyan } from '@material-ui/core/colors';
import Popover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import { useSelector } from 'react-redux';

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
    fontSize: 13,
    display: 'flex'
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
        { label: 'to:', value: emails.to },
        {
          label: 'cc:',
          value: emails.cc
        },
        { label: 'bcc:', value: emails.bcc }
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
  const { name, time, avatar, state, status, emails: _emails, userType } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(false);
  const currentTabs = useSelector(({ workspace }) => workspace.formReducer.tabs);

  const showMailInfo = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const emails = {
    to: currentTabs ? _emails['toOnshore'] : _emails['toCustomer'],
    cc: currentTabs ? _emails['toOnshoreCc'] : _emails['toCustomerCc'],
    bcc: currentTabs ? _emails['toOnshoreBcc'] : _emails['toCustomerBcc']
  };

  return (
    <div className="flex">
      <MailInfo anchorEl={anchorEl} setAnchorEl={setAnchorEl} emails={emails} />
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
              <span>{time}</span>
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
                {['INQ_SENT', 'REP_Q_SENT'].includes(state) && userType === 'Admin' && (
                  <>
                    <span style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {` | to ${emails['to'].join(', ')}`}
                    </span>
                    <IconButton style={{ padding: 1 }} onClick={showMailInfo}>
                      <Icon size="small">expand_more</Icon>
                    </IconButton>
                  </>
                )}
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
