import React, { useContext, useState } from 'react';
import history from '@history';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Icon,
  ListItemIcon,
  ListItemText,
  Popover,
  MenuItem,
  Typography,
  Avatar
} from '@material-ui/core';
import { cyan } from '@material-ui/core/colors';
import { Link } from 'react-router-dom';
import { clearLocalStorage } from '@shared';
import * as AppActions from 'app/store/actions';
import { SocketContext } from 'app/AppContext';
import { encodeAuthParam } from 'app/services/authService';
import { BROADCAST } from '@shared/keyword';
import { handleError } from '@shared/handleError';

function UserProfile(props) {
  const { classes } = props;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(null);
  const user = useSelector(({ user }) => user);
  const socket = useContext(SocketContext);
  const channel = new BroadcastChannel(BROADCAST.ACCESS);

  const handleClick = ({ currentTarget }) => setOpen(currentTarget);

  const handleClose = () => setOpen(null);

  const handleChangePassword = async () => {
    const { auth } = await encodeAuthParam().catch(err => handleError(dispatch, err));
    history.push(`/change-password?auth=${auth}`);
  };

  const handleLogOut = () => {
    clearLocalStorage();
    channel.postMessage({ role: user.role, type: "logout" });
    // socket.emit('user_logout');
    dispatch(AppActions.removeUser());
    dispatch(AppActions.checkAllow(false));
  };

  return (
    <>
      <Button className="h-64" onClick={handleClick} style={{ marginLeft: 2 }}>
        <Avatar
          className={classes.fitAvatar}
          style={{ background: cyan[400], height: 25, width: 25 }}
          src={user.photoURL ? user.photoURL : ''}
          alt="User photo">
          {!user.photoURL ? user.displayName.charAt(0).toUpperCase() : ''}
        </Avatar>
        <Typography
          component="span"
          className="normal-case font-600 ml-8 flex"
          style={{
            fontFamily: 'Montserrat',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: 12,
            color: '#515E6A',
          }}
        >
          {user.displayName}
        </Typography>
        <Icon className="text-16 ml-4 hidden sm:flex" variant="action">
          keyboard_arrow_down
        </Icon>
      </Button>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        classes={{
          paper: 'py-8'
        }}>
        <MenuItem component={Link} onClick={() => handleChangePassword()}>
          <ListItemIcon className="min-w-40">
            <Icon>vpn_key</Icon>
          </ListItemIcon>
          <ListItemText className="pl-0" primary="Change Password" />
        </MenuItem>

        <MenuItem component={Link} onClick={() => handleLogOut()}>
          <ListItemIcon className="min-w-40">
            <Icon>exit_to_app</Icon>
          </ListItemIcon>
          <ListItemText className="pl-0" primary="Sign Out" />
        </MenuItem>
      </Popover>
    </>
  );
}

export default UserProfile;
