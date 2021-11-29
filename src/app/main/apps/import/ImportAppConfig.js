import React from 'react';
import { BookingFooter } from './components'

export const ImportAppConfig = {
    settings: {
        layout: {}
    },
    routes: [
        {
            path: '/apps/import/new',
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
            path: '/apps/import',
            component: React.lazy(() => import('./ImportApp'))
        },
    ]
};
