import React from 'react';
import {
    MenuItem,
    Table,
    TableHead, 
    TableBody, 
    TableRow,
    TableCell,
    Typography
} from '@material-ui/core';
import { FieldWithLabel, CustomOutlinedField } from 'app/main/apps/import/components/Form/BookingFormBase';

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

const term = ['PREPAID', 'COLLECT'];

const SeaFormBooking = () => {

    const [selectedTerm, setSelectedTerm] = React.useState(term[0]);

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
                    
                </div>
                <div className="flex-1 ml-16">
                    <FieldWithLabel
                        label="Booking No"
                    />
                    <FieldWithLabel
                        label="B/L No"
                    />
                    <FieldWithLabel
                        label="Master Bill"
                    />
                    <FieldWithLabel
                        label="House Bill"
                    />
                    <FieldWithLabel
                        label="Place Of Issue"
                        multiline
                        rowsMax={4}
                    />
                    <FieldWithLabel
                        label="Other Request"
                        multiline
                        rowsMax={4}
                    />
                </div>
            </div>
            <div className="flex-1 flex">
                <div className="flex-1">
                    <FieldWithLabel
                        label="Notify Part"
                    />
                    <FieldWithLabel
                        label="Notify Part Address"
                        multiline
                        rowsMax={4}
                    />
                </div>
                <div className="flex-1 ml-16">
                    <FieldWithLabel
                        label="Also Notify Part"
                    />
                    <FieldWithLabel
                        label="Also Notify Part Address"
                        multiline
                        rowsMax={4}
                    />
                </div>
            </div>
            <div className="flex-1 flex">
                <div className="flex-1">
                    <FieldWithLabel
                        label="Feeder Vessel"
                    > 
                        <CustomOutlinedField />
                        <CustomOutlinedField className="ml-4" placeholder="Place Of Receipt" />
                    </FieldWithLabel>
                    <FieldWithLabel
                        label="Mother vessel"
                    >
                        <CustomOutlinedField />
                        <CustomOutlinedField className="ml-4" placeholder="Port Of Loading" />
                    </FieldWithLabel>
                    <FieldWithLabel
                        label="Port of Discharge "
                    >
                        <CustomOutlinedField />
                        <CustomOutlinedField className="ml-4" placeholder="Place Of Receipt" />
                    </FieldWithLabel>
                </div>
                <div className="flex-1 ml-16">
                    <FieldWithLabel
                        label="Service Contract Number"
                    />
                    <FieldWithLabel
                        label="Final Destination"
                        multiline
                        rowsMax={4}
                    />
                </div>
            </div>
            <div className="flex-1 flex">
                <Table>
                    <TableHead>
                        <TableCell colSpan={8}>
                            <Typography className="text-center" variant="h6" >PARTICULAR FURNISHED BY SHIPPER - CARRIER NOT RESPONSIBLE</Typography>
                        </TableCell>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2}  align="center">Container/Seal No</TableCell>
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
                                    { [...Array(8)].map((col, colIndex) => (
                                        <InputCell key={'col' + colIndex} />
                                    ))}
                                </TableRow>
                            )
                        })}
                        <TableRow>
                            <TableCell colSpan={4}  align="center"></TableCell>
                            <TableCell align="center">TOTAL: </TableCell>
                            <TableCell align="center">0</TableCell>
                            <TableCell align="center">0.00</TableCell>
                            <TableCell align="center">0.00</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={5}  align="left">Payment Terms ( Prepaid or Collect or Paid at 3rd country ):</TableCell>
                            <TableCell align="center" colSpan={2}>
                                <FieldWithLabel
                                    select
                                    value={selectedTerm}
                                    onChange={(ev) => setSelectedTerm(ev.target.value)}
                                    mb={'mb-0'}
                                >
                                    <MenuItem value="PREPAID">PREPAID</MenuItem>
                                    <MenuItem value="COLLECT">COLLECT</MenuItem>
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
