import React, { useState } from 'react';
import { Button, Checkbox, TextField, Select, Menu, MenuItem, InputLabel, NativeSelect, IconButton, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FormControl } from '@material-ui/core';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import ImageIcon from '@material-ui/icons/Image';
import CloseIcon from '@material-ui/icons/Close';
import { grey } from '@material-ui/core/colors';
import { styled } from '@material-ui/core/styles';
import _ from '@lodash'
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
    },
}))
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
                    <IconButton
                        style={{ marginLeft: "1rem" }}
                    >
                        <ImageIcon />
                    </IconButton>
                    {/* blank space because first choice dont have close button */}
                    <div style={{ marginLeft: "1rem", width: "48px", height: "48px" }}>

                    </div>
                </>
            )}

        </div>
    )
}
const Choice = (props) => {
    const { id, question, handleChange, handleRemoveQuestion } = props
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
            >
                <ImageIcon />
            </IconButton>
            <IconButton
                style={{ marginLeft: "1rem" }}
                onClick={() => handleRemoveQuestion(id)}>
                <CloseIcon />
            </IconButton>
        </div>
    )
}
// Main Component
const InformationForm = (props) => {
    const classesDisabled = inputStyleDisabled()
    const classes = inputStyle()
    const [questionInfo, setQuestionInfo] = useState(!_.isEmpty(question) ? { name: question.name, type: question.type } : { name: "", type: "" })
    const { question } = props
    const [haveOtherChoice, setHaveOtherChoice] = useState(false)
    const [choiceList, setChoiceList] = useState(!_.isEmpty(question) ? question.choices : [
        {
            id: 1,
            content: "add option1"
        }
    ])
    const handleAddQuestion = () => {
        setChoiceList(prevQuestion => [...prevQuestion, {
            id: choiceList[choiceList.length - 1].id + 1,
            content: `add option ${choiceList.length + 1}`
        }])
    }
    const handleRemoveQuestion = (id) => {
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
        // console.log(typeToNameDict[e.target.value])
        setQuestionInfo({
            type: e.target.value,
            name: typeToNameDict[e.target.value]
        })
        // console.log(type)
        // console.log(name)
    }
    const onSave = (e) => {
        let savedQuestion = {
            name: questionInfo.name,
            type: questionInfo.type,
            choices: choiceList,
            addOther: haveOtherChoice
        }
        props.onSave(savedQuestion)
        props.onCloseForm(e)
    }
    return (
        <div style={{ padding: "3rem", maxHeight: "450px" }}>
            <div className="flex justify-between">
                {/* <FormControl style={{ marginLeft: "3rem" }}>
                    <NativeSelect
                        name="question name"
                    >
                        
                        <option value={10}>Multiple choice question</option>
                        <option value={20}>Place of receipt</option>
                        <option value={30}>Port of loading</option>
                    </NativeSelect>
                </FormControl> */}
                <TextField value={questionInfo.name} disabled fullWidth />
                <ImageIcon style={{ marginLeft: "3rem" }} />
                <FormControl style={{ marginLeft: "3rem" }}>
                    <NativeSelect
                        value={questionInfo.type}
                        name="Question type"
                        onChange={handleTypeChange}
                    >
                        <option aria-label="None" value="" />
                        <option value="ROUTING INQUIRY/DISCREPANCY"> ROUTING INQUIRY/DISCREPANCY</option>
                        <option value="MISSING DESTINATION REQUIREMENT">MISSING DESTINATION REQUIREMENT</option>
                        <option value="BROKEN ROUTE ERROR">BROKEN ROUTE ERROR</option>
                    </NativeSelect>
                </FormControl>
            </div>
            <div style={{ paddingTop: "2rem" }}>
                {/* if there are 1 choice -> remove close button in the end */}
                {choiceList.length === 1 ? (
                    <FirstChoice question={choiceList[0].content} id={choiceList[0].id} handleChange={handleChange} />
                ) : (
                    choiceList.map((question) => {
                        return (
                            <Choice question={question.content} id={question.id} handleChange={handleChange} handleRemoveQuestion={handleRemoveQuestion} handleChange={handleChange} />
                        )
                    })
                )}
                <div className="flex">
                    <div style={{ paddingTop: "6px", marginRight: "1rem" }}>
                        <DisabledRadioButtonUncheckedIcon />
                    </div>
                    <TextField style={{ border: "none" }} placeholder="Add option" onClick={handleAddQuestion} InputProps={{ classes }} />
                    {!haveOtherChoice &&
                        (
                            <div className="flex" style={{ paddingTop: "6px" }}>
                                <p style={{ margin: "0px 1rem 0px 1rem", fontSize: "20px" }}> or </p>
                                <Link style={{ fontSize: "20px" }} onClick={() => setHaveOtherChoice(true)}>add "Other"</Link>
                            </div>
                        )
                    }
                </div>
                {haveOtherChoice &&
                    (
                        <div className='flex'>
                            <div style={{ paddingTop: "6px", marginRight: "1rem" }}>
                                <DisabledRadioButtonUncheckedIcon />
                            </div>
                            <TextField style={{ border: "none" }} disabled placeholder='add "Other"' fullWidth InputProps={{ classesDisabled }} />
                            <IconButton
                                style={{ marginLeft: "1rem" }}
                                onClick={() => setHaveOtherChoice(false)}>
                                <CloseIcon />
                            </IconButton>
                        </div>
                    )
                }
            </div>
            <div className="block justify-center mt-12 text-center ">
                <Button color="primary" variant="contained" onClick={onSave}> Save</Button>
            </div>
        </div>
    );
}

export default InformationForm;