import React from 'react';

export const AmendmentRequestAppConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  routes: [
    {
      path: '/apps/amendment-request',
      component: React.lazy(() => import('./AmendmentRequestApp'))
    }
  ]
};
