import * as Actions from '../actions/booking.actions';
import _ from '@lodash';

export const stepsDef = {
    init: {
        title: 'Khởi tạo đơn hàng' ,
        index: 0
    },
    manifest: {
        title: 'Manifest info' ,
        index: 1
    },
    delivery: {
        title: 'Thông tin giao/nhận' ,
        index: 2
    },
    price: {
        title: 'Chi phí' ,
        index: 3
    }
}

export const steps = [
    stepsDef.init.title,
    stepsDef.manifest.title,
    stepsDef.price.title,
];

const initState = {
    data: null,
    form: null,
    steps,
    activeStep: 1,
    lockEdit: false
}

const bookingReducer = (state = initState, action) => {
    switch(action.type) {
        case Actions.CHANGE_BOOKING_STEP: 
        {
            return {
                ...state,
                activeStep: action.payload
            }
        }
        case Actions.RESET_BOOKING_STEP: 
        {
            return initState;
        }
        case Actions.SET_BOOKING_FORM: 
        {
            return {
                ...state,
                form: _.merge({}, state.form, action.payload)
            }
        }
        case Actions.SET_BOOKING_DATA: 
        {
            return {
                ...state,
                data: _.merge({}, state.data, action.payload)
            }
        }
        case Actions.TOGGLE_LOCK_EDIT: 
        {
            return {
                ...state,
                lockEdit: !state.lockEdit
            }
        }
        case Actions.ADD_BOOKING_STEP: 
        {
            const { title, index } = action.payload;
            let currentStep = [...state.steps];
            currentStep.splice(index, 0, title);
            return {
                ...state,
                steps: currentStep
            }
        }
        case Actions.REMOVE_BOOKING_STEP: 
        {
            let currentStep = [...state.steps];
            currentStep.splice(action.payload, 1)
            return {
                ...state,
                steps: currentStep
            }
        }
        default: 
        {
            return state;
        }
    }
}

export function getStepIndex(stepTitle) {
    const matchStep = Object.values(stepsDef).find(item => item.title === stepTitle);
    
    return matchStep?.index;
}

export default bookingReducer;