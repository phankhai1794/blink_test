import React from 'react';
import InitBooking from './InitBooking';
import Delivery from './Delivery';
import Pricing from './Pricing';
import { useSelector} from 'react-redux';
import { getStepIndex } from '../../store/reducers/booking.reducer'; 

const BookingForm = () => {

    const activeStep = useSelector(({ exportApp }) => exportApp.booking.activeStep);
    const steps = useSelector(({ exportApp }) => exportApp.booking.steps);

    switch(getStepIndex(steps[activeStep - 1])) {
        case 0 : return <InitBooking />
        case 1 : return <Delivery />
        case 2 : return <Pricing />
        default:  return <InitBooking />
    }
}

export default BookingForm;
