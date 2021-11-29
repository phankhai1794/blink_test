import React from 'react';
import {
    Box,
    Typography,
    TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    inputField: {
        '& .MuiOutlinedInput-input': {
            padding: 8,
            textTransform: 'uppercase'
        },
        '& .MuiSelect-root': {
            minWidth: '20.5rem'
        }
    }
});

export const CustomOutlinedField = (props) => {

    const classes = useStyles();
    return (
        <TextField
            variant="outlined"
            classes={{
                root: classes.inputField
            }}
            className={props.className}
            fullWidth
            {...props}
        />
    )
}

export function FieldWithLabel({ children, label, mb, ...inputProps }) {

    return (
        <Box className={`w-full flex items-center ${mb || 'mb-16'}`}>
            {label && (
                <Typography className="min-w-136 truncated mr-16">{label}: </Typography>
            )}
            {children && !inputProps.select ? children : (
                <CustomOutlinedField {...inputProps}>{children}</CustomOutlinedField>
            )}
        </Box>
    )
}



