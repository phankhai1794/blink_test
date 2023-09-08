import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Paper,
  Select,
  MenuItem,
  Input,
  Checkbox,
  ListItemText,
  Chip,
  Grid,
  Icon,
  Switch
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { formatDate } from '@shared';
import clsx from 'clsx';
import { mapperBlinkStatus, mapperBlinkStatusCustomer } from '@shared/keyword';
import { DateRangePicker, defaultStaticRanges } from 'react-date-range';
import { subMonths, addDays, subDays } from 'date-fns';

import * as Actions from '../store/actions';

import QueueListTable from './QueueListTable';

import { setLocalStorageItem } from './';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

const useStyles = makeStyles((theme) => ({
  headerPopup: {
    borderBottom: '1px solid #8A97A3',
    '& h6': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontFamily: 'Montserrat'
    }
  },
  bodyPopup: {
    backgroundColor: '#FFF9F9'
  },
  btn: {
    textTransform: 'none',
    backgroundColor: '#BD0F72',
    borderRadius: '8px',
    '&:hover': {
      backgroundColor: '#BD0F73'
    }
  },
  btnIsMe: {
    textTransform: 'none',
    backgroundColor: 'green',
    borderRadius: '25px',
    marginLeft: 10,
    '&:hover': {
      backgroundColor: 'green'
    }
  },
  btnSearch: {
    color: '#FFFF',
    fontFamily: 'Montserrat'
  },
  btnBackGround: {
    backgroundColor: '#646e779c',
    '& .MuiButton-label': {
      color: 'white'
    },
    '&:hover': {
      backgroundColor: '#646e779c'
    }
  },
  closeBtn: {
    cursor: 'pointer'
  },
  popupContent: {
    '& .MuiDialog-paper': {
      margin: '0px'
    }
  },
  paper: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '24px',
    '& span': {
      fontFamily: 'Montserrat'
    },
    '& input': {
      fontFamily: 'Montserrat',
      fontSize: '14px'
    },
    '& .MuiGrid-grid-xs-2': {
      flexBasis: '21%',
      // maxWidth: '17%',
      display: 'flex'
      // justifyContent: 'space-around'
    }
  },
  searchBox: {
    height: '40px'
  },
  btnReset: {
    textTransform: 'none',
    fontFamily: 'Montserrat',
    color: '#BD0F72'
  },
  selectStatus: {
    // minWidth: '285px',
    '& :focus': {
      backgroundColor: 'transparent'
    }
  },
  chips: {
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  chip: {
    backgroundColor: '#E2E6EA',
    borderRadius: '4px',
    height: '24px',
    margin: 2
  },
  menuItem: {
    '&:hover': {
      backgroundColor: '#FDF2F2'
    }
  },
  menuItemSelected: {
    backgroundColor: '#FDF2F2 !important'
  },
  grid: {
    '& .MuiGrid-grid-xs-4': {
      flexBasis: '33%',
      maxWidth: '30%'
    },
    '& .MuiGrid-grid-xs-3': {
      flexBasis: '23%',
      maxWidth: '23%'
    },
    '& .MuiGrid-grid-xs-1': {
      flexBasis: '11%',
      maxWidth: '11%'
    }
  },
  styleSearch: {
    '& .MuiSwitch-colorSecondary.Mui-checked': {
      color: 'white'
    },
    '& .MuiSwitch-colorSecondary.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#36B37E'
    },
    [theme.breakpoints.down('sm')]: {
      '& .MuiButton-root': {
        lineHeight: 0
      },
      '& .MuiButton-label': {
        fontSize: '10px !important'
      },
      '& .MuiSvgIcon-root': {
        fontSize: '2rem'
      }
    },
    [theme.breakpoints.down('md')]: {
      '& .MuiButton-root': {
        lineHeight: 0
      },
      '& .MuiButton-label': {
        fontSize: '10px !important'
      },
      '& .MuiSvgIcon-root': {
        fontSize: '2rem'
      }
    },
    [theme.breakpoints.down('lg')]: {
      '& .MuiButton-root': {
        lineHeight: 0
      },
      '& .MuiButton-label': {
        fontSize: '11px !important'
      },
      '& .MuiSvgIcon-root': {
        fontSize: '2rem'
      }
    },
    [theme.breakpoints.up('xl')]: {
      '& .MuiButton-root': {
        lineHeight: 0
      },
      '& .MuiButton-label': {
        fontSize: 12
      }
    }
  }
}));

const QueueList = () => {
  return (
    <>
      <SearchLayout />
      <QueueListTable />
    </>
  );
};

const SearchLayout = (props) => {
  const end = new Date();
  const start = subMonths(end, 1);
  const classes = useStyles();
  const dispatch = useDispatch();
  const userType = useSelector(({ user }) => user.userType);
  const settings = JSON.parse(localStorage.getItem('dashboard') || '{}');

  const getBlinkStatus = userType === 'ONSHORE' ? mapperBlinkStatusCustomer : mapperBlinkStatus;
  const blStatusOption = Object.keys(getBlinkStatus);
  const initialState = {
    bookingNo: '',
    from: start,
    to: end,
    blStatus: blStatusOption
  };
  const [state, setState] = useState({
    bookingNo: settings.bookingNo || '',
    from: settings.from || start,
    to: settings.to || end,
    blStatus: settings.blStatus || blStatusOption,
    isMe: false
  });
  const [isMe, setIsMe] = useState(false);
  const searchQueueQuery = useSelector(({ dashboard }) => dashboard.searchQueueQuery);
  const [startingDate, setStartingDate] = useState('');
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [labelDate, setLabelDate] = useState();
  const pickerRef = useRef(null);

  const handleSelectStatus = (event) => {
    let values = event.target.value;
    if (values.indexOf('All') !== -1 && values.indexOf('All') === values.length - 1) {
      if (values.length <= blStatusOption.length) {
        setState({ ...state, blStatus: blStatusOption });
        setLocalStorageItem('blStatus', blStatusOption);
      } else {
        setState({ ...state, blStatus: [] });
        setLocalStorageItem('blStatus', []);
      }
    } else {
      setState({ ...state, blStatus: values });
      setLocalStorageItem('blStatus', values);
    }
  };

  const handleChange = (query) => {
    setState({ ...state, ...query });
  };

  const handleSearch = () => {
    setLocalStorageItem('bookingNo', state.bookingNo);
    dispatch(Actions.searchQueueQuery({ ...searchQueueQuery, ...state }));
  };

  const handleToogleMyBl = () => {
    const getIsMe = !isMe;
    setIsMe(getIsMe);
    const searchState = {
      bookingNo: settings.bookingNo || '',
      from: settings.from || start,
      to: settings.to || end,
      blStatus: settings.blStatus || blStatusOption,
      isMe: getIsMe
    };
    setState({ ...searchState });
    dispatch(Actions.searchQueueQuery({ ...searchQueueQuery, ...searchState }));
  };

  const handleReset = () => {
    setState(initialState);

    dispatch(Actions.setReset(true));
    dispatch(Actions.setPage(1, 10));
    dispatch(
      Actions.setColumn({
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
      })
    );

    const query = { ...initialState, sortField: ['lastUpdated', 'DESC'], isMe: false };
    dispatch(Actions.searchQueueQuery({ ...searchQueueQuery, ...query }));
    if (userType === 'ONSHORE') setIsMe(false)

    localStorage.removeItem('dashboard');
  };

  const handleClickOutside = (event) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target)) {
      setPickerOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getLabelDate = (startDate, endDate) => {
    return defaultStaticRanges.find(
      (date) =>
        formatDate(date.range().startDate, 'MMM DD YYYY') ===
          formatDate(startDate, 'MMM DD YYYY') &&
        formatDate(date.range().endDate, 'MMM DD YYYY') === formatDate(endDate, 'MMM DD YYYY')
    )?.label;
  };

  const handleDateChange = (ranges) => {
    const { startDate, endDate } = ranges.selection;

    const maxEndDate = addDays(startDate, 30);
    const minStartDate = subDays(endDate, 30);
    if (startDate.getTime() === endDate.getTime()) setStartingDate(endDate);

    // If the selected end date is beyond the maximum, adjust it
    let from = '';
    let to = '';
    if (startDate < startingDate) {
      from = startDate < minStartDate ? minStartDate : startDate;
      to = endDate;
    } else {
      from = startDate;
      to = endDate > maxEndDate ? maxEndDate : endDate;
    }
    handleChange({ from, to });
    setLabelDate(getLabelDate(from, to));
    setLocalStorageItem('from', from);
    setLocalStorageItem('to', to);
  };

  const onPaste = (e) => {
    e.preventDefault();
    const { bookingNo } = state;
    const bkgNosPaste = [
      e.clipboardData
        .getData('text')
        .split(/\n/) // split new line
        .map((str) => str.trim()) // trim space
        .filter((str) => str) // filter empty string
    ].join(', ');
    const bkgSearch = bookingNo + bkgNosPaste;
    const bkgNoArr = [...new Set(bkgSearch.split(','))].join();
    handleChange({ bookingNo: bkgNoArr });
  };

  return (
    <Paper className={classes.paper}>
      <Grid container spacing={1} className={classes.grid}>
        {/* Booking Number */}
        <Grid item xs={4} sm={3} md={3} lg={3} xl={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>
              <span>Booking Number</span>
            </InputLabel>
            <OutlinedInput
              value={state.bookingNo}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              inputProps={{ style: { textTransform: 'uppercase' } }}
              onChange={(e) => handleChange({ bookingNo: e.target.value.replace(/\s+|;+/g, ',') })}
              onPaste={onPaste}
              startAdornment={
                <InputAdornment className={classes.searchBox} position="start">
                  {''}
                </InputAdornment>
              }
              labelWidth={120}
            />
          </FormControl>
        </Grid>
        {/* From */}
        <Grid item xs={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>
              <span>Date</span>
            </InputLabel>
            <OutlinedInput
              value={
                labelDate ||
                `${formatDate(state.from, 'MMM DD YYYY')} - ${formatDate(state.to, 'MMM DD YYYY')}`
              }
              endAdornment={<Icon fontSize="small">calendar_today</Icon>}
              onClick={() => setPickerOpen(true)}
              inputProps={{
                readOnly: true
              }}
              labelWidth={35}
            />
            {isPickerOpen && (
              <div ref={pickerRef}>
                <DateRangePicker
                  ranges={[
                    {
                      startDate: new Date(state.from),
                      endDate: new Date(state.to),
                      key: 'selection'
                    }
                  ]}
                  onChange={handleDateChange}
                />
              </div>
            )}
          </FormControl>
        </Grid>
        {/* BL Status */}
        <Grid item xs={4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="selected-status">
              <span>BLink Status</span>
            </InputLabel>
            <OutlinedInput
              onChange={(e) => handleChange({ blStatus: e.target.value })}
              inputProps={{
                style: { width: 0 }
              }}
              startAdornment={
                <Select
                  className={classes.selectStatus}
                  multiple
                  value={state.blStatus}
                  onChange={handleSelectStatus}
                  input={<Input style={{ width: '100%' }} />}
                  renderValue={(selected) => (
                    <div className={classes.chips}>
                      {selected.map((value) => (
                        <Chip key={value} label={getBlinkStatus[value]} className={classes.chip} />
                      ))}
                    </div>
                  )}
                  disableUnderline>
                  <MenuItem
                    key={'All'}
                    value={'All'}
                    classes={{ selected: classes.menuItemSelected }}>
                    <Checkbox
                      checked={state.blStatus.length === blStatusOption.length}
                      color="primary"
                    />
                    <span style={{ fontFamily: 'Montserrat', fontSize: '14px' }}>All</span>
                  </MenuItem>
                  {blStatusOption.map((status) => (
                    <MenuItem
                      key={status}
                      classes={{ selected: classes.menuItemSelected }}
                      value={status}>
                      <Checkbox checked={state.blStatus.indexOf(status) > -1} color="primary" />
                      <span style={{ fontFamily: 'Montserrat', fontSize: '14px' }}>
                        {getBlinkStatus[status]}
                      </span>
                    </MenuItem>
                  ))}
                </Select>
              }
              labelWidth={90}
            />
          </FormControl>
        </Grid>
        {/*Search*/}
        <Grid item xs={2} style={{ margin: 'auto' }} className={classes.styleSearch}>
          <Button className={clsx(classes.btn, classes.btnSearch)} onClick={handleSearch}>
            <SearchIcon />
            <span>Search</span>
          </Button>
          {userType === 'ONSHORE' ? (
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 10 }}>
              <span style={{ paddingRight: 1, fontSize: 13, fontWeight: 600 }}>MyBLs</span>
              <Switch checked={isMe} onChange={handleToogleMyBl} />
            </div>
          ) : (
            ``
          )}
          <Button
            className={classes.btnReset}
            variant="text"
            style={{ backgroundColor: 'transparent' }}
            onClick={handleReset}>
            <span className="underline">
              <span>Reset</span>
            </span>
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default QueueList;
