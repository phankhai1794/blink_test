import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableRow
} from '@material-ui/core';
import { FieldWithLabel, CustomOutlinedField } from 'app/main/apps/import/components/Form/BookingFormBase';
import { InputCell } from './SeaFormBooking';

const AirFormBooking = () => {
    return (
        <div className="mx-32 flex flex-col">
             <div className="flex-1 flex">
                <div className="flex-1">
                    <FieldWithLabel
                        label="Shipper"
                        name="shipper"
                    />
                    <FieldWithLabel
                        label="Shipper Address"
                        multiline
                        rowsMax={5}
                    />
                    <FieldWithLabel
                        label="Consignee"
                        name="consignee"
                    />
                    <FieldWithLabel
                        label="Consignee Address"
                        multiline
                        rowsMax={5}
                    />
                    <FieldWithLabel
                        label="Airport Departure"
                        multiline
                        rowsMax={5}
                    />
                </div>
                <div className="flex-1 ml-16">
                    <FieldWithLabel
                        label="Notify Part"
                    />
                    <FieldWithLabel
                        label="Notify Part Address"
                        multiline
                        rowsMax={4}
                    />
                    <FieldWithLabel
                        label="Also Notify Part"
                    />
                    <FieldWithLabel
                        label="Also Notify Part Address"
                        multiline
                        rowsMax={4}
                    />
                    <FieldWithLabel
                        label="Declared Value For Carriage"
                    />
                    <FieldWithLabel
                        label="Declared Value For Customs"
                    />
                    
                </div>
            </div>
            <div className="flex-1 flex">
                <div className="flex-1">
                    <FieldWithLabel
                        label="Routing And Destination"
                    >
                        <CustomOutlinedField placeholder="To" />
                        <CustomOutlinedField className="ml-4" placeholder="By First Carrier" />
                    </FieldWithLabel>
                    <div className="flex mb-16">
                        <CustomOutlinedField className="ml-4" placeholder="To" />
                        <CustomOutlinedField className="ml-4" placeholder="By" />
                        <CustomOutlinedField className="ml-4" placeholder="To" />
                        <CustomOutlinedField className="ml-4" placeholder="By" />
                    </div>
                    <FieldWithLabel
                        label="Handling Information"
                        multiline
                        rowsMax={5}
                    />
                </div>
                <div className="flex-1 ml-16">
                    <FieldWithLabel
                        label="Currency"
                    />
                    <div className="flex mb-16">
                        <CustomOutlinedField className="ml-4" placeholder="CHGS Code" />
                        <CustomOutlinedField className="ml-4" placeholder="WT/VAL" />
                        <CustomOutlinedField className="ml-4" placeholder="OTHER" />
                    </div>
                </div>
            </div>
            <div>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell align="center">NO OF PIECES</TableCell>
                            <TableCell align="center">GROSS WEIGHT</TableCell>
                            <TableCell align="center">RATE CLASS</TableCell>
                            <TableCell align="center">CHARGEABLE WEIGHT</TableCell>
                            <TableCell align="center">RATE/CHARGE</TableCell>
                            <TableCell align="center">TOTAL</TableCell>
                            <TableCell align="center">NATURE AND QUANTITY OF GOODS </TableCell>
                        </TableRow>
                        <TableRow>
                            <InputCell align="center" placeholder=" "></InputCell>
                            <InputCell align="center" placeholder=" "></InputCell>
                            <InputCell align="center" placeholder=" "></InputCell>
                            <InputCell align="center" placeholder=" "></InputCell>
                            <InputCell align="center" placeholder=" "></InputCell>
                            <InputCell align="center" placeholder=" "></InputCell>
                            <InputCell align="center" placeholder=" "></InputCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default AirFormBooking
