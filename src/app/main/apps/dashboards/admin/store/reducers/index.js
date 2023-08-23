import { mapperBlinkStatus } from '@shared/keyword';
import { subMonths } from 'date-fns';
import { formatDate } from '@shared';

import * as Actions from '../actions';

const end = new Date();
const start = subMonths(end, 1);
const settings = JSON.parse(localStorage.getItem('dashboard') || '{}');
const foffice = JSON.parse(localStorage.getItem('foffice') || '""');

const initialState = {
  page: { currentPageNumber: 1, pageSize: settings.pageSize || 10 },
  columns: settings.columns || {
    etd: true,
    shipperN: false,
    customerS: true,
    onshoreS: true,
    blinkS: true,
    vvd: true,
    pol: false,
    pod: false,
    inquiry: true,
    amendment: true,
    resolve: true
  },
  searchQueueQuery: {
    bookingNo: settings.bookingNo || '',
    from: settings.from || formatDate(start, 'YYYY-MM-DD'),
    to: settings.to || formatDate(end, 'YYYY-MM-DD'),
    blStatus: settings.blStatus || Object.keys(mapperBlinkStatus),
    sortField: settings.sortField || ['lastUpdated', 'DESC'],
    countries: null
  },
  countries: [],
  isReset: false,
  office: foffice || []
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
  case Actions.SET_COLUMN: {
    return { ...state, columns: action.state };
  }
  case Actions.SET_RESET: {
    return { ...state, isReset: action.state };
  }
  case Actions.SET_OFFICE: {
    return { ...state, office: action.state };
  }
  default: {
    return state;
  }
  }
}

export default dashboardReducer;
