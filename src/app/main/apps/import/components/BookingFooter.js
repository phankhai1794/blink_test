import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import withReducer from 'app/store/withReducer';
import reducers from '../store/reducers';
import * as Actions from '../store/actions';
import * as appActions from 'app/store/actions';
import { Button } from '@material-ui/core';

const BookingFooter = (props) => {
    const { history } = props;
    const dispatch = useDispatch();

    const activeStep = useSelector(({ importApp }) => importApp.booking.activeStep);
    const steps = useSelector(({ importApp }) => importApp.booking.steps);
    const currentBookingForm = useSelector(({ importApp }) => importApp.booking.form);

    const handleNextStep = () => {
        dispatch(Actions.changeBookingStep(activeStep + 1));
        dispatch(Actions.setBookingData(currentBookingForm))        
    };

    const handleBackStep = () => {
        dispatch(Actions.changeBookingStep(activeStep - 1));
    }

    const handleSubmitBooking = () => {
        dispatch(appActions.showMessage({
            message: "create booking success!",
            variant: 'success'
        }));

        history.push('/apps/import');
    }

    const isLastStep = () => {
        return activeStep !== 1 && activeStep === steps.length;
    }

    return (
        <div className="w-full flex my-16 mx-32 justify-between">
            <Button
                variant="contained"
                color="primary"
                className={activeStep === 1 ? 'invisible' : ""}
                onClick={handleBackStep}
            >
                back
            </Button>
            { isLastStep() ?
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitBooking}
                >
                    Finish
                </Button>
                : 
                <Button
                    variant="contained"
                    color="primary"
                    className={activeStep === steps.length ? 'invisible' : ""}
                    onClick={handleNextStep}
                >
                    next
                </Button>
            }
        </div>
    )
}

export default withReducer('importApp', reducers)(withRouter(BookingFooter));
