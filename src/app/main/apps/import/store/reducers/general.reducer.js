import * as Actions from '../actions';

export const importTypeDefs = {
    sea: 'Sea',
    air: 'Air'
}
export const importTypes = Object.values(importTypeDefs);

const initState = {
    importTypeIndex: 0
}

const generalReducer = (state = initState, action) => {
    switch (action.type) {
        case Actions.CHANGE_IMPORT_TYPE:
        {
            return {
                ...state,
                importTypeIndex: action.payload
            }
        }
        default:
        {
            return state;
        }
    }
}

export default generalReducer;