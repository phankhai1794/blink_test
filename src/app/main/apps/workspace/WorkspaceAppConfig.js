import React from 'react';

export const WorkspaceAppConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  routes: [
    {
      path: '/apps/workplace/:id',
      exact: false,
      component: React.lazy(() => import('./WorkspaceApp'))
    },
    {
      path: '/guest',
      exact: false,
      component: React.lazy(() => import('./components/OTPCheck'))
    }
  ]
};
