import React from 'react';
import { TextField, Radio, Button } from '@material-ui/core';
import { useState } from 'react';
const QuestionBox = (props) => {
    const { question } = props
    const [selectedChoice, setSelectedChoice] = useState("")
    const [otherChoiceContent, setOtherChoiceContent] = useState("")
    const handleChange = (e) => {
        setSelectedChoice(e.target.value)
    }
    const handleFocus = (e) => {
        setSelectedChoice("other")
        e.target.select()
    }
    let questionIsEmpty = props.question === undefined
    return (
        <div style={{ width: '100%', height: "100%" }}>
            <h2>
                {questionIsEmpty ? "" : question.name}
            </h2>
            <div style={{ display: "block", margin: "1rem 0rem" }}>
                {!questionIsEmpty && question.choices.map((choice) => (
                    <div key={choice.id} style={{ display: "flex", marginTop: "0.5rem" }} >
                        <div>
                            <Radio
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
                {!questionIsEmpty && question.addOther &&
                    (
                        <div style={{ display: "flex", marginTop: "1rem" }} >
                            <Radio
                                checked={selectedChoice === 'other'}
                                onChange={handleChange}
                                value="other"
                                color="primary"
                                style={{ marginLeft: "0rem" }} />
                            <TextField placeholder="INPUT YOUR INFORMATION"
                                InputProps={{
                                    classes: {
                                        input: {
                                            fontSize: "1.7rem"

                                        },
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
            {selectedChoice !== "" &&
                (
                    <div className="flex justify-end">
                        <Button variant="contained" color="primary" onClick={(e) => props.onSaveSelectedChoice(e, selectedChoice === "other" ? otherChoiceContent : selectedChoice)}>Save</Button>
                    </div>
                )}

        </div>
    );
}

export default QuestionBox;
