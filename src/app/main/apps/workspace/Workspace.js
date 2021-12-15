import React, { useEffect } from 'react';
import {
    Button,
    Grid,
    TextField,
    Divider
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import PopoverTextField from './components/PopoverTextField';
import { useState } from 'react';
const useStyles = makeStyles(theme => ({
    root: {
        // color: theme.palette.secondary.contrastText,
        backgroundColor: "#f5f8fa",
    },
    input: {
        fontFamily: "Courier New"
    }

}))
// const data = {
//     id: 1,
//     content: "PlACE OF RECEIPT",
//     questions:
//         {
//             name: "place of receipt",
//             type: "Multiplechoice question",
//             choices: [
//                 {
//                     id: 1,
//                     content: "Malaysia"
//                 },
//                 {
//                     id: 2,
//                     content: "Indonesia"
//                 }
//             ],
//             addOther: false
//         },
// }
const mockData = {
    id: 1,
    content: "PlACE OF RECEIPT",
    question: {}

}
const Workspace = (props) => {
    const classes = useStyles(props)
    const [data, setData] = useState(mockData)
    const onSave = (savedQuestion) => {
        setData({
            ...data,
            question: savedQuestion
        })
        // console.log(savedQuestion)
    }
    return (
        <div className="ml-20" style={{ fontFamily: "Courier New" }}>
            <Grid container>
                <Grid item xs={5}>
                    <Grid item xs={11}>
                        <h3>Shipper/Exporter </h3>
                        <PopoverTextField>
                            <TextField disabled id="outlined-disabled"
                                defaultValue="DSV AIR & SEA CO. LTD. AS AGENT OF
                            DSV OCEAN TRANSPORT A/S
                            3F IXINAL MONZEN-NAKACHO BLDG.
                            2-5-4 FUKUZUMI, KOTO-KU, TOKYO,
                            135-0032, JAPAN"
                                variant="outlined"
                                fullWidth={true}
                                multiline
                                classes={{ root: classes.root }}
                                InputProps={{ classes: { root: classes.input } }}
                            />
                        </PopoverTextField>
                    </Grid>
                    <Grid item xs={11}>
                        <h3>Consignee</h3>
                        <PopoverTextField>
                            <TextField disabled id="outlined-disabled"
                                defaultValue=" DSV AIR & SEA LTD. -1708
                                16TH FLOOR, HANSSEM BLDG 179,
                                SEONGAM-RO. MAPO-GU SEOUL 03929
                                KOREA"
                                variant="outlined"
                                multiline
                                fullWidth={true}
                                classes={{ root: classes.root }}
                                InputProps={{ classes: { root: classes.input } }}
                            />
                        </PopoverTextField>
                    </Grid>
                    <Grid item xs={11}>
                        <h3>NOTIFY PARTY (It is agreed that no responsibility shall be <br></br> attached to the Carrier or its Agents for failure to notify)</h3>
                        <PopoverTextField>
                            <TextField disabled id="outlined-disabled"
                                defaultValue=" DSV AIR & SEA LTD. -1708
                                16TH FLOOR, HANSSEM BLDG 179,
                                SEONGAM-RO. MAPO-GU SEOUL 03929
                                KOREA"
                                variant="outlined"
                                multiline
                                fullWidth={true}
                                classes={{ root: classes.root }}
                                InputProps={{ classes: { root: classes.input } }}
                            />
                        </PopoverTextField>
                    </Grid>
                    <Grid container xs={11} >
                        <Grid item xs={7} >
                            <h3>PRE-CARRIAGE BY</h3>
                            <PopoverTextField fullWidth={false}>
                                <TextField disabled id="outlined-disabled"
                                    defaultValue=""
                                    variant="outlined"
                                    classes={{ root: classes.root }}
                                    InputProps={{ classes: { root: classes.input } }}
                                />
                            </PopoverTextField>
                        </Grid>
                        <Grid item xs={5} >
                            <h3>PLACE OF RECEIPT</h3>
                            <PopoverTextField question={data.question} onSave={onSave} >
                                <TextField disabled id="outlined-disabled"
                                    defaultValue="SINGAPORE"
                                    variant="outlined"
                                    fullWidth={true}
                                    classes={{ root: classes.root }}
                                    InputProps={{ classes: { root: classes.input } }}
                                />
                            </PopoverTextField>
                        </Grid>
                    </Grid>
                    <Grid container xs={11}>
                        <Grid item xs={7} >
                            <h3>OCEAN VESSEL VOYAGE NO. FlAG</h3>
                            <PopoverTextField fullWidth={false}>
                                <TextField disabled id="outlined-disabled"
                                    defaultValue="CONFIDENCE 021W"
                                    variant="outlined"
                                    classes={{ root: classes.root }}
                                    InputProps={{ classes: { root: classes.input } }}
                                />
                            </PopoverTextField>
                        </Grid>
                        <Grid item xs={5} >
                            <h3>PORT OF LOADING</h3>
                            <PopoverTextField >
                                <TextField disabled id="outlined-disabled"
                                    defaultValue="TOKYO,JAPAN"
                                    variant="outlined"
                                    fullWidth={true}
                                    classes={{ root: classes.root }}
                                    InputProps={{ classes: { root: classes.input } }}
                                />
                            </PopoverTextField>
                        </Grid>
                        <Grid item xs={7} >
                            <h3>PORT OF DISCHARGE</h3>
                            <PopoverTextField fullWidth={false}>
                                <TextField disabled id="outlined-disabled"
                                    defaultValue="BUSAN, KOREA"
                                    variant="outlined"
                                    classes={{ root: classes.root }}
                                    InputProps={{ classes: { root: classes.input } }}
                                />
                            </PopoverTextField>
                        </Grid>
                        <Grid item xs={5} >
                            <h3>PLACE OF DELIVERY</h3>
                            <PopoverTextField>

                                <TextField disabled id="outlined-disabled"
                                    defaultValue="BUSAN"
                                    variant="outlined"
                                    fullWidth={true}
                                    classes={{ root: classes.root }}
                                    InputProps={{ classes: { root: classes.input } }}
                                />
                            </PopoverTextField>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6} spacing={2}>
                    <Grid container spacing={10} >
                        <Grid item xs={5} >
                            <h3 >BOOKING NO.</h3>
                            <PopoverTextField>
                                <TextField disabled id="outlined-disabled"
                                    defaultValue="TYOBD9739500"
                                    variant="outlined"
                                    fullWidth={true}
                                    classes={{ root: classes.root }}
                                    InputProps={{ classes: { root: classes.input } }}
                                />
                            </PopoverTextField>
                        </Grid>
                        <Grid item xs={5}>
                            <h3>SEA WAYBILL NO.</h3>
                            <PopoverTextField>
                                <TextField disabled id="outlined-disabled"
                                    defaultValue="ONEYTOBD9739500"
                                    variant="outlined"
                                    fullWidth={true}
                                    classes={{ root: classes.root }}
                                    InputProps={{ classes: { root: classes.input } }}
                                />
                            </PopoverTextField>
                        </Grid>
                    </Grid>
                    <Grid item xs={10}>
                        <h3>EXPORT REFERENCES (for the merchant's and/or Carrier's reference only. See back clause 8. (4.))</h3>
                        <PopoverTextField>
                            <Grid sx={{ height: "50px" }} >
                                <TextField disabled id="outlined-disabled"
                                    defaultValue=""
                                    variant="outlined"
                                    fullWidth={true}
                                    classes={{ root: classes.root }}
                                    InputProps={{ classes: { root: classes.input } }}
                                />
                            </Grid>
                        </PopoverTextField>
                    </Grid>
                    <Grid item xs={10} className="mt-32">
                        <span >RECEIVED by the Carrier in apparent good order and condition (unless otherwise stated herein) the total number or quantity of Containers or other packages
                            or units indicated in the box entitled "Carrier's Receipt",to be carried subject to all the terms and conditions hereof from the Place of Receipt or Port of Loading to thePort of Discharge or
                            Place of Delivery, as applicable. Delivery of the Goods to the Carrier for Carriagehereunder constitutes acceptance by the Merchant (as defined hereinafter) (i) of all the terms and conditions,whether printed, stamped
                            or otherwise incorporated on this side and on the reverse side of this Bill of ladingand the terms and conditions of the Carrier's applicable tariff(s) as if they were all signed by the Merchant,and (ii) that any prior representations and/or agreements for or in connection with Carriage of the Goods
                            aresuperseded by this Bill of Lading. If this is a negotiable (To Order/of) Bill of Lading, one original Bill of Lading,duly endorsed must be surrendered by the Merchant to the Carrier (together with any outstanding Freight) inexchange for the Goods or a Delivery Order or the pin codes for any applicable
                            Electronic Release System.If this is a non-negotiable (straight) Bill of Lading, or where issued as a Sea Waybill, the Carrier shall deliverthe Goods or issue a Delivery Order or the pin codes for any applicable Electronic Release System (afterpayment of outstanding Freight) to the named consignee against the surrender of one original Bill of Lading,or
                            in the case of a Sea Waybill, on production of such reasonable proof of identify as may be required by theCarrier, or in accordance with the national law at the Port of Discharge or Place of Delivery as applicable. INWITNESS WHEREOF the Carrier or their Agent has signed the number of Bills of Lading stated at the top,all of this tenor and date, and whenever
                            one original Bill of Lading has been surrendered all other Bills ofLading shall be void.</span>
                    </Grid>
                    <Grid item xs={10}>
                        <h3>FINAL DESTINATION(for line merchant's reference only)</h3>
                        <PopoverTextField>
                            <Grid sx={{ height: "50px" }} >
                                <TextField disabled id="outlined-disabled"
                                    defaultValue="BUSAN, KOREA"
                                    variant="outlined"
                                    fullWidth={true}
                                    classes={{ root: classes.root }}
                                    InputProps={{ classes: { root: classes.input } }}
                                />
                            </Grid>
                        </PopoverTextField>
                    </Grid>
                    <Grid item xs={10}>
                        <h3>TYPE OF MOMENT (IF MIXED, USE DESCRIPTION OF <br></br> PACKAGES AND GOODS FIELD)</h3>
                        <PopoverTextField>
                            <Grid sx={{ height: "50px" }} >
                                <TextField disabled id="outlined-disabled"
                                    defaultValue="R1CB118000"
                                    variant="outlined"
                                    fullWidth={true}
                                    classes={{ root: classes.root }}
                                    InputProps={{ classes: { root: classes.input } }}
                                />
                            </Grid>
                        </PopoverTextField>
                    </Grid>
                </Grid>
            </Grid>
            <Divider className="my-32" />
            <Grid container spacing={8} >
                <Grid item xs={2}>
                    <h3> Container No.1 </h3>
                </Grid>
                <Grid item xs={2} >
                    <PopoverTextField>
                        <TextField disabled id="outlined-disabled"
                            defaultValue="262 Packages"
                            variant="outlined"
                            fullWidth={true}
                            classes={{ root: classes.root }}
                            InputProps={{ classes: { root: classes.input } }}
                        />
                    </PopoverTextField>
                </Grid>
                <Grid item xs={2}>
                    <PopoverTextField>
                        <TextField disabled id="outlined-disabled"
                            defaultValue="1,716.000 KGS"
                            variant="outlined"
                            fullWidth={true}
                            classes={{ root: classes.root }}
                            InputProps={{ classes: { root: classes.input } }}
                        />
                    </PopoverTextField>
                </Grid>
                <Grid item xs={2}>
                    <PopoverTextField>
                        <TextField disabled id="outlined-disabled"
                            defaultValue="3,560 CBM"
                            variant="outlined"
                            fullWidth={true}
                            classes={{ root: classes.root }}
                            InputProps={{ classes: { root: classes.input } }}
                        />
                    </PopoverTextField>
                </Grid>
            </Grid>
            <Grid container spacing={8} >
                <Grid item xs={2}>
                    <h3> Container No.2 </h3>
                </Grid>
                <Grid item xs={2} >
                    <PopoverTextField>
                        <TextField disabled id="outlined-disabled"
                            defaultValue="262 Packages"
                            variant="outlined"
                            fullWidth={true}
                            classes={{ root: classes.root }}
                            InputProps={{ classes: { root: classes.input } }}
                        />
                    </PopoverTextField>
                </Grid>
                <Grid item xs={2}>
                    <PopoverTextField>
                        <TextField disabled id="outlined-disabled"
                            defaultValue="1,716.000 KGS"
                            variant="outlined"
                            fullWidth={true}
                            classes={{ root: classes.root }}
                            InputProps={{ classes: { root: classes.input } }}
                        />
                    </PopoverTextField>
                </Grid>
                <Grid item xs={2}>
                    <PopoverTextField>
                        <TextField disabled id="outlined-disabled"
                            defaultValue="3,560 CBM"
                            variant="outlined"
                            fullWidth={true}
                            classes={{ root: classes.root }}
                            InputProps={{ classes: { root: classes.input } }}
                        />
                    </PopoverTextField>
                </Grid>
            </Grid>
        </div>
    )
}
export default Workspace;
