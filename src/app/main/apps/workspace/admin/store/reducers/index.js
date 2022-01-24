import * as Actions from '../actions';
const initialState = {
    open: false,
    openEdit: 0,
    anchorEl: null,
    currentField: "",
    questionSaved: [],
    question: [{
        name: "We found discrepancy in the routing information between SI and OPUS booking details",
        type: "ROUTING INQUIRY/DISCREPANCY",
        answerType: "CHOICE ANSWER",
        field: "other",
        choices: [],
        addOther: "",
        src: ""
      }]
}
const inquiryReducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.OPEN_INQUIRY_FORM:
        {
            return {...state, open: action.state};
        }
        case Actions.SET_ANCHOR_EL:
        {
            return {...state, anchorEl: action.state};
        }
        case Actions.SET_CURRENT_FIELD:
        {
            return {...state, currentField: action.state};
        }
        case Actions.SET_QUESTION:
        {
            return {...state, question: action.state};
        }
        case Actions.SET_EDIT:
        {
            return {...state, openEdit: action.state};
        }
        case Actions.ADD_QUESTION:
        {
            return {...state, question: [...state.question, {
                name: "We found discrepancy in the routing information between SI and OPUS booking details",
                type: "ROUTING INQUIRY/DISCREPANCY",
                answerType: "CHOICE ANSWER",
                field: "other",
                choices: [],
                addOther: "",
                src: ""
              }]};
        }
        case Actions.SAVE_QUESTION:
        {
            return {...state, questionSaved: [...state.questionSaved, ...state.question]};
        }
        default:
        {
            return state;
        }
    }
};

export default inquiryReducer;