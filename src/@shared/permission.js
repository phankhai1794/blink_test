export const PERMISSION = {
  // UI
  VIEW_ACCESS_DASHBOARD: 'view_accessDashboard',
  VIEW_ACCESS_BLLIST: 'view_accessBLList',
  VIEW_ACCESS_WORKSPACE: 'view_accessWorkspace',
  VIEW_ACCESS_DRAFT_BL: 'view_accessDraftBL',
  VIEW_SHOW_ALL_INQUIRIES: 'view_showAllInquiries',
  VIEW_SHOW_BL_HISTORY: 'view_showBLHistory',
  VIEW_SHOW_USER_MENU: 'view_showUserMenu',
  VIEW_PREVIEW_DRAFT_BL: 'view_previewDraftBL',
  VIEW_EDIT_DRAFT_BL: 'view_editDraftBL',
  VIEW_EDIT_INQUIRY: 'view_editInquiry',
  VIEW_SAVE_INQUIRY: 'view_saveInquiry',

  // UI + API
  INQUIRY_CREATE_INQUIRY: 'inquiry_createInquiry',
  INQUIRY_CREATE_COMMENT: 'inquiry_createComment',
  INQUIRY_UPDATE_INQUIRY_STATUS: 'inquiry_updateInquiryStatus',
  MAIL_SEND_MAIL: 'mail_sendMail',
  INQUIRY_ANSWER_ATTACHMENT: 'inquiry_createAttachmentAnswer',
  INQUIRY_ANSWER_CREATE_PARAGRAPH: 'inquiry_createParagraphAnswer',
  INQUIRY_ANSWER_UPDATE_PARAGRAPH: 'inquiry_updateParagraphAnswer',
  INQUIRY_ANSWER_UPDATE_CHOICE: 'inquiry_updateInquiryChoice',
  INQUIRY_REPLACE_MEDIA: 'inquiry_replaceMedia',
  INQUIRY_REMOVE_MEDIA: 'inquiry_removeMedia',
  INQUIRY_INQ_ATT_MEDIA: 'inquiry_changesInqAtt',
  INQUIRY_ADD_MEDIA: 'inquiry_addMedia'
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
