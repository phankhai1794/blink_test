import { mapperBlinkStatus } from '@shared/keyword';

import * as Actions from '../actions';

const initialState = {
  searchQueueQuery: {
    bookingNo: '',
    from: '',
    to: '',
    blStatus: Object.keys(mapperBlinkStatus),
    currentPageNumber: 1,
    pageSize: 10,
    totalPageNumber: 5,
    sortField: ''
  }
}

const dashboardReducer = function (state = initialState, action) {
  switch (action.type) {
  case Actions.SEARCH_QUEUE_QUERY: {
    return { ...state, searchQueueQuery: action.state };
  }
  default: {
    return state;
  }
  }
}

export default dashboardReducer;
