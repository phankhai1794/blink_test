import { subMonths } from 'date-fns';
import { formatDate } from '@shared';

import * as Actions from '../actions/dashboard';

const end = new Date();
const start = subMonths(end, 1);
const settings = JSON.parse(localStorage.getItem('cdboard') || '{}');

const initialState = {
  page: { currentPageNumber: 1, pageSize: settings.pageSize || 10 },
  columns: settings.columns || {
    etd: true,
    status: true,
    inquiry: true,
    amendment: true,
    resolve: true,
    // lane: false,
    vvd: true,
    pol: false,
    pod: false,
    del: false,
    // bdr: false,
    // pendingAgeing: false,
    eta: false,
    shipperN: false,
  },
  searchQueueQuery: {
    bookingNo: settings.bookingNo || '',
    from: settings.from || formatDate(start, 'YYYY-MM-DD'),
    to: settings.to || formatDate(end, 'YYYY-MM-DD'),
    blStatus: settings.blStatus || 'PENDING,IN_QUEUE',
    sortField: settings.sortField || ''
  },
  isReset: false
};

const dashboardReducer = function (state = initialState, action) {
  switch (action.type) {
  case Actions.SEARCH_QUEUE_QUERY: {
    return { ...state, searchQueueQuery: action.state };
  }
  case Actions.SET_PAGE: {
    return { ...state, page: { currentPageNumber: action.page, pageSize: action.size } };
  }
  case Actions.SET_COLUMN: {
    return { ...state, columns: action.state };
  }
  case Actions.SET_RESET: {
    return { ...state, isReset: action.state };
  }
  default: {
    return state;
  }
  }
};

export default dashboardReducer;
