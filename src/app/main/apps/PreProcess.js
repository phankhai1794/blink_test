import React, { useEffect, useContext } from 'react';
import _ from 'lodash';
import history from '@history';
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from 'app/AppContext';
import { getPermissionByRole } from 'app/services/authService';
import { getBlInfo } from 'app/services/myBLService';
import * as AppActions from 'app/store/actions';
import { handleError } from '@shared/handleError';
// import { categorizeInquiriesByUserType } from '@shared';

import Deploying from '../pages/errors/deploying/Deploying';

import * as DraftActions from './draft-bl/store/actions';
import * as Actions from './workspace/store/actions';
import * as FormActions from './workspace/store/actions/form';
import * as InquiryActions from './workspace/store/actions/inquiry';
import SubmitAnswerNotification from './workspace/components/SubmitAnswerNotification';

const PreProcess = ({ bl, children }) => {
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);

  const deploying = useSelector(({ fuse }) => fuse.message.deploying);
  const myBL = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);
  const isLoading = useSelector(({ workspace }) => workspace.formReducer.isLoading);
  const openNotification = useSelector(
    ({ workspace }) => workspace.formReducer.openNotificationSubmitAnswer
  );
  const openNotificationReply = useSelector(
    ({ workspace }) => workspace.formReducer.openNotificationDeleteReply
  );
  const openNotificationBLWarning = useSelector(
    ({ workspace }) => workspace.formReducer.openNotificationBLWarning
  );
  const openNotificationAmendment = useSelector(
    ({ workspace }) => workspace.formReducer.openNotificationDeleteAmendment
  );
  const openNotificationSubmitPreview = useSelector(
    ({ workspace }) => workspace.formReducer.openNotificationSubmitPreview
  );

  const renderMsgNoti = () => {
    if (openNotification) return 'Your answer has been submitted successfully.';
    else if (openNotificationReply) return 'Your reply has been deleted.';
    else if (openNotificationAmendment) return 'Your amendment has been deleted.';
    else if (openNotificationBLWarning.status)
      return (
        <>
          <img
            style={{ verticalAlign: 'middle', paddingBottom: 2, paddingLeft: 5, paddingRight: 5 }}
            src={`/assets/images/icons/warning.svg`}
          />
          <span>{`The BL is opening by [${openNotificationBLWarning.userName}].`}</span>
        </>
      );
    else if (openNotificationSubmitPreview)
      return (
        // not used, change to toast
        <>
          <div>Your inquiries and amendments</div>
          <div>have been sent successfully.</div>
        </>
      );
  };

  const renderMsgNoti2 = () => {
    if (openNotificationBLWarning.status)
      return `Please wait for ${openNotificationBLWarning.userName} complete his/her work!`;
    return 'Thank you!';
  };

  const renderIconType = () => {
    if (
      openNotification ||
      openNotificationReply ||
      openNotificationAmendment ||
      openNotificationSubmitPreview
    )
      return <img src={`/assets/images/icons/vector.svg`} />;
    return null;
  };

  useEffect(() => {
    const bkgNo = window.location.pathname.split('/')[3];
    if (bkgNo) {
      dispatch(Actions.initBL(bkgNo));
    } else if (bl) {
      dispatch(FormActions.increaseLoading());
      getBlInfo(bl).then((res) => {
        const { id, state, bkgNo } = res.myBL;
        dispatch(InquiryActions.setMyBL({ id, state, bkgNo }));
        dispatch(DraftActions.setBL({ id, state, bkgNo }));
        dispatch(FormActions.decreaseLoading());
      });
    }

    if (!socket.connected) socket.connect();

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (myBL.id) {
      const user = JSON.parse(localStorage.getItem('USER'));

      // user connect
      const mybl = user.userType === 'ADMIN' ? [myBL.bkgNo, myBL.id] : [myBL.id, myBL.bkgNo];
      socket.emit('user_connect', {
        mybl: mybl[0],
        optSite: mybl[1], // opposite workspace (offshore or onshore/customer)
        userName: user.displayName,
        userType: user.userType
      });

      // socket.on('connect_error', (err) => {
      //   // if server has disconnected
      //   dispatch(AppActions.warningDeploying(true));
      // });

      // save socketId into window console after connecting
      socket.on('user_socket_id', (socketId) => {
        window.socketId = socketId;
      });

      // receive a list of accessed onshores/customers
      socket.on('users_allowed_access', (data) => {
        if (!data.includes(user.email)) window.location.reload();
      });

      // receive a list users accessing
      socket.on('users_accessing', async ({ usersAccessing }) => {
        window.usersAccessing = usersAccessing;

        if (
          user.userType === 'ADMIN' ||
          (user.userType === 'CUSTOMER' && myBL.state.includes('DRF_'))
        ) {
          const userLocal = localStorage.getItem('USER')
            ? JSON.parse(localStorage.getItem('USER'))
            : {};
          if (userLocal.displayName && usersAccessing.length) {
            let permissions = await getPermissionByRole(userLocal.role).catch((err) =>
              handleError(dispatch, err)
            );
            if (userLocal.displayName === usersAccessing[0].userName) {
              // if to be the first user
              dispatch(FormActions.toggleOpenBLWarning(false));
            } else if (
              userLocal.displayName === usersAccessing[usersAccessing.length - 1].userName
            ) {
              // if to be the last user
              const { pathname, search } = window.location;
              const rdrFrmWs = new URLSearchParams(search).get('rdrFrmWs');
              if (!rdrFrmWs)
                dispatch(
                  FormActions.toggleOpenBLWarning({
                    status: true,
                    userName: usersAccessing[0].userName
                  })
                );
              else {
                permissions = await getPermissionByRole('Viewer').catch((err) =>
                  handleError(dispatch, err)
                );
                setTimeout(() => {
                  const bl = new URLSearchParams(search).get('bl');
                  const url = new URL(window.location);
                  url.searchParams.set('bl', bl);
                  window.history.pushState({}, '', `${pathname}?bl=${bl}`);
                }, 200);
              }
            }

            setTimeout(() => {
              dispatch(AppActions.setUser({ ...userLocal, permissions }));
            }, 500);
            sessionStorage.setItem('permissions', JSON.stringify(permissions));
          }
        }
      });

      // receive the message sync state
      // socket.on('sync_state', async ({ from, data }) => {
      //   const { inquiries, listMinimize, content, amendments } = data;

      //   const result = categorizeInquiriesByUserType(from, user.userType, myBL, inquiries);
      //   dispatch(InquiryActions.setInquiries(result));

      //   if (listMinimize) {
      //     if (from === "ADMIN") dispatch(InquiryActions.setListMinimize(listMinimize));
      //     else {
      //       let listMin = JSON.parse(sessionStorage.getItem("listMinimize"));
      //       // merge two array objects while removing duplicates
      //       listMin = listMin.concat(listMinimize).filter((item, idx, self) => {
      //         return idx === self.findIndex(el => el.id === item.id);
      //       });
      //       dispatch(InquiryActions.setListMinimize(listMin));
      //     }
      //   }

      //   if (content) dispatch(InquiryActions.setContent(content));

      //   if (amendments) dispatch(InquiryActions.setListCommentDraft(amendments));
      // });
    }
  }, [myBL]);

  return (
    <>
      {deploying ? (
        <Deploying />
      ) : (
        <>
          {isLoading <= 0 && (
            <SubmitAnswerNotification
              open={
                openNotification ||
                openNotificationReply ||
                openNotificationAmendment ||
                openNotificationBLWarning.status ||
                openNotificationSubmitPreview
              }
              msg={renderMsgNoti()}
              msg2={renderMsgNoti2()}
              iconType={renderIconType()}
            />
          )}
          <>{children}</>
        </>
      )}
    </>
  );
};

export default PreProcess;
