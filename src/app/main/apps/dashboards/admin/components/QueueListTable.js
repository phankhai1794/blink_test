import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Icon,
  Collapse,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  Chip,
  Menu,
  Button,
  Tooltip
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { getOffshoreQueueList } from 'app/services/myBLService';
import { formatDate } from '@shared';
import * as InquiryActions from 'app/main/apps/workspace/store/actions/inquiry';
import Pagination from 'app/main/apps/workspace/shared-components/Pagination';
import EllipsisPopper from 'app/main/apps/workspace/shared-components/EllipsisPopper';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import { mapperBlinkStatus } from '@shared/keyword';
import { handleError } from '@shared/handleError';

const useStyles = makeStyles({
  root: {
    width: '100%',
    overflowX: 'auto'
  },
  selectStatus: {
    margin: 'auto',
    border: '1px solid #E2E6EA',
    backgroundColor: 'white',
    padding: '0 12px',
    borderRadius: 4,
    fontFamily: 'Montserrat'
  },
  table: {
    width: 'fit-content',
    tableLayout: 'fixed',
    borderCollapse: 'separate !important',
    '& th, td': {
      fontFamily: 'Montserrat'
    }
  },
  iconAdd: {
    cursor: 'pointer',
    '&:hover': {
      color: '#BD0F72'
    }
  },
  headerColor: {
    '& .MuiTableCell-head ': {
      fontSize: 14,
      color: '#333333'
    }
  },
  iconDownload: {
    paddingRight: '12px'
  },
  btnDownload: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 600,
    textTransform: 'none',
    fontFamily: 'Montserrat',
    color: '#BD0F72'
  },
  btnAddColumn: {
    '&:hover': {
      color: '#BD0F72',
      cursor: 'pointer'
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
      marginRight: '22px'
    }
  },
  link: {
    color: '#333333',
    textDecoration: 'none !important',
    '&:hover': {
      color: '#BD0F72 !important',
      fontWeight: '600'
    }
  },
  label: {
    display: 'flex',
    justifyContent: 'center'
  },
  labelPending: {
    backgroundColor: '#FDF2F2',
    color: '#BD0F72',
    padding: '3px 4px',
    borderRadius: '4px'
  },
  labelReplies: {
    backgroundColor: '#EAF2FD',
    color: '#2F80ED',
    padding: '3px 4px',
    borderRadius: '4px'
  },
  labelResolved: {
    backgroundColor: '#EBF7F2',
    color: '#36B37E',
    padding: '3px 8px',
    borderRadius: '4px'
  },
  chips: {
    display: 'flex'
  },
  chip: {
    fontFamily: 'Montserrat',
    borderRadius: '4px',
    height: 26,
    width: 56,
    margin: 2
  },
  inquiryColor: {
    backgroundColor: '#FDF2F2',
    color: '#DC2626'
  },
  amendmentColor: {
    backgroundColor: '#FEF4E6',
    color: '#F39200'
  },
  resolvedColor: {
    backgroundColor: '#EBF7F2',
    color: '#36B37E'
  },
  replyColor: {
    backgroundColor: '#EAF2FD',
    color: '#2F80ED'
  },
  sizeIcon: {
    fontSize: '18px'
  },
  cellHead: {
    padding: '0 10px',
    height: 50
  },
  cellBody: {
    padding: '0 10px',
    height: 50
  },
  cellSticky: {
    borderBottom: 0
  },
  iconLabelWrapper: {
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-around'
  },
  colorSelectedTab: {
    color: '#BD0F72'
  },
  countBtn: {
    background: '#E2E6EA',
    fontSize: '14px',
    height: '24px',
    width: '24px',
    borderRadius: '4px',
    marginBottom: '0 !important'
  },
  tab: {
    fontFamily: 'Montserrat',
    textTransform: 'none',
    fontSize: '18px',
    fontWeight: '600'
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
      cursor: 'pointer'
    }
  }
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

const sortDates = (array) => {
  return array.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
};

