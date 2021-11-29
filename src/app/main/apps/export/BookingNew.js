import React, { useState, useEffect} from 'react'
import withReducer from 'app/store/withReducer';
import reducers from './store/reducers';
import ExportAppHeader from './ExportAppHeader';
import {
    HorizontalLinearStepper,
    BookingForm
} from './components';
import { useSelector, useDispatch } from 'react-redux';
import * as Actions from './store/actions';
import { stepsDef } from './store/reducers/booking.reducer';
import { 
    FormControlLabel,
    Tooltip,
    IconButton,
    Icon,
    Switch
} from '@material-ui/core';


const BookingNew = () => {

    const dispatch = useDispatch();

    const steps = useSelector(({ exportApp }) => exportApp.booking.steps);
    const activeStep = useSelector(({ exportApp }) => exportApp.booking.activeStep);
    const lockEdit = useSelector(({ exportApp }) => exportApp.booking.lockEdit);
    const [deliveryStep, setDeliveryStep] = useState(false);

    const toggleLockEdit = () => {
        dispatch(Actions.toggleLockEdit());
    }

    const hanldeChangeDeliveryStep = (ev) => {
        const checked = ev.target.checked;
        setDeliveryStep(checked);
        if(checked) {
            return  AddDeliveryStep();
        }

        return removeDeliveryStep();
    }

    const AddDeliveryStep = () => {
        dispatch(Actions.addBookingStep(stepsDef.delivery));
    }

    const removeDeliveryStep = () => {
        dispatch(Actions.removeBookingStep(stepsDef.delivery.index));
    }

    useEffect(() => {
        dispatch(Actions.resetBookingStep())
    }, [])

    // render
    return (
        <div className="flex flex-col flex-1 w-full p-0 sm:px-8">
            <div className="flex justify-between items-center">
                <ExportAppHeader />
                <div>
                    <FormControlLabel
                        control={
                            <Switch name="di" value={deliveryStep} onChange={hanldeChangeDeliveryStep} />
                        }
                        label="Delivery Information"
                    />
                    <Tooltip className="ml-8" title={lockEdit ? "Unlock Edit" : "Lock Edit"} placement="bottom">
                        <IconButton onClick={toggleLockEdit}>
                            <Icon color={lockEdit ? "primary" : "action"}>{lockEdit ? 'lock' : 'lock_open'}</Icon>
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            <div className="flex justify-center">
                <HorizontalLinearStepper className="max-w-640" steps={steps} active={activeStep - 1} />
            </div>
            <div className=" w-full mx-8 mt-16">
               <BookingForm />
            </div>
        </div>
    )
}

export default withReducer('exportApp', reducers)(BookingNew)
