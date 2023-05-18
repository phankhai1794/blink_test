export const SEARCH_QUEUE_QUERY = 'SEARCH_QUEUE_QUERY';

export function searchQueueQuery(state) {
  return {
    type: SEARCH_QUEUE_QUERY,
    state: state
  };
}