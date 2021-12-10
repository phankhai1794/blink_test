import React, { useState } from 'react';
import { Button, Checkbox } from '@material-ui/core';
import CommentBox from "./CommentBox"
import { makeStyles } from '@material-ui/styles';
import { classNames } from 'react-select/lib/utils'
const useStyles = makeStyles(theme => ({
    submit_btn: {
        paddingLeft: "4rem",
        paddingRight: "4rem",
        borderRadius: "20px"
    },
    active_btn: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
        "&:hover": {
            //you want this to be the same as the backgroundColor above
            backgroundColor: theme.palette.primary.dark,
            color: theme.palette.primary.contrastText,
        }
    },
    choice_btn: {
        width: "100%",
        justifyContent: 'left',
        marginBottom: "2rem"
    },
    title: {
        marginBottom: "4px",
        marginTop: "0px"
    }

}))
const InformationForm = (props) => {
    const [isEdit, setIsEdit] = useState(props.hasComment ? true : false)
    const classes = useStyles()
    const [choice, setChoice] = useState("")
    return (
        <div style={{ padding: "20px", width: "320px", maxHeight: "450px" }}>
            <h2 className={classes.title}> Place of Receipt</h2>
            {!isEdit && (
                <div className="block">
                    <Button color={`${choice === "0" ? "" : "primary"}`} variant="contained" className={`${classes.choice_btn} ${choice === "0" ? classes.active_btn : ""}`} onClick={() => setChoice("0")}>
                        Routing/ Inquiry/Descrepancy
                    </Button>
                    <Button color={`${choice === "1" ? "" : "primary"}`} variant="contained" className={`${classes.choice_btn} ${choice === "1" ? classes.active_btn : ""}`} onClick={() => setChoice("1")}>
                        Broken Route Error
                    </Button>
                    <Button color={`${choice === "2" ? "" : "primary"}`} variant="contained" className={`${classes.choice_btn} ${choice === "2" ? classes.active_btn : ""}`} onClick={() => setChoice("2")}>
                        Missing Destination requirement
                    </Button>
                    <hr />
                </div>
            )}

            <div className="flex">
                <Checkbox
                    value={isEdit}
                    checked={isEdit}
                    onClick={() => setIsEdit(!isEdit)} />
                <p>Ask customer to confirm information</p>
            </div>
            {isEdit && (
                <CommentBox style={{ marginTop: "0px" }} />
            )}
            {/* <div className="flex justify-center">
                <Button className={classes.submit_btn}
                    variant="contained"
                    color="primary"
                    onClick={props.onClose}
                >Save</Button>
            </div> */}
        </div>
    );
}

export default InformationForm;
