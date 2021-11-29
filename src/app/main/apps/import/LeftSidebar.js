import React from 'react';
import { Icon, List, ListItem, ListItemText, Paper} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import {FuseAnimate, NavLinkAdapter} from '@fuse';

const useStyles = makeStyles(theme => ({
    listItem: {
        color              : 'inherit!important',
        textDecoration     : 'none!important',
        height             : 40,
        width              : 'calc(100% - 16px)',
        borderRadius       : '0 20px 20px 0',
        paddingLeft        : 24,
        paddingRight       : 12,
        '&.active'         : {
            backgroundColor    : theme.palette.secondary.main,
            color              : theme.palette.secondary.contrastText + '!important',
            pointerEvents      : 'none',
            '& .list-item-icon': {
                color: 'inherit'
            }
        },
        '& .list-item-icon': {
            marginRight: 16
        }
    }
}));

function LeftSidebarContent(props)
{
    const classes = useStyles(props);

    return (
        <div className="p-0 lg:p-24 lg:pr-4">
            <FuseAnimate animation="transition.slideLeftIn" delay={200}>
                <Paper className="rounded-0 shadow-none lg:rounded-8 lg:shadow-1">
                    <List>
                        <ListItem
                            button
                            component={NavLinkAdapter}
                            to={'/apps/import/all'}
                            activeClassName="active"
                            className={classes.listItem}
                        >
                            <Icon className="list-item-icon text-16" color="action">view_list</Icon>
                            <ListItemText className="truncate pr-0" primary="All" disableTypography={true}/>
                        </ListItem>
                        <ListItem
                            button
                            component={NavLinkAdapter}
                            to={'/apps/import/inprogress'}
                            activeClassName="active"
                            className={classes.listItem}
                        >
                            <Icon className="list-item-icon text-16" color="action">drag_handle</Icon>
                            <ListItemText className="truncate pr-0" primary="Inprogress" disableTypography={true}/>
                        </ListItem>
                        <ListItem
                            button
                            component={NavLinkAdapter}
                            to={'/apps/import/waiting'}
                            activeClassName="active"
                            className={classes.listItem}
                        >
                            <Icon className="list-item-icon text-16" color="action">hourglass_empty</Icon>
                            <ListItemText className="truncate pr-0" primary="Waiting" disableTypography={true}/>
                        </ListItem>
                        <ListItem
                            button
                            component={NavLinkAdapter}
                            to={'/apps/import/finish'}
                            activeClassName="active"
                            className={classes.listItem}
                        >
                            <Icon className="list-item-icon text-16" color="action">check_circle_outline</Icon>
                            <ListItemText className="truncate pr-0" primary="Finish" disableTypography={true}/>
                        </ListItem>
                    </List>
                </Paper>
            </FuseAnimate>
        </div>
    );
}

export default LeftSidebarContent;
