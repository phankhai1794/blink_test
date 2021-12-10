import React, { useEffect } from 'react';
import {
    Button,
    Grid
} from '@material-ui/core';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import ShareIcon from '@material-ui/icons/Share';
import SendIcon from '@material-ui/icons/Send';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import HelpIcon from '@material-ui/icons/Help';
import { FuseAnimate } from '@fuse';

import MyEditor from "./MyEditor"

const useStyles = makeStyles(theme => ({
    disabledText: {
        // color: theme.palette.secondary.contrastText,
        color: "blue",
        fontSize: "1rem",
        textTransform: "uppercase"
    },
    disabledText1: {
        // color: theme.palette.secondary.contrastText,
        color: "blue",
        fontSize: "1.1rem",
        display: "block",
        lineHeight: "1.2"
    },
    gridFull: {
        border: "1px solid blue"
    },
    grid: {
        borderTop: "1px solid blue",
        borderBottom: "1px solid blue"
    },
    gridLeft: {
        borderRight: "1px solid blue",
    },
    gridRight: {
        borderRight: "1px solid blue",
    },
    gridTop: {
        borderTop: '1px solid blue',
    },
    gridBottom: {
        borderBottom: "1px solid blue",
    },
    normalText: {
        color: "grey",
        textTransform: "uppercase",
        fontSize: "1.1rem"
    },
    highlight: {
        backgroundColor: "yellow"
    },
    popover: {
        backgroundColor: "green",
        color: theme.palette.primary.contrastText
    },
    font: {
        fontFamily: "Courier New"
    },
    hasComment: {
        float: "right",
        outline: "1px solid red",
        border: '3px solid red',
        marginTop: "-1px",
        marginLeft: "-1px"
    }
}));

