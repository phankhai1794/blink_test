export const OPEN_INQUIRY_FORM = 'OPEN_INQUIRY_FORM';
export const SET_ANCHOR_EL = 'SET_ANCHOR_EL';

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