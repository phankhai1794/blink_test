import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, Tooltip, Chip, Icon, FormControl, Select, MenuItem, Menu } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { getQueueList } from 'app/services/myBLService';
import { formatDate } from '@shared';
import Pagination from '../shared-components/Pagination';
import * as InquiryActions from 'app/main/apps/workspace/store/actions/inquiry';
import clsx from 'clsx';
import HelpIcon from '@material-ui/icons/Help';
import EditIcon from '@material-ui/icons/Edit';
import ReplyIcon from '@material-ui/icons/Reply';
import { withStyles } from '@material-ui/core/styles';

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
    width: 'fit-content',
    '& span': {
      fontFamily: 'Montserrat',
    },
    borderCollapse: 'separate !important'
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
      fontSize: 14,
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
    },
    '& span': {
      textWrap: 'nowrap',
      paddingRight: '10px'
    }
  },
  lineMinWidth: {
    minWidth: '180px',
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
  cellBody: {
    padding: '0 10px',
    height: 50
  },
  cellSticky: {
    display: 'flex',
    alignItems: 'center',
    borderBottom: 0
  },
});

const StickyTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#FDF2F2',
    left: 0,
    position: 'sticky',
    zIndex: 2,
    boxShadow: 'rgba(100, 100, 111, 0.2) 5px 0 5px -1px',
    width: 220,
    padding: 10
  },
  body: {
    backgroundColor: 'white',
    left: 0,
    position: 'sticky',
    zIndex: 1,
    boxShadow: 'rgba(100, 100, 111, 0.2) 5px 0 5px -1px',
    width: 220,
    padding: 14
  }
}))(TableCell);

const AddColumn = (columns, handleShowColumn) => {
  const items = [
    { label: 'Last Updated', value: 'lastUpdate', show: columns['lastUpdate'] },
    { label: 'ETD', value: 'etd', show: columns['etd'] },
    { label: 'Status', value: 'status', show: columns['status'] },
    { label: 'Unresolved Inquiry', value: 'inquiry', show: columns['inquiry'] },
    { label: 'Unresolved Amendment', value: 'amendment', show: columns['amendment'] },
    { label: 'Resolved', value: 'resolve', show: columns['resolve'] },
    // { label: 'Lane', value: 'lane', show: columns['lane'] },
    { label: 'VVD', value: 'vvd', show: columns['vvd'] },
    { label: 'POL', value: 'pol', show: columns['pol'] },
    { label: 'POD', value: 'pod', show: columns['pod'] },
    { label: 'DEL', value: 'del', show: columns['del'] },
    // { label: 'BDR', value: 'bdr', show: columns['bdr'] },
    // { label: 'Pending Ageing', value: 'pendingAgeing', show: columns['pendingAgeing'] },
    { label: 'ETA', value: 'eta', show: columns['eta'] },
    { label: 'Shipper Name', value: 'shipperN', show: columns['shipperN'] },
  ];

  const handleClick = (value, display) => {
    handleShowColumn({ [value]: !display });
  };

  return (
    <div>
      <span
        style={{
          color: '#BD0F72',
          fontSize: 14,
          fontWeight: 600,
          fontFamily: 'Montserrat',
          padding: 14
        }}>
        {' '}
        SHOW FIELDS
      </span>
      {items.map((item, index) => (
        <MenuItem key={index} onClick={() => handleClick(item.value, item.show)}>
          <div className="w-full flex justify-between">
            <span style={{ fontFamily: 'Montserrat', fontSize: 14 }}> {item.label} </span>
            {item.show && <Icon color="primary">check</Icon>}
          </div>
        </MenuItem>
      ))}
    </div>
  );
};