const Row = (props) => {
  const { row, index, open, setOpen, columns } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [arrowRef, setArrowRef] = useState(null);
  const [popover, setPopover] = useState({ open: false, text: '' });

  const data = (row, type) => {
    const pending =
      type === 'inquiry'
        ? row.new_inq.map((v) => ({ ...v, state: 'Inquired' }))
        : row.new_ame.map((v) => ({ ...v, state: 'New Amendment' }));
    const new_reply = row.new_reply.map((v) => ({ ...v, state: 'New Reply' }));
    const reopen = row.reopen.map((v) => ({ ...v, state: 'Reopen' }));
    const replied = row.replied.map((v) => ({ ...v, state: 'Replied' }));
    const resolved = row.resolved.map((v) => ({ ...v, state: 'Resolved' }));
    const uploaded = row.uploaded.map((v) => ({ ...v, state: 'Uploaded' }));

    return [
      [...pending, ...new_reply, ...replied, ...reopen],
      [...new_reply, ...replied],
      [...resolved, ...uploaded]
    ];
  };

  const [Ipending, Ireply, Iresolved] = data(row.inquiries, 'inquiry');
  const [Apending, Areply, Aresolved] = data(row.amendments, 'amendment');
  const countAllInquiry = Ipending.length + Iresolved.length;
  const countAllAmend = Apending.length + Aresolved.length;

  const [tab, setTab] = useState(countAllInquiry > 0 ? 0 : 1);

  const handleChange = (_, value) => setTab(value);

  const handleArrorRef = (node) => setArrowRef(node);

  const checkPopover = (e) => {
    const overflow = e.target.scrollWidth > e.target.clientWidth;
    if (overflow) {
      setAnchorEl(e.currentTarget);
      setPopover({ open: true, text: e.target.textContent });
    }
  };

  const closePopover = () => {
    setAnchorEl(null);
    setPopover({ open: false });
  };

  return (
    <>
      <TableRow>
        <StickyTableCell>
          <TableCell
            className={clsx(classes.cellBody, classes.cellSticky)}
            component="th"
            scope="row">
            {index + 1}
          </TableCell>
          <TableCell
            className={clsx(classes.cellBody, classes.cellSticky)}
            component="th"
            scope="row">
            {countAllInquiry + countAllAmend ? (
              <IconButton style={{ padding: 0 }} onClick={setOpen} aria-label="Delete">
                <Icon> {open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</Icon>
              </IconButton>
            ) : null}
            <a
              href={`/apps/workspace/${row.bkgNo}?usrId=admin&cntr=${row.country}`}
              target="_blank"
              className={classes.link}
              rel="noreferrer">
              <span>{row.bkgNo}</span>
            </a>
          </TableCell>
        </StickyTableCell>
        {columns.lastUpdate && <TableCell className={classes.cellBody}>
          {formatDate(row.lastUpdated, 'MMM DD YYYY HH:mm')}
        </TableCell>
        }
        {columns.etd && (
          <TableCell className={classes.cellBody}>
            {row.etd && formatDate(row.etd, 'MMM DD YYYY HH:mm')}
          </TableCell>
        )}
        {columns.shipperN && <TableCell className={classes.cellBody}>{row.shipperName}</TableCell>}
        {columns.pol && <TableCell className={classes.cellBody}>{row.pol}</TableCell>}
        {columns.pod && <TableCell className={classes.cellBody}>{row.pod}</TableCell>}
        {columns.customerS && (
          <TableCell className={classes.cellBody}>
            <span style={{ textTransform: 'capitalize' }}>{row.status.customer}</span>
          </TableCell>
        )}
        {columns.onshoreS && (
          <TableCell className={classes.cellBody}>
            <span style={{ textTransform: 'capitalize' }}>{row.status.onshore}</span>
          </TableCell>
        )}
        {columns.blinkS && (
          <TableCell className={classes.cellBody}>{mapperBlinkStatus[row.status.bl]}</TableCell>
        )}
        {columns.vvd && (
          <TableCell className={classes.cellBody} style={{ minWidth: 150 }}>
            <span style={{ textTransform: 'capitalize' }}>{row?.vvd}</span>
          </TableCell>
        )}
        {columns.inquiry && (
          <TableCell className={classes.cellBody} style={{ minWidth: 200 }}>
            <div className={classes.label}>
              {Ipending.length ? (
                <Tooltip title="Inquiries">
                  <Chip
                    label={Ipending.length}
                    className={clsx(classes.chip, classes.inquiryColor)}
                    icon={
                      <Icon className={clsx(classes.sizeIcon, classes.inquiryColor)}>help</Icon>
                    }
                  />
                </Tooltip>
              ) : null}
              {Ireply.length ? (
                <Tooltip title="New replies">
                  <Chip
                    label={Ireply.length}
                    className={clsx(classes.chip, classes.replyColor)}
                    icon={
                      <Icon className={clsx(classes.sizeIcon, classes.replyColor)}> reply </Icon>
                    }
                  />
                </Tooltip>
              ) : null}
            </div>
          </TableCell>
        )}
        {columns.amendment && (
          <TableCell className={classes.cellBody} style={{ minWidth: 200 }}>
            <div className={classes.label}>
              {Apending.length ? (
                <Tooltip title="Amendments">
                  <Chip
                    label={Apending.length}
                    className={clsx(classes.chip, classes.amendmentColor)}
                    icon={
                      <Icon className={clsx(classes.sizeIcon, classes.amendmentColor)}> edit </Icon>
                    }
                  />
                </Tooltip>
              ) : null}
              {Areply.length ? (
                <Tooltip title="New replies">
                  <Chip
                    label={Areply.length}
                    className={clsx(classes.chip, classes.replyColor)}
                    icon={
                      <Icon className={clsx(classes.sizeIcon, classes.replyColor)}> reply </Icon>
                    }
                  />
                </Tooltip>
              ) : null}
            </div>
          </TableCell>
        )}
        {columns.resolve && (
          <TableCell className={classes.cellBody}>
            <div className={classes.label}>
              {countAllInquiry ? (
                <Tooltip title="Inquiries">
                  <Chip
                    label={`${Iresolved.length}/${countAllInquiry}`}
                    className={clsx(classes.chip, classes.resolvedColor)}
                    icon={
                      <Icon className={clsx(classes.sizeIcon, classes.resolvedColor)}> help </Icon>
                    }
                  />
                </Tooltip>
              ) : null}
              {countAllAmend ? (
                <Tooltip title="Amendments">
                  <Chip
                    label={`${Aresolved.length}/${countAllAmend}`}
                    className={clsx(classes.chip, classes.resolvedColor)}
                    icon={
                      <Icon className={clsx(classes.sizeIcon, classes.resolvedColor)}> edit </Icon>
                    }
                  />
                </Tooltip>
              ) : null}
            </div>
          </TableCell>
        )}
        <TableCell className={classes.cellBody}></TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0, border: open ? '8px solid #F5F8FA' : '' }}
          colSpan="100%">
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Tabs
              indicatorColor="primary"
              style={{ display: 'flex', margin: 0, height: '50px' }}
              value={tab}
              onChange={handleChange}>
              {countAllInquiry > 0 &&
                <Tab
                  value={0}
                  classes={{ wrapper: classes.iconLabelWrapper }}
                  className={clsx(classes.tab, tab === 0 && classes.colorSelectedTab)}
                  label="Inquiries"
                  icon={
                    <div className={clsx(classes.countBtn, tab === 0 && classes.colorCountBtn)}>
                      {countAllInquiry}
                    </div>
                  }
                />
              }
              {countAllAmend > 0 &&
                <Tab
                  value={1}
                  classes={{ wrapper: classes.iconLabelWrapper }}
                  className={clsx(classes.tab, tab === 1 && classes.colorSelectedTab)}
                  label="Amendments"
                  icon={
                    <div className={clsx(classes.countBtn, tab === 1 && classes.colorCountBtn)}>
                      {countAllAmend}
                    </div>
                  }
                />
              }
            </Tabs>
            <EllipsisPopper anchorEl={anchorEl} ref={arrowRef}>
              <div className="arrow" ref={handleArrorRef} />
              <span style={{ color: '#515E6A' }}>{popover.text}</span>
            </EllipsisPopper>
            <Table size="small" aria-label="purchases" style={{ marginTop: 15 }}>
              <TableHead className={classes.headerColor}>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>BL Data Fields</TableCell>
                  {!tab ? <TableCell>Type of Inquiry</TableCell> : null}
                  <TableCell>Last Updated</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Activities</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortDates(tab ? [...Apending, ...Aresolved] : [...Ipending, ...Iresolved]).map(
                  (row, index) => (
                    <TableRow style={{ height: 50 }} key={index}>
                      <TableCell component="th" scope="row">
                        {index + 1}
                      </TableCell>
                      <TableCell>{row.field}</TableCell>
                      {!tab ? <TableCell>{row.inqType}</TableCell> : null}
                      <TableCell>{formatDate(row.updatedAt, 'MMM DD YYYY HH:mm')}</TableCell>
                      <TableCell>{row.state}</TableCell>
                      <TableCell
                        style={{
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={checkPopover}
                        onMouseLeave={closePopover}>
                        {row.content}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const AddColumn = (columns, handleShowColumn) => {
  const items = [
    { label: 'Last Updated', value: 'lastUpdate', show: columns['lastUpdate'] },
    { label: 'ETD', value: 'etd', show: columns['etd'] },
    { label: 'Customer Status', value: 'customerS', show: columns['customerS'] },
    { label: 'Onshore Status', value: 'onshoreS', show: columns['onshoreS'] },
    { label: 'BLink Status', value: 'blinkS', show: columns['blinkS'] },
    { label: 'Shipper Name', value: 'shipperN', show: columns['shipperN'] },
    { label: 'VVD', value: 'vvd', show: columns['vvd'] },
    { label: 'POL', value: 'pol', show: columns['pol'] },
    { label: 'POD', value: 'pod', show: columns['pod'] },
    { label: 'Unresolved Inquiry', value: 'inquiry', show: columns['inquiry'] },
    { label: 'Unresolved Amendment', value: 'amendment', show: columns['amendment'] },
    { label: 'Resolved', value: 'resolve', show: columns['resolve'] }
  ];

  const handleClick = (value, display) => {
    handleShowColumn({ [value]: !display });
  };

  return (
    <>
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
    </>
  );
};

const QueueListTable = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [state, setState] = useState({
    queueListBl: [],
    totalBkgNo: 1,
    sortBkgNo: 'asc',
    sortLatestDate: 'asc',
    sortStatus: 'asc'
  });
  const searchQueueQuery = useSelector(({ dashboard }) => dashboard.searchQueueQuery);
  const countries = useSelector(({ dashboard }) => dashboard.countries);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('bkgNo');
  const [openDetailIndex, setOpenDetailIndex] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [columns, setColumns] = useState({
    lastUpdate: true,
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
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleShowColumn = (value) => {
    setColumns({ ...columns, ...value });
  };

  useEffect(() => {
    dispatch(InquiryActions.searchQueueQuery({ ...searchQueueQuery, countries }));
  }, [countries]);

  useEffect(() => {
    return () =>
      dispatch(InquiryActions.searchQueueQuery({ ...searchQueueQuery, countries: null }));
  }, []);

  useEffect(() => {
    if (searchQueueQuery.countries)
      getOffshoreQueueList({
        page: searchQueueQuery.currentPageNumber,
        size: searchQueueQuery.pageSize,
        query: {
          startDate: formatDate(searchQueueQuery.from, 'YYYY-MM-DD'),
          endDate: formatDate(searchQueueQuery.to, 'YYYY-MM-DD'),
          bkgNos: searchQueueQuery.bookingNo
            .split(',')
            .filter((bkg) => bkg)
            .map((bkg) => bkg.trim()),
          blinkStatus: searchQueueQuery.blStatus,
          countries
        },
        sort: searchQueueQuery.sortField
      })
        .then(({ total, data }) => setState({ ...state, queueListBl: data, totalBkgNo: total }))
        .catch((err) => handleError(dispatch, err));
  }, [searchQueueQuery]);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc' ? 'desc' : 'asc';
    setOrder(isAsc);
    setOrderBy(property);
    dispatch(
      InquiryActions.searchQueueQuery({ ...searchQueueQuery, sortField: [property, isAsc] })
    );
  };

  const openDetails = (index) => {
    setOpenDetailIndex(index !== openDetailIndex ? index : null);
  };

  const showItems = (e) => {
    searchQueueQuery.currentPageNumber > Math.ceil(state.totalBkgNo / e.target.value)
      ? dispatch(
        InquiryActions.searchQueueQuery({
          ...searchQueueQuery,
          pageSize: e.target.value,
          currentPageNumber: Math.ceil(state.totalBkgNo / e.target.value)
        })
      )
      : dispatch(
        InquiryActions.searchQueueQuery({ ...searchQueueQuery, pageSize: e.target.value })
      );
  };

  return (
    <>
      {state?.queueListBl.length > 0 ? (
        <>
          <div className={classes.container}>
            <Pagination
              currentNumber={searchQueueQuery.currentPageNumber}
              totalPage={searchQueueQuery.totalPageNumber}
              totalBkgNo={state.totalBkgNo}
              query={searchQueueQuery}
              searchQueueQuery={(search) =>
                dispatch(InquiryActions.searchQueueQuery({ ...searchQueueQuery, ...search }))
              }
            />
            <FormControl variant="outlined" className={classes.formControl}>
              <Select
                className={classes.selectStatus}
                value={searchQueueQuery.pageSize}
                onChange={showItems}
                disableUnderline>
                {[10, 20, 50].map((val) => (
                  <MenuItem key={val} style={{ fontFamily: 'Montserrat' }} value={val}>
                    Show {val} items
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* <Button
              variant='text'
              className={classes.btnDownload}
              onClick={handleDownload}
            >
              <img src='/assets/images/icons/icon-download.svg' style={{ paddingRight: '10px' }} />
              <span>Download</span>
            </Button> */}
          </div>
          <div style={{ overflowX: 'auto' }}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead
                className={classes.headerColor}
                style={{ backgroundColor: '#FDF2F2', position: 'sticky', top: 0, zIndex: 2 }}>
                <TableRow>
                  <StickyTableCell>
                    <TableCell className={clsx(classes.cellHead, classes.cellSticky)}>
                      <div className={classes.lineColumn}>
                        <span>No.</span>
                      </div>
                    </TableCell>
                    <TableCell
                      className={clsx(classes.cellHead, classes.cellSticky)}
                      style={{ width: 200, padding: 0 }}>
                      <div className={classes.lineColumn}>
                        <span>Booking Number</span>
                        <img
                          src="/assets/images/icons/Icon-sort.svg"
                          onClick={() => handleSort('bkgNo')}
                        />
                      </div>
                    </TableCell>
                  </StickyTableCell>
                  {columns.lastUpdate && (
                    <TableCell className={classes.cellHead} style={{ width: 160 }}>
                      <div className={classes.lineColumn}>
                        <span>Last Updated</span>
                        <img
                          src="/assets/images/icons/Icon-sort.svg"
                          onClick={() => handleSort('lastUpdated')}
                        />
                      </div>
                    </TableCell>
                  )}
                  {columns.etd && (
                    <TableCell className={classes.cellHead} style={{ width: 160 }}>
                      <div className={classes.lineColumn}>
                        <span>ETD</span>
                      </div>
                    </TableCell>
                  )}
                  {columns.shipperN && (
                    <TableCell className={classes.cellHead} style={{ width: 180 }}>
                      <div className={classes.lineColumn}>
                        <span>Shipper Name</span>
                      </div>
                    </TableCell>
                  )}
                  {columns.pol && (
                    <TableCell className={classes.cellHead} style={{ width: 160 }}>
                      <div className={classes.lineColumn}>
                        <span>POL</span>
                      </div>
                    </TableCell>
                  )}
                  {columns.pod && (
                    <TableCell className={classes.cellHead} style={{ width: 160 }}>
                      <div className={classes.lineColumn}>
                        <span>POD</span>
                      </div>
                    </TableCell>
                  )}
                  {columns.customerS && (
                    <TableCell className={classes.cellHead} style={{ width: 130 }}>
                      <div className={classes.lineColumn}>
                        <span>Customer Status</span>
                      </div>
                    </TableCell>
                  )}
                  {columns.onshoreS && (
                    <TableCell className={classes.cellHead} style={{ width: 130 }}>
                      <div className={classes.lineColumn}>
                        <span>Onshore Status</span>
                      </div>
                    </TableCell>
                  )}
                  {columns.blinkS && (
                    <TableCell className={classes.cellHead} style={{ width: 150 }}>
                      <div className={classes.lineColumn}>
                        <span>BLink Status</span>
                      </div>
                    </TableCell>
                  )}
                  {columns.vvd && (
                    <TableCell className={classes.cellHead} style={{ width: 130 }}>
                      <div className={classes.lineColumn}>
                        <span>VVD</span>
                        {/* <img src='/assets/images/icons/Icon-sort.svg' onClick={() => handleSort('vvd')} /> */}
                      </div>
                    </TableCell>
                  )}
                  {columns.inquiry && (
                    <TableCell className={classes.cellHead} style={{ width: 170 }}>
                      <div className={classes.lineColumn}>
                        <span>Unresolved Inquiry</span>
                      </div>
                    </TableCell>
                  )}
                  {columns.amendment && (
                    <TableCell className={classes.cellHead} style={{ width: 190 }}>
                      <div className={classes.lineColumn}>
                        <span>Unresolved Amendment</span>
                      </div>
                    </TableCell>
                  )}
                  {columns.resolve && (
                    <TableCell className={classes.cellHead} style={{ width: 150 }}>
                      <div>
                        <span>Resolved</span>
                      </div>
                    </TableCell>
                  )}
                  <TableCell className={classes.cellHead} style={{ width: 50 }}>
                    <Tooltip title="Add Column">
                      <Icon classes={{ root: classes.iconAdd }} onClick={handleClick}>
                        control_point
                      </Icon>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ backgroundColor: 'white' }}>
                {state?.queueListBl.map((row, index) => (
                  <Row
                    columns={columns}
                    key={index}
                    row={row}
                    index={
                      index + (searchQueueQuery.currentPageNumber - 1) * searchQueueQuery.pageSize
                    }
                    open={openDetailIndex === index}
                    setOpen={() => openDetails(index)}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
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
        </>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 'auto',
            color: '#515F6B'
          }}>
          <img src="assets/images/icons/noData.svg" alt="No data" />
          <span style={{ fontWeight: 600, fontSize: 24, margin: '10px 0' }}>No data found</span>
          <span>Please try another search, keywords or filters.</span>
        </div>
      )}
    </>
  );
};

export default QueueListTable;
