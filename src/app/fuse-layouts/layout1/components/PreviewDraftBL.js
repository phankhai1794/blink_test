import React from 'react';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Tooltip } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  iconDraftBL: {
    width: 40,
    height: 40,
    margin: '0 5px',
    cursor: 'pointer'
  }
}));

const PreviewDraftBL = () => {
  const classes = useStyles();
  const myBL = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);

  const previewDraftBL = () => {
    const bl = myBL.id || window.location.pathname.split('/')[4];
    if (bl) { 
      const newWindow = window.open(`/apps/draft-bl/preview/${bl}`, '_blank');
      if (newWindow) newWindow.opener = null;
    }
  };

  return (
    <PermissionProvider
      action={PERMISSION.VIEW_PREVIEW_DRAFT_BL}
      extraCondition={['/workspace', '/guest', '/apps/draft-bl/edit'].some((el) => window.location.pathname.includes(el))}>
      <Tooltip title="Preview Draft B/L">
        <img
          src="assets/images/icons/preview-draft.svg"
          alt="Draft BL Icon"
          className={classes.iconDraftBL}
          onClick={previewDraftBL}
        />
      </Tooltip>
    </PermissionProvider>
  );
};

export default PreviewDraftBL;
