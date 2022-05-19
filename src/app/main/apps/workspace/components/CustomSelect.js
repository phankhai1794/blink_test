import React from 'react';
import {
  FormControl,
  makeStyles,
  MenuItem,
  Icon,
  Select,
  OutlinedInput
} from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  wideInput: {
    display: 'flex',
    alignItems: 'center',
    width: 180,
    height: 30,
    padding: theme.spacing(1),
  },
  formControl: {
    minWidth: 120,
  },
}))

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 6 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const CustomSelect = ({ options, iconProps, ...rootProps }) => {

  const classes = useStyles();

  return (
    <FormControl className={clsx(classes.formControl)} variant="outlined">
      <Select
        {...rootProps}
        MenuProps={MenuProps}
        input={<OutlinedInput />}
        inputProps={{
          className: clsx(classes.wideInput, 'mr-20')
        }}
      >
        { options.map(({ title, icon, value }) => (
          <MenuItem key={title} value={value}>
            <div className="flex items-center">
              {icon && <Icon {...iconProps}>{icon}</Icon> }
              <p className={icon && 'pl-12'}>{ title || value }</p>                                        
            </div>
          </MenuItem>
        ))}
      </Select> 
    </FormControl>
  );
};

CustomSelect.defaultProps = {
  options: [],
}

export default CustomSelect;
