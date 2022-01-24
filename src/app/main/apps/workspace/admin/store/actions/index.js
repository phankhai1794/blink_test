export const OPEN_INQUIRY_FORM = 'OPEN_INQUIRY_FORM';
export const SET_ANCHOR_EL = 'SET_ANCHOR_EL';
export const SET_CURRENT_FIELD = 'SET_CURRENT_FIELD';
export const SET_QUESTION = 'SET_QUESTION';
export const SET_EDIT= 'SET_EDIT';
export const ADD_QUESTION = 'ADD_QUESTION';
export const SAVE_QUESTION = 'SAVE_QUESTION';

export function toggleInquiry(state)
{
    return {
        type: OPEN_INQUIRY_FORM,
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

export function saveQuestion()
{
    return {
        type: SAVE_QUESTION,
    }
}