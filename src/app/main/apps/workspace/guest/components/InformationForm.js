import React, { useState } from 'react';
import { Link } from '@material-ui/core';
import _ from '@lodash'
import QuestionBox from './QuestionBox';
import UserInfo from '../../shared-components/UserInfo';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import PopoverFooter from '../../shared-components/PopoverFooter';
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
            <PopoverFooter toggleDrawer={toggleDrawer} />
        </div>
    );
}

export default InformationForm;