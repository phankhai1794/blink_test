// import { MaterialUIComponentsNavigation } from 'app/main/documentation/material-ui-components/MaterialUIComponentsNavigation';

const navigationConfig = [
  {
    id: 'applications',
    title: 'Applications',
    type: 'group',
    icon: 'apps',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        icon: 'dashboard',
        url: '/apps/dashboards'
      },
      {
        id: 'bl-amendment-request',
        title: 'Amendment Request',
        type: 'item',
        icon: 'assignment',
        url: '/apps/bl-amendment/request'
      },
      {
        id: 'bl-amendment-inquired',
        title: 'B/L Inquired',
        type: 'item',
        icon: 'help_outline',
        url: '/apps/bl-amendment/inquired'
      },
      {
        id: 'bl-amendment-confirm',
        title: 'B/L Confirmed by Shipper',
        type: 'item',
        icon: 'check_box',
        url: '/apps/bl-amendment/confirm'
      },
      {
        id: 'bl-amendment-completed',
        title: 'B/L Data Completed',
        type: 'item',
        icon: 'check_circle',
        url: '/apps/bl-amendment/completed'
      }
    ]
  },
  {
    type: 'divider',
    id: 'divider-2'
  },
  {
    id: 'logout',
    title: 'Logout',
    type: 'item',
    icon: 'settings_power',
    url: '/logout'
  }
];

export default navigationConfig;
