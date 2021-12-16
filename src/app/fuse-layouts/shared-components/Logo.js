import React from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    root      : {
        '& .logo-icon'                : {
            width     : 32,
            height    : 32,
            transition: theme.transitions.create(['width', 'height'], {
                duration: theme.transitions.duration.shortest,
                easing  : theme.transitions.easing.easeInOut
            })
        },
        '& .react-badge, & .logo-text': {
            transition: theme.transitions.create('opacity', {
                duration: theme.transitions.duration.shortest,
                easing  : theme.transitions.easing.easeInOut
            })
        }
    },
    reactBadge: {
        backgroundColor: theme.palette.secondary.light,
        color          : theme.palette.secondary.contrastText
    }
}));

function Logo()
{
    const classes = useStyles();

    return (
        <div className={clsx(classes.root, "flex items-center")}>
            <div className={clsx(classes.reactBadge, "react-badge flex items-center ml-12 mr-8 py-4 px-8 rounded")}>
                <span className="react-text text-12 ml-4"> CYBERLOGITEC</span>
            </div>
        </div>
    );
}

export default Logo;
