import { mapperBlinkStatus } from '@shared/keyword';
import { subMonths } from 'date-fns';
import { formatDate } from '@shared';

import * as Actions from '../actions';

const end = new Date();
const start = subMonths(end, 1);
const initialState = {
  page: { currentPageNumber: 1, pageSize: 10 },
  searchQueueQuery: {
    bookingNo: '',
    from: formatDate(start, 'YYYY-MM-DD'),
    to: formatDate(end, 'YYYY-MM-DD'),
    blStatus: Object.keys(mapperBlinkStatus),
    sortField: ['lastUpdated', 'DESC'],
    countries: null
  },
  countries: ''
}

const dashboardReducer = function (state = initialState, action) {
  switch (action.type) {
  case Actions.SEARCH_QUEUE_QUERY: {
    return { ...state, searchQueueQuery: action.state };
  }
  case Actions.FILTER_COUNTRY: {
    return { ...state, countries: action.state };
  }
  case Actions.SET_PAGE: {
    return { ...state, page: { currentPageNumber: action.page, pageSize: action.size } };
  }
  default: {
    return state;
  }
  }
}

export default dashboardReducer;
