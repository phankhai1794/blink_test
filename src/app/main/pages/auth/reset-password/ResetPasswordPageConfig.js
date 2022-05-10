import React from 'react';

export const ResetPasswordPageConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  routes: [
    {
      path: '/auth/reset-password',
      component: React.lazy(() => import('./ResetPasswordPage'))
    },
    {
      path: '/auth/session-expired',
      component: React.lazy(() => import('./AuthExpired'))
    }
  ]
};
