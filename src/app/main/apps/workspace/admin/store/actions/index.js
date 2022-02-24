export const OPEN_CREATE_INQUIRY = 'OPEN_CREATE_INQUIRY';
export const OPEN_INQUIRY = 'OPEN_INQUIRY';
export const OPEN_ALL_INQUIRY = 'OPEN_ALL_INQUIRY';
export const SET_ANCHOR_EL = 'SET_ANCHOR_EL';
export const SET_CURRENT_FIELD = 'SET_CURRENT_FIELD';
export const SET_QUESTION = 'SET_QUESTION';
export const SET_REPLY = 'SET_REPLY';
export const SET_EDIT= 'SET_EDIT';
export const ADD_QUESTION = 'ADD_QUESTION';
export const ADD_QUESTION1 = 'ADD_QUESTION1';
export const SAVE_QUESTION = 'SAVE_QUESTION';
export const EDIT_QUESTION = 'EDIT_QUESTION';
export const SAVE_FIELD = 'SAVE_FIELD'

export function toggleCreateInquiry(state)
{
    return {
        type: OPEN_CREATE_INQUIRY,
        state: state
    }
}
export function toggleAllInquiry()
{
    return {
        type: OPEN_ALL_INQUIRY,
    }
}

export function toggleInquiry(state)
{
    return {
        type: OPEN_INQUIRY,
        state: state
    }
}

export function setAnchor(state)
{
    return {
        type: SET_ANCHOR_EL,
        state: state
    }
}

export function setField(state)
{
    return {
        type: SET_CURRENT_FIELD,
        state: state
    }
}

export function setQuestion(question)
{
    return {
        type: SET_QUESTION,
        state: question,
    }
}

export function setReply(question)
{
    return {
        type: SET_REPLY,
        state: question,
    }
}

export function editQuestion(question)
{
    return {
        type: EDIT_QUESTION,
        state: question,
    }
}

export function setEdit(state)
{
    return {
        type: SET_EDIT,
        state: state,
    }
}

export function addQuestion()
{
    return {
        type: ADD_QUESTION,
    }
}

export function addQuestion1()
{
    return {
        type: ADD_QUESTION1,
    }
}

export function saveQuestion()
{
    return {
        type: SAVE_QUESTION,
    }
}

export function saveField()
{
    return {
        type: SAVE_FIELD,
    }
}