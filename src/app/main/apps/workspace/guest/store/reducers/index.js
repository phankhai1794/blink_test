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
    openInquiry: false,
    openEdit: 0,
    anchorEl: null,
    currentField: "",
    fields: ["port_of_loading", "shipper", "consignee"],
    inquiries: mockData,
}

const inquiryReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.OPEN_INQUIRY:
            {
                return { ...state, openInquiry: action.state };
            }
        case Actions.SET_ANCHOR_EL:
            {
                return { ...state, anchorEl: action.state };
            }
        case Actions.SET_REPLY:
            {
                return { ...state, reply: action.state };
            }
        case Actions.SET_CURRENT_FIELD:
            {
                return { ...state, currentField: action.state };
            }
        case Actions.SET_EDIT:
            {
                return { ...state, openEdit: action.state };
            }
        default:
            {
                return state;
            }
    }
};

export default inquiryReducer;