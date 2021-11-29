import React from 'react';
import InitBooking from './InitBooking';
import Manifest from './Manifest';
import Delivery from './Delivery';
import Pricing from './Pricing';
import { useSelector} from 'react-redux'
import { getStepIndex } from '../../store/reducers/booking.reducer';

const BookingForm = () => {

    const activeStep = useSelector(({ importApp }) => importApp.booking.activeStep);
    const steps = useSelector(({ importApp }) => importApp.booking.steps);

    switch(getStepIndex(steps[activeStep - 1])) {
        case 0 : return <InitBooking />
        case 1 : return <Manifest />
        case 2 : return <Delivery />
        case 3 : return <Pricing />
        default: return null
    }
}

export default BookingForm;
