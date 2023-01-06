import React, { useEffect } from 'react';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { Typography } from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import { Link } from 'react-router-dom';
import * as AppActions from 'app/store/actions';

function Error404Page() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(AppActions.setDefaultSettings(_.set({}, 'layout.config.toolbar.display', false)));
  }, []);

  return (
    <div className="flex flex-col flex-1 items-center justify-center p-16">
      <div className="max-w-512 text-center">
        <FuseAnimate animation="transition.expandIn" delay={100}>
          <Typography variant="h1" color="inherit" className="font-medium mb-16">
            404
          </Typography>
        </FuseAnimate>

        <FuseAnimate delay={500}>
          <Typography variant="h5" color="textSecondary" className="mb-16">
            Sorry but we could not find the page you are looking for
          </Typography>
        </FuseAnimate>

        {/* <Link className="font-medium" to="/apps/dashboards">
          Go back to main page
        </Link> */}
      </div>
    </div>
  );
}

export default Error404Page;
