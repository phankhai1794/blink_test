import React, { useState, useEffect } from 'react';
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
import { Link } from 'react-router-dom';
import * as userActions from 'app/auth/store/actions';

function UserProfile(props) {
  const { classes, history } = props;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(null);
  const user = useSelector(({ auth }) => auth.user);
  const handleClick = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogOut = () => {
    localStorage.clear();
    dispatch(userActions.removeUserData());
  };

  useEffect(() => {
    if (user.displayName == '' || user.displayName == null) {
      let userInfo = JSON.parse(localStorage.getItem('USER'));
      if (localStorage.getItem('AUTH_TOKEN') && userInfo) {
        let payload = {
          ...user,
          role: userInfo.role,
          displayName: userInfo.displayName,
          photoURL: userInfo.photoURL,
          permissions: userInfo.permissions
        };
        dispatch(userActions.setUserData(payload));
      } else {
        history.push('/login');
      }
    }
  }, [user]);

  return (
    <React.Fragment>
      <Button className="h-64 px-12" onClick={handleClick}>
        <Avatar src={user.photoURL} className={classes.fitAvatar} alt="user photo" />
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
        }}
      >
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