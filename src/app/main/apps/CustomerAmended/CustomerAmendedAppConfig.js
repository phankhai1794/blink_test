import React from 'react';

export const CustomerAmendedAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes: [
        {
            path: '/apps/customer-amended',
            component: React.lazy(() => import('./CustomerAmendedApp'))
        }
    ]
};
