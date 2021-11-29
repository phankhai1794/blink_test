import React from 'react';
import { BookingFooter } from './components'

export const ExportAppConfig = {
    settings: {
        layout: {}
    },
    routes: [
        {
            path: '/apps/export/new',
            component: React.lazy(() => import('./BookingNew')),
            settings: {
                layout: {
                    config: {
                        footer: {
                            display: true,
                            children: <BookingFooter />,
                        }
                    }
                }
            }
        },
        {
            path: '/apps/export',
            component: React.lazy(() => import('./ExportApp'))
        },
    ]
};
