export const SEARCH_QUEUE_QUERY = 'SEARCH_QUEUE_QUERY';
export const SET_PAGE = 'SET_PAGE';

export function setPage(page, size) {
  return {
    type: SET_PAGE,
    page,
    size
  };
}
export function searchQueueQuery(state) {
  return {
    type: SEARCH_QUEUE_QUERY,
    state: state
  };
}