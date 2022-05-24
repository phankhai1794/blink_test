export const PERMISSION = {
  // UI
  VIEW_ACCESS_DASHBOARD: 'view_accessDashboard',
  VIEW_ACCESS_INQUIRING: 'view_accessInquiring',
  VIEW_ACCESS_WORKSPACE: 'view_accessWorkspace',
  VIEW_SHOW_ALL_INQUIRIES: 'view_showAllInquiries',
  VIEW_SHOW_BL_HISTORY: 'view_showBLHistory',
  VIEW_SHOW_USER_MENU: 'view_showUserMenu',
  VIEW_REDIRECT_GUEST_BL: 'view_redirectGuestBL',
  VIEW_REDIRECT_DRAFT_BL: 'view_redirectDraftBL',
  VIEW_EDIT_INQUIRY: 'view_editInquiry',
  VIEW_SAVE_INQUIRY: 'view_saveInquiry',

  // UI + API
  INQUIRY_CREATE_INQUIRY: 'inquiry_createInquiry',
  INQUIRY_CREATE_COMMENT: 'inquiry_createComment',
  INQUIRY_UPDATE_INQUIRY_STATUS: 'inquiry_updateInquiryStatus',
  MAIL_SEND_MAIL: 'mail_sendMail',
  INQUIRY_ANSWER_ATTACHMENT: 'inquiry_createAttachmentAnswer'
};

export const PermissionProvider = ({
  action,
  extraCondition = true,
  children,
  fallback = null
}) => {
  const user = localStorage.getItem('USER');
  if (!user) return null;

  const isAllowed =
    JSON.parse(user).permissions.filter((p) => `${p.controller}_${p.action}` === action && p.enable)
      .length > 0;
  return isAllowed && extraCondition ? (children ? children : true) : fallback;
};
