import React, { useEffect, useState } from 'react';
import history from '@history';
import {
  Icon,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Checkbox,
  Box,
  Chip,
  Tooltip
} from '@material-ui/core';
import { FuseScrollbars } from '@fuse';
import { Avatar } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import _ from '@lodash';
import { makeStyles } from '@material-ui/styles';
import moment from 'moment';
import axios from 'axios';
import { getHeaders } from '../workspace/shared-functions';

const useStyles = makeStyles((theme) => ({
  root: {
    // color: theme.palette.secondary.contrastText,
    border: '1px solid orange',
    backgroundColor: '#FCC4191A'
  },
  outlined: {
    color: '#8F6400',
    fontWeight: '700'
  }
}));

function InquiringTable(props) {
  const classes = useStyles();

  // const dispatch = useDispatch();
  // const products = useSelector(({ eCommerceApp }) => eCommerceApp.products.data);
  // const searchText = useSelector(({ eCommerceApp }) => eCommerceApp.products.searchText);

  const [selected, setSelected] = useState([]);
  const [mybls, setMybls] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: 'asc',
    id: null
  });

  function handleRequestSort(event, property) {
    const id = property;
    let direction = 'desc';

    if (order.id === property && order.direction === 'desc') {
      direction = 'asc';
    }

    setOrder({
      direction,
      id
    });
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      setSelected(mybls.map((n) => n.id));
      return;
    }
    setSelected([]);
  }

  function handleClick(item) {
    props.history.push({
      pathname: '/apps/workplace/' + item.bkgNo,
      state: 'inquiry'
    });
  }

  function handleCheck(event, id) {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  }

  function handleChangePage(event, page) {
    setPage(page);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
  }
  // function renderNumber(num) {
  //     var indents = [];
  //     for (var i = 0; i < num; i++) {
  // indents.push(<Box sx={{ mr: "-10px" }} >
  //             <Avatar src/>
  //         </Box>)
  //     }
  //     return indents;
  // }

  async function getAllBl() {
    await axios
      .get(`${process.env.REACT_APP_API}/mybl/`, {
        headers: getHeaders('get')
      })
      .then(({ data }) => {
        setMybls(data.myBLs);
      })
      .catch((error) => {
        console.error(error);
        history.push(`/pages/errors/error-404`);
      });
  }

  useEffect(() => {
    getAllBl();
  }, []);

  return (
    <div className="w-full flex flex-col mr-52">
      <FuseScrollbars className="flex-grow overflow-x-auto">
        <Table className="min-w-xl" aria-labelledby="tableTitle">
          {/* <ProductsTableHead
                        numSelected={selected.length}
                        order={order}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={mybls.length}
                    /> */}
          <TableBody>
            {_.orderBy(mybls, ['id'], ['asc'])
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((record) => {
                return (
                  <TableRow
                    className="h-64 cursor-pointer"
                    hover
                    role="checkbox"
                    key={record.id}
                    // aria-checked={isSelected}
                    // tabIndex={-1}
                    // selected={isSelected}
                    onClick={() => handleClick(record)}
                  >
                    <TableCell className="w-48 px-4 sm:px-12" padding="checkbox">
                      <Checkbox
                      // checked={isSelected}
                      // onClick={event => event.stopPropagation()}
                      // onChange={event => handleCheck(event, n.id)}
                      />
                    </TableCell>

                    <TableCell className="w-52" component="th" scope="row" padding="none">
                      <Tooltip
                        title={'Undefined' || record.createdBy_TB_ACCOUNT.userName}
                        arrow
                        placement="top"
                      >
                        <Avatar src={'Undefined' || record.createdBy_TB_ACCOUNT.avatar} />
                      </Tooltip>
                    </TableCell>

                    <TableCell component="th" scope="row">
                      <Box>
                        <Box>{record.bkgNo}</Box>
                      </Box>
                    </TableCell>

                    <TableCell className="w-52" component="th" scope="row" padding="none">
                      <Tooltip
                        title={'Undefined' || record.createdBy_TB_ACCOUNT.userName}
                        arrow
                        placement="top"
                      >
                        <Avatar src={'Undefined' || record.createdBy_TB_ACCOUNT.avatar} />
                      </Tooltip>
                    </TableCell>

                    <TableCell component="th" scope="row">
                      <Chip
                        label={record.state}
                        variant="outlined"
                        classes={{
                          root: classes.root,
                          outlined: classes.outlined
                        }}
                      />
                    </TableCell>

                    <TableCell component="th" scope="row" align="right">
                      <Box sx={{ mt: '-25px' }}>
                        <Typography variant="subtitle2" color="textSecondary">
                          {moment(record.updatedAt).format('DD MMM YYYY')}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </FuseScrollbars>

      <TablePagination
        component="div"
        count={mybls.length}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          'aria-label': 'Previous Page'
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page'
        }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
}

export default withRouter(InquiringTable);
