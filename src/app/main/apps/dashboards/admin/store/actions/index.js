export const SEARCH_QUEUE_QUERY = 'SEARCH_QUEUE_QUERY';
export const FILTER_COUNTRY = 'FILTER_COUNTRY';
export const SET_PAGE = 'SET_PAGE';
export const SET_COLUMN = 'SET_COLUMN';
export const SET_RESET = 'SET_RESET';
export const SET_OFFICE = 'SET_OFFICE';

export function searchQueueQuery(state) {
  return {
    type: SEARCH_QUEUE_QUERY,
    state: state
  };
}

export function filterCountry(state) {
  return {
    type: FILTER_COUNTRY,
    state: state
  };
}

export function setPage(page, size) {
  return {
    type: SET_PAGE,
    page,
    size
  };
}

export function setColumn(state) {
  return {
    type: SET_COLUMN,
    state
  };
}

export function setReset(state) {
  return {
    type: SET_RESET,
  }
}

export function setOffice(state) {
  return {
    type: SET_OFFICE,
    state
  };
}