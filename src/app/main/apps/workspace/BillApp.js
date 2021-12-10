import React, { useEffect, useRef } from 'react';
import Bill from './Bill';
import * as Actions from 'app/store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { FusePageSimple } from '@fuse';
import _ from '@lodash';
function BillApp(props) {
    const { history } = props;
    const dispatch = useDispatch();

    const pageLayout = useRef(null);

    useEffect(() => {
        dispatch(Actions.setDefaultSettings(_.set({}, 'layout.config.navbar.folded', true)))
    }, [dispatch])
    return (
        <div className="flex flex-col flex-1 w-full">
            {/* <ExportAppHeader className="p-0 sm:px-24" /> */}
            <FusePageSimple
                classes={{
                    contentWrapper: "p-0 sm:p-24 pb-80 sm:pb-80 h-full",
                    content: "flex flex-col h-full",
                    leftSidebar: "w-256 border-0",
                }}
                content={
                    <Bill status={history.location.state} />
                }

                sidebarInner
                ref={pageLayout}
                innerScroll
            />
        </div>
    );
}

export default BillApp;
