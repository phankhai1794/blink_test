import React, { useState } from 'react';
import { Button,TextField, Select, IconButton, Link, OutlinedInput, Popover, Grid, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FormControl } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CloseIcon from '@material-ui/icons/Close';
import { grey } from '@material-ui/core/colors';
import { styled } from '@material-ui/core/styles';
import _ from '@lodash'
import QuestionBox from './QuestionBox';
import UserInfo from './UserInfo';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const DisabledRadioButtonUncheckedIcon = styled(RadioButtonUncheckedIcon)({
    color: grey['500']
})
// show border bottom when input is hovered (split to single style to prevent error)
const inputStyle = makeStyles(theme => (
    {
        underline: {
            "&&&:before": {
                borderBottom: "none"
            },
            '&:hover:not($disabled):before':
            {
                borderBottom: `1px solid ${theme.palette.text.primary} !important`
            },
        }
    }
))
const inputStyleDisabled = makeStyles(theme => (
    {
        underline: {
            "&&&:before": {
                borderBottom: "none"
            },
            '&:hover:not($disabled):before':
            {
                borderBottom: `1px dashed ${theme.palette.text.primary} !important`
            },
            "&&&:before": {
                borderStyle: "dashed"
            },
        }
    }
))
const typeToNameDict = {
    "ROUTING INQUIRY/DISCREPANCY": "We found discrepancy in the routing information between SI and OPUS booking details",
    "MISSING DESTINATION REQUIREMENT": "We found discrepancy in the routing information between SI and OPUS booking details",
    "BROKEN ROUTE ERROR": "We found discrepancy in the routing information between SI and OPUS booking details"
}
// Sub Commporent
const FirstChoice = (props) => {
    const { handleChange, question, id } = props;
    const [isHover, setIsHover] = useState(false)
    const [isOnFocus, setIsOnFocus] = useState(false)
    const classes = inputStyle()
    const handleFocus = (e) => {
        setIsOnFocus(true)
        e.target.select()
    }
    return (
        <div className="flex" onMouseEnter={() => setIsHover(true)} onMouseLeave={() => { isOnFocus ? setIsHover(true) : setIsHover(false) }}>
            <div style={{ paddingTop: "6px", marginRight: "1rem" }}>
                <DisabledRadioButtonUncheckedIcon />
            </div>
            <div style={{ height: "50px", width: "100%" }}>
                <TextField style={{ border: "none" }}
                    name="input"
                    value={question}
                    onChange={(e) => handleChange(e, id)}
                    fullWidth={isHover} onFocus={handleFocus}
                    InputProps={{ classes }}
                />
            </div>
            {isHover && (
                <>
                    {/* blank space because first choice dont have close button */}
                    <div style={{ marginLeft: "1rem", width: "48px", height: "48px" }}>

                    </div>
                </>
            )}

        </div>
    )
}
const Choice = (props) => {
    const { id, question, handleChange, handleRemoveChoice } = props
    const classes = inputStyle()
    return (
        <div className="flex" key={id}>
            <div style={{ paddingTop: "6px", marginRight: "1rem" }}>
                <DisabledRadioButtonUncheckedIcon />
            </div>
            <TextField fullWidth
                value={question}
                style={{ marginLeft: "1rem" }}
                autoFocus={true}
                onFocus={(e) => e.target.select()}
                onChange={(e) => handleChange(e, id)}
                InputProps={{ classes }}

            />
            <IconButton
                style={{ marginLeft: "1rem" }}
                onClick={() => handleRemoveChoice(id)}>
                <CloseIcon />
            </IconButton>
        </div>
    )
}
// Main Component
const InformationForm = (props) => {
    // custom attribute must be lowercase
    const classes_disabled = inputStyleDisabled()
    const classes = inputStyle()
    const { question, questionIsEmpty, content, title } = props
    const [questionInfo, setQuestionInfo] = useState(!questionIsEmpty ?
        {
            name: question.name,
            type: question.type,
            answerType: question.answerType,
            selectedChoice: question.selectedChoice,
            addOther: question.addOther,
            otherChoice: question.otherChoice
        } :
        {
            name: typeToNameDict["ROUTING INQUIRY/DISCREPANCY"],
            type: "ROUTING INQUIRY/DISCREPANCY",
            answerType: "CHOICE ANSWER",
            selectedChoice: "",
            addOther: false,
            otherChoice: ""
        })
    const [isEdit, setIsEdit] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const [choiceList, setChoiceList] = useState(!questionIsEmpty ? question.choices : [
        {
            id: 1,
            content: content
        }
    ])
    const handleAddChoice = () => {
        setChoiceList(prevQuestion => [...prevQuestion, {
            id: choiceList[choiceList.length - 1].id + 1,
            content: `Add Option ${choiceList.length + 1}`
        }])
    }
    const handleAddOtherChoice = () => {
        setQuestionInfo({
            ...questionInfo,
            addOther: true
        })
    }
    const handleRemoveOtherChoice = () => {
        setQuestionInfo({
            ...questionInfo,
            addOther: false
        })
    }
    const handleRemoveChoice = (id) => {
        const data = choiceList.filter(question => question.id !== id)
        setChoiceList(data)
    }
    const handleChange = (e, id) => {
        e.preventDefault()
        const questionIndex = choiceList.findIndex((question) => question.id === id);
        let temp = [...choiceList]
        temp[questionIndex].content = e.target.value
        setChoiceList(temp)
    }
    const handleTypeChange = (e) => {
        setQuestionInfo({
            ...questionInfo,
            type: e.target.value,
            name: typeToNameDict[e.target.value]
        })
    }
    const handleAnswerTypeChange = (e) => {
        setQuestionInfo({
            ...questionInfo,
            answerType: e.target.value
        })
    }
    const onSave = (e) => {
        let savedQuestion = {
            name: questionInfo.name,
            type: questionInfo.type,
            answerType: questionInfo.answerType,
            choices: choiceList,
            addOther: questionInfo.addOther
        }
        props.onSave(savedQuestion, props.title)
        setIsEdit(true)
    }
    const onEdit = () => {
        setIsEdit(true)
    }
    /* if questionIsEmpty -> show Form */
    /* if questionIs Empty -> check isEdit to show Form or QuestionBox */
    const isShowForm = () => {
        if (questionIsEmpty === true) {
            return questionIsEmpty
        }
        return isEdit
    }
    const onSaveSelectedChoice = (e, choice, otherChoiceContent) => {
        let savedQuestion = {
            name: questionInfo.name,
            type: questionInfo.type,
            answerType: questionInfo.answerType,
            selectedChoice: choice === "other" ? otherChoiceContent : choice,
            choices: choiceList,
            addOther: questionInfo.addOther,
            otherChoice: otherChoiceContent
        }
        props.onSave(savedQuestion, props.title)
    }
    return (
        <div style={{ padding: "4rem 5.5rem" }}>
            {isShowForm() &&
                (
                    <Grid container style={{ width: "700px" }}>
                        <Grid item xs={3}>
                            <UserInfo name="andrew" date="today" time="10:45PM" />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl style={{ width: "90%" }}>
                                <Select
                                    value={questionInfo.type}
                                    name="Question type"
                                    onChange={handleTypeChange}
                                    input={<OutlinedInput />}
                                >
                                    <MenuItem value="ROUTING INQUIRY/DISCREPANCY"> ROUTING INQUIRY/DISCREPANCY</MenuItem>
                                    <MenuItem value="MISSING DESTINATION REQUIREMENT">MISSING DESTINATION REQUIREMENT</MenuItem>
                                    <MenuItem value="BROKEN ROUTE ERROR">BROKEN ROUTE ERROR</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl style={{ width: "100%", height: "100%" }} >
                                <Select
                                    value={questionInfo.answerType}
                                    name="Question answer type"
                                    onChange={handleAnswerTypeChange}
                                    input={<OutlinedInput />}
                                >
                                    <MenuItem value="CHOICE ANSWER"> CHOICE ANSWER</MenuItem>
                                    <MenuItem value="SHORT ANSWER">SHORT ANSWER</MenuItem>
                                    <MenuItem value="ATTACHMENT ANSWER">ATTACHMENT ANSWER</MenuItem>
                                    <MenuItem value="PARAGRAPH ANSWER">PARAGRAPH ANSWER</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                )
            }

            {!isShowForm() && (
                <div className="flex justify-between">

                    <div>
                        <UserInfo name="Andrew" date="Today" time="10:45PM" />
                    </div>
                    <Popover
                        id={Boolean(anchorEl) ? 'simple-popover' : undefined}
                        open={Boolean(anchorEl)}
                        anchorEl={anchorEl}
                        onClose={() => setAnchorEl(null)}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <Button onClick={onEdit}>
                            Edit
                        </Button>
                    </Popover>
                    <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            )}

            {
                isShowForm() ?
                    (
                        <>
                            <div style={{ marginTop: '1rem' }}>
                                <TextField
                                    value={questionInfo.name}
                                    variant="outlined"
                                    multiline
                                    onFocus={(e) => e.target.select()}
                                    onChange={(e) => setQuestionInfo({
                                        ...questionInfo,
                                        name: e.target.value
                                    })}
                                    style={{ width: "100%", resize: "none" }} />
                            </div>
                            <div style={{ paddingTop: "2rem" }}>
                                {/* if there are 1 choice -> remove close button in the end */}
                                {choiceList.length === 1 ? (
                                    <FirstChoice
                                        question={choiceList[0].content}
                                        id={choiceList[0].id}
                                        handleChange={handleChange} />
                                ) : (
                                    choiceList.map((question, index) => {
                                        return (
                                            <Choice
                                                question={question.content}
                                                id={question.id} key={index}
                                                handleChange={handleChange}
                                                handleRemoveChoice={handleRemoveChoice}
                                                handleChange={handleChange} />
                                        )
                                    })
                                )}
                                <div className="flex">
                                    <div style={{ paddingTop: "6px", marginRight: "1rem" }}>
                                        <DisabledRadioButtonUncheckedIcon />
                                    </div>
                                    <TextField style={{ border: "none" }} placeholder="Add Option" onClick={handleAddChoice} InputProps={{ classes }} />
                                    {!questionInfo.addOther &&
                                        (
                                            <div className="flex" style={{ paddingTop: "6px" }}>
                                                <p style={{ margin: "0px 1rem 0px 1rem", fontSize: "20px" }}> OR </p>
                                                <Link style={{ fontSize: "20px" }} onClick={handleAddOtherChoice}>Add "Customer Input"</Link>
                                            </div>
                                        )
                                    }
                                </div>
                                {questionInfo.addOther &&
                                    (
                                        <div className='flex'>
                                            <div style={{ paddingTop: "6px", marginRight: "1rem" }}>
                                                <DisabledRadioButtonUncheckedIcon />
                                            </div>
                                            <TextField style={{ border: "none" }} placeholder='Add "Customer Input"' fullWidth disabled InputProps={{ classes_disabled }} />
                                            <IconButton
                                                style={{ marginLeft: "1rem" }}
                                                onClick={handleRemoveOtherChoice}>
                                                <CloseIcon />
                                            </IconButton>
                                        </div>
                                    )
                                }
                            </div>
                            <div className="flex justify-end mt-12 mr-2 ">
                                <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={onSave}>
                                    <SaveIcon />Save
                                </Button>
                            </div>


                        </>
                    ) :
                    (<QuestionBox
                        question={question}
                        onEdit={onEdit}
                        title={title}
                        onSaveSelectedChoice={onSaveSelectedChoice} />)
            }
            <hr />
            <div className="flex justify-between pt-1">
                <Link style={{ fontSize: "20px" }}>Open All Inquiries</Link>
                <div>
                    <ArrowBackIosIcon />
                    <ArrowForwardIosIcon />
                </div>
            </div>
        </div>
    );
}

export default InformationForm;