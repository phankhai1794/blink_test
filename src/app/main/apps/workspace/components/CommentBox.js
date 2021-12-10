import React, { useState } from 'react';
import { Avatar, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { TextField } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    title: {
        marginBottom: "0px",
        marginLeft: "1rem",
        fontSize: "20px",
        marginTop: "0rem",
        color: theme.palette.primary.main
    },
    name: {
        marginBottom: "0px",
        marginLeft: "1rem",
        marginTop: "0px"
    },
    normal: {
        marginTop: "0px"
    },
    message: {
        marginLeft: "1rem",
        marginTop: "0rem"
    }
}))
const UserInfo = (props) => {
    const { name, date, time } = props
    const classes = useStyles()
    return (
        <div className="flex">
            <Avatar src={`../assets/images/avatars/${name}.jpg`} />
            <div>
                <p className={classes.name}>{name}</p>
                <div className="flex" style={{ marginLeft: "1rem" }}>
                    <p className={classes.normal}>{date}</p>
                    <p className={classes.normal}>{time}</p>
                </div>
            </div>
        </div>
    )
}

const CommentBox = () => {
    const classes = useStyles()
    const [choice, setChoice] = useState("")
    return (
        <div style={{ width: '100%', height: "100%" }}>
            <UserInfo name="alice" date="today" time="10:20PM" />
            <p className={classes.title} color="primary">Place of receipt</p>
            <div className="flex justify-end">
                <Button variant="contained" color="primary" style={{ marginRight: "1rem" }} onClick={() => setChoice("Indonesia")}>Indonesia</Button>
                <Button variant="contained" color="primary" onClick={() => setChoice("Malaysia")}>Malaysia</Button>
            </div>
            <UserInfo name="andrew" date="today" time="10:20PM" style={{ marginTop: "20px" }} />
            {choice !== "" ? (
                <div>
                    <p className={classes.title}>Place of receipt</p>
                    <p className={classes.message}>{choice}</p>
                </div>
            ) : null}
            <div className="comment flex justify-between">
                {/* <input className={classes.inputComment} /> */}
                <TextField variant="outlined" fullWidth multiline style={{ marginRight: "1rem" }} />
                <Avatar src="../assets/images/avatars/andrew.jpg" />
            </div>
        </div>
    );
}

export default CommentBox;
