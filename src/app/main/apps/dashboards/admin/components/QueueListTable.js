import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, Icon, Collapse, Tabs, Tab, Select, MenuItem, FormControl, Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { getOffshoreQueueList } from 'app/services/myBLService';
import { formatDate } from '@shared';
import * as InquiryActions from 'app/main/apps/workspace/store/actions/inquiry';
import Pagination from 'app/main/apps/workspace/shared-components/Pagination';
import EllipsisPopper from 'app/main/apps/workspace/shared-components/EllipsisPopper';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import { mapperBlinkStatus } from '@shared/keyword'

const useStyles = makeStyles({
  root: {
    width: "100%",
    overflowX: 'auto',
  },
  selectStatus: {
    margin: 'auto',
    border: '1px solid #E2E6EA',
    backgroundColor: 'white',
    padding: '0 12px',
    borderRadius: 4,
    fontFamily: 'Montserrat',
  },
  table: {
    tableLayout: 'fixed',
    overflowX: 'auto',
    borderCollapse: 'separate !important',
    '& th, td': {
      fontFamily: 'Montserrat',
    }
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '20px',
  },
  headerColor: {
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
      marginRight: '22px',
    }
  },
  link: {
    color: '#333333',
    textDecoration: 'none !important',
    '&:hover': {
      color: '#BD0F72 !important',
      fontWeight: '600',
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
    fontFamily: 'Montserrat',
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
  resolvedColor: {
    backgroundColor: '#EBF7F2',
    color: '#36B37E',
  },
  replyColor: {
    backgroundColor: '#EAF2FD',
    color: '#2F80ED'
  },
  sizeIcon: {
    fontSize: '18px',
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
    borderBottom: 0,
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
      cursor: 'pointer',
    }
  }
});

const StickyTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#FDF2F2',
    left: 0,
    position: "sticky",
    zIndex: 2,
    boxShadow: 'rgba(100, 100, 111, 0.2) 5px 0 5px -1px',
    width: 220,
    padding: 10
  },
  body: {
    backgroundColor: 'white',
    left: 0,
    position: "sticky",
    zIndex: 1,
    boxShadow: 'rgba(100, 100, 111, 0.2) 5px 0 5px -1px',
    width: 220,
    padding: 14
  }
}))(TableCell);

