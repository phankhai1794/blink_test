import React from 'react';
import {
    Button,
    Grid
} from '@material-ui/core';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import ShareIcon from '@material-ui/icons/Share';
import SendIcon from '@material-ui/icons/Send';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { FuseAnimate } from '@fuse';
import "./editorStyles.module.css";

import MyEditor from "./MyEditor"

const useStyles = makeStyles(theme => ({
    disabledText: {
        // color: theme.palette.secondary.contrastText,
        color: "blue",
        fontWeight: "medium",
        fontSize: "1rem",
        textTransform: "uppercase"
    },
    grid: {
        borderTop: "1px solid black",
        borderBottom: "1px solid black"
    },
    gridLeft: {
        borderRight: "1px solid black",
    },
    gridRight: {
        borderRight: "1px solid black",
    },
    gridTop: {
        borderTop: '1px solid black'
    },
    gridBottom: {
        borderBottom: "1px solid black"
    },
    normalText: {
        color: "grey",
        textTransform: "uppercase",
        fontSize: "1rem"
    },
    highlight: {
        backgroundColor: "yellow"
    },
    popover: {
        backgroundColor: "green",
        color: theme.palette.primary.contrastText
    },
    font: {
        fontFamily: "Arial, Courier"
    }
}));

const Bill = (props) => {

    const classes = useStyles(props)
    return (
        <div className={classes.font}>
            <div className=" items-center justify-between pr-8 sm:px-12 my-4 ">
                {/* <ThemeProvider theme={mainTheme}>
                            </ThemeProvider> */}
                <FuseAnimate animation="transition.slideUpIn" delay={350}>
                    <div className="flex justify-end">

                        <Button
                            color="primary"
                            variant="contained"
                            // onClick={handleCreateBooking}
                            className="mx-4"
                        >
                            <ShareIcon className="mx-4" />
                            Share
                        </Button>
                        <Button
                            color="primary"
                            variant="contained"
                            className="mx-4"
                        // onClick={handleCreateBooking}
                        >
                            <SendIcon className="mx-4" />
                            Send & Confirm
                        </Button>
                        <Button
                            color="primary"
                            variant="contained"
                            className="mx-4"
                        >
                            History version
                            <ArrowDropDownIcon className="mx-4" />
                        </Button>
                    </div>
                </FuseAnimate>
            </div>
            <div className="flex mt-2">
                <div className="flex-auto">
                    <img src="./assets/images/logos/one_ocean_network-logo.png" className="object-scale-down h-40 w-50 pt-24" />
                </div>
                <div className="flex-auto mr-2">
                    <p className="text-2xl font-medium">COPY NONE NEGOTIABLE</p>
                </div>
                <div className="flex-auto">
                    {/* <Typography>SEA WAY BILL</Typography> */}
                    <p className="text-2xl font-medium">SEA WAY BILL</p>
                </div>
            </div>
            <Grid container className={classes.grid}>
                <Grid item xs={6} className={`${classes.gridLeft} ${classes.gridBottom}`}>
                    <h1 className={classes.disabledText}>shipper/exporter </h1>
                    <MyEditor>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac consectetur nibh. Mauris vel ultrices est. Duis eget tincidunt ipsum. Sed ut maximus felis, quis blandit lorem. Nunc tortor leo, vestibulum a nisl id, dignissim luctus turpis. Suspendisse vestibulum tincidunt massa, ac vulputate tellus aliquam quis </MyEditor>

                </Grid>
                <Grid item xs={6} className={classes.gridBottom}>
                    <Grid container className="my-0" className={classes.gridBottom}>
                        <Grid item xs={6} className={`${classes.gridLeft} ${classes.gridBottom}`}>
                            <h1 className={classes.disabledText}>Booking no</h1>
                        </Grid>
                        <Grid item xs={6} className={classes.gridBottom} >
                            <h1 className={classes.disabledText} >B/L no</h1>
                        </Grid>
                        <Grid item xs={6} contentEditable="true" className={classes.gridLeft}>
                        </Grid>
                        <Grid item xs={6} contentEditable="true">
                        </Grid>
                    </Grid>
                    <Grid>
                        <h1 className={classes.disabledText} >export references Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac consectetur nib</h1>
                        <Grid sx={{ height: "50px" }} >
                            <MyEditor content="export references Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac consectetur nib" />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6} className={`${classes.gridLeft} ${classes.gridBottom}`}>
                    <h1 className={classes.disabledText}>consignee</h1>
                    <MyEditor>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac consectetur nibh. Mauris vel ultrices est. Duis eget tincidunt ipsum. Sed ut maximus felis, quis blandit lorem. Nunc tortor leo, vestibulum a nisl id, dignissim luctus turpis. Suspendisse vestibulum tincidunt massa, ac vulputate tellus aliquam quis </MyEditor>
                </Grid>
                <Grid item xs={6} className={`${classes.gridBottom}`}>
                    <h1 className={classes.disabledText}>Forward agent references (FMC NO)</h1>
                    <MyEditor>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac consectetur nibh. Mauris vel ultrices est. Duis eget tincidunt ipsum. Sed ut maximus felis, quis blandit lorem. Nunc tortor leo, vestibulum a nisl id, dignissim luctus turpis. Suspendisse vestibulum tincidunt massa, ac vulputate tellus aliquam quis </MyEditor>
                </Grid>
                <Grid item xs={6} className={classes.gridBottom} >
                    <Grid container className={`${classes.gridLeft} ${classes.gridBottom}`}>
                        <h1 className={classes.disabledText}>Notify party</h1>
                        <MyEditor>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac consectetur nibh. Mauris vel ultrices est. Duis eget tincidunt ipsum. Sed ut maximus felis, quis blandit lorem. Nunc tortor leo, vestibulum a nisl id, dignissim luctus turpis. Suspendisse vestibulum tincidunt massa, ac vulputate tellus aliquam quis </MyEditor>
                    </Grid>
                    <Grid container >
                        <Grid item xs={6} className={`${classes.gridLeft} `}>
                            <h1 className={classes.disabledText}>pre carrilage by</h1>
                            <MyEditor> </MyEditor>
                        </Grid>
                        <Grid item xs={6} className={`${classes.gridLeft} `}>
                            <h1 className={classes.disabledText}>place of receipt (service type)</h1>
                            <MyEditor>Singapore </MyEditor>
                        </Grid>
                    </Grid>

                </Grid>
                <Grid item xs={6} className={classes.gridBottom}>
                    <h1 className={classes.disabledText}>Vivamus rutrum placerat commodo. Phasellus venenatis, lorem eget ornare tincidunt, ligula ante vulputate lorem, ac euismod nulla nulla id mi. Vivamus laoreet arcu ac turpis vestibulum molestie. Interdum et malesuada fames ac ante ipsum primis in faucibus. Mauris consequat sapien risus, vitae pulvinar libero sollicitudin quis. Cras eu magna faucibus, rhoncus erat nec, auctor est. Nullam sit amet elit commodo, auctor mi sed, vestibulum risus. Integer mattis diam ac ultrices lobortis. Donec eu tortor nec libero vestibulum aliquet. Vestibulum iaculis rutrum ullamcorper. Suspendisse a lorem non mi tincidunt facilisis ac sed lacus. Proin venenatis nec arcu vitae porta. Maecenas commodo quam eget odio tempor malesuada. Morbi commodo magna in congue efficitur. Praesent sed elit id sapien malesuada suscipit nec quis augue.</h1>
                </Grid>
                <Grid item xs={6} className={classes.gridBottom}>
                    <Grid container >
                        <Grid item xs={6} className={`${classes.gridLeft} ${classes.gridBottom}`}>
                            <h1 className={classes.disabledText}>Ocean vessel voyage NO Flag</h1>
                            <MyEditor> </MyEditor>
                        </Grid>
                        <Grid item xs={6} className={`${classes.gridLeft} ${classes.gridBottom}`}>
                            <h1 className={classes.disabledText}>Port of loading</h1>
                            <MyEditor> </MyEditor>
                        </Grid>
                        <Grid item xs={6} className={`${classes.gridLeft} `}>
                            <h1 className={classes.disabledText}>Port of discharged</h1>
                            <MyEditor />
                        </Grid>
                        <Grid item xs={6} className={`${classes.gridLeft} `}>
                            <h1 className={classes.disabledText}>Place of delivery (service type)</h1>
                            <MyEditor >Singapore</MyEditor>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6} className={classes.gridBottom}>
                    <Grid item xs={12} className={classes.gridBottom}>
                        <h1 className={classes.disabledText}>Final Destination(for line merchant's reference only</h1>
                        <MyEditor> </MyEditor>
                    </Grid>
                    <Grid item xs={12}>
                        <h1 className={classes.disabledText}>Type of movement (if mixedm use description of packages and good field)</h1>
                        <MyEditor> </MyEditor>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={4}>
                        <h1 className={classes.disabledText} style={{ marginRight: "4.0rem" }}>check "HM" column if hazardous materail</h1>

                    </Grid>
                    <Grid item xs={8}>
                        <h1 className={classes.disabledText}>particulars declared by shipper but not acknowledge by the carrier </h1>

                    </Grid>
                </Grid>
                <Grid container className={classes.grid}>
                    <Grid item xs={3} className={classes.gridLeft}>
                        <h1 className={classes.disabledText}>cntr inos w/seal nos marks & numbers</h1>
                    </Grid>
                    <Grid item xs={1} className={classes.gridLeft}>
                        <h1 className={classes.disabledText}>quantity (for customs declaration only)</h1>
                    </Grid>
                    <Grid item xs={4} className={classes.gridLeft}>
                        <h1 className={classes.disabledText}>descriptions of goods</h1>
                    </Grid>
                    <Grid item xs={2} className={classes.gridLeft}>
                        <h1 className={classes.disabledText}>gross weight</h1>
                    </Grid>
                    <Grid item xs={2} >
                        <h1 className={classes.disabledText}>measurement</h1>
                    </Grid>
                </Grid>
                <Grid container >
                    <div className="flex">
                        <p className={classes.normalText}>count-no: 0 /</p>
                        <p className={classes.normalText}>/          /</p>
                        <p className={classes.normalText}>10 packages /</p>
                        <p className={classes.normalText}>/           /</p>
                        <p className={classes.normalText}>10.000 KGS /</p>
                        <p className={classes.normalText}>10 CBM</p>

                    </div>
                </Grid>
                <Grid container >
                    <div className="flex">
                        <p className={classes.normalText}>count-no: 0 /</p>
                        <p className={classes.normalText}>/          /</p>
                        <p className={classes.normalText}>10 packages /</p>
                        <p className={classes.normalText}>/           /</p>
                        <p className={classes.normalText}>10.000 KGS /</p>
                        <p className={classes.normalText}>10 CBM</p>

                    </div>
                </Grid>
                <Grid container style={{ borderTop: "1px dashed black" }} >
                    <Grid item xs={3} style={{ borderRight: "1px solid black" }}>
                        <p className={classes.normalText}>PR SINGAPORE PTE LTD  </p>
                    </Grid>
                    <Grid item xs={1} style={{ borderRight: "1px solid black" }}>
                        <p className={classes.normalText}>10 packages</p>
                    </Grid>
                    <Grid item xs={4} style={{ borderRight: "1px solid black" }}>
                        <p className={classes.normalText}>PR SINGAPORE PTE LTD</p>
                    </Grid>
                    <Grid item xs={2} style={{ borderRight: "1px solid black" }}>
                        <p className={classes.normalText}>10000KGS</p>
                    </Grid>
                    <Grid item xs={2} >
                        <p className={classes.normalText}>10 CBM</p>
                    </Grid>
                </Grid>
                <Grid container  >
                    <Grid item xs={3} style={{ borderRight: "1px solid black" }}>
                        <p className={classes.normalText}>PR SINGAPORE PTE LTD  </p>
                    </Grid>
                    <Grid item xs={1} style={{ borderRight: "1px solid black" }}>
                        <p className={classes.normalText}>10 packages</p>
                    </Grid>
                    <Grid item xs={4} style={{ borderRight: "1px solid black" }}>
                        <p className={classes.normalText}>PR SINGAPORE PTE LTD</p>
                    </Grid>
                    <Grid item xs={2} style={{ borderRight: "1px solid black" }}>
                        <p className={classes.normalText}>10000KGS</p>
                    </Grid>
                    <Grid item xs={2} >
                        <p className={classes.normalText}>10 CBM</p>
                    </Grid>
                </Grid>
                <Grid container  >
                    <Grid item xs={3} style={{ borderRight: "1px solid black" }}>
                        <p className={classes.normalText}>PR SINGAPORE PTE LTD  </p>
                    </Grid>
                    <Grid item xs={1} style={{ borderRight: "1px solid black" }}>
                        <p className={classes.normalText}>10 packages</p>
                    </Grid>
                    <Grid item xs={4} style={{ borderRight: "1px solid black" }}>
                        <p className={classes.normalText}>PR SINGAPORE PTE LTD</p>
                    </Grid>
                    <Grid item xs={2} style={{ borderRight: "1px solid black" }}>
                        <p className={classes.normalText}>10000KGS</p>
                    </Grid>
                    <Grid item xs={2} >
                        <p className={classes.normalText}>10 CBM</p>
                    </Grid>
                </Grid>
                <Grid container  >
                    <Grid item xs={3} style={{ borderRight: "1px solid black" }}>
                        <p className={classes.normalText}>PR SINGAPORE PTE LTD  </p>
                    </Grid>
                    <Grid item xs={1} style={{ borderRight: "1px solid black" }}>
                        <p className={classes.normalText}>10 packages</p>
                    </Grid>
                    <Grid item xs={4} style={{ borderRight: "1px solid black" }}>
                        <p className={classes.normalText}>PR SINGAPORE PTE LTD</p>
                    </Grid>
                    <Grid item xs={2} style={{ borderRight: "1px solid black" }}>
                        <p className={classes.normalText}>10000KGS</p>
                    </Grid>
                    <Grid item xs={2} >
                        <p className={classes.normalText}>10 CBM</p>
                    </Grid>
                </Grid>
                <Grid container  >
                    <Grid item xs={3} style={{ borderRight: "1px solid black" }}>
                        <p className={classes.normalText}>PR SINGAPORE PTE LTD  </p>
                    </Grid>
                    <Grid item xs={1} style={{ borderRight: "1px solid black" }}>
                        <p className={classes.normalText}>10 packages</p>
                    </Grid>
                    <Grid item xs={4} style={{ borderRight: "1px solid black" }}>
                        <p className={classes.normalText}>PR SINGAPORE PTE LTD</p>
                    </Grid>
                    <Grid item xs={2} style={{ borderRight: "1px solid black" }}>
                        <p className={classes.normalText}>10000KGS</p>
                    </Grid>
                    <Grid item xs={2} >
                        <p className={classes.normalText}>10 CBM</p>
                    </Grid>
                </Grid>
                <Grid container  >
                    <Grid item xs={3} style={{ borderRight: "1px solid black" }}>
                        <p className={classes.normalText}>PR SINGAPORE PTE LTD  </p>
                    </Grid>
                    <Grid item xs={1} style={{ borderRight: "1px solid black" }}>
                        <p className={classes.normalText}>10 packages</p>
                    </Grid>
                    <Grid item xs={4} style={{ borderRight: "1px solid black" }}>
                        <p className={classes.normalText}>PR SINGAPORE PTE LTD</p>
                    </Grid>
                    <Grid item xs={2} style={{ borderRight: "1px solid black" }}>
                        <p className={classes.normalText}>10000KGS</p>
                    </Grid>
                    <Grid item xs={2} >
                        <p className={classes.normalText}>10 CBM</p>
                    </Grid>
                </Grid>
                <Grid container  >
                    <Grid item xs={3} style={{ borderRight: "1px solid black" }}>
                        <p className={classes.normalText}>PR SINGAPORE PTE LTD  </p>
                    </Grid>
                    <Grid item xs={1} style={{ borderRight: "1px solid black" }}>
                        <p className={classes.normalText}>10 packages</p>
                    </Grid>
                    <Grid item xs={4} style={{ borderRight: "1px solid black" }}>
                        <p className={classes.normalText}>PR SINGAPORE PTE LTD</p>
                    </Grid>
                    <Grid item xs={2} style={{ borderRight: "1px solid black" }}>
                        <p className={classes.normalText}>10000KGS</p>
                    </Grid>
                    <Grid item xs={2} >
                        <p className={classes.normalText}>10 CBM</p>
                    </Grid>
                </Grid>
            </Grid>
            <Grid xs={12} style={{ borderBottom: '1px solid black' }}>
                <h1 className={classes.disabledText}>Ocean Preight prepaid</h1>
            </Grid>

        </div >
    );
}

export default Bill;
