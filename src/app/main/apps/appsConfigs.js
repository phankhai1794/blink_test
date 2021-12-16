import { InquiringAppConfig } from './Inquiring/InquiringAppConfig';
import { ProjectDashboardAppConfig } from './dashboards/project/ProjectDashboardAppConfig';
import { CustomerConfirmedAppConfig } from './CustomerConfirmed/CustomerConfirmedAppConfig';
import { AmendmentRequestAppConfig } from './AmendmentRequest/AmendmentRequestAppConfig';
import { CompletedDraftBLAppConfig } from './CompletedDraftBL/CompletedDraftBLAppConfig';
import { CustomerAmendedAppConfig } from './CustomerAmended/CustomerAmendedAppConfig';
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
