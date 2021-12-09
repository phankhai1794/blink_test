import { MaterialUIComponentsNavigation } from 'app/main/documentation/material-ui-components/MaterialUIComponentsNavigation';
import { authRoles } from 'app/auth';

const navigationConfig = [
    {
        'id': 'applications',
        'title': 'Applications',
        'type': 'group',
        'icon': 'apps',
        'children': [
            {
                'id': 'dashboard',
                'title': 'Dashboard',
                'type': 'item',
                'icon': 'dashboard',
                'url': '/apps/dashboards'
            },
            {
                'id': 'inquiring',
                'title': 'Inquiring',
                'type': 'item',
                'icon': 'help_outline',
                'url': '/apps/inquiring'
            },
            {
                'id': 'customer-confirmed',
                'title': 'B/L Confirmed by Shipper',
                'type': 'item',
                'icon': 'check_box',
                'url': '/apps/customer-confirmed'
            },
            {
                'id': 'completed-draft-bl',
                'title': 'B/L Data Completed',
                'type': 'item',
                'icon': 'check_circle',
                'url': '/apps/completed-draft-bl'
            },
            {
                'id': 'amendment-request',
                'title': 'Amendment Request',
                'type': 'item',
                'icon': 'assignment',
                'url': '/apps/amendment-request'
            },
            {
                'id': 'customer-amended',
                'title': 'Customer Amended',
                'icon': 'edit',
                'type': 'item',
                'url': '/apps/customer-amended'
            },   
        ]
    },
    {
        'type': 'divider',
        'id': 'divider-2'
    },
    {
        'id': 'logout',
        'title': 'Logout',
        'type': 'item',
        'icon': 'settings_power',
        'url': '/logout'
    }
];

export default navigationConfig;
