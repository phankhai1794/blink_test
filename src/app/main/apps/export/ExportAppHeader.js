import React from 'react';
import { ColorTabs } from './components';
import { Box } from '@material-ui/core';
import { exportTypes } from './store/reducers/general.reducer';
import { useSelector, useDispatch } from 'react-redux';
import * as Actions from './store/actions';

const ExportAppHeader = (props) => {

    const dispatch = useDispatch();
    const tabIndex = useSelector(({exportApp}) => exportApp.general.exportTypeIndex);
    
    const handleTabChange = (ev, tabIndex) => {
        dispatch(Actions.changeExportType(tabIndex));
    }

    return (
        <div className={props.className}>
            <Box sx={{ borderColor: 'divider' }} className="my-8">
                <ColorTabs
                    items={exportTypes}
                    value={tabIndex}
                    onChange={handleTabChange}
                />
            </Box>
        </div>
    )
}

export default ExportAppHeader
