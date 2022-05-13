import React, { useState } from 'react';
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
import * as AppActions from 'app/store/actions';

function UserProfile(props) {
  const { classes } = props;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(null);
  const user = useSelector(({ user }) => user);
  const handleClick = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogOut = () => {
    localStorage.clear();
    window.location.logout = true;
    dispatch(AppActions.removeUser());
    dispatch(AppActions.checkAllow(false));
  };

  return (
    <React.Fragment>
      <Button className="h-64" onClick={handleClick}>
        <Avatar
          className={classes.fitAvatar}
          style={{ background: cyan[400] }}
          src={user.photoURL ? user.photoURL : ''}
          alt="User photo">
          {!user.photoURL ? user.displayName.charAt(0).toUpperCase() : ''}
        </Avatar>
        <Typography component="span" className="normal-case font-600 ml-8 flex">
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
        <React.Fragment>
          <MenuItem component={Link} to="#" onClick={() => handleLogOut()}>
            <ListItemIcon className="min-w-40">
              <Icon>exit_to_app</Icon>
            </ListItemIcon>
            <ListItemText className="pl-0" primary="Sign Out" />
          </MenuItem>
        </React.Fragment>
      </Popover>
    </React.Fragment>
  );
}

export default UserProfile;
