import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, Tooltip, Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import ControlPoint from '@material-ui/icons/ControlPoint';
import { getQueueList } from 'app/services/myBLService';
import { formatDate } from '@shared';
import Pagination from '../shared-components/Pagination';
import * as InquiryActions from 'app/main/apps/workspace/store/actions/inquiry';
import clsx from 'clsx';
import HelpIcon from '@material-ui/icons/Help';
import EditIcon from '@material-ui/icons/Edit';
import ReplyIcon from '@material-ui/icons/Reply';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
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
  }
});

const QueueListTable = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [state, setState] = useState({ queueListBl: [], totalBkgNo: 1, sortBkgNo: 'asc', sortLatestDate: 'asc', sortStatus: 'asc' })
  const searchQueueQuery = useSelector(({ workspace }) => workspace.inquiryReducer.searchQueueQuery);

  useEffect(() => {
    const handleGetQueueList = async (search) => {
      const { total, dataResult } = await getQueueList(search.currentPageNumber, search.pageSize, `bkgNo=${search.bookingNo}&startDate=${search.from}&endDate=${search.to}&status=${search.blStatus}&field=${search.sortField}`);
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
                  <div className={classes.lineColumn}>No.</div>
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
                  <div className={classes.lineColumn}>Unresolved</div>
                </TableCell>
                <TableCell>
                  <div>Resolved</div>
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
                  <TableCell >{formatDate(row.latestDate, 'DD/MM/YYYY hh:mm')}</TableCell>
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
                    {row?.countAll ?
                      <span className={classes.labelResolved}>{`${row.countResolved}/${row.countAll} Resolved`}</span> : ''
                    }
                  </TableCell>
                  <TableCell />
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination currentNumber={searchQueueQuery.currentPageNumber} totalPage={searchQueueQuery.totalPageNumber} totalBkgNo={state.totalBkgNo} />
        </div>
        : <span>No data!</span>
      }
    </div>
  )
}

export default QueueListTable;

