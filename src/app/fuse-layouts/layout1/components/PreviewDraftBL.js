import React from 'react';
import history from '@history';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { Button, Tooltip } from '@material-ui/core';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import * as InquiryActions from 'app/main/apps/workspace/store/actions/inquiry';


const useStyles = makeStyles((theme) => ({
  iconDraftBL: {
    width: 20,
    height: 20,
    cursor: 'pointer'
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
  const { pathname } = window.location;
  const classes = useStyles();
  const dispatch = useDispatch();

  const myBL = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);
  const userType = useSelector(({ user }) => user.userType);

  const previewDraftBL = () => {
    const bl = myBL.id;
    if (bl) {
      const newWindow = window.open(`/draft-bl/preview/${bl}`, '_blank');
      if (newWindow) newWindow.opener = null;
    }
  };

  const redirectDraftBL = () => {
    const bl = myBL.id || window.location.pathname.split('/')[3];
    if (bl) {
      dispatch(InquiryActions.setMyBL({})); // reset BL to re-init socket every redirect page
      history.push(`/draft-bl?bl=${bl}`, { skipVerification: true });
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
            extraCondition={pathname.includes('/guest') && myBL.state.includes('DRF_') && userType === 'CUSTOMER'}>
            <Tooltip title="Preview Draft B/L">
              <Button
                variant='contained'
                onClick={redirectDraftBL}
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