const sortDates = (array) => {
  return array.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

const isDateStringValid = (str) => {
  const date = new Date(str);
  return isNaN(date) ? str : formatDate(date, 'MMM DD YYYY');
};

const InqStatus = {
  "OPEN": "Inquired",
  "INQ_SENT": "Inquired",
  "ANS_DRF": "",
  "ANS_SENT": "New Reply",
  "REP_Q_DRF": "Replied",
  "REP_Q_SENT": "Replied",
  "REP_A_DRF": "",
  "REP_A_SENT": "New Reply",
  "COMPL": "Resolved",
  "REOPEN_Q": "Reopen",
  "REOPEN_A": "",
  "UPLOADED": "Uploaded",
  "AME_DRF": "",
  "AME_SENT": "New Amendment",
  "REP_SENT": "Replied",
  "RESOLVED": "Resolved"
}

const Row = (props) => {
  const { row, index, open, setOpen } = props;
  const classes = useStyles();

  const [tab, setTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [arrowRef, setArrowRef] = useState(null);
  const [popover, setPopover] = useState({ open: false, text: '' });

  const handleChange = (_, value) => setTab(value);

  const data = (row) => {
    let { pending, resolved, uploaded } = row;
    let newReply = row.new;
    pending = pending.map(a => ({ ...a, status: 'pending' }));
    resolved = resolved.map(a => ({ ...a, status: 'resolved' }));
    newReply = newReply.map(a => ({ ...a, status: 'reply' }));
    uploaded = uploaded.map(a => ({ ...a, status: 'uploaded' }));
    return [pending, newReply, resolved, uploaded];
  }

  const [Ipending, Ireply, Iresolved, Iuploaded] = data(row.inquiries);
  const [Apending, Areply, Aresolved, Auploaded] = data(row.amendments);
  const countAllInquiry = Ipending.length + Ireply.length + Iresolved.length + Iuploaded.length;
  const countAllAmend = Apending.length + Areply.length + Aresolved.length + Auploaded.length;

  const handleArrorRef = (node) => setArrowRef(node);

  const checkPopover = (e) => {
    const overflow = e.target.scrollWidth > e.target.clientWidth;
    if (overflow) {
      setAnchorEl(e.currentTarget);
      setPopover({ open: true, text: e.target.textContent });
    }
  }

  const closePopover = () => {
    setAnchorEl(null);
    setPopover({ open: false });
  }

  return (
    <>
      <TableRow>
        <StickyTableCell>
          <TableCell className={clsx(classes.cellBody, classes.cellSticky)} component='th' scope='row'>
            {index + 1}
          </TableCell>
          <TableCell className={clsx(classes.cellBody, classes.cellSticky)} component='th' scope='row'>
            <IconButton
              style={{ padding: 0 }}
              onClick={setOpen}
              aria-label="Delete"
            >
              <Icon>  {open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</Icon>
            </IconButton>
            <a href={`/apps/workspace/${row.bkgNo}?usrId=admin&cntr=${row.country}`} target='_blank' className={classes.link} rel="noreferrer"><span>{row.bkgNo}</span></a>
          </TableCell>
        </StickyTableCell>
        <TableCell className={classes.cellBody} >{formatDate(row.lastUpdated, 'MMM DD YYYY HH:mm')}</TableCell>
        <TableCell className={classes.cellBody}>{row.etd && formatDate(row.etd, 'MMM DD YYYY HH:mm')}</TableCell>
        <TableCell className={classes.cellBody} ><span style={{ textTransform: 'capitalize' }}>{row.status.customer}</span></TableCell>
        <TableCell className={classes.cellBody} ><span style={{ textTransform: 'capitalize' }}>{row.status.onshore}</span></TableCell>
        <TableCell className={classes.cellBody}>{mapperBlinkStatus[row.status.bl]}</TableCell>
        <TableCell className={classes.cellBody} style={{ minWidth: 150 }}><span style={{ textTransform: 'capitalize' }}>{row?.vvd}</span></TableCell>
        <TableCell className={classes.cellBody} style={{ minWidth: 200 }}>
          <div className={classes.label}>
            {Ipending.length ? <Chip label={Ipending.length} className={clsx(classes.chip, classes.inquiryColor)} icon={<Icon className={clsx(classes.sizeIcon, classes.inquiryColor)}>help </Icon>} /> : null}
            {Ireply.length ? <Chip label={Ireply.length} className={clsx(classes.chip, classes.replyColor)} icon={<Icon className={clsx(classes.sizeIcon, classes.replyColor)}> reply </Icon>} /> : null}
          </div>
        </TableCell>
        <TableCell className={classes.cellBody} style={{ minWidth: 200 }}>
          <div className={classes.label}>
            {Apending.length ? <Chip label={Apending.length} className={clsx(classes.chip, classes.amendmentColor)} icon={<Icon className={clsx(classes.sizeIcon, classes.amendmentColor)}> edit </Icon>} /> : null}
            {Areply.length ? <Chip label={Areply.length} className={clsx(classes.chip, classes.replyColor)} icon={<Icon className={clsx(classes.sizeIcon, classes.replyColor)}> reply </Icon>} /> : null}
          </div>
        </TableCell>
        <TableCell className={classes.cellBody}>
          <div className={classes.label}>
            {countAllInquiry ? <Chip label={`${Iresolved.length + Iuploaded.length}/${countAllInquiry}`} className={clsx(classes.chip, classes.resolvedColor)} icon={<Icon className={clsx(classes.sizeIcon, classes.resolvedColor)}> help </Icon>} /> : null}
            {countAllAmend ? <Chip label={`${Aresolved.length + Auploaded.length}/${countAllAmend}`} className={clsx(classes.chip, classes.resolvedColor)} icon={<Icon className={clsx(classes.sizeIcon, classes.resolvedColor)}> edit </Icon>} /> : null}
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, border: open ? '8px solid #F5F8FA' : '' }} colSpan='100%'>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Tabs
              indicatorColor="primary"
              style={{ display: 'flex', margin: 0, height: '50px' }}
              value={tab}
              onChange={handleChange}>
              <Tab
                classes={{ wrapper: classes.iconLabelWrapper }}
                className={clsx(classes.tab, tab === 0 && classes.colorSelectedTab)}
                label="Inquiries"
                icon={
                  <div className={clsx(classes.countBtn, tab === 0 && classes.colorCountBtn)}>
                    {countAllInquiry}
                  </div>
                }
              />
              <Tab
                classes={{ wrapper: classes.iconLabelWrapper }}
                className={clsx(classes.tab, tab === 1 && classes.colorSelectedTab)}
                label="Amendments"
                icon={
                  <div className={clsx(classes.countBtn, tab === 0 && classes.colorCountBtn)}>
                    {countAllAmend}
                  </div>
                }
              />
            </Tabs>
            <EllipsisPopper anchorEl={anchorEl} ref={arrowRef}>
              <div className='arrow' ref={handleArrorRef} />
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
                {sortDates(
                  tab
                    ? [...Apending, ...Areply, ...Aresolved, ...Auploaded]
                    : [...Ipending, ...Ireply, ...Iresolved, ...Iuploaded]
                ).map((row, index) => (
                  <TableRow style={{ height: 50 }} key={index}>
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell>{row.field}</TableCell>
                    {!tab ? <TableCell>{row.inqType}</TableCell> : null}
                    <TableCell>
                      {formatDate(row.updatedAt, 'MMM DD YYYY HH:mm')}
                    </TableCell>
                    <TableCell>
                      {InqStatus[row.state]}
                    </TableCell>
                    <TableCell
                      style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      onMouseEnter={checkPopover}
                      onMouseLeave={closePopover}
                    >
                      {isDateStringValid(row.content)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

const QueueListTable = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [state, setState] = useState({ queueListBl: [], totalBkgNo: 1, sortBkgNo: 'asc', sortLatestDate: 'asc', sortStatus: 'asc' });
  const searchQueueQuery = useSelector(({ dashboard }) => dashboard.searchQueueQuery);
  const countries = useSelector(({ dashboard }) => dashboard.countries);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('bkgNo');
  const [openDetailIndex, setOpenDetailIndex] = useState();

  useEffect(() => {
    dispatch(InquiryActions.searchQueueQuery({ ...searchQueueQuery, countries }));
  }, [countries]);

  useEffect(() => {
    return () => dispatch(InquiryActions.searchQueueQuery({ ...searchQueueQuery, countries: null }));
  }, []);

  useEffect(() => {
    if (searchQueueQuery.countries)
      getOffshoreQueueList({
        page: searchQueueQuery.currentPageNumber,
        size: searchQueueQuery.pageSize,
        query: {
          startDate: formatDate(searchQueueQuery.from, 'YYYY-MM-DD'),
          endDate: formatDate(searchQueueQuery.to, 'YYYY-MM-DD'),
          bkgNos: searchQueueQuery.bookingNo.split(',').filter(bkg => bkg).map(bkg => bkg.trim()),
          blinkStatus: searchQueueQuery.blStatus,
          countries
        },
        sort: searchQueueQuery.sortField
      }).then(({ total, data }) =>
        setState({ ...state, queueListBl: data, totalBkgNo: total })
      )
  }, [searchQueueQuery]);

  const handleSort = (property) => {
    const isAsc = (orderBy === property && order === 'asc') ? 'desc' : 'asc';
    setOrder(isAsc);
    setOrderBy(property);
    dispatch(InquiryActions.searchQueueQuery({ ...searchQueueQuery, sortField: [property, isAsc] }));
  };

  const openDetails = (index) => {
    setOpenDetailIndex(index !== openDetailIndex ? index : null)
  }

  const showItems = (e) => {
    searchQueueQuery.currentPageNumber > Math.ceil(state.totalBkgNo / e.target.value) ?
      dispatch(InquiryActions.searchQueueQuery({ ...searchQueueQuery, pageSize: e.target.value, currentPageNumber: Math.ceil(state.totalBkgNo / e.target.value) }))
      :
      dispatch(InquiryActions.searchQueueQuery({ ...searchQueueQuery, pageSize: e.target.value }))
  }

  return (
    <>
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
                  [10, 20, 50].map(val =>
                    <MenuItem key={val} style={{ fontFamily: 'Montserrat' }} value={val}>
                      Show {val} items
                    </MenuItem>

                  )}
              </Select>
            </FormControl>
          </div>
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <Table className={classes.table} aria-label='simple table'>
              <TableHead className={classes.headerColor} style={{ backgroundColor: '#FDF2F2', position: 'sticky', top: 0, zIndex: 2 }}>
                <TableRow>
                  <StickyTableCell>
                    <TableCell className={clsx(classes.cellHead, classes.cellSticky)}>
                      <div className={classes.lineColumn}>
                        <span>No.</span>
                      </div>
                    </TableCell>
                    <TableCell className={clsx(classes.cellHead, classes.cellSticky)} style={{ width: 200, padding: 0 }}>
                      <div className={classes.lineColumn} >
                        <span>Booking Number</span>
                        <img src='/assets/images/icons/Icon-sort.svg' onClick={() => handleSort('bkgNo')} />
                      </div>
                    </TableCell>
                  </StickyTableCell>
                  <TableCell className={classes.cellHead} style={{ width: 160 }}>
                    <div className={classes.lineColumn}>
                      <span>Last Updated</span>
                      <img src='/assets/images/icons/Icon-sort.svg' onClick={() => handleSort('lastUpdated')} />
                    </div>
                  </TableCell>
                  <TableCell className={classes.cellHead} style={{ width: 160 }}>
                    <div className={classes.lineColumn}>
                      <span>ETD</span>
                      {/* <img src='/assets/images/icons/Icon-sort.svg' onClick={() => handleSort('etd')} /> */}
                    </div>
                  </TableCell>
                  <TableCell className={classes.cellHead} style={{ width: 130 }}>
                    <div className={classes.lineColumn}>
                      <span>Customer Status</span>
                    </div>
                  </TableCell>
                  <TableCell className={classes.cellHead} style={{ width: 130 }}>
                    <div className={classes.lineColumn}>
                      <span>Onshore Status</span>
                    </div>
                  </TableCell>
                  <TableCell className={classes.cellHead} style={{ width: 150 }}>
                    <div className={classes.lineColumn}>
                      <span>BLink Status</span>
                      {/* <img src='/assets/images/icons/Icon-sort.svg' onClick={() => handleSort('status')} /> */}
                    </div>
                  </TableCell>
                  <TableCell className={classes.cellHead} style={{ width: 200 }}>
                    <div className={classes.lineColumn}>
                      <span>VVD</span>
                      {/* <img src='/assets/images/icons/Icon-sort.svg' onClick={() => handleSort('vvd')} /> */}
                    </div>
                  </TableCell>
                  <TableCell className={classes.cellHead} style={{ width: 170 }}>
                    <div className={classes.lineColumn}>
                      <span>Unresolved Inquiry</span>
                    </div>
                  </TableCell>
                  <TableCell className={classes.cellHead} style={{ width: 190 }}>
                    <div className={classes.lineColumn}>
                      <span>Unresolved Amendment</span>
                    </div>
                  </TableCell>
                  <TableCell className={classes.cellHead} style={{ width: 150 }}>
                    <div>
                      <span>Resolved</span>
                    </div>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ backgroundColor: 'white' }}>
                {state?.queueListBl.map((row, index) => (
                  <Row
                    key={index}
                    row={row}
                    index={index + (searchQueueQuery.currentPageNumber - 1) * searchQueueQuery.pageSize}
                    open={openDetailIndex === index}
                    setOpen={() => openDetails(index)}
                  />
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
    </>
  )
}

export default QueueListTable;