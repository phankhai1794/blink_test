import * as Actions from '../actions';
const mockData = [
    {
        content: "We found discrepancy in the routing information between SI and OPUS booking details",
        inqType: "ROUTING INQUIRY/DISCREPANCY",
        answerType: "ATTACHMENT ANSWER",
        field: "consignee",
        choices: [],
        addOther: "",
        files: [],
        reply: ["Example reply"]
    }]
const initialState = {
    success: false,
    fail: false,
    metadata: {},
    openDialog: false,
    openAllInquiry: false,
    openInquiry: false,
    openEdit: 0,
    openEdit1: null,
    anchorEl: null,
    currentField: "",
    reload: false,
    fields: [],
    inquiries: [],
    question: [{
        content: "We found discrepancy in the routing information between SI and OPUS booking details",
        inqType: "12cb6526-a6b1-11ec-b909-0242ac120002",
        ansType: "97883952-a6b0-11ec-b909-0242ac120002",
        field: "other",
        choices: [],
        addOther: "",
        receiver: "",
        files: []
    }]
}

const inquiryReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.OPEN_CREATE_INQUIRY:
            {
                return { ...state, openDialog: action.state };
            }
        case Actions.OPEN_ALL_INQUIRY:
            {
                return { ...state, openAllInquiry: !state.openAllInquiry };
            }
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
        case Actions.SET_QUESTION:
            {
                return { ...state, question: action.state };
            }
        case Actions.SET_EDIT:
            {
                return { ...state, openEdit: action.state };
            }
        case Actions.SET_EDIT1:
            {
                return { ...state, openEdit1: action.state };
            }
        case Actions.ADD_QUESTION:
            {
                return {
                    ...state, question: [...state.question, {
                        content: "We found discrepancy in the routing information between SI and OPUS booking details",
                        inqType: "12cb6526-a6b1-11ec-b909-0242ac120002",
                        ansType: "97883952-a6b0-11ec-b909-0242ac120002",
                        field: "other",
                        choices: [],
                        addOther: "",
                        receiver: "",
                        files: []
                    }]
                };
            }
        case Actions.ADD_QUESTION1:
            {
                return {
                    ...state, inquiries: [...state.inquiries, {
                        content: "We found discrepancy in the routing information between SI and OPUS booking details",
                        inqType: "12cb6526-a6b1-11ec-b909-0242ac120002",
                        ansType: "97883952-a6b0-11ec-b909-0242ac120002",
                        field: "other",
                        choices: [],
                        addOther: "",
                        files: []
                    }]
                };
            }
        case Actions.EDIT_INQUIRY:
            {
                return { ...state, inquiries: action.state };
            }
        case Actions.RELOAD:
        {
            return { ...state, reload: !state.reload, openEdit: 0, openDialog: false, question: [{
                content: "We found discrepancy in the routing information between SI and OPUS booking details",
                inqType: "12cb6526-a6b1-11ec-b909-0242ac120002",
                ansType: "97883952-a6b0-11ec-b909-0242ac120002",
                field: "other",
                choices: [],
                addOther: "",
                receiver: "",
                files: []
            }] };
        }
        case Actions.SAVE_FIELD:
        {
            return { ...state, fields: action.state };
        }
        case Actions.SAVE_METADATA:
        {
            return { ...state, metadata: action.state };
        }
        case Actions.DISPLAY_SUCCESS:
        {
            return { ...state, success: action.state };
        }
        case Actions.DISPLAY_FAIL:
        {
            return { ...state, fail: {openDialog : action.state, error: action.message} };
        }
        default:
            {
                return state;
            }
    }
};

export default inquiryReducer;