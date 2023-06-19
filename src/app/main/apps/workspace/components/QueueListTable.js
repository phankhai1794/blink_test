import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, Tooltip, Chip, Icon, FormControl, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { getQueueList } from 'app/services/myBLService';
import { formatDate } from '@shared';
import Pagination from '../shared-components/Pagination';
import * as InquiryActions from 'app/main/apps/workspace/store/actions/inquiry';
import clsx from 'clsx';
import HelpIcon from '@material-ui/icons/Help';
import EditIcon from '@material-ui/icons/Edit';
import ReplyIcon from '@material-ui/icons/Reply';

const useStyles = makeStyles({
  root: {
    width: "100%",
    overflowX: 'auto',
  },
  container: {
    display: 'flex',
    justifyContent: 'end',
    margin: 10,
    '& a': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '10px',
      width: '34px',
      height: '34px',
      border: '1px solid #E2E6EA',
      backgroundColor: '#FFFFFF',
      color: '#132535',
      textDecoration: 'none',
      margin: '5px',
      cursor: 'pointer',
    }
  },
  pagination: {
    display: 'flex',
    position: 'absolute',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bottom: '-10px',
  },
  table: {
    minWidth: 650,
    '& span': {
      fontFamily: 'Montserrat',
    }
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '20px',
  },
  searchIcon: {
    marginRight: '10px',
  },
  clearIcon: {
    cursor: 'pointer',
  },
  filterFormControl: {
    minWidth: 120,
    marginLeft: '20px',
  },
  headerColor: {
    backgroundColor: '#FDF2F2',
    '& .MuiTableCell-head ': {
      color: '#333333'
    },
  },
  iconDownload: {
    paddingRight: '12px'
  },
  btnDownload: {
    textTransform: 'none',
    fontFamily: 'Montserrat',
    color: '#BD0F72',
  },
  btnAddColumn: {
    '&:hover': {
      color: '#BD0F72',
      cursor: 'pointer',
    }
  },
  lineColumn: {
    borderRight: '2px solid #BD0F72',
    lineHeight: 'initial',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& img': {
      width: '24px',
      height: '14px',
      cursor: 'pointer',
      marginRight: '22px',
    }
  },
  link: {
    color: '#333333',
    textDecoration: 'none',
    '&:hover': {
      color: '#BD0F72',
      fontWeight: '600',
    }
  },
  label: {
    display: 'flex',
    // justifyContent: 'space-evenly'
  },
  labelPending: {
    backgroundColor: '#FDF2F2',
    color: '#BD0F72',
    padding: '3px 4px',
    borderRadius: '4px',
  },
  labelReplies: {
    backgroundColor: '#EAF2FD',
    color: '#2F80ED',
    padding: '3px 4px',
    borderRadius: '4px',
  },
  labelResolved: {
    backgroundColor: '#EBF7F2',
    color: '#36B37E',
    padding: '3px 8px',
    borderRadius: '4px',
  },
  chips: {
    display: 'flex',
  },
  chip: {
    color: '#FFFF',
    borderRadius: '4px',
    height: 26,
    width: 56,
    margin: 2,
  },
  inquiryColor: {
    backgroundColor: '#FDF2F2',
    color: '#DC2626'
  },
  amendmentColor: {
    backgroundColor: '#FEF4E6',
    color: '#F39200'
  },
  replyColor: {
    backgroundColor: '#EAF2FD',
    color: '#2F80ED'
  },
  sizeIcon: {
    fontSize: '18px',
  },
  resolvedColor: {
    backgroundColor: '#EBF7F2',
    color: '#36B37E',
  },
  selectStatus: {
    margin: 'auto',
    border: '1px solid #E2E6EA',
    backgroundColor: 'white',
    padding: '0 12px',
    borderRadius: 4
  },
});

