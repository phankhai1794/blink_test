import React from 'react'
import { FieldWithLabel } from './BookingFormBase';
import { useSelector } from 'react-redux';
import { importTypeDefs, importTypes } from '../../store/reducers/general.reducer';

const Manifest = () => {

    const importTypeIndex = useSelector(({ importApp }) => importApp.general.importTypeIndex);
    const importType = importTypes[importTypeIndex];

    const isAirBooking = () => {
        return importType === importTypeDefs.air
    }

    return (
        <div className="mx-32 flex flex-col">
            <div className="flex-1 flex">
                <div className="flex-1">
                    <FieldWithLabel
                        label="Auth Code"
                    />
                    <FieldWithLabel
                        label="Function Document"
                    />
                    <FieldWithLabel
                        label={ isAirBooking() ? "Air Port of via" : "Port of via"  }
                    />
                </div>
                <div className="flex-1 ml-16">
                    <FieldWithLabel
                        label={ isAirBooking() ? "Air Port of destination code" : "Port of destination code"  }
                    />
                    <FieldWithLabel
                        label={ isAirBooking() ? "Air Port of loading code" : "Port of loading code"  }
                    />
                    <FieldWithLabel
                        label={ isAirBooking() ? "Air Port of discharge code" : "Port of discharge code"  }
                    />
                </div>
            </div>
        </div>
    )
}

export default Manifest
