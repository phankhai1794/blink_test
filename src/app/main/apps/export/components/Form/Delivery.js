import React from 'react'
import { FieldWithLabel } from 'app/main/apps/import/components/Form/BookingFormBase';

const Delivery = () => {
    return (
        <div className="mx-32 flex flex-col">
            <div className="flex-1 flex">
                <div className="flex-1">
                    <FieldWithLabel
                        label="Số tờ khai"
                        name="shipper"
                    />
                    <FieldWithLabel
                        label="Luồng tờ khai"
                        name="shp_ref"
                    />
                    <FieldWithLabel
                        label="Thông tin khác của tên hàng"
                        multiline
                        rowsMax={5}
                    />

                </div>
                <div className="flex-1 ml-16">
                    <FieldWithLabel
                        label="Số xe"
                    />
                    <FieldWithLabel
                        label="Địa chỉ giao hàng"
                    />
                </div>
            </div>
        </div> 
    )
}

export default Delivery
