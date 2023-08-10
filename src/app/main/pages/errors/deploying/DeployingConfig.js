import React from 'react';

export const DeployingConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  routes: [
    {
      path: '/deploying',
      component: React.lazy(() => import('./Deploying'))
    }
  ]
};