const QueueListTable = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [state, setState] = useState({ queueListBl: [], totalBkgNo: 1, sortBkgNo: 'asc', sortLatestDate: 'asc', sortStatus: 'asc' })
  const searchQueueQuery = useSelector(({ workspace }) => workspace.inquiryReducer.searchQueueQuery);

  useEffect(() => {
    const handleGetQueueList = async (search) => {
      const query = {
        bkgNo: search.bookingNo ? search.bookingNo.split(',').map(bkg => bkg.trim()) : [],
        startDate: search.from,
        endDate: search.to,
        status: search.blStatus,
        field: search.sortField
      };
      const { total, dataResult } = await getQueueList(search.currentPageNumber, search.pageSize, query);
      setState({ ...state, queueListBl: dataResult, totalBkgNo: total })
    }
    handleGetQueueList(searchQueueQuery);
  }, [searchQueueQuery]);

  // TODO: Download - TBU
  const handleDownload = () => {
    alert('Download Success!')
  };

  // TODO: Add Column  - TBU
  const handleAddColumn = () => {
    alert('Add Column Success!')
  };

  const handleSort = (query, column) => {
    let tempQuery = query;
    if (tempQuery.indexOf('asc') !== -1) {
      tempQuery = tempQuery.replace('asc', 'desc');
    } else {
      tempQuery = tempQuery.replace('desc', 'asc');
    }
    switch (column) {
      case 'bkgNo':
        setState({ ...state, sortBkgNo: (state.sortBkgNo === 'asc') ? 'desc' : 'asc', sortLatestDate: 'asc', sortStatus: 'asc' });
        break;
      case 'latestDate':
        setState({ ...state, sortBkgNo: 'asc', sortLatestDate: (state.sortLatestDate === 'asc') ? 'desc' : 'asc', sortStatus: 'asc' });
        break;
      case 'status':
        setState({ ...state, sortBkgNo: 'asc', sortLatestDate: 'asc', sortStatus: (state.sortStatus === 'asc') ? 'desc' : 'asc' });
        break;
      default:
        setState({ ...state, sortBkgNo: 'asc', sortLatestDate: 'asc', sortStatus: 'asc' });
        break;
    }
    dispatch(InquiryActions.searchQueueQuery({ ...searchQueueQuery, sortField: tempQuery }));
  };

  const showItems = (e) => {
    searchQueueQuery.currentPageNumber > Math.ceil(state.totalBkgNo / e.target.value) ?
      dispatch(InquiryActions.searchQueueQuery({ ...searchQueueQuery, pageSize: e.target.value, currentPageNumber: Math.ceil(state.totalBkgNo / e.target.value) }))
      :
      dispatch(InquiryActions.searchQueueQuery({ ...searchQueueQuery, pageSize: e.target.value }))
  }

  return (
    <div style={{ padding: '20px', height: '695px' }}>
      {/* TODO: TBU */}
      {/* <div className={classes.searchContainer}>
        <Button
          variant='text'
          className={classes.btnDownload}
          onClick={handleDownload}
        >
          <img src='/assets/images/icons/icon-download.svg' style={{ paddingRight: '10px' }} />
          <span>Download</span>
        </Button>
      </div> */}
      {(state?.queueListBl.length > 0) ?
        <>
          <div className={classes.container}>
            <Pagination
              currentNumber={searchQueueQuery.currentPageNumber}
              totalPage={searchQueueQuery.totalPageNumber}
              totalBkgNo={state.totalBkgNo}
              query={searchQueueQuery}
              searchQueueQuery={(search) => dispatch(InquiryActions.searchQueueQuery({ ...searchQueueQuery, ...search }))}
            />
            <FormControl variant='outlined' className={classes.formControl}>
              <Select
                className={classes.selectStatus}
                value={searchQueueQuery.pageSize}
                onChange={showItems}
                disableUnderline
              >
                {
                  [5, 10, 15].map(val =>
                    <MenuItem key={val} classes={{ selected: classes.menuItemSelected }} value={val}>
                      Show {val} items
                    </MenuItem>

                  )}
              </Select>
            </FormControl>
          </div>
          <div style={{ width: '100%', overflowX: 'auto', maxHeight: '90%' }}>
            <Table className={classes.table} aria-label='simple table'>
              <TableHead className={classes.headerColor} style={{ backgroundColor: '#FDF2F2', position: 'sticky', top: 0, zIndex: 2 }}>
                <TableRow>
                  <TableCell >
                    <div className={classes.lineColumn}>
                      <span>No.</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={classes.lineColumn}>
                      <span>Booking Number</span>
                      <img src='/assets/images/icons/Icon-sort.svg' onClick={() => handleSort(`bkgNo&order=${state.sortBkgNo}`, 'bkgNo')} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={classes.lineColumn}>
                      <span>Last Updated</span>
                      <img src='/assets/images/icons/Icon-sort.svg' onClick={() => handleSort(`latestDate&order=${state.sortLatestDate}`, 'latestDate')} />
                    </div>
                  </TableCell>
                  {/* <TableCell>
                    <div className={classes.lineColumn}>
                      <span>ETD</span>
                      <img src='/assets/images/icons/Icon-sort.svg' />
                    </div>
                  </TableCell> */}
                  <TableCell>
                    <div className={classes.lineColumn}>
                      <span>Status</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={classes.lineColumn}>
                      <span>Unresolved Inquiry</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={classes.lineColumn}>
                      <span>Unresolved Amendment</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <span>Resolved</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {/* TBU */}
                    {/* <Tooltip title='Add a column'>
                      <ControlPoint className={classes.btnAddColumn} fontSize='small' onClick={handleAddColumn} />
                    </Tooltip> */}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state?.queueListBl.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell component='th' scope='row'>
                      {/* TODO: No. function */}
                      {index + (searchQueueQuery.currentPageNumber - 1) * searchQueueQuery.pageSize + 1}
                    </TableCell>
                    <TableCell component='th' scope='row'>
                      <a href={`/guest?bl=${row.id}`} target='_blank' className={classes.link} rel="noreferrer"><span>{row.bookingNo}</span></a>
                    </TableCell>
                    <TableCell >{formatDate(row.latestDate, 'MMM - DD - YYYY HH:mm')}</TableCell>
                    {/* <TableCell ><span>{row.etd}</span></TableCell> */}
                    <TableCell ><span style={{ textTransform: 'capitalize' }}>{row?.status ? row?.status.replace('_', ' ').toLowerCase() : ''}</span></TableCell>
                    {/* Inquiries */}
                    <TableCell >
                      <div className={classes.label}>
                        <Tooltip title={'Inquiries'} placement='bottom-end'>
                          <div className={classes.chips}>
                            {row.countPendingInq ? <Chip label={row.countPendingInq} className={clsx(classes.chip, classes.inquiryColor)} icon={<HelpIcon className={clsx(classes.sizeIcon, classes.inquiryColor)} />} /> : ''}
                          </div>
                        </Tooltip>
                        <Tooltip title={'New Replies'} placement='bottom-end'>
                          <div className={classes.chips}>
                            {row.countNewReplyInq ? <Chip label={row.countNewReplyInq} className={clsx(classes.chip, classes.replyColor)} icon={<ReplyIcon className={clsx(classes.sizeIcon, classes.replyColor)} />} /> : ''}
                          </div>
                        </Tooltip>
                      </div>
                    </TableCell>
                    {/* Amendments */}
                    <TableCell >
                      <div className={classes.label}>
                        <Tooltip title={'Amendments'} placement='bottom-end'>
                          <div className={classes.chips}>
                            {row.countPendingAme ? <Chip label={row.countPendingAme} className={clsx(classes.chip, classes.amendmentColor)} icon={<EditIcon className={clsx(classes.sizeIcon, classes.amendmentColor)} />} /> : ''}
                          </div>
                        </Tooltip>
                        <Tooltip title={'New Replies'} placement='bottom-end'>
                          <div className={classes.chips}>
                            {row.countNewReplyAmend ? <Chip label={row.countNewReplyAmend} className={clsx(classes.chip, classes.replyColor)} icon={<ReplyIcon className={clsx(classes.sizeIcon, classes.replyColor)} />} /> : ''}
                          </div>
                        </Tooltip>
                      </div>
                    </TableCell>
                    <TableCell >
                      <div className={classes.label}>
                        {row?.countAllInq ?
                          <Chip
                            label={`${row.countInqResolved}/${row.countAllInq}`}
                            className={clsx(classes.chip, classes.resolvedColor)}
                            icon={
                              <Icon className={clsx(classes.sizeIcon, classes.resolvedColor)}>
                                help
                              </Icon>
                            }
                          />
                          : ''}
                        {row.countAllAme ?
                          <Chip
                            label={`${row.countAmeResolved}/${row.countAllAme}`}
                            className={clsx(classes.chip, classes.resolvedColor)}
                            icon={
                              <Icon className={clsx(classes.sizeIcon, classes.resolvedColor)}>
                                edit
                              </Icon>
                            }
                          />
                          : ''}
                      </div>
                    </TableCell>
                    <TableCell />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
        :
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 'auto', color: '#515F6B' }}>
          <img
            src="assets/images/icons/noData.svg"
            alt="No data"
          />
          <span style={{ fontWeight: 600, fontSize: 24, margin: '10px 0' }}>No data found</span>
          <span>Please try another search, keywords or filters.</span>
        </div>
      }
    </div>
  )
}

export default QueueListTable;