import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
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
import { getAllBl } from 'app/main/api/mybl';
import * as Actions from './store/actions';

const blStateStyles = {
  REQUEST: {
    root: {
      border: '1px solid red',
      backgroundColor: '#FF505F1A'
    },
    outlined: {
      color: '#EB0014',
      fontWeight: '700'
    }
  },
  INQUIRED: {
    root: {
      border: '1px solid orange',
      backgroundColor: '#FCC4191A'
    },
    outlined: {
      color: '#8F6400',
      fontWeight: '700'
    }
  },
  CONFIRM: {
    root: {
      border: '1px solid green',
      backgroundColor: '#21CC661A'
    },
    outlined: {
      color: '#178D46',
      fontWeight: '700'
    }
  },
  COMPLETED: {
    root: {
      border: '1px solid #F1C40F',
      backgroundColor: '#FAFAD2'
    },
    outlined: {
      color: '#FFBF00',
      fontWeight: '700'
    }
  }
};
function getFilterStateFromPath(pathname) {
  const paths = pathname.split('/');
  return paths[paths.length - 1].replaceAll('/', '').toUpperCase();
}

const useStyles = makeStyles((theme) => ({
  root: ({ location }) => {
    const state = getFilterStateFromPath(location.pathname);
    return blStateStyles[state].root;
  },
  outlined: ({ location }) => {
    const state = getFilterStateFromPath(location.pathname);
    return blStateStyles[state].outlined;
  }
}));

function InquiringTable(props) {
  const { location, history } = props;
  const classes = useStyles(props);

  const filterState = getFilterStateFromPath(location.pathname);
  const myBLs = useSelector(({ listBlReducer }) => listBlReducer.myBLs);
  const dispatch = useDispatch();

  const [selected, setSelected] = useState([]);
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
      setSelected(myBLs.map((n) => n.id));
      return;
    }
    setSelected([]);
  }

  function handleClick(bkgNo) {
    history.push({
      pathname: '/apps/workplace/' + bkgNo,
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

  useEffect(() => {
    getAllBl(filterState)
      .then(({ myBLs: data }) => {
        if (data) dispatch(Actions.setMyBLs(data));
      })
      .catch((error) => {
        console.error(error);
      });
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
            rowCount={myBLs.length}
          /> */}
          <TableBody>
            {_.orderBy(myBLs, ['id'], ['asc'])
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((record) => {
                const { id, bkgNo, state, createdBy, updatedBy, updatedAt } = record;
                return (
                  <TableRow
                    className="h-64 cursor-pointer"
                    hover
                    role="checkbox"
                    key={id}
                    // aria-checked={isSelected}
                    // tabIndex={-1}
                    // selected={isSelected}
                    onClick={() => handleClick(bkgNo)}
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
                        title={createdBy ? createdBy.userName : 'Undefined'}
                        placement="top"
                        arrow="true"
                      >
                        <Avatar src={createdBy ? createdBy.avatar : 'Undefined'} />
                      </Tooltip>
                    </TableCell>

                    <TableCell component="th" scope="row">
                      <Box>
                        <Box>{bkgNo}</Box>
                      </Box>
                    </TableCell>

                    <TableCell className="w-52" component="th" scope="row" padding="none">
                      <Tooltip
                        title={updatedBy ? updatedBy.userName : 'Undefined'}
                        placement="top"
                        arrow="true"
                      >
                        <Avatar src={updatedBy ? updatedBy.avatar : 'Undefined'} />
                      </Tooltip>
                    </TableCell>

                    <TableCell component="th" scope="row">
                      <Chip
                        label={state}
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
                          {moment(updatedAt).format('DD MMM YYYY')}
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
        count={myBLs.length}
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
