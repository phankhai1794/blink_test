import React, { useState } from 'react';
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

function UserProfile(props) {
  const { user, classes, history } = props;
  const [open, setOpen] = useState(null);

  const handleClick = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogOut = () => {
    localStorage.clear();
    history.push('/login');
  };

  return (
    <React.Fragment>
      <Button className="h-64 px-12" onClick={handleClick}>
        <Avatar src={user.photoURL} className={classes.fitAvatar} alt="user photo" />
        <Typography component="span" className="normal-case font-600 ml-8 flex">
          {window.location.pathname.includes('apps/workplace/customer')
            ? 'Customer'
            : user.displayName}
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
