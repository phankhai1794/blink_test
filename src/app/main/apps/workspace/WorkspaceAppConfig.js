import React from 'react';

export const WorkspaceAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes: [
        {
            path: '/apps/workplace/:id/:hashcode',
            exact: false,
            component: React.lazy(() => import('./WorkspaceApp'))
        },
        {
            path: '/apps/workplace/mybl',
            exact: true,
            component: React.lazy(() => import('./BillApp'))
        },
    ]
};
