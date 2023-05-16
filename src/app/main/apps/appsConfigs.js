import { ListBLAppConfig } from './listBL/Config';
import { ProjectDashboardAppConfig } from './dashboards/project/ProjectDashboardAppConfig';
import { AdminAppConfig } from './dashboards/admin/AdminAppConfig';
import { WorkspaceAppConfig } from './workspace/WorkspaceAppConfig';
import { DraftAppConfig } from './draft-bl/Config';

export const appsConfigs = [AdminAppConfig, ProjectDashboardAppConfig, WorkspaceAppConfig, ListBLAppConfig, DraftAppConfig];
