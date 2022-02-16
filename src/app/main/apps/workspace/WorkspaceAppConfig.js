import React from 'react';

export const WorkspaceAppConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  routes: [
    {
      path: '/apps/workplace/:id/:hashcode',
      exact: false,
      component: React.lazy(() => import('./WorkspaceApp'))
    },
    {
      path: '/apps/workplace/draft-bl',
      exact: true,
      component: React.lazy(() => import('./draft-bl/DraftWorkspace'))
    },
    {
      path: '/apps/workplace/mybl',
      exact: true,
      component: React.lazy(() => import('./BillApp'))
    },
  ]
};
