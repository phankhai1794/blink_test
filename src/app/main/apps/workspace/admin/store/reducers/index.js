import * as Actions from '../actions';
const mockData = [{
    name: "We found discrepancy in the routing information between SI and OPUS booking details",
    type: "ROUTING INQUIRY/DISCREPANCY",
    answerType: "CHOICE ANSWER",
    field: "port_of_loading",
    choices: ["TOKYO", "JAPAN"],
    addOther: "",
    files: [],
    reply: ["Example reply"]
  },
  {
    name: "We found discrepancy in the routing information between SI and OPUS booking details",
    type: "ROUTING INQUIRY/DISCREPANCY",
    answerType: "PARAGRAPH ANSWER",
    field: "shipper",
    choices: [],
    addOther: "",
    files: [],
    reply: ["Example reply"]
  },
  {
    name: "We found discrepancy in the routing information between SI and OPUS booking details",
    type: "ROUTING INQUIRY/DISCREPANCY",
    answerType: "ATTACHMENT ANSWER",
    field: "consignee",
    choices: [],
    addOther: "",
    files: [],
    reply: ["Example reply"]
  }]
const initialState = {
    open: false,
    openAllInquiry: false,
    openInquiry: false,
    openEdit: 0,
    openEdit1: null,
    anchorEl: null,
    currentField: "",
    fields: ["port_of_loading","shipper","consignee"],
    questionSaved: mockData,
    question: [{
        name: "We found discrepancy in the routing information between SI and OPUS booking details",
        type: "ROUTING INQUIRY/DISCREPANCY",
        answerType: "CHOICE ANSWER",
        field: "other",
        choices: [],
        addOther: "",
        files: []
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
        case Actions.OPEN_ALL_INQUIRY:
        {
            return {...state, openAllInquiry: !state.openAllInquiry};
        }
        case Actions.OPEN_INQUIRY:
        {
            return {...state, openInquiry: action.state};
        }
        case Actions.SET_ANCHOR_EL:
        {
            return {...state, anchorEl: action.state};
        }
        case Actions.SET_REPLY:
        {
            return {...state, reply: action.state};
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
        case Actions.SET_EDIT1:
        {
            return {...state, openEdit1: action.state};
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
                files: []
              }]};
        }
        case Actions.ADD_QUESTION1:
        {
            return {...state, questionSaved: [...state.questionSaved, {
                name: "We found discrepancy in the routing information between SI and OPUS booking details",
                type: "ROUTING INQUIRY/DISCREPANCY",
                answerType: "CHOICE ANSWER",
                field: "other",
                choices: [],
                addOther: "",
                files: []
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
                files: []
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