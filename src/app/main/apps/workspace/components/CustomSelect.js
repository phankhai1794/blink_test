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
    width: 210,
    height: 30,
    padding: theme.spacing(1),
    color: "#BD0F72",
    paddingLeft: 12
  },
  formControl: {
    minWidth: 120,
    '& $fieldset': {
      borderRadius: '9px'
    }
  },
  selected: {
    backgroundColor: "#FDF2F2 !important" ,
    color: "#BD0F72",
    fontWeight: 600
  }
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
        {options.map(({ title, value }) => (
          <MenuItem key={title} value={value} classes={{ selected: classes.selected }}>
            <div className="flex items-center">
              <p >{title || value}</p>
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
