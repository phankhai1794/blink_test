import React from 'react';

export const InquiringAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes: [
        {
            path: '/apps/inquiring',
            component: React.lazy(() => import('./InquiringApp'))
        }
    ]
};
