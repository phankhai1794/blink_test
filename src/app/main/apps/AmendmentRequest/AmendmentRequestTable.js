import React, { useEffect, useState } from 'react';
import { Icon, Table, TableBody, TableCell, TablePagination, TableRow, Checkbox, Box } from '@material-ui/core';
import { FuseScrollbars } from '@fuse';
import { Avatar } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import _ from '@lodash';
import { useDispatch, useSelector } from 'react-redux';
import { data } from './data';
function AmendmentRequestTable(props) {

    const dispatch = useDispatch();
    // const products = useSelector(({ eCommerceApp }) => eCommerceApp.products.data);
    // const searchText = useSelector(({ eCommerceApp }) => eCommerceApp.products.searchText);

    const [selected, setSelected] = useState([]);
    // const [data, setData] = useState(0);

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
            setSelected(data.map(n => n.id));
            return;
        }
        setSelected([]);
    }

    function handleClick(item) {
        props.history.push('/apps/dashboards/monitor/' + item.id + '/' + item.handle);
    }

    function handleCheck(event, id) {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        }
        else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        }
        else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        }
        else if (selectedIndex > 0) {
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

    return (
        <div className="w-full flex flex-col mr-52">

            {/* <FuseScrollbars className="flex-grow overflow-x-auto"> */}

            <Table className="min-w-xl" aria-labelledby="tableTitle">

                {/* <ProductsTableHead
                        numSelected={selected.length}
                        order={order}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={data.length}
                    /> */}
                <TableBody>
                    {_.orderBy(data, ['id'], ['asc']).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map(h => {
                            return (
                                <TableRow
                                    className="h-64 cursor-pointer"
                                    hover
                                    role="checkbox"
                                // aria-checked={isSelected}
                                // tabIndex={-1}
                                // key={n.id}
                                // selected={isSelected}
                                // onClick={event => handleClick(n)}
                                >
                                    <TableCell className="w-48 px-4 sm:px-12" padding="checkbox">
                                        <Checkbox
                                        // checked={isSelected}
                                        // onClick={event => event.stopPropagation()}
                                        // onChange={event => handleCheck(event, n.id)}
                                        />
                                    </TableCell>

                                    <TableCell className="w-52" component="th" scope="row" padding="none">
                                        <Avatar src={h.avatar} />
                                    </TableCell>

                                    <TableCell component="th" scope="row">
                                        <Box>
                                            <Box>
                                                {h.id}
                                            </Box>
                                            <Box>
                                                {h.position}
                                            </Box>
                                        </Box>
                                    </TableCell>


                                    <TableCell component="th" scope="row" align="center">
                                        <Box display="flex" alignItems="center">
                                            {/* {renderNumber(h.memberNumber)} */}
                                            {h.members.map((member, index) => {
                                                return (<Box key={index} sx={{ mr: "-10px" }} >
                                                    <Avatar src={member.avatar} />
                                                </Box>)
                                            })}
                                        </Box>
                                    </TableCell>

                                    <TableCell component="th" scope="row">
                                        <Box sx={{ p: 1, backgroundColor: "orange", borderRadius: '7px', border: "1px solid orange", maxWidth: "fit-content" }}>
                                            {h.status}
                                        </Box>
                                    </TableCell>

                                    <TableCell component="th" scope="row" align="right">
                                        <Box sx={{ mt: "-25px" }}>
                                            <Typography variant="subtitle2" color="textSecondary">{h.dateCreated}</Typography>
                                        </Box>
                                        {/* {h.dateCreated} */}
                                    </TableCell>
                                </TableRow>
                            )
                        })}


                </TableBody>
            </Table>
            {/* </FuseScrollbars> */}

            <TablePagination
                component="div"
                count={data.length}
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

export default withRouter(AmendmentRequestTable);
