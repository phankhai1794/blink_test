export const OPEN_INQUIRY = 'OPEN_INQUIRY';
export const SET_ANCHOR_EL = 'SET_ANCHOR_EL';
export const SET_CURRENT_FIELD = 'SET_CURRENT_FIELD';
export const SET_REPLY = 'SET_REPLY';
export const SET_EDIT= 'SET_EDIT';
export const SAVE_FIELD = 'SAVE_FIELD'

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

export function setReply(question)
{
    return {
        type: SET_REPLY,
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

export function saveField()
{
    return {
        type: SAVE_FIELD,
    }
}