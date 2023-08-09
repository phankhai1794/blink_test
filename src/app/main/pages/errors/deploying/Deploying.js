// https://forum.gitlab.com/t/deploy-in-progress-please-try-again-in-a-few-minutes-please-contact-your-gitlab-administrator/15414
import React, { useEffect } from 'react';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { Typography } from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import * as AppActions from 'app/store/actions';

function Deploying() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(AppActions.setDefaultSettings(_.set({}, 'layout.config.toolbar.display', false)));
  }, []);

  return (
    <div className="flex flex-col flex-1 items-center justify-center p-16">
      <div className="max-w-1080 text-center">
        <FuseAnimate animation="transition.expandIn" delay={100}>
          <Typography variant="h1" color="inherit" className="font-medium mb-16">
            Deploy in progress
          </Typography>
        </FuseAnimate>

        <FuseAnimate delay={500}>
          <Typography variant="h4" color="textSecondary" className="mb-16">
            Please try again in a few minutes
          </Typography>
        </FuseAnimate>

        <FuseAnimate delay={500}>
          <Typography variant="h6" color="textSecondary" className="mb-16">
          Please contact your BLink administrator if this problem persists
          </Typography>
        </FuseAnimate>
      </div>
    </div>
  );
}

export default Deploying;
