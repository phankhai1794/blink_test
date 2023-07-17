export const PERMISSION = {
  // UI
  VIEW_ACCESS_DASHBOARD: 'view_accessDashboard',
  VIEW_ACCESS_BLLIST: 'view_accessBLList',
  VIEW_ACCESS_WORKSPACE: 'view_accessWorkspace',
  VIEW_ACCESS_DRAFT_BL: 'view_accessDraftBL',
  VIEW_ACCESS_EDIT_DRAFT_BL: 'view_accessEditDraftBL',
  VIEW_SHOW_ALL_INQUIRIES: 'view_showAllInquiries',
  VIEW_SHOW_BL_HISTORY: 'view_showBLHistory',
  VIEW_SHOW_USER_MENU: 'view_showUserMenu',
  VIEW_PREVIEW_DRAFT_BL: 'view_previewDraftBL',
  VIEW_EDIT_DRAFT_BL: 'view_editDraftBL',
  VIEW_EDIT_INQUIRY: 'view_editInquiry',
  VIEW_SAVE_INQUIRY: 'view_saveInquiry',
  VIEW_REDIRECT_DRAFT_BL: 'view_redirectDraftBL',
  VIEW_CREATE_AMENDMENT: 'view_createAmendment',

  // UI + API
  INQUIRY_CREATE_INQUIRY: 'inquiry_createInquiry',
  INQUIRY_CREATE_REPLY: 'inquiry_createReply',
  INQUIRY_UPDATE_REPLY: 'inquiry_updateReply',
  INQUIRY_UPDATE_INQUIRY: 'inquiry_updateInquiry',
  INQUIRY_DELETE_INQUIRY: 'inquiry_deleteInquiry',
  INQUIRY_RESOLVE_INQUIRY: 'inquiry_resolveInquiry',
  INQURIY_DELETE_COMMENT: 'inquiry_deleteComment',
  INQUIRY_ANSWER_ATTACHMENT: 'inquiry_createAttachmentAnswer',
  INQUIRY_ANSWER_CREATE_PARAGRAPH: 'inquiry_createParagraphAnswer',
  INQUIRY_ANSWER_UPDATE_PARAGRAPH: 'inquiry_updateParagraphAnswer',
  INQUIRY_ANSWER_UPDATE_CHOICE: 'inquiry_updateInquiryChoice',
  INQUIRY_REPLACE_MEDIA: 'inquiry_replaceMedia',
  INQUIRY_REMOVE_MEDIA: 'inquiry_removeMedia',
  INQUIRY_INQ_ATT_MEDIA: 'inquiry_changesInqAtt',
  INQUIRY_ADD_MEDIA: 'inquiry_addMedia',
  INQUIRY_SUBMIT_INQUIRY_ANSWER: 'inquiry_submitInquiryAnswer',
  INQUIRY_REOPEN_INQUIRY: 'inquiry_reOpenInquiry',
  DRAFTBL_UPDATE_DRAFT_BL_REPLY: 'draftbl_updateDraftBLReply',
  DRAFTBL_CONFIRM_DRAFT_BL: 'draftbl_confirmDraftBl',
  DRAFTBL_CREATE_REPLY: 'draftbl_saveEditedField',
  MAIL_SEND_MAIL: 'mail_sendMail',
};

export const PermissionProvider = ({
  action,
  extraCondition = true,
  children,
  fallback = null
}) => {
  const user = localStorage.getItem('USER');
  if (!user) return null;

  const permissionsSession = sessionStorage.getItem('permissions') || '';
  const permissions = permissionsSession.length ? JSON.parse(permissionsSession) : JSON.parse(user).permissions;
  const isAllowed = (permissions || []).filter((p) => `${p.controller}_${p.action}` === action && p.enable).length > 0;
  return isAllowed && extraCondition ? (children ? children : true) : fallback;
};
