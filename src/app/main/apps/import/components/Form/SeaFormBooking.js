import React, { useEffect } from 'react';
import {
    MenuItem,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Typography
} from '@material-ui/core';
import { FieldWithLabel, CustomOutlinedField } from './BookingFormBase';
import { useForm } from '@fuse/hooks';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../../store/actions';

export const InputCell = (props) => {
    const [value, setValue] = React.useState("");
    return (
        <TableCell classes={{
            root: "p-4 py-8"
        }}>
            <input className="w-full" value={value} onChange={ev => setValue(ev.target.value)} placeholder={props.placeholder || "..............."} />
        </TableCell>
    )
}

const freight = ['PREPAID', 'COLLECT'];

const initBookingState = {
    "shipperCd": "",
    "shipperNm": "",
    "shipperAddr": "",
    "consigneeCd": "",
    "consigneeNm": "",
    "consigneeAddr": "",
    "notifyCd": "",
    "notifyNm": "",
    "notifyAddr": "",
    "shippingMark": "",
    "desOfGoods": [{
        "goodsNm": "",
        "hsCd": "",
        "goodsNW": ""
    }],
    "demension": "",
    "term": "",
    "noCtn": "",
    "obrdEtdDt": "",
    "cgoRcvDt": "",
    "freight": freight[0],
    "poi": "",
    "doi": "",
    "whNm": "",
    "volume": [
        {
            "cntrTpSz": "",
            "cntrQty": "",
            "eqCntrTpSz": "",
            "eqCntrQty": ""
        }
    ],
    "container": [
        {
            "ctnGW": "",
            "cntrNo": "",
            "cntrSealNo": [
                ""
            ],
            "cntrTpsz": [
                ""
            ],
            "pkgTp": "",
            "pkgQty": "",
            "cntrMf": [
                {
                    "hsCd": "",
                    "htsCd": "",
                    "ncmNo": ""
                }
            ]
        }
    ],
    "mbCd": "",
    "hbCd": ""
}


const SeaFormBooking = () => {
    const dispatch = useDispatch();

    const bookingData = useSelector(({importApp}) => importApp.booking.data);
    const lockEdit = useSelector(({importApp}) => importApp.booking.lockEdit);
    const { form, handleChange } = useForm(bookingData || initBookingState);

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

                </div>
                <div className="flex-1 ml-16">
                    <FieldWithLabel
                        label="Booking No"
                        name="bkgNo"
                        value={form.bkgNo}
                        onChange={handleChange} 
                        disabled={isLocked('bkgNo')}
                    />
                    <FieldWithLabel
                        label="B/L No"
                        name="blNo"
                        value={form.blNo}
                        onChange={handleChange} 
                        disabled={isLocked('blNo')}
                    />
                    <FieldWithLabel
                        label="Master Bill"
                        name="mbCd"
                        value={form.mbCd}
                        onChange={handleChange} 
                        disabled={isLocked('mbCd')}
                    />
                    <FieldWithLabel
                        label="House Bill"
                        name="hbCd"
                        value={form.hbCd}
                        onChange={handleChange} 
                        disabled={isLocked('hbCd')}
                    />
                    <FieldWithLabel
                        label="Place Of Issue"
                        multiline
                        rowsMax={4}
                        name="poi"
                        value={form.poi}
                        onChange={handleChange} 
                        disabled={isLocked('poi')}
                    />
                    <FieldWithLabel
                        label="Other Request"
                        name="otherRq"
                        value={form.otherRq}
                        onChange={handleChange} 
                        disabled={isLocked('otherRq')}
                        multiline
                        rowsMax={4}
                    />
                </div>
            </div>
            <div className="flex-1 flex">
                <div className="flex-1">
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
                </div>
                <div className="flex-1 ml-16">
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
                </div>
            </div>
            <div className="flex-1 flex">
                <div className="flex-1">
                    <FieldWithLabel
                        label="Feeder Vessel"
                    >
                        <CustomOutlinedField name="feederVslNo" onChange={handleChange} disabled={isLocked('feederVslNo')} />
                        <CustomOutlinedField
                            className="ml-4"
                            placeholder="Place Of Receipt Name"
                            name="porNm"
                            value={form.porNm}
                            onChange={handleChange} 
                            disabled={isLocked('porNm')}
                        />
                    </FieldWithLabel>
                    <FieldWithLabel
                        label="Mother vessel"
                    >
                        <CustomOutlinedField name="motherVslNo" onChange={handleChange} 
                        disabled={isLocked('motherVslNo')} />
                        <CustomOutlinedField
                            className="ml-4"
                            placeholder="Port Of Loading"
                            name="pol"
                            value={form.pol}
                            onChange={handleChange} 
                            disabled={isLocked('pol')}
                        />
                    </FieldWithLabel>
                    <FieldWithLabel
                        label="Port of Discharge "
                    >
                        <CustomOutlinedField
                            name="pod"
                            value={form.pod}
                            onChange={handleChange} 
                            disabled={isLocked('pod')}
                        />
                        <CustomOutlinedField
                            className="ml-4"
                            placeholder="Place Of Delivery"
                            name="delNm"
                            value={form.delNm}
                            onChange={handleChange} 
                            disabled={isLocked('delNm')}
                        />
                    </FieldWithLabel>
                </div>
                <div className="flex-1 ml-16">
                    <FieldWithLabel
                        label="Service Contract Number"
                        name="serCtNb"
                        value={form.serCtNb}
                        onChange={handleChange} 
                        disabled={isLocked('serCtNb')}
                    />
                    <FieldWithLabel
                        label="Final Destination"
                        multiline
                        rowsMax={4}
                        name="finalDst"
                        value={form.finalDst}
                        onChange={handleChange} 
                        disabled={isLocked('finalDst')}
                    />
                </div>
            </div>
            <div className="flex-1 flex">
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={8}>
                                <Typography className="text-center" variant="h6" >PARTICULAR FURNISHED BY SHIPPER - CARRIER NOT RESPONSIBLE</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2} align="center">Container/Seal No</TableCell>
                            <TableCell align="center">Size/Type</TableCell>
                            <TableCell align="center">Shipping Marks</TableCell>
                            <TableCell align="center">Description of goods</TableCell>
                            <TableCell align="center">No/Kind of Packages</TableCell>
                            <TableCell align="center">Gross Weight (Kgs) </TableCell>
                            <TableCell align="center">Measurement (Cbm) </TableCell>
                        </TableRow>
                        {[...Array(5)].map((row, index) => {
                            return (
                                <TableRow key={'row' + index}>
                                    {[...Array(8)].map((col, colIndex) => (
                                        <InputCell key={'col' + colIndex} />
                                    ))}
                                </TableRow>
                            )
                        })}
                        <TableRow>
                            <TableCell colSpan={4} align="center"></TableCell>
                            <TableCell align="center">TOTAL: </TableCell>
                            <TableCell align="center">0</TableCell>
                            <TableCell align="center">0.00</TableCell>
                            <TableCell align="center">0.00</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={5} align="left">Payment Terms ( Prepaid or Collect or Paid at 3rd country ):</TableCell>
                            <TableCell align="center" colSpan={2}>
                                <FieldWithLabel
                                    select
                                    name="freight"
                                    value={form.freight}
                                    onChange={handleChange} 
                                    disabled={isLocked('freight')}
                                    mb={'mb-0'}
                                >
                                    {freight.map((item, index) => (
                                        <MenuItem 
                                            key={'freight' + index} 
                                            value={item}
                                        >{ item }</MenuItem>
                                    ))}
                                </FieldWithLabel>
                            </TableCell>
                            <TableCell align="center"></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default SeaFormBooking
