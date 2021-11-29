import React from 'react';

export const CompletedDraftBLAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes: [
        {
            path: '/apps/Completed-draft-bl',
            component: React.lazy(() => import('./CompletedDraftBLApp'))
        }
    ]
};
