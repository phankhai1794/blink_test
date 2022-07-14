import React from 'react';

export const DraftAppConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  routes: [
    {
      path: '/apps/draft-bl/:id',
      exact: true,
      component: React.lazy(() => import('./App'))
    },
    {
      path: '/apps/draft-bl/edit/:id',
      exact: true,
      component: React.lazy(() => import('./App'))
    },
    {
      path: '/apps/draft-bl/preview/:id',
      exact: true,
      component: React.lazy(() => import('./App'))
    }
  ]
};
