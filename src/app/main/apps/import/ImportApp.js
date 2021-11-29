import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
    Button,
    Icon,
    Input, 
    Paper
} from '@material-ui/core';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { AddCircleOutline as AddIcon } from '@material-ui/icons';
import { FuseAnimate, FusePageSimple } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import _ from '@lodash';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import BookingList from './BookingList';
import LeftSidebarContent from './LeftSidebar';
import ImportAppHeader from './ImportAppHeader';

function ImportApp(props) {
    const { history } = props;
    const dispatch = useDispatch();
    const mainTheme = useSelector(({fuse}) => fuse.settings.mainTheme);
    
    const pageLayout = useRef(null);
    
    const handleCreateBooking = () => {
        history.push('/apps/import/new');
    }

    useEffect(() => {
        dispatch(Actions.getBookingsList());
    }, [])

    return (
        <div className="flex flex-col flex-1 w-full">
            <ImportAppHeader className="p-0 sm:px-24" />
            <FusePageSimple
                classes={{
                    contentWrapper: "p-0 sm:p-24 pb-80 sm:pb-80 h-full",
                    content: "flex flex-col h-full",
                    leftSidebar: "w-256 border-0",
                }}
                content={
                    <div>
                        <div className="flex flex-1 items-center justify-between pr-8 sm:px-12 my-8">
                            <ThemeProvider theme={mainTheme}>
                                <FuseAnimate animation="transition.slideUpIn" delay={300}>
                                    <Paper className="flex p-4 items-center w-full max-w-512 px-8 py-4" elevation={1}>
                                        <Icon className="mr-8" color="action">search</Icon>

                                        <Input
                                            placeholder="Search bookings item"
                                            className="flex flex-1"
                                            disableUnderline
                                            fullWidth
                                            inputProps={{
                                                'aria-label': 'Search'
                                            }}
                                        />
                                        
                                    </Paper>
                                </FuseAnimate>
                            </ThemeProvider>
                            <FuseAnimate animation="transition.slideUpIn" delay={350}>
                                <Button 
                                    color="primary" 
                                    variant="contained"
                                    onClick={handleCreateBooking}
                                >
                                    <AddIcon className="mx-4" />
                                    create
                                </Button>
                            </FuseAnimate>
                        </div>
                        <BookingList />
                    </div>
                }
                leftSidebarContent={
                    <LeftSidebarContent />
                }
                
                sidebarInner
                ref={pageLayout}
                innerScroll
            />
        </div>
    );
}

export default withReducer('importApp', reducer)(ImportApp);
