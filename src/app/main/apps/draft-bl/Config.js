import React from 'react';

export const DraftAppConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  routes: [
    {
      path: '/draft-bl',
      exact: true,
      component: React.lazy(() => import('./DraftBLWorkspace'))
    },
    {
      path: '/draft-bl/edit/:id',
      exact: true,
      component: React.lazy(() => import('./App'))
    },
    {
      path: '/draft-bl/preview/:id',
      exact: true,
      component: React.lazy(() => import('./DraftBLWorkspace'))
    }
  ]
};
