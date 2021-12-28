import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, List } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import MuiListItem from "@material-ui/core/ListItem";
import { useSelector, useDispatch } from 'react-redux';
import withReducer from 'app/store/withReducer';
import reducer from '../../../../fuse-layouts/shared-components/quickPanel/store/reducers'
import * as quickPanelActions from '../../../../fuse-layouts/shared-components/quickPanel/store/actions'
import QuestionDrawerItem from "../admin/components/QuestionDrawerItem"
import QuestionBox from '../guest/components/QuestionBox';
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


function TemporaryDrawer(props) {
    const classes = useStyles();
    const [anchor, setAnchor] = useState(false);
    const [selectedTitle, setSelectedTitle] = useState("");
    const dispatch = useDispatch();
    const state = useSelector(({ quickPanel }) => quickPanel.state);
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
        props.closeDrawer(selectedTitle)
        setSelectedTitle("")
        dispatch(quickPanelActions.toggleQuickPanel())
    }
    const onSaveSelectedChoice = (e, savedQuestion) => {
        props.onSave(savedQuestion, selectedTitle)
    }
    return (
        <div>
            <React.Fragment key="right">
                <Drawer
                    // variant="persistent"
                    anchor="right"
                    open={anchor !== state}
                    onClose={closeDrawer}
                    classes={{
                        paper: classes.paper
                    }}
                >

                    <List
                        style={{ margin: "2rem 1rem", width: "450px" }}
                    >

                        {dataHadChoices.map((data, index) => {
                            return (
                                <ListItem
                                    selected={selectedTitle === data.title}
                                    onClick={(event) => handleListItemClick(event, data.title)}
                                    style={{ marginTop: '1rem' }}
                                    key={index}
                                >
                                    {props.role === "admin" ?
                                        (
                                            <QuestionDrawerItem
                                                title={data.title}
                                                question={data.question}
                                                content={data.content}
                                                onSave={props.onSave}
                                            />
                                        ) : (
                                            <QuestionBox
                                                question={data.question}
                                                title={data.title}
                                                onSaveSelectedChoice={onSaveSelectedChoice} />
                                        )}
                                </ListItem>
                            )
                        })}
                    </List>
                </Drawer>
            </React.Fragment>
        </div>
    );
}

export default withReducer('quickPanel', reducer)(TemporaryDrawer);