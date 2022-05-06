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

import * as FormActions from 'app/main/apps/workspace/admin/store/actions/form';
import { useSelector, useDispatch } from 'react-redux';


function History(props) {
  const dispatch = useDispatch();
  const [history, setHistory] = useState(null);

  const historyClick = (event) => {
    setHistory(event.currentTarget);
    dispatch(FormActions.openTrans());
  };

  const historyClose = () => {
    setHistory(null);
    dispatch(FormActions.openTrans());
  };

  return (
    <React.Fragment>
      <Button className="h-64 px-12 ml-12" onClick={historyClick}>
        <div className="hidden md:flex flex-col items-start">
          <Typography component="span" className="normal-case font-600 flex">B/L Version History</Typography>
        </div>
        <Icon className="text-16 ml-4 hidden sm:flex" variant="action">
          keyboard_arrow_down
        </Icon>
      </Button>

      {/* <Popover
        open={Boolean(history)}
        anchorEl={history}
        onClose={historyClose}
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
          <MenuItem component={Link} to="#">
            <ListItemIcon className="min-w-40">
              <Icon>label</Icon>
            </ListItemIcon>
            <ListItemText className="pl-0" primary="Menu Item" />
          </MenuItem>
          <MenuItem component={Link} to="#">
            <ListItemIcon className="min-w-40">
              <Icon>label</Icon>
            </ListItemIcon>
            <ListItemText className="pl-0" primary="Menu Item" />
          </MenuItem>
        </React.Fragment>
      </Popover> */}
    </React.Fragment>
  );
}

export default History;
