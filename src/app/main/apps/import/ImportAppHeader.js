import React from 'react';
import { ColorTabs } from './components';
import { Box } from '@material-ui/core';
import { importTypes } from './store/reducers/general.reducer';
import { useSelector, useDispatch } from 'react-redux';
import * as Actions from './store/actions';

const ImportAppHeader = (props) => {

    const dispatch = useDispatch();
    const tabIndex = useSelector(({importApp}) => importApp.general.importTypeIndex);
    
    const handleTabChange = (ev, tabIndex) => {
        dispatch(Actions.changeImportType(tabIndex));
    }

    return (
        <div className={props.className}>
            <Box sx={{ borderColor: 'divider' }} className="my-8">
                <ColorTabs
                    items={importTypes}
                    value={tabIndex}
                    onChange={handleTabChange}
                />
            </Box>
        </div>
    )
}

export default ImportAppHeader