const QueueListTable = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [state, setState] = useState({ queueListBl: [], totalBkgNo: 1, sortBkgNo: 'asc', sortLatestDate: 'asc', sortStatus: 'asc' })
  const searchQueueQuery = useSelector(({ workspace }) => workspace.inquiryReducer.searchQueueQuery);
  const [anchorEl, setAnchorEl] = useState(null);
  const initColumns = {
    lastUpdate: true,
    etd: true,
    status: true,
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
  };
  const [columns, setColumns] = useState(initColumns);

  useEffect(() => {
    const handleGetQueueList = async (search) => {
      const query = {
        bkgNo: search.bookingNo ? search.bookingNo.split(',').map(bkg => bkg.trim()) : [],
        startDate: search.from ? formatDate(search.from, 'YYYY-MM-DD') : '',
        endDate: search.to ? formatDate(search.to, 'YYYY-MM-DD') : '',
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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleShowColumn = (value) => {
    setColumns({ ...columns, ...value });
  };

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
                  <StickyTableCell style={{ display: 'flex' , paddingRight: '18px'}}>
                    <div className={clsx(classes.cellBody, classes.cellSticky)}>
                      <div className={classes.lineColumn}>
                        <span>No.</span>
                      </div>
                    </div>
                    <div className={clsx(classes.cellBody, classes.cellSticky)}>
                      <div className={classes.lineColumn}>
                        <span>Booking Number</span>
                        <img src='/assets/images/icons/Icon-sort.svg' onClick={() => handleSort(`bkgNo&order=${state.sortBkgNo}`, 'bkgNo')} />
                      </div>
                    </div>
                  </StickyTableCell>
                  {columns.lastUpdate && <TableCell>
                    <div className={clsx(classes.lineMinWidth, classes.lineColumn)}>
                      <span>Last Updated</span>
                      <img src='/assets/images/icons/Icon-sort.svg' onClick={() => handleSort(`latestDate&order=${state.sortLatestDate}`, 'latestDate')} />
                    </div>
                  </TableCell>}
                  {columns.etd && <TableCell>
                    <div className={clsx(classes.lineMinWidth, classes.lineColumn)}>
                      <span>ETD</span>
                    </div>
                  </TableCell>}
                  {columns.eta && <TableCell>
                    <div className={clsx(classes.lineMinWidth, classes.lineColumn)}>
                      <span>ETA</span>
                    </div>
                  </TableCell>}
                  {columns.status && <TableCell>
                    <div className={clsx(classes.lineMinWidth, classes.lineColumn)}>
                      <span>Status</span>
                    </div>
                  </TableCell>}
                  {columns.vvd && <TableCell>
                    <div className={clsx(classes.lineMinWidth, classes.lineColumn)}>
                      <span>VVD</span>
                    </div>
                  </TableCell>}
                  {columns.shipperN && <TableCell>
                    <div className={clsx(classes.lineMinWidth, classes.lineColumn)}>
                      <span>Shipper Name</span>
                    </div>
                  </TableCell>}
                  {columns.pol && <TableCell>
                    <div className={clsx(classes.lineMinWidth, classes.lineColumn)}>
                      <span>POL</span>
                    </div>
                  </TableCell>}
                  {columns.pod && <TableCell>
                    <div className={clsx(classes.lineMinWidth, classes.lineColumn)}>
                      <span>POD</span>
                    </div>
                  </TableCell>}
                  {columns.del && <TableCell>
                    <div className={clsx(classes.lineMinWidth, classes.lineColumn)}>
                      <span>DEL</span>
                    </div>
                  </TableCell>}
                  {columns.inquiry && <TableCell>
                    <div className={clsx(classes.lineMinWidth, classes.lineColumn)}>
                      <span>Unresolved Inquiry</span>
                    </div>
                  </TableCell>}
                  {columns.amendment && <TableCell>
                    <div className={clsx(classes.lineMinWidth, classes.lineColumn)}>
                      <span>Unresolved Amendment</span>
                    </div>
                  </TableCell>}
                  {columns.resolve && <TableCell>
                    <div>
                      <span>Resolved</span>
                    </div>
                  </TableCell>}
                  <TableCell className={classes.cellHead} style={{ width: 50 }}>
                    <Tooltip title='Add Column'>
                      <Icon classes={{ root: classes.iconAdd }} onClick={handleClick}>
                        control_point
                      </Icon>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state?.queueListBl.map((row, index) => (
                  <TableRow key={index}>
                    <StickyTableCell className='flex'>
                      <div className={clsx(classes.cellBody, classes.cellSticky)} component='th' scope='row'>
                        {index + (searchQueueQuery.currentPageNumber - 1) * searchQueueQuery.pageSize + 1}
                      </div>
                      <div className={clsx(classes.cellBody, classes.cellSticky)} component='th' scope='row'>
                        <a href={`/guest?bl=${row.id}`} target='_blank' className={classes.link} rel="noreferrer"><span>{row.bookingNo}</span></a>
                      </div>
                    </StickyTableCell>
                    {columns.lastUpdate && <TableCell>{formatDate(row.latestDate, 'MMM DD YYYY HH:mm')}</TableCell>}
                    {columns.etd && <TableCell><span>{row.etd && formatDate(row.etd, 'MMM DD YYYY HH:mm')}</span></TableCell>}
                    {columns.eta && <TableCell><span>{row.eta && formatDate(row.eta, 'MMM DD YYYY HH:mm')}</span></TableCell>}
                    {columns.status && <TableCell><span style={{ textTransform: 'capitalize' }}>{row?.status ? row?.status.replace('_', ' ').toLowerCase() : ''}</span></TableCell>}
                    {columns.vvd && <TableCell><span>{row.vvd}</span></TableCell>}
                    {columns.shipperN && <TableCell><span>{row.shipperName}</span></TableCell>}
                    {columns.pol && <TableCell><span>{row.pol}</span></TableCell>}
                    {columns.pod && <TableCell><span>{row.pod}</span></TableCell>}
                    {columns.del && <TableCell><span>{row.del}</span></TableCell>}
                    {/* Inquiries */}
                    {columns.inquiry && <TableCell>
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
                    </TableCell>}
                    {/* Amendments */}
                    {columns.amendment && <TableCell>
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
                    </TableCell>}
                    {columns.resolve && <TableCell>
                      <div className={classes.label}>
                        {row?.countAllInq ?
                        <Tooltip title={'Inquiries'} placement='bottom-end'>
                          <Chip
                            label={`${row.countInqResolved}/${row.countAllInq}`}
                            className={clsx(classes.chip, classes.resolvedColor)}
                            icon={
                              <Icon className={clsx(classes.sizeIcon, classes.resolvedColor)}>
                                help
                              </Icon>
                            }
                          />
                        </Tooltip>
                          : ''}
                        {row.countAllAme ?
                        <Tooltip title={'Amendments'} placement='bottom-end'>
                          <Chip
                            label={`${row.countAmeResolved}/${row.countAllAme}`}
                            className={clsx(classes.chip, classes.resolvedColor)}
                            icon={
                              <Icon className={clsx(classes.sizeIcon, classes.resolvedColor)}>
                                edit
                              </Icon>
                            }
                          />
                        </Tooltip>
                          : ''}
                      </div>
                    </TableCell>}
                    <TableCell className={classes.cellBody} style={{ width: 50 }} />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              PaperProps={{
                style: {
                  width: 270
                }
              }}
              onClose={handleClose}>
                {AddColumn(columns, handleShowColumn)}
            </Menu>
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