import axios from 'axios';

export const GET_CONTACTS = '[CHAT PANEL] GET CONTACTS';
export const SET_SELECTED_CONTACT_ID = '[CHAT PANEL] SET SELECTED CONTACT ID';
export const REMOVE_SELECTED_CONTACT_ID = '[CHAT PANEL] REMOVE SELECTED CONTACT ID';

export function getContacts() {
  const request = axios.get('/api/chat/contacts');
  return (dispatch) =>
    request.then((response) =>
      dispatch({
        type: GET_CONTACTS,
        payload: response.data
      })
    );
}

export function setselectedContactId(contactId) {
  return {
    type: SET_SELECTED_CONTACT_ID,
    payload: contactId
  };
}

export function removeSelectedContactId() {
  return {
    type: REMOVE_SELECTED_CONTACT_ID
  };
}
