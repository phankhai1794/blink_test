import React from 'react';

export const ExpiredAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes: [
        {
            path: '/apps/expired',
            component: React.lazy(() => import('./ExpiredApp'))
        }
    ]
};
