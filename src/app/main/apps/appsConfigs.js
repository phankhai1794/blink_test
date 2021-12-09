import { InquiringAppConfig } from './Inquiring/InquiringAppConfig';
import { ProjectDashboardAppConfig } from './dashboards/project/ProjectDashboardAppConfig';
import { CustomerConfirmedAppConfig } from './CustomerConfirmed/CustomerConfirmedAppConfig';
import { AmendmentRequestAppConfig } from './AmendmentRequest/AmendmentRequestAppConfig';
import { ExpiredAppConfig } from './Expired/ExpiredAppConfig';
import { CompletedDraftBLAppConfig } from './CompletedDraftBL/CompletedDraftBLAppConfig';
import { CustomerAmendedAppConfig } from './CustomerAmended/CustomerAmendedAppConfig';
import { MailAppConfig } from './mail/MailAppConfig';
import { TodoAppConfig } from './todo/TodoAppConfig';
import { ContactsAppConfig } from './contacts/ContactsAppConfig';
import { FileManagerAppConfig } from './file-manager/FileManagerAppConfig';
import { CalendarAppConfig } from './calendar/CalendarAppConfig';
import { ChatAppConfig } from "./chat/ChatAppConfig";
import { ECommerceAppConfig } from './e-commerce/ECommerceAppConfig';
import { ScrumboardAppConfig } from './scrumboard/ScrumboardAppConfig';
import { AcademyAppConfig } from './academy/AcademyAppConfig';
import { NotesAppConfig } from './notes/NotesAppConfig';
import { ImportAppConfig } from './import/ImportAppConfig';
import { ExportAppConfig } from './export/ExportAppConfig';
import { BillAppConfig } from './bill/BillConfig';
import { WorkspaceAppConfig } from './workspace/WorkspaceAppConfig';


export const appsConfigs = [
    ProjectDashboardAppConfig,
    MailAppConfig,
    TodoAppConfig,
    FileManagerAppConfig,
    ContactsAppConfig,
    CalendarAppConfig,
    ChatAppConfig,
    ECommerceAppConfig,
    ScrumboardAppConfig,
    AcademyAppConfig,
    NotesAppConfig,
    ImportAppConfig,
    ExportAppConfig,
    BillAppConfig,
    InquiringAppConfig,
    CustomerConfirmedAppConfig,
    AmendmentRequestAppConfig,
    CompletedDraftBLAppConfig,
    ExpiredAppConfig,
    CustomerAmendedAppConfig,
    WorkspaceAppConfig
];
