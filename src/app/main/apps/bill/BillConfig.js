import React from 'react';

export const BillAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes: [
        {
            path: '/apps/bill',
            component: React.lazy(() => import('./BillApp'))
        }
    ]
};
