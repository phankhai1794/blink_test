import React, { useEffect, useState } from 'react';
import { Checkbox, Icon, IconButton, Typography } from '@material-ui/core';
import { FuseUtils, FuseAnimate } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import ReactTable from "react-table";

function BookingsList(props) {
    const dispatch = useDispatch();
    const bookings = useSelector(({ exportApp }) => exportApp.bookings.data);
    const selectedBookingIds = useSelector(({ exportApp }) => exportApp.bookings.selectedBookingIds);
    const searchText = useSelector(({ exportApp }) => exportApp.bookings.searchText);

    const [filteredData, setFilteredData] = useState(null);

    useEffect(() => {
        function getFilteredArray(entities, searchText) {
            const arr = Object.keys(entities).map((id) => entities[id]);
            if (searchText.length === 0) {
                return arr;
            }
            return FuseUtils.filterArrayByString(arr, searchText);
        }

        if (bookings) {
            setFilteredData(getFilteredArray(bookings, searchText));
        }
    }, [bookings, searchText]);


    if (!filteredData) {
        return null;
    }

    if (filteredData.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center h-full">
                <Typography color="textSecondary" variant="h5">
                    There are no bookings item!
                </Typography>
            </div>
        );
    }

    return (
        <FuseAnimate animation="transition.slideUpIn" delay={300}>
            <ReactTable
                className="-striped -highlight h-full sm:rounded-16 overflow-hidden"
                getTrProps={(state, rowInfo, column) => {
                    return {
                        className: "cursor-pointer",
                    }
                }}
                data={filteredData}
                columns={[
                    {
                        Header: () => (
                            <Checkbox
                                onClick={(event) => {
                                    event.stopPropagation();
                                }}

                                checked={selectedBookingIds.length === Object.keys(bookings).length && selectedBookingIds.length > 0}
                                indeterminate={selectedBookingIds.length !== Object.keys(bookings).length && selectedBookingIds.length > 0}
                            />
                        ),
                        accessor: "",
                        Cell: row => {
                            return (<Checkbox
                                onClick={(event) => {
                                    event.stopPropagation();
                                }}
                                checked={selectedBookingIds.includes(row.value.id)}
                            />
                            )
                        },
                        className: "justify-center",
                        sortable: false,
                        width: 64
                    },
                    {
                        Header: "Order ID",
                        accessor: "orderId",
                        filterable: true,
                        className: "font-bold"
                    },
                    {
                        Header: "Sale By",
                        accessor: "saleBy",
                        Cell: row => row.value?.name,
                        filterable: true,
                        className: "font-bold"
                    },
                    {
                        Header: "Customer Service",
                        accessor: "cusSer",
                        Cell: row => row.value?.name,
                        filterable: true
                    },
                    {
                        Header: "Operation Service",
                        accessor: "opSer",
                        Cell: row => row.value?.name,
                        filterable: true
                    },
                    {
                        Header: "Shipping Address",
                        accessor: "bkgInfo",
                        Cell: row => row.value?.delivery?.shippingAddr,
                        filterable: true
                    },
                    {
                        Header: "Freight",
                        accessor: "bkgInfo",
                        Cell: row => row.value?.freight,
                        filterable: true
                    },
                    {
                        Header: "",
                        width: 128,
                        Cell: row => (
                            <div className="flex items-center">
                                <IconButton
                                    onClick={(ev) => {
                                        ev.stopPropagation();
                                    }}
                                >
                                    <Icon>delete</Icon>
                                </IconButton>
                            </div>
                        )
                    }
                ]}
                defaultPageSize={10}
                noDataText="No contacts found"
            />
        </FuseAnimate>
    );
}

export default BookingsList;
