export const SHOW_BTN_DRAFT_BL = 'SHOW_BTN_DRAFT_BL';
export const SHOW_BTN_EDIT = 'SHOW_BTN_EDIT';

export function showBtnDraftBL(state)
{
    return {
        type: SHOW_BTN_DRAFT_BL,
        state: state
    }
}

export function showBtnEdit(state)
{
    return {
        type: SHOW_BTN_EDIT,
        state: state
    }
}