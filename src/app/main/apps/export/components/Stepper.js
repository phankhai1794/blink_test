import * as React from 'react';
import {
    Box,
    Stepper,
    Step,
    StepLabel,
} from '@material-ui/core';
import { useTheme } from '@material-ui/styles'


export function HorizontalLinearStepper(props) {
    const { active, steps } = props;
    const theme = useTheme();

    return (
        <Box style={{ width: '100%' }} className={props.className}>
            <Stepper activeStep={active} alternativeLabel style={{backgroundColor: theme.palette.background.default}} >
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};

                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
        </Box>
    );
}
