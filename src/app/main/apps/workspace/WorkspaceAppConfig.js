import React from 'react';

export const WorkspaceAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes: [
        {
            path: '/apps/workplace',
            component: React.lazy(() => import('./WorkspaceApp'))
        },
    ]
};
