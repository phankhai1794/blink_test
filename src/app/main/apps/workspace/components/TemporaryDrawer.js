import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, Button, Link, List } from '@material-ui/core';
import QuestionBoxViewOnly from './QuestionBoxViewOnly';
import { withStyles } from "@material-ui/core/styles";
import MuiListItem from "@material-ui/core/ListItem";

const ListItem = withStyles((theme) => ({
    root: {
        "&$selected": {
            border: `1.5px solid ${theme.palette.primary.main}`,
            backgroundColor: "white",
            "& .MuiListItemIcon-root": {}
        },
        "&$selected:hover": {
            boxShadow: `0px 0px 2px 1px ${theme.palette.primary.main}`,
            border: `1.5px solid ${theme.palette.primary.main}`,
            backgroundColor: "white",
            "& .MuiListItemIcon-root": {}
        },
        "&:hover": {
            border: "1.5px solid black",
            "& .MuiListItemIcon-root": {}
        },
        border: "1.5px solid black"
    },
    selected: {}
}))(MuiListItem);
const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    hoverDiv: {
        "&:hover": {
            boderColor: "red"
        }
    },
    paper: {
        position: 'absolute'
    }
});

const mockData = [
    {
        question: {
            name: "We found discrepancy in the routing information between SI and OPUS booking details",
            type: "ROUTING INQUIRY/DISCREPANCY",
            answerType: "CHOICE ANSWER",
            choices: [
                {
                    id: 1,
                    content: 'SINGAPORE'
                },
                {
                    id: 2,
                    content: 'MALAYSIA'
                },
            ],
            addOther: true,
            otherChoiceContent: "INDONESIA",
            selectedChoice: "INDONESIA"
        },
    },
    {
        question: {
            name: "We found discrepancy in the routing information between SI and OPUS booking details",
            type: "BROKEN ROUTE ERROR",
            answerType: "CHOICE ANSWER",
            choices: [
                {
                    id: 1,
                    content: 'BUSAN'
                },
                {
                    id: 2,
                    content: 'OSAKA'
                },
            ],
            addOther: true,
            otherChoiceContent: "YOUR INPUT",
            selectedChoice: ""
        },
    },
]
function TemporaryDrawer(props) {
    const classes = useStyles();
    const [anchor, setAnchor] = useState(false);
    const [selectedTitle, setSelectedTitle] = useState("");
    useEffect(() => {
        if (props.openDrawer === true) {
            setAnchor(true)
            setSelectedTitle(props.defaultTitle)
        }
        else {
            setAnchor(false)
        }
    }, [props.openDrawer])
    const handleListItemClick = (event, title) => {
        setSelectedTitle(title)
        props.getDataPopover(title)
    };
    const dataHadChoices = Object.values(props.data).filter(item => item.question.choices.length > 0)
    const closeDrawer = () => {
        props.closeDrawer()
    }
    return (
        <div>
            <React.Fragment key="right">
                <Drawer
                    // variant="persistent"
                    anchor="right"
                    open={anchor}
                    onClose={closeDrawer}
                    classes={{
                        paper: classes.paper
                    }}
                >

                    <List
                        style={{ margin: "2rem 1rem", width: "440px" }}
                    >

                        {dataHadChoices.map((data, index) => {
                            return (
                                <ListItem
                                    selected={selectedTitle === data.title}
                                    onClick={(event) => handleListItemClick(event, data.title)}
                                    style={{ marginTop: '1rem' }}
                                    key={index}
                                >
                                    <QuestionBoxViewOnly question={data.question} />
                                </ListItem>
                            )
                        })}
                    </List>
                </Drawer>
            </React.Fragment>
        </div>
    );
}

export default TemporaryDrawer