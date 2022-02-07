import * as Actions from '../actions';
const mockData = [{
    name: "We found discrepancy in the routing information between SI and OPUS booking details",
    type: "ROUTING INQUIRY/DISCREPANCY",
    answerType: "CHOICE ANSWER",
    field: "consignee",
    choices: ["Option 1", "Option 2"],
    addOther: "",
    src: ""
  },
  {
    name: "We found discrepancy in the routing information between SI and OPUS booking details",
    type: "ROUTING INQUIRY/DISCREPANCY",
    answerType: "PARAGRAPH ANSWER",
    field: "shipper",
    choices: [],
    addOther: "",
    src: ""
  },
  {
    name: "We found discrepancy in the routing information between SI and OPUS booking details",
    type: "ROUTING INQUIRY/DISCREPANCY",
    answerType: "ATTACHMENT ANSWER",
    field: "place_of_delivery",
    choices: [],
    addOther: "",
    src: ""
  }]
const initialState = {
    open: false,
    openInquiry: false,
    openEdit: 0,
    anchorEl: null,
    currentField: "",
    fields: ["consignee","shipper","place_of_delivery"],
    questionSaved: mockData,
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
const getList = (state) => {
    var array = state.question.filter(f => !state.fields.includes(f.field))
    var list = []
    array.forEach(e => list.push(e.field))
    return list
}
const inquiryReducer = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.OPEN_CREATE_INQUIRY:
        {
            return {...state, open: action.state};
        }
        case Actions.OPEN_INQUIRY:
        {
            return {...state, openInquiry: action.state};
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
            return {...state, open: false, openEdit: 0,fields:[...state.fields, ...getList(state)], questionSaved: [...state.questionSaved, ...state.question], question: [{
                name: "We found discrepancy in the routing information between SI and OPUS booking details",
                type: "ROUTING INQUIRY/DISCREPANCY",
                answerType: "CHOICE ANSWER",
                field: "other",
                choices: [],
                addOther: "",
                src: ""
            }]};
        }
        case Actions.EDIT_QUESTION:
        {
            return {...state, questionSaved: action.state};
        }
        default:
        {
            return state;
        }
    }
};

export default inquiryReducer;