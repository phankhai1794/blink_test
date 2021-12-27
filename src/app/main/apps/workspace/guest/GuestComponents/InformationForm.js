import React, { useState } from 'react';
import { Link } from '@material-ui/core';
import _ from '@lodash'
import QuestionBox from './QuestionBox';
import UserInfo from '../../components/UserInfo';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
const InformationForm = (props) => {
    const { question, title } = props
    const toggleDrawer = () => {
        props.toggleDrawer()
    }
    const onSaveSelectedChoice = (e, savedQuestion) => {
        props.onSave(savedQuestion, props.title)
    }
    return (
        <div style={{ padding: "4rem 5.5rem" }}>
            <div className="flex justify-between">

                <div>
                    <UserInfo name="Andrew" date="Today" time="10:45PM" />
                </div>
            </div>

            <QuestionBox
                question={question}
                title={title}
                onSaveSelectedChoice={onSaveSelectedChoice} />
            <hr />
            <div className="flex justify-between pt-1">
                <Link style={{ fontSize: "20px" }} onClick={toggleDrawer}>Open All Inquiries</Link>
                <div>
                    <ArrowBackIosIcon />
                    <ArrowForwardIosIcon />
                </div>
            </div>
        </div>
    );
}

export default InformationForm;