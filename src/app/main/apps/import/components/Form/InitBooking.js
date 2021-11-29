import React from 'react'
import { FieldWithLabel } from './BookingFormBase';
import SeaFormBooking from './SeaFormBooking';
import AirFormBooking from './AirFormBooking';
import { useSelector } from 'react-redux';
import { importTypeDefs, importTypes } from '../../store/reducers/general.reducer';

const InitBooking = () => {

    const importTypeIndex = useSelector(({ importApp }) => importApp.general.importTypeIndex);
    const importType = importTypes[importTypeIndex];

    if(importType === importTypeDefs.sea) {
        return <SeaFormBooking /> 
    }

    if(importType === importTypeDefs.air) {
        return <AirFormBooking /> 
    }

    return null;
    
}

export default InitBooking
