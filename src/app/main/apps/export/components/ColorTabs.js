import React from 'react'
import { Tab, Tabs } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

function a11yProps(index) {
    return {
        id: `color-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles(theme => ({
    contained: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText
    },
    constrastText: {
        color: theme.palette.secondary.contrastText
    }
}))

export const ColorTab = ({ label, index, ...orthers }) => {
    const classes = useStyles();
    return (
        <Tab
            classes={{
                selected: classes.contained
            }}
            label={label || ""}
            {...a11yProps(index)}
            {...orthers}
        />
    )
}

export const ColorTabs = ({ items, ...others }) => {
    return (
        <Tabs
            aria-label="import tabs"
            indicatorColor="primary"
            {...others}
        >
            {items.map((tabItem, index) => (
                <ColorTab key={tabItem + index} label={tabItem} index={index} />
            ))}
        </Tabs>
    )
}
ColorTabs.defaultProps = {
    value: 0,
    items: [],
}


