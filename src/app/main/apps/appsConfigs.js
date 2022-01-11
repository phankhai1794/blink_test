import { InquiringAppConfig } from './inquiring/InquiringAppConfig';
import { ProjectDashboardAppConfig } from './dashboards/project/ProjectDashboardAppConfig';
import { CustomerConfirmedAppConfig } from './customer-confirmed/CustomerConfirmedAppConfig';
import { AmendmentRequestAppConfig } from './amendment-request/AmendmentRequestAppConfig';
import { CompletedDraftBLAppConfig } from './completed-draftBL/CompletedDraftBLAppConfig';
import { CustomerAmendedAppConfig } from './customer-amended/CustomerAmendedAppConfig';
import { WorkspaceAppConfig } from './workspace/WorkspaceAppConfig';

export const appsConfigs = [
  ProjectDashboardAppConfig,
  InquiringAppConfig,
  CustomerConfirmedAppConfig,
  AmendmentRequestAppConfig,
  CompletedDraftBLAppConfig,
  CustomerAmendedAppConfig,
  WorkspaceAppConfig
];
