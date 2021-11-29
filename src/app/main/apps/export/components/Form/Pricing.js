import React from 'react'
import { FieldWithLabel } from 'app/main/apps/import/components/Form/BookingFormBase';
import {
    MenuItem,
} from '@material-ui/core';
import { useForm } from '@fuse/hooks';

const costCd = ['EXW', 'OF', 'DO', 'THC', 'CIC']

const Pricing = () => {

    const { form, handleChange } = useForm({
        sell: costCd[0],
        buy : costCd[0],
        share: ''
    })

    return (
        <div className="mx-32 flex flex-col">
            <div className="flex-1 flex max-w-640">
                <div className="flex-1">
                    <FieldWithLabel
                        label="Selling rate"
                        select
                        value={form.sell}
                        name='sell'
                        onChange={handleChange}
                    >
                        {costCd.map((item, index) => (
                            <MenuItem key={'sell' + index} value={item} >{item}</MenuItem>
                        ))}
                    </FieldWithLabel>

                    <FieldWithLabel
                        label="Buying rate"
                        select
                        value={form.buy}
                        name='buy'
                        onChange={handleChange}
                    >
                        {costCd.map((item, index) => (
                            <MenuItem key={'buy' + index} value={item}>{item}</MenuItem>
                        ))}
                    </FieldWithLabel>
                    <FieldWithLabel
                        label="Share Cost"
                        name='share'
                        value={form.share}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </div>
    )
}

export default Pricing
