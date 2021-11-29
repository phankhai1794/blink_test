import React from 'react';

export const CustomerConfirmedAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes: [
        {
            path: '/apps/customer-confirmed',
            component: React.lazy(() => import('./CustomerConfirmedApp'))
        }
    ]
};
