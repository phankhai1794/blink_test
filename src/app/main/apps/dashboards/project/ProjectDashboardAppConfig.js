import React from 'react';

export const ProjectDashboardAppConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  routes: [
    {
      path: '/apps/dashboards/',
      component: React.lazy(() => import('./ProjectDashboardApp'))
    }
  ]
};
