import React from 'react';

export const AdminAppConfig = {
  settings: {
    layout: {
      config: {
        toolbar: {
          layout: 'layout2'
        }
      }
    }
  },
  routes: [
    {
      path: '/apps/admin/',
      component: React.lazy(() => import('./AdminApp'))
    }
  ]
};
