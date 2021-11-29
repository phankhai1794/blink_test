import React, {useEffect} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableRow
} from '@material-ui/core';
import { FieldWithLabel, CustomOutlinedField } from './BookingFormBase';
import { InputCell } from './SeaFormBooking';
import { useForm } from '@fuse/hooks';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../../store/actions';

const AirFormBooking = () => {
    const dispatch = useDispatch();

    const bookingData = useSelector(({importApp}) => importApp.booking.data);
    const lockEdit = useSelector(({importApp}) => importApp.booking.lockEdit);
    const { form, handleChange } = useForm(bookingData || {});

    const isLocked = (fieldName) => {
        return lockEdit && bookingData && bookingData[fieldName];
    }

    useEffect(() => {
        dispatch(Actions.setBookingForm(form))
    }, [form])

    return (
        <div className="mx-32 flex flex-col">
             <div className="flex-1 flex">
                <div className="flex-1">
                    <FieldWithLabel
                        label="Shipper Name"
                        name="shipperNm"
                        value={form.shipperNm}
                        onChange={handleChange} 
                        disabled={isLocked('shipperNm')}
                    />
                    <FieldWithLabel
                        label="Shipper Address"
                        multiline
                        rowsMax={5}
                        name="shipperAddr"
                        value={form.shipperAddr}
                        onChange={handleChange} 
                        disabled={isLocked('shipperAddr')}
                    />
                    <FieldWithLabel
                        label="Consignee Name"
                        name="consigneeNm"
                        value={form.consigneeNm}
                        onChange={handleChange} 
                        disabled={isLocked('consigneeNm')}
                    />
                    <FieldWithLabel
                        label="Consignee Address"
                        multiline
                        rowsMax={5}
                        name="consigneeAddr"
                        value={form.consigneeAddr}
                        onChange={handleChange} 
                        disabled={isLocked('consigneeAddr')}
                    />
                    <FieldWithLabel
                        label="Airport Departure"
                        multiline
                        rowsMax={5}
                        name="aPd"
                        value={form.aPd}
                        onChange={handleChange} 
                        disabled={isLocked('aPd')}
                    />
                </div>
                <div className="flex-1 ml-16">
                    <FieldWithLabel
                        label="Notify Name"
                        name="notifyNm"
                        value={form.notifyNm}
                        onChange={handleChange} 
                        disabled={isLocked('notifyNm')}
                    />
                    <FieldWithLabel
                        label="Notify Address"
                        multiline
                        rowsMax={4}
                        name="notifyAddr"
                        value={form.notifyAddr}
                        onChange={handleChange} 
                        disabled={isLocked('notifyAddr')}
                    />
                    <FieldWithLabel
                        label="Also Notify Name"
                        name="alsoNotifyNm"
                        value={form.alsoNotifyNm}
                        onChange={handleChange} 
                        disabled={isLocked('alsoNotifyNm')}
                    />
                    <FieldWithLabel
                        label="Also Notify Address"
                        multiline
                        rowsMax={4}
                        name="alsoNotifyAddr"
                        value={form.alsoNotifyAddr}
                        onChange={handleChange} 
                        disabled={isLocked('alsoNotifyAddr')}
                    />
                    <FieldWithLabel
                        label="Declared Value For Carriage"
                        name="carVal"
                        value={form.carVal}
                        onChange={handleChange} 
                        disabled={isLocked('carVal')}
                    />
                    <FieldWithLabel
                        label="Declared Value For Customs"
                        name="cusVal"
                        value={form.cusVal}
                        onChange={handleChange} 
                        disabled={isLocked('cusVal')}
                    />
                    
                </div>
            </div>
            <div className="flex-1 flex">
                <div className="flex-1">
                    <FieldWithLabel
                        label="Routing And Destination"
                    >
                        <CustomOutlinedField placeholder="To"
                            name="to1"
                            value={form.to1}
                            onChange={handleChange} 
                        />
                        <CustomOutlinedField 
                            className="ml-4" 
                            placeholder="By First Carrier"
                            name="by1"
                            value={form.by1}
                            onChange={handleChange} 
                        />
                    </FieldWithLabel>
                    <div className="flex mb-16">
                        <CustomOutlinedField className="ml-4" placeholder="To" name="to2" value={form.to2} onChange={handleChange} />
                        <CustomOutlinedField className="ml-4" placeholder="By" name="by2" value={form.by2} onChange={handleChange} />
                        <CustomOutlinedField className="ml-4" placeholder="To" name="to3" value={form.to3} onChange={handleChange} />
                        <CustomOutlinedField className="ml-4" placeholder="By" name="by3" value={form.by3} onChange={handleChange} />
                    </div>
                    <FieldWithLabel
                        label="Handling Information"
                        multiline
                        rowsMax={5}
                        name="hInf"
                        value={form.hInf}
                        onChange={handleChange} 
                        disabled={isLocked('hInf')}
                    />
                </div>
                <div className="flex-1 ml-16">
                    <FieldWithLabel
                        label="Currency"
                        name="currency"
                        value={form.currency}
                        onChange={handleChange} 
                        disabled={isLocked('currency')}
                    />
                    <div className="flex mb-16">
                        <CustomOutlinedField className="ml-4" placeholder="CHGS Code" name="chgsCd" value={form.chgsCd} onChange={handleChange} />
                        <CustomOutlinedField className="ml-4" placeholder="WT/VAL" name="WtVal" value={form.WtVal} onChange={handleChange} />
                        <CustomOutlinedField className="ml-4" placeholder="Other" name="other" value={form.other} onChange={handleChange} />
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
