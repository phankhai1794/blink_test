import React from 'react'
import SeaFormBooking from './SeaFormBooking';
import AirFormBooking from './AirFormBooking';
import { useSelector } from 'react-redux';
import { exportTypeDefs, exportTypes } from '../../store/reducers/general.reducer';

const InitBooking = () => {

    const exportTypeIndex = useSelector(({ exportApp }) => exportApp.general.exportTypeIndex);
    const exportType = exportTypes[exportTypeIndex];

    if(exportType === exportTypeDefs.sea) {
        return <SeaFormBooking /> 
    }

    if(exportType === exportTypeDefs.air) {
        return <AirFormBooking /> 
    }

    return null;
    
}

export default InitBooking
