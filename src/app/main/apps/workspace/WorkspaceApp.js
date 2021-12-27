import React, { useEffect, useRef } from 'react';
import Workspace from './Workspace';
import GuestWorkspace from './guest/GuestWorkspace';
import * as Actions from 'app/store/actions';
import { useDispatch } from 'react-redux';
import { FusePageSimple } from '@fuse';
import _ from '@lodash';
import OtpCheck from './guest/OTPCheck';

function RoleRedirect({ history }) {
    if (history.location.pathname.includes("/customer")) {
        // return <GuestWorkspace status={history.location.state} />
        return <OtpCheck />
    }
    else {
        return <Workspace status={history.location.state} />
    }
}
function WorkspaceApp(props) {
    const { history } = props;
    const dispatch = useDispatch();

    const pageLayout = useRef(null);

    useEffect(() => {
        dispatch(Actions.setDefaultSettings(_.set({}, 'layout.config.navbar.display', false)))
        return () => {
            dispatch(Actions.setDefaultSettings(_.set({}, 'layout.config.navbar.display', true)))

        }
    }, [dispatch])
    return (
        <div className="flex flex-col flex-1 w-full">
            <FusePageSimple
                classes={{
                    contentWrapper: "p-0 sm:p-24 pb-80 sm:pb-80 h-full",
                    content: "flex flex-col h-full",
                    leftSidebar: "w-256 border-0",
                }}
                content={
                    <RoleRedirect history={history} />
                }
                sidebarInner
                ref={pageLayout}
                innerScroll
            />
        </div>
    );
}

export default WorkspaceApp;
