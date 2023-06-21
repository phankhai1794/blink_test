export const SEARCH_QUEUE_QUERY = 'SEARCH_QUEUE_QUERY';
export const FILTER_COUNTRY = 'FILTER_COUNTRY';

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