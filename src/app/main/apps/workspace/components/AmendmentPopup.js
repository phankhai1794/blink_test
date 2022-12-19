import {
  Icon,
  Button,
  TextField,
  IconButton,
  Select,
  Chip,
  MenuItem,
  ListSubheader,
  FormControl,
  FormHelperText
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import {
  CONTAINER_DETAIL,
  CONTAINER_NUMBER,
  CONTAINER_SEAL,
  CONTAINER_LIST,
  CONTAINER_PACKAGE,
  CONTAINER_PACKAGE_UNIT,
  CONTAINER_WEIGHT,
  CONTAINER_WEIGHT_UNIT,
  CONTAINER_TYPE,
  CONTAINER_MEASUREMENT,
  CM_MARK,
  CM_DESCRIPTION,
  CM_PACKAGE,
  CM_PACKAGE_UNIT,
  CM_WEIGHT,
  CM_MEASUREMENT,
  CM_WEIGHT_UNIT,
  HS_CODE,
  HTS_CODE,
  NCM_CODE,
  mapUnit
} from '@shared/keyword';
import { packageUnits, weightUnits, measurementUnits } from '@shared/units';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles((theme) => ({
  selectRoot: {
    background: 'white',
    border: '1px solid #BAC3CB',
    borderRadius: 8,
    width: 180,
    fontSize: 15,
    color: '#515E6A',
    fontFamily: 'Montserrat'
  },
  select: {
    padding: '5px 23px 5px 5px'
  },
  selectIcon: { color: '#BD0F72' },
  textField: {
    '& fieldset': {
      border: '1px solid #BAC3CB',
      borderRadius: '8px',
      backgroundColor: 'white',
      zIndex: '-1',
      color: '#515E6A'
    },
    '& .MuiOutlinedInput-multiline': {
      padding: 2
    },
    '& .MuiOutlinedInput-input': {
      padding: 8,
      color: '#515E6A',
      fontFamily: 'Montserrat'
    }
  },
  lock: {
    '& fieldset': {
      backgroundColor: '#EFEFEF',
      color: '#515E6A'
    },
    '& .MuiInputBase-root.Mui-disabled': {
      color: '#515E6A'
    },
    '& .MuiOutlinedInput-multiline': {
      padding: 2
    }
  },
  button: {
    margin: theme.spacing(1),
    borderRadius: 8,
    boxShadow: 'none',
    textTransform: 'capitalize',
    fontFamily: 'Montserrat',
    fontWeight: 600,
    width: 120,
    '&.cancel': {
      backgroundColor: 'white',
      color: '#BD0F72',
      border: '1px solid #BD0F72'
    }
  },
  chip: {
    borderRadius: '8px',
    border: '0.5px solid #515F6B',
    background: 'white',
    height: 26,
    margin: 3,
    color: '#515E6A',
    fontSize: 15,
    fontFamily: 'Montserrat'
  }
}));

const containsText = (text, searchText) =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

const AmendmentPopup = (props) => {
  const { onClose, inqType, isEdit, data, index, updateData, updateEdit, containerDetail } = props;
  const classes = useStyles();
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const user = useSelector(({ user }) => user);
  const [errors, setErrors] = useState({});
  const [inputSeal, setInputSeal] = useState('');
  const getType = (type) => {
    return metadata.inq_type?.[type] || '';
  };

  const getTypeName = (type) => {
    return Object.keys(metadata.inq_type).find((key) => metadata.inq_type[key] === type);
  };

  const CDTitle = [...CONTAINER_LIST.cd, mapUnit[CONTAINER_PACKAGE], mapUnit[CONTAINER_WEIGHT], mapUnit[CONTAINER_MEASUREMENT]].map((title) => {
    return { title: title, value: data[getType(title)], id: getType(title) };
  });

  const CMTitle = [CONTAINER_NUMBER, CONTAINER_SEAL, ...CONTAINER_LIST.cm, mapUnit[CM_PACKAGE], mapUnit[CM_WEIGHT], mapUnit[CM_MEASUREMENT]].map((title) => {
    return {
      title: title,
      value:
        CONTAINER_SEAL === title
          ? containerDetail.find(
            (c) => c[getType(CONTAINER_NUMBER)] === data[getType(CONTAINER_NUMBER)]
          )?.[getType(CONTAINER_SEAL)]
          : data[getType(title)],
      id: getType(title)
    };
  });

  const isValid = (id, value) => {
    const name = getTypeName(id);
    if (
      !value &&
      [
        CONTAINER_PACKAGE,
        CONTAINER_PACKAGE_UNIT,
        CM_PACKAGE,
        CM_PACKAGE_UNIT,
        CONTAINER_WEIGHT,
        CONTAINER_WEIGHT_UNIT,
        CM_WEIGHT,
        CM_WEIGHT_UNIT,
        CM_DESCRIPTION
      ].includes(name)
    ) {
      return [true, 'This is required'];
    } else if (value && [CONTAINER_PACKAGE, CM_PACKAGE].includes(name)) {
      const pattern = /^\s*[1-9]\d{0,2}(,?\d{3})*\s*$/g;
      return [!pattern.test(value), 'Must be an integer'];
    } else if (value && Object.keys(mapUnit).includes(name)) {
      const pattern = /^\s*(([1-9]\d{0,2}(,?\d{3})*)|0)(\.\d+)?\s*$/g;
      return [!pattern.test(value), 'Must be a number'];
    }
    return [false, ''];
  };

  const onSave = () => {
    if (!Object.values(errors).includes(true)) {
      updateData((old) => old.map((row, i) => (index === i ? data : row)));
      onClose();
    }
  };

  useEffect(() => {
    const temp = {};
    const type = inqType === CONTAINER_DETAIL ? CDTitle : CMTitle;
    type.forEach(({ id, value, title }) => {
      temp[title] = isValid(id, value)[0];
    });
    setErrors(temp);
  }, []);

  const show = (value) => user.role === 'Admin' && value;

  const onChange = (id, value) => {
    const name = getTypeName(id);
    setErrors({ ...errors, [name]: isValid(id, value)[0] });
    updateEdit((old) => old.map((row, i) => (index === i ? { ...old[index], [id]: value } : row)));
  };

  const onDelete = (value, tagIndex) => {
    updateEdit((old) =>
      old.map((row, i) =>
        index === i
          ? { ...old[index], [getType(CONTAINER_SEAL)]: value.filter((_, i) => i !== tagIndex) }
          : row
      )
    );
  };

  const onAddition = (value) => {
    if (inputSeal) {
      setInputSeal('');
      updateEdit((old) =>
        old.map((row, i) =>
          index === i
            ? { ...old[index], [getType(CONTAINER_SEAL)]: [...new Set([...value, inputSeal.trim()])] }
            : row
        )
      );
    }
  };

  const onKeyDown = (e, value) => {
    if (['Enter', 'Tab'].includes(e.key) && inputSeal) {
      e.preventDefault();
      onAddition(value);
    }
    if (['Backspace', 'Delete'].includes(e.key) && !inputSeal) {
      e.preventDefault();
      onDelete(value, value.length - 1);
    }
  };

  const CustomTextField = (props) => {
    const { title, ...prop } = props;
    const type = inqType === CONTAINER_DETAIL ? CDTitle : CMTitle;
    const field = type.find((f) => f.title === title);
    const [invalid, textWarning] = isValid(field.id, field.value);
    return (
      <TextField
        {...prop}
        variant="outlined"
        error={invalid}
        helperText={invalid && textWarning}
        className={clsx(classes.textField, !isEdit && classes.lock)}
        value={field.value}
        onChange={(e) => onChange(field.id, e.target.value)}
        InputProps={{
          disabled: !isEdit,
          endAdornment: <>{!isEdit && <Icon>lock</Icon>}</>
        }}
      />
    );
  };

  const CustomContainerSeal = (value) => {
    const unlock = inqType === CONTAINER_DETAIL && isEdit;
    return (
      <>
        {unlock ? (
          <div
            className="flex flex-wrap"
            style={{
              background: 'white',
              border: '1px solid #BAC3CB',
              borderRadius: 8,
              padding: '2px 5px'
            }}>
            <>
              {value.map((tag, i) => (
                <Chip
                  classes={{ root: classes.chip }}
                  key={i}
                  label={tag}
                  onDelete={() => onDelete(value, i)}
                  deleteIcon={<ClearIcon fontSize="small" />}
                />
              ))}
            </>
            <input
              style={{
                width: 20,
                flexGrow: 1,
                border: 'none',
                fontSize: 15,
                fontFamily: 'Montserrat'
              }}
              value={inputSeal}
              onKeyDown={(e) => onKeyDown(e, value)}
              onChange={(e) => setInputSeal(e.target.value)}
              onBlur={() => onAddition(value)}
            />
          </div>
        ) : (
          <TextField
            fullWidth
            multiline
            variant="outlined"
            className={clsx(classes.textField, !unlock && classes.lock)}
            value={value?.join(', ')}
            InputProps={{
              disabled: !unlock,
              endAdornment: <>{!unlock && <Icon>lock</Icon>}</>
            }}
          />
        )}
      </>
    );
  };

  const CustomSelect = (props) => {
    const { title, options, ...prop } = props;
    const [searchText, setSearchText] = useState('');
    const displayedOptions = (options) =>
      options.filter((option) => containsText(option, searchText));
    const type = inqType === CONTAINER_DETAIL ? CDTitle : CMTitle;
    const field = type.find((f) => f.title === title);
    const isError = errors[title];
    return (
      <>
        {isEdit ? (
          <FormControl error={isError}>
            <Select
              MenuProps={{ autoFocus: false }}
              classes={{
                root: classes.selectRoot,
                icon: classes.selectIcon,
                select: classes.select
              }}
              disableUnderline
              value={field.value}
              disabled={!isEdit}
              onChange={(e) => onChange(field.id, e.target.value)}
              onClose={() => setSearchText('')}>
              <ListSubheader style={{ background: 'white' }}>
                <TextField
                  size="small"
                  autoFocus
                  variant="outlined"
                  placeholder="Type to search..."
                  fullWidth
                  InputProps={{
                    startAdornment: <SearchIcon />
                  }}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key !== 'Escape') {
                      e.stopPropagation();
                    }
                  }}
                />
              </ListSubheader>
              {displayedOptions(options).map((option, i) => (
                <MenuItem key={i} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {isError && <FormHelperText>This is required!</FormHelperText>}
          </FormControl>
        ) : (
          <TextField
            variant="outlined"
            className={clsx(classes.textField, !isEdit && classes.lock)}
            value={field.value}
            InputProps={{
              disabled: !isEdit,
              endAdornment: <>{!isEdit && <Icon>lock</Icon>}</>
            }}
          />
        )}
      </>
    );
  };

  const CDFields = () => {
    const cdUnit = [
      { field: CONTAINER_PACKAGE, title: 'PACKAGE', unit: packageUnits },
      { field: CONTAINER_WEIGHT, title: 'WEIGHT', unit: weightUnits },
      { field: CONTAINER_MEASUREMENT, title: 'MEASUREMENT', unit: measurementUnits }
    ];
    return (
      <>
        <p style={{ fontWeight: 600 }}>CONTAINER NUMBER</p>
        {CustomTextField({ fullWidth: true, title: CONTAINER_NUMBER })}
        <p style={{ fontWeight: 600 }}>CONTAINER SEAL</p>
        {CustomContainerSeal(data[getType(CONTAINER_SEAL)])}
        <p style={{ fontWeight: 600 }}>CONTAINER TYPE</p>
        {CustomTextField({ fullWidth: true, title: CONTAINER_TYPE })}
        {cdUnit.map(({ field, title, unit }, i) => (
          <div key={i} className="flex justify-start">
            <div>
              <p style={{ fontWeight: 600 }}>{title}</p>
              {CustomTextField({ style: { width: '90%' }, title: field })}
            </div>
            <div>
              <p style={{ fontWeight: 600 }}>{`${title} UNIT`}</p>
              {CustomSelect({ options: unit, title: mapUnit[field] })}
            </div>
          </div>
        ))}
      </>
    );
  };

  const CMFields = () => {
    const cmUnit = [
      { field: CM_PACKAGE, title: 'PACKAGE', unit: packageUnits },
      { field: CM_WEIGHT, title: 'WEIGHT', unit: weightUnits },
      { field: CM_MEASUREMENT, title: 'MEASUREMENT', unit: measurementUnits }
    ];
    return (
      <>
        <p style={{ fontWeight: 600 }}>CONTAINER NUMBER</p>
        {CustomTextField({ fullWidth: true, title: CONTAINER_NUMBER })}
        <p style={{ fontWeight: 600 }}>CONTAINER SEAL</p>
        {CustomContainerSeal(CMTitle.find((f) => f.title === CONTAINER_SEAL).value)}
        <p style={{ fontWeight: 600 }}>MARKS</p>
        {CustomTextField({ fullWidth: true, multiline: true, title: CM_MARK })}
        {[HS_CODE, HTS_CODE, NCM_CODE].map((title) => {
          const value = CMTitle.find((f) => f.title === title).value;
          return (
            show(value) && (
              <>
                <p style={{ fontWeight: 600 }}>{title}</p>
                {CustomTextField({ style: { width: '90%' }, title: title })}
              </>
            )
          );
        })}
        <p style={{ fontWeight: 600 }}>C/M DESCRIPTION</p>
        {CustomTextField({ fullWidth: true, multiline: true, title: CM_DESCRIPTION })}
        {cmUnit.map(({ field, title, unit }, i) => (
          <div key={i} className="flex justify-start">
            <div>
              <p style={{ fontWeight: 600 }}>{`C/M ${title}`}</p>
              {CustomTextField({ style: { width: '90%' }, title: field })}
            </div>
            <div>
              <p style={{ fontWeight: 600 }}>{`${title} UNIT`}</p>
              {CustomSelect({ options: unit, title: mapUnit[field] })}
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <>
      <div
        style={{
          justifyContent: 'end',
          alignItems: 'center',
          display: 'flex',
          height: 56,
          borderBottom: '2px solid #8A97A3',
          overflow: 'hidden'
        }}>
        <IconButton style={{ marginRight: '1rem' }} onClick={onClose}>
          <Icon style={{ color: '#8A97A3' }}>close</Icon>
        </IconButton>
      </div>
      <div style={{ padding: '20px 30px', overflow: 'auto' }}>
        {inqType === CONTAINER_DETAIL ? CDFields() : CMFields()}
      </div>
      {isEdit && (
        <div className="text-center my-16">
          <Button
            variant="contained"
            color="primary"
            onClick={onSave}
            classes={{ root: clsx(classes.button) }}>
            Save
          </Button>
          <Button
            variant="contained"
            classes={{ root: clsx(classes.button, 'cancel') }}
            color="primary"
            onClick={onClose}>
            Cancel
          </Button>
        </div>
      )}
    </>
  );
};

export default AmendmentPopup;
