import * as Actions from '../actions';

export const exportTypeDefs = {
    sea: 'Sea',
    air: 'Air'
}
export const exportTypes = Object.values(exportTypeDefs);

const initState = {
    exportTypeIndex: 0
}

const generalReducer = (state = initState, action) => {
    switch (action.type) {
        case Actions.CHANGE_EXPORT_TYPE:
        {
            return {
                ...state,
                exportTypeIndex: action.payload
            }
        }
        default:
        {
            return state;
        }
    }
}

export default generalReducer;