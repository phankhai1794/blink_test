import React from 'react';
import { TextField, Radio, Button } from '@material-ui/core';
import { useState } from 'react';
import UserInfo from '../../shared-components/UserInfo';
import SaveIcon from '@material-ui/icons/Save';
const QuestionBox = (props) => {
    const { question } = props
    let questionIsEmpty = props.question === undefined
    let prevChoiceArray = question.choices.filter(choice => choice.content === question.selectedChoice)
    const [selectedChoice, setSelectedChoice] = useState(
        questionIsEmpty ? "" :
            prevChoiceArray.length === 0 ?
                `${question.otherChoice === undefined ? "" : "other"}` :
                prevChoiceArray[0].content
    )
    const [otherChoiceContent, setOtherChoiceContent] = useState(question.otherChoice)
    const [lastSelectedChoice, setLastSelectedChoice] = useState(selectedChoice === "other" ? otherChoiceContent : selectedChoice)
    const [showSaveBtn, setShowSaveBtn] = useState(false)
    const handleChange = (e) => {
        setSelectedChoice(e.target.value)
        setShowSaveBtn(true)
    }
    const handleSaveSelectedChoice = (e) => {
        props.onSaveSelectedChoice(e, selectedChoice === "other" ? otherChoiceContent : selectedChoice, otherChoiceContent)
        setLastSelectedChoice(selectedChoice === "other" ? otherChoiceContent : selectedChoice)
        setShowSaveBtn(false)
    }
    const handleFocus = (e) => {
        setSelectedChoice("other")
        e.target.select()
        setShowSaveBtn(true)
    }
    return (
        <div style={{ width: '400px', height: "100%" }}>
            <h2>
                {questionIsEmpty ? "" : question.name}
            </h2>
            <div style={{ display: "block", margin: "1rem 0rem" }}>
                {!questionIsEmpty && question.choices.map((choice) => (
                    <div key={choice.id} style={{ display: "flex", marginTop: "0.5rem" }} >
                        <div>
                            <Radio disabled
                                checked={selectedChoice === choice.content}
                                onChange={handleChange}
                                value={choice.content}
                                color="primary"
                                style={{ margin: "auto" }} />
                        </div>
                        <p style={{ margin: "auto 1rem", fontSize: "1.7rem" }}>{choice.content}</p>
                    </div>
                )
                )}
                {question.addOther &&
                    (
                        <div style={{ display: "flex", marginTop: "1rem" }} >
                            <Radio disabled
                                checked={selectedChoice === 'other'}
                                onChange={handleChange}
                                value="other"
                                color="primary"
                                style={{ marginLeft: "0rem" }} />
                            <TextField placeholder="INPUT YOUR INFORMATION"
                                InputProps={{
                                    style: {
                                        fontSize: "1.7rem",
                                    },
                                }}
                                InputLabelProps={{
                                    style: {
                                        fontSize: "1.7rem",
                                    },
                                }}
                                style={{ margin: "auto 1rem" }}
                                value={otherChoiceContent}
                                onChange={(e) => setOtherChoiceContent(e.target.value)}
                                fullWidth multiline
                                onFocus={handleFocus}
                            />
                        </div>
                    )}
            </div>
            {lastSelectedChoice !== "" && !showSaveBtn &&
                (
                    <div>
                        <UserInfo name="Anrew" date="today" time="10:50PM" />
                        <h3 style={{ margin: "1rem 2rem" }}>{lastSelectedChoice}</h3>
                    </div>
                )}
            {showSaveBtn &&
                (
                    <div className="flex">
                        <Button variant="contained" color="primary" onClick={handleSaveSelectedChoice} style={{ margin: "auto" }}> <SaveIcon />Save</Button>
                    </div>
                )}

        </div>
    );
}

export default QuestionBox;
