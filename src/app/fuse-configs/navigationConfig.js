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
                'title': 'Customer Confirmed',
                'type': 'item',
                'icon': 'check_box',
                'url': '/apps/customer-confirmed'
            },
            {
                'id': 'customer-amended',
                'title': 'Customer Amended',
                'icon': 'edit',
                'type': 'item',
                'url': '/apps/customer-amended'
            },
            {
                'id': 'amendment-request',
                'title': 'Amendment Request',
                'type': 'item',
                'icon': 'assignment',
                'url': '/apps/amendment-request'
            },
            {
                'id': 'completed-draft-bl',
                'title': 'Completed Draft B/L ',
                'type': 'item',
                'icon': 'check_circle',
                'url': '/apps/completed-draft-bl'
            },
            {
                'id': 'expired',
                'title': 'Expired',
                'type': 'item',
                'icon': 'warning',
                'url': '/apps/expired',
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
