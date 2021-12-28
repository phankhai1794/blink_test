import React from 'react';
import { Link } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
const PopoverFooter = ({ toggleDrawer, prevQuestion, nextQuestion }) => {
    return (
        <div className="flex justify-between pt-1">
            <Link style={{ fontSize: "20px" }} onClick={toggleDrawer}>Open All Inquiries</Link>
            <div>
                <ArrowBackIosIcon />
                <ArrowForwardIosIcon />
            </div>
        </div>
    );
}

export default PopoverFooter;
