import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Button, Tooltip } from '@material-ui/core';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import * as DraftBLActions from 'app/main/apps/draft-bl/store/actions';


const useStyles = makeStyles((theme) => ({
  iconDraftBL: {
    width: 19,
    height: 19,
    cursor: 'pointer',
    display: 'inline-flex'
  },
  btn: {
    textTransform: 'none',
    color: '#FFFF',
    backgroundColor: '#BD0F73',
    margin: '0px 8px',
    borderRadius: '8px',
    fontFamily: 'Montserrat',
    '&:hover': {
      backgroundColor: '#BD0F73'
    }
  },
}));

const PreviewDraftBL = () => {
  const { pathname, search } = window.location;
  const classes = useStyles();
  const dispatch = useDispatch();

  const myBL = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);
  const userType = useSelector(({ user }) => user.userType);
  const isPreviewingDraftPage = useSelector(({ draftBL }) => draftBL.isPreviewingDraftPage);

  const previewDraftBL = () => {
    const bl = myBL.id;
    if (bl) {
      const newWindow = window.open(`/draft-bl/preview/${bl}`, '_blank');
      if (newWindow) newWindow.opener = null;
    }
  };

  return (
    <>
      {myBL?.state &&
        <>
          <PermissionProvider
            action={PERMISSION.VIEW_PREVIEW_DRAFT_BL}
            extraCondition={pathname.includes('/workspace') || (pathname.includes('/guest') && !myBL.state.includes('DRF_'))}>
            <Tooltip title="Preview Draft B/L">
              <Button
                variant='contained'
                onClick={previewDraftBL}
                className={classes.btn}
                style={{ height: 30, marginRight: 0, width: 90, fontSize: 12 }}>
                <img src="assets/images/icons/preview-draft.svg" alt="Draft BL Icon" className={classes.iconDraftBL} />
                Preview
              </Button>
            </Tooltip>
          </PermissionProvider>

          <PermissionProvider
            action={PERMISSION.VIEW_REDIRECT_DRAFT_BL}
            extraCondition={
              userType === 'CUSTOMER'
              && myBL.state.includes('DRF_')
              && pathname.includes('/draft-bl')
              && !isPreviewingDraftPage
            }
          >
            <Tooltip title="Preview Draft B/L">
              <Button
                variant='contained'
                onClick={() => {
                  const bl = new URLSearchParams(search).get('bl');
                  const url = new URL(window.location);
                  url.searchParams.set('bl', bl);
                  window.history.pushState({}, '', `${pathname}?bl=${bl}&btn-back=true`);
                  dispatch(DraftBLActions.setPreviewingDraftBL(true))
                }}
                className={classes.btn}
                style={{ height: 30, marginRight: 0, width: 90, fontSize: 12 }}>
                <img src="assets/images/icons/preview-draft.svg" alt="Draft BL Icon" className={classes.iconDraftBL} />
                Preview
              </Button>
            </Tooltip>
          </PermissionProvider>
        </>
      }
    </>
  );
};

export default PreviewDraftBL;