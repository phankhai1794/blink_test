import React, { useState } from 'react';
import {
  Button,
  Icon,
  ListItemIcon,
  ListItemText,
  Popover,
  MenuItem,
  Typography
} from '@material-ui/core';
import { Link } from 'react-router-dom';

function History(props) {
  const [history, setHistory] = useState(null);

  const historyClick = (event) => {
    setHistory(event.currentTarget);
  };

  const historyClose = () => {
    setHistory(null);
  };

  return (
    <React.Fragment>
      <Button className="h-64" onClick={historyClick}>
        <div className="hidden md:flex flex-col ml-12 items-start">
          <Typography component="span" className="normal-case font-600 flex">B/L Version History</Typography>
        </div>
        <Icon className="text-16 ml-12 hidden sm:flex" variant="action">
          keyboard_arrow_down
        </Icon>
      </Button>

      <Popover
        open={Boolean(history)}
        anchorEl={history}
        onClose={historyClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        classes={{
          paper: 'py-8'
        }}
      >
        <React.Fragment>
          <MenuItem component={Link} to="/login">
            <ListItemIcon className="min-w-40">
              <Icon>lock</Icon>
            </ListItemIcon>
            <ListItemText className="pl-0" primary="Login" />
          </MenuItem>
          <MenuItem component={Link} to="/register">
            <ListItemIcon className="min-w-40">
              <Icon>person_add</Icon>
            </ListItemIcon>
            <ListItemText className="pl-0" primary="Register" />
          </MenuItem>
        </React.Fragment>
      </Popover>
    </React.Fragment>
  );
}

export default History;