const Bill = (props) => {
    const { status } = props;

    const classes = useStyles(props)
    return (
        <div className={classes.font}>
            <div className=" items-center justify-between pr-8 sm:px-12 my-4 ">
                {/* <ThemeProvider theme={mainTheme}>
                            </ThemeProvider> */}
                <FuseAnimate animation="transition.slideUpIn" delay={350}>
                    <div className="flex">
                        <>
                            {status === "amended" ?
                                <>
                                    <HelpIcon fontSize="large" className="mx-4" />
                                    <span className="sm:mt-12">Show Inquiry</span>
                                </>
                                : status === "request" ?
                                    <>
                                        <HelpIcon fontSize="large" className="mx-4" />
                                        <span className="sm:mt-12">Add Inquiry</span>
                                    </> : <></>
                            }
                        </>
                        <div className="flex ml-auto">
                            {status === "inquiry" ?
                                <><Button
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
                                    </Button></>
                                : status === "confirm" ?
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        // onClick={handleCreateBooking}
                                        className="mx-4"
                                    >
                                        <ShareIcon className="mx-4" />
                                        Update to Opus
                                    </Button>
                                    : status === "amended" ?
                                        <>
                                            <div>Attachment: <br></br> <a href="https://drive.google.com/file/d/1gS-CJ0nu1i4j0uVY7azbQ1y8OoicaZ8j/view">
                                                <img src='http://wwwimages.adobe.com/content/dam/acom/en/legal/images/badges/Adobe_PDF_file_icon_32x32.png'></img></a> </div>
                                            <Button
                                                color="primary"
                                                variant="contained"
                                                // onClick={handleCreateBooking}
                                                className="mx-4"
                                            >
                                                <ShareIcon className="mx-4" />
                                                Upload to Opus
                                            </Button> </> :
                                        <>
                                            <div>Attachment: <br></br> <a href="https://drive.google.com/file/d/1gS-CJ0nu1i4j0uVY7azbQ1y8OoicaZ8j/view">
                                                <img src='http://wwwimages.adobe.com/content/dam/acom/en/legal/images/badges/Adobe_PDF_file_icon_32x32.png'></img></a> </div>
                                            <Button
                                                color="primary"
                                                variant="contained"
                                                // onClick={handleCreateBooking}
                                                className="mx-4"
                                            >
                                                <ShareIcon className="mx-4" />
                                                Send Inquiry
                                            </Button>
                                            <Button
                                                color="primary"
                                                variant="contained"
                                                className="mx-4"
                                            // onClick={handleCreateBooking}
                                            >
                                                <SendIcon className="mx-4" />
                                                Upload to Opus
                                            </Button></>
                            }
                            <Button
                                color="primary"
                                variant="contained"
                                className="mx-4"
                            >
                                History version
                                <ArrowDropDownIcon className="mx-4" />
                            </Button>
                        </div>
                    </div>
                </FuseAnimate>
            </div>
            <div className="flex mt-2">
                <div className="flex-auto">
                    <img src="./assets/images/logos/one_ocean_network-logo.png" className="object-scale-down h-40 w-50 pt-24" />
                </div>
                <div className="flex-auto mr-2">
                    <p className={`text-2xl font-extrabold`}>COPY NON NEGOTIABLE</p>
                </div>
                <div className="flex-auto">
                    {/* <Typography>SEA WAY BILL</Typography> */}
                    <p className={`text-2xl font-extrabold`}>SEA WAY BILL</p>
                </div>
            </div>
            <Grid container className={classes.grid}>
                <Grid item xs={6} className={`${classes.gridLeft} ${classes.gridBottom}`}>
                    <h1 className={classes.disabledText}>shipper/exporter </h1>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac consectetur nibh. Mauris vel ultrices est. Duis eget tincidunt ipsum. Sed ut maximus felis, quis blandit lorem. Nunc tortor leo, vestibulum a nisl id, dignissim luctus turpis. Suspendisse vestibulum tincidunt massa, ac vulputate tellus aliquam quis

                </Grid>
                <Grid item xs={6} className={classes.gridBottom}>
                    <Grid container className="my-0" className={classes.gridBottom}>
                        <Grid item xs={6} className={`${classes.gridLeft}`}>
                            <h1 className={classes.disabledText}>Booking no.</h1>
                        </Grid>
                        <Grid item xs={6}>
                            <h1 className={classes.disabledText} >sea waybill no.</h1>
                        </Grid>
                    </Grid>
                    <Grid>
                        <h1 className={classes.disabledText} >export references(for the merchant's and/or Carrier's reference only. See back clause 8.(4.))</h1>
                        <Grid sx={{ height: "50px" }} >
                            export references Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac consectetur nib
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6} className={`${classes.gridLeft} ${classes.gridBottom} `}>
                    <h1 className={classes.disabledText}>consignee</h1>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac consectetur nibh. Mauris vel ultrices est. Duis eget tincidunt ipsum. Sed ut maximus felis, quis blandit lorem. Nunc tortor leo, vestibulum a nisl id, dignissim luctus turpis. Suspendisse vestibulum tincidunt massa, ac vulputate tellus aliquam quis
                </Grid>
                <Grid item xs={6} className={`${classes.gridBottom}`}>
                    <h1 className={classes.disabledText}>Forwarding agent-references FMC NO.</h1>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac consectetur nibh. Mauris vel ultrices est. Duis eget tincidunt ipsum. Sed ut maximus felis, quis blandit lorem. Nunc tortor leo, vestibulum a nisl id, dignissim luctus turpis. Suspendisse vestibulum tincidunt massa, ac vulputate tellus aliquam quis
                </Grid>
                <Grid item xs={6} className={`${classes.gridLeft} ${classes.gridBottom}`} >
                    <Grid container >
                        <Grid item xs={12} className={`${classes.gridBottom}`}>
                            <h1 className={classes.disabledText}>Notify party (It is agreed that no responsibility shall be attached to the Carrier or its Agents for failure to notify)</h1>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ac consectetur nibh. Mauris vel ultrices est. Duis eget tincidunt ipsum. Sed ut maximus felis, quis blandit lorem. Nunc tortor leo, vestibulum a nisl id, dignissim luctus turpis. Suspendisse vestibulum tincidunt massa, ac vulputate tellus aliquam quis
                        </Grid>
                        <Grid item xs={6} className={`${classes.gridLeft} `}>
                            <h1 className={classes.disabledText}>pre-carriage by</h1>
                            em ipsum dolor sit amet,
                        </Grid>
                        <Grid item xs={6} style={{ paddingTop: "0px" }}>
                            {/* <h1 className={classes.disabledText}>place of receipt</h1> */}
                            <MyEditor title="place of receipt" paddingBottom="78px">Singapore </MyEditor>
                        </Grid>
                    </Grid>

                </Grid>
                <Grid item xs={6} className={classes.gridBottom}>
                    <span className={classes.disabledText1}>RECEIVED by the Carrier in apparent good order and condition (unless otherwise stated herein) the total number or quantity of Containers or other packages
                        or units indicated in the box entitled "Carrier's Receipt",to be carried subject to all the terms and conditions hereof from the Place of Receipt or Port of Loading to thePort of Discharge or
                        Place of Delivery, as applicable. Delivery of the Goods to the Carrier for Carriagehereunder constitutes acceptance by the Merchant (as defined hereinafter) (i) of all the terms and conditions,whether printed, stamped
                        or otherwise incorporated on this side and on the reverse side of this Bill of ladingand the terms and conditions of the Carrier's applicable tariff(s) as if they were all signed by the Merchant,and (ii) that any prior representations and/or agreements for or in connection with Carriage of the Goods
                        aresuperseded by this Bill of Lading. If this is a negotiable (To Order/of) Bill of Lading, one original Bill of Lading,duly endorsed must be surrendered by the Merchant to the Carrier (together with any outstanding Freight) inexchange for the Goods or a Delivery Order or the pin codes for any applicable
                        Electronic Release System.If this is a non-negotiable (straight) Bill of Lading, or where issued as a Sea Waybill, the Carrier shall deliverthe Goods or issue a Delivery Order or the pin codes for any applicable Electronic Release System (afterpayment of outstanding Freight) to the named consignee against the surrender of one original Bill of Lading,or
                        in the case of a Sea Waybill, on production of such reasonable proof of identify as may be required by theCarrier, or in accordance with the national law at the Port of Discharge or Place of Delivery as applicable. INWITNESS WHEREOF the Carrier or their Agent has signed the number of Bills of Lading stated at the top,all of this tenor and date, and whenever
                        one original Bill of Lading has been surrendered all other Bills ofLading shall be void.</span>
                </Grid>
                <Grid item xs={6} className={classes.gridBottom}>
                    <Grid container >
                        <Grid item xs={6} className={`${classes.gridLeft} ${classes.gridBottom}`}>
                            <h1 className={classes.disabledText}>Ocean vessel voyage NO. Flag</h1>
                            em ipsum dolor sit amet
                        </Grid>
                        <Grid item xs={6} className={`${classes.gridLeft} ${classes.gridBottom} ${classes.hasComment}`}>
                            <MyEditor title="Port of loading" hasComment={true} paddingBottom="">Singapore</MyEditor>
                        </Grid>
                        <Grid item xs={6} className={`${classes.gridLeft} `}>
                            <h1 className={classes.disabledText}>Port of discharge</h1>
                            em ipsum dolor sit amet
                        </Grid>
                        <Grid item xs={6} className={`${classes.gridLeft} `}>
                            <h1 className={classes.disabledText}>Place of delivery</h1>
                            em ipsum dolor sit amet
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6} className={classes.gridBottom}>
                    <Grid item xs={12} className={classes.gridBottom}>
                        <h1 className={classes.disabledText}>Final Destination(for line merchant's reference only)</h1>
                        em ipsum dolor sit amet
                    </Grid>
                    <Grid item xs={12}>
                        <h1 className={classes.disabledText}>Type of movement (if mixed, use description of packages and goods field)</h1>
                        em ipsum dolor sit amet
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={4}>
                        <h1 className={classes.disabledText} style={{ marginRight: "4.0rem" }}>(check "HM" column if hazardous material)</h1>

                    </Grid>
                    <Grid item xs={8}>
                        <h1 className={classes.disabledText}>particulars declared by shipper but not acknowledged by the carrier </h1>

                    </Grid>
                </Grid>
                <Grid container className={classes.grid}>
                    <Grid item xs={3} className={classes.gridLeft}>
                        <h1 className={`${classes.disabledText} text-center`}>cntr nos. w/seal nos. marks & numbers</h1>
                    </Grid>
                    <Grid item xs={1} className={classes.gridLeft}>
                        <h1 className={`${classes.disabledText} text-center`}>quantity (for customs declaration only)</h1>
                    </Grid>
                    <Grid item xs={4} className={classes.gridLeft}>
                        <h1 className={`${classes.disabledText} text-center`}>description of goods</h1>
                    </Grid>
                    <Grid item xs={2} className={classes.gridLeft}>
                        <h1 className={`${classes.disabledText} text-center`}>gross weight</h1>
                    </Grid>
                    <Grid item xs={2} >
                        <h1 className={`${classes.disabledText} text-center`}>gross measurement</h1>
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
                <Grid container style={{ borderTop: "1px dashed blue" }} >
                    <Grid item xs={3} style={{ borderRight: "1px solid blue" }}>
                        <p className={classes.normalText}>PR SINGAPORE PTE LTD  </p>
                    </Grid>
                    <Grid item xs={1} style={{ borderRight: "1px solid blue" }}>
                        <p className={classes.normalText}>10 packages</p>
                    </Grid>
                    <Grid item xs={4} style={{ borderRight: "1px solid blue" }}>
                        <p className={classes.normalText}>PR SINGAPORE PTE LTD</p>
                    </Grid>
                    <Grid item xs={2} style={{ borderRight: "1px solid blue" }}>
                        <p className={classes.normalText}>10000KGS</p>
                    </Grid>
                    <Grid item xs={2} >
                        <p className={classes.normalText}>10 CBM</p>
                    </Grid>
                </Grid>
                <Grid container  >
                    <Grid item xs={3} style={{ borderRight: "1px solid blue" }}>
                        <p className={classes.normalText}>PR SINGAPORE PTE LTD  </p>
                    </Grid>
                    <Grid item xs={1} style={{ borderRight: "1px solid blue" }}>
                        <p className={classes.normalText}>10 packages</p>
                    </Grid>
                    <Grid item xs={4} style={{ borderRight: "1px solid blue" }}>
                        <p className={classes.normalText}>PR SINGAPORE PTE LTD</p>
                    </Grid>
                    <Grid item xs={2} style={{ borderRight: "1px solid blue" }}>
                        <p className={classes.normalText}>10000KGS</p>
                    </Grid>
                    <Grid item xs={2} >
                        <p className={classes.normalText}>10 CBM</p>
                    </Grid>
                </Grid>
                <Grid container  >
                    <Grid item xs={3} style={{ borderRight: "1px solid blue" }}>
                        <p className={classes.normalText}>PR SINGAPORE PTE LTD  </p>
                    </Grid>
                    <Grid item xs={1} style={{ borderRight: "1px solid blue" }}>
                        <p className={classes.normalText}>10 packages</p>
                    </Grid>
                    <Grid item xs={4} style={{ borderRight: "1px solid blue" }}>
                        <p className={classes.normalText}>PR SINGAPORE PTE LTD</p>
                    </Grid>
                    <Grid item xs={2} style={{ borderRight: "1px solid blue" }}>
                        <p className={classes.normalText}>10000KGS</p>
                    </Grid>
                    <Grid item xs={2} >
                        <p className={classes.normalText}>10 CBM</p>
                    </Grid>
                </Grid>
                <Grid container  >
                    <Grid item xs={3} style={{ borderRight: "1px solid blue" }}>
                        <p className={classes.normalText}>PR SINGAPORE PTE LTD  </p>
                    </Grid>
                    <Grid item xs={1} style={{ borderRight: "1px solid blue" }}>
                        <p className={classes.normalText}>10 packages</p>
                    </Grid>
                    <Grid item xs={4} style={{ borderRight: "1px solid blue" }}>
                        <p className={classes.normalText}>PR SINGAPORE PTE LTD</p>
                    </Grid>
                    <Grid item xs={2} style={{ borderRight: "1px solid blue" }}>
                        <p className={classes.normalText}>10000KGS</p>
                    </Grid>
                    <Grid item xs={2} >
                        <p className={classes.normalText}>10 CBM</p>
                    </Grid>
                </Grid>
                <Grid container  >
                    <Grid item xs={3} style={{ borderRight: "1px solid blue" }}>
                        <p className={classes.normalText}>PR SINGAPORE PTE LTD  </p>
                    </Grid>
                    <Grid item xs={1} style={{ borderRight: "1px solid blue" }}>
                        <p className={classes.normalText}>10 packages</p>
                    </Grid>
                    <Grid item xs={4} style={{ borderRight: "1px solid blue" }}>
                        <p className={classes.normalText}>PR SINGAPORE PTE LTD</p>
                    </Grid>
                    <Grid item xs={2} style={{ borderRight: "1px solid blue" }}>
                        <p className={classes.normalText}>10000KGS</p>
                    </Grid>
                    <Grid item xs={2} >
                        <p className={classes.normalText}>10 CBM</p>
                    </Grid>
                </Grid>
                <Grid container  >
                    <Grid item xs={3} style={{ borderRight: "1px solid blue" }}>
                        <p className={classes.normalText}>PR SINGAPORE PTE LTD  </p>
                    </Grid>
                    <Grid item xs={1} style={{ borderRight: "1px solid blue" }}>
                        <p className={classes.normalText}>10 packages</p>
                    </Grid>
                    <Grid item xs={4} style={{ borderRight: "1px solid blue" }}>
                        <p className={classes.normalText}>PR SINGAPORE PTE LTD</p>
                    </Grid>
                    <Grid item xs={2} style={{ borderRight: "1px solid blue" }}>
                        <p className={classes.normalText}>10000KGS</p>
                    </Grid>
                    <Grid item xs={2} >
                        <p className={classes.normalText}>10 CBM</p>
                    </Grid>
                </Grid>
                <Grid container  >
                    <Grid item xs={3} style={{ borderRight: "1px solid blue" }}>
                        <p className={classes.normalText}>PR SINGAPORE PTE LTD  </p>
                    </Grid>
                    <Grid item xs={1} style={{ borderRight: "1px solid blue" }}>
                        <p className={classes.normalText}>10 packages</p>
                    </Grid>
                    <Grid item xs={4} style={{ borderRight: "1px solid blue" }}>
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
            <Grid style={{ borderBottom: '1px solid blue' }}>
                <h1 className={classes.disabledText}>Ocean Preight prepaid</h1>
            </Grid>

        </div>
    );
}

export default Bill;
