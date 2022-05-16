import * as FormActions from 'app/main/apps/workspace/store/actions/form';

import React, { useState } from 'react';
import {
  Button,
  Icon,
  Typography
} from '@material-ui/core';
import { useDispatch } from 'react-redux';

function History(props) {
  const dispatch = useDispatch();
  const [history, setHistory] = useState(null);

  const historyClick = (event) => {
    setHistory(event.currentTarget);
    dispatch(FormActions.openTrans());
  };

  return (
    <React.Fragment>
      <Button className="h-64 px-12 ml-12" onClick={historyClick}>
        <div className="hidden md:flex flex-col items-start">
          <Typography component="span" className="normal-case font-600 flex">
            B/L Version History
          </Typography>
        </div>
        <Icon className="text-16 ml-4 hidden sm:flex" variant="action">
          keyboard_arrow_down
        </Icon>
      </Button>
    </React.Fragment>
  );
}

export default History;
