import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, Tooltip, Chip, Icon } from '@material-ui/core';
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
  container: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '16px',
    paddingBottom: '16px',
    '& a': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '10px',
      width: '40px',
      height: '43px',
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
    height: '24px',
    width: '53px',
    margin: 2,
  },
  inquiryColor: {
    backgroundColor: '#DC2626',
  },
  amendmentColor: {
    backgroundColor: '#ECC083',
  },
  replyColor: {
    backgroundColor: '#2F80ED'
  },
  sizeIcon: {
    fontSize: '18px',
  },
  iconColor: {
    color: '#FFFF'
  },
  resolvedColor: {
    backgroundColor: '#EBF7F2',
    color: '#36B37E',
  }
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

  return (
    <div style={{ padding: '22px', height: '675px' }}>
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
        <div component={Paper}>
          <Table className={classes.table} aria-label='simple table'>
            <TableHead className={classes.headerColor}>
              <TableRow>
                <TableCell>
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
                    <span>Unresolved</span>
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
                    {index + 1}
                  </TableCell>
                  <TableCell component='th' scope='row'>
                    <a href={`/guest?bl=${row.id}`} target='_blank' className={classes.link} rel="noreferrer"><span>{row.bookingNo}</span></a>
                  </TableCell>
                  <TableCell >{formatDate(row.latestDate, 'MMM - DD - YYYY HH:mm')}</TableCell>
                  {/* <TableCell ><span>{row.etd}</span></TableCell> */}
                  <TableCell ><span style={{ textTransform: 'capitalize' }}>{row?.status.toLowerCase()}</span></TableCell>
                  <TableCell >
                    <div className={classes.label}>
                      <Tooltip title={'Inquiry'} placement='bottom-end'>
                        <div className={classes.chips}>
                          <Chip label={row.countPendingInq} className={clsx(classes.chip, classes.inquiryColor)} icon={<HelpIcon className={clsx(classes.sizeIcon, classes.iconColor)} />} />
                        </div>
                      </Tooltip>
                      <Tooltip title={'Amendment'} placement='bottom-end'>
                        <div className={classes.chips}>
                          <Chip label={row.countPendingAme} className={clsx(classes.chip, classes.amendmentColor)} icon={<EditIcon className={clsx(classes.sizeIcon, classes.iconColor)} />} />
                        </div>
                      </Tooltip>
                      <Tooltip title={'New Replies'} placement='bottom-end'>
                        <div className={classes.chips}>
                          <Chip label={row.countNewReply} className={clsx(classes.chip, classes.replyColor)} icon={<ReplyIcon className={clsx(classes.sizeIcon, classes.iconColor)} />} />
                        </div>
                      </Tooltip>
                      {/* <div style={{ minWidth: '75px' }}>
                        {row?.countNewReply ?
                          <span className={classes.labelReplies}>{`${row.countNewReply} New Replies`}</span> : <span />
                        }
                      </div> */}
                    </div>
                  </TableCell>
                  <TableCell >
                    <div className={classes.label}>
                      {row.countPendingInq ?
                        <Chip
                          label={`${row.countInqResolved}/${row.countAllInq}`}
                          className={clsx(classes.chip, classes.resolvedColor)}
                          icon={
                            <Icon className={clsx(classes.sizeIcon, classes.resolvedColor)}>
                              help
                            </Icon>
                          }
                        /> :
                        null
                      }
                      {row.countPendingAme ?
                        <Chip
                          label={`${row.countAmeResolved}/${row.countAllAme}`}
                          className={clsx(classes.chip, classes.resolvedColor)}
                          icon={
                            <Icon className={clsx(classes.sizeIcon, classes.resolvedColor)}>
                              edit
                            </Icon>
                          }
                        /> :
                        null
                      }
                    </div>
                  </TableCell>
                  <TableCell />
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className={classes.container}>
            <div className={classes.pagination}>
              <Pagination
                currentNumber={searchQueueQuery.currentPageNumber}
                totalPage={searchQueueQuery.totalPageNumber}
                totalBkgNo={state.totalBkgNo}
                query={searchQueueQuery}
                searchQueueQuery={(search) => dispatch(InquiryActions.searchQueueQuery({ ...searchQueueQuery, ...search }))}
              />
            </div>
          </div>
        </div>
        : <span>No data!</span>
      }
    </div>
  )
}

export default QueueListTable;