import React from 'react';

export const ListBLAppConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  routes: [
    {
      path: '/apps/bl-amendment/request',
      component: React.lazy(() => import('./App'))
    },
    {
      path: '/apps/bl-amendment/inquired',
      component: React.lazy(() => import('./App'))
    },
    {
      path: '/apps/bl-amendment/confirm',
      component: React.lazy(() => import('./App'))
    },
    {
      path: '/apps/bl-amendment/completed',
      component: React.lazy(() => import('./App'))
    }
  ]
};
