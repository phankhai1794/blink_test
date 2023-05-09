import {
  Icon,
  Button,
  TextField,
  IconButton,
  Chip,
  FormControl,
  FormHelperText,
  Tooltip
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import {
  CONTAINER_DETAIL,
  CONTAINER_NUMBER,
  CONTAINER_SEAL,
  CONTAINER_LIST,
  CONTAINER_PACKAGE,
  CONTAINER_WEIGHT,
  CONTAINER_TYPE,
  CONTAINER_MEASUREMENT,
  CM_MARK,
  CM_DESCRIPTION,
  CM_PACKAGE,
  CM_WEIGHT,
  CM_MEASUREMENT,
  HS_CODE,
  HTS_CODE,
  NCM_CODE,
  mapUnit
} from '@shared/keyword';
import { useUnsavedChangesWarning } from 'app/hooks'
import { packageUnits, weightUnits, measurementUnits, containerTypeUnit } from '@shared/units';
import ClearIcon from '@material-ui/icons/Clear';
import WindowedSelect from "react-windowed-select";
import { formatContainerNo, formatNumber } from '@shared';

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
    padding: '5px 23px 5px 5px',
    minHeight: 23
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
  }
}));

const StyledChip = withStyles(theme => ({
  root: {
    maxWidth: 350,
    borderRadius: '8px',
    border: '0.5px solid #515F6B',
    background: 'white',
    height: 26,
    margin: 3,
    color: '#515E6A',
    fontSize: 15,
    fontFamily: 'Montserrat'
  },
  label: {
    display: 'inline-block',
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  }
}))(Chip);

const AmendmentPopup = (props) => {
  const { onClose, inqType, isEdit, data, index, updateData, updateEdit, containerDetail, setSave, isInqCDCM } = props;
  const classes = useStyles();
  const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning();

  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const user = useSelector(({ user }) => user);
  const [inputSeal, setInputSeal] = useState('');
  const { register, control, handleSubmit, formState: { errors } } = useForm();
  const regNumber = { value: /^\s*(([1-9]\d{0,2}(,?\d{3})*))(\.\d+)?\s*$/g, message: 'Must be a Number' }
  const regInteger = { value: /^\s*[1-9]\d{0,2}(,?\d{3})*\s*$/g, message: 'Must be a Number' }

  const getType = (type) => {
    return metadata.inq_type?.[type] || '';
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

  const idUnit = [getType(CONTAINER_WEIGHT), getType(CONTAINER_MEASUREMENT), getType(CM_WEIGHT), getType(CM_MEASUREMENT)];

  const onSave = () => {
    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'string' && ![getType(HS_CODE), getType(HTS_CODE), getType(NCM_CODE)].includes(key))
        data[key] = data[key].toUpperCase().trim();
      if (typeof data[key] === 'string' && idUnit.includes(key) && !isNaN(data[key])) {
        data[key] = parseFloat(data[key]).toFixed(3);
      }
    });
    updateData((old) => old.map((row, i) => (index === i ? data : row)));
    onClose();
    setPristine()
    if (isInqCDCM) setSave();
  };

  const show = (value) => user.role === 'Admin' && value;

  const handleChange = (field, value) => {
    setDirty();
    let val = value;
    const id = field.id;
    if ([CONTAINER_PACKAGE, CONTAINER_WEIGHT, CONTAINER_MEASUREMENT, CM_PACKAGE, CM_WEIGHT, CM_MEASUREMENT].includes(field.title) && !isNaN(value)) {
      val = formatNumber(value);
    }
    updateEdit((old) => old.map((row, i) => (index === i ? { ...old[index], [id]: val } : row)));
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
      const input = inputSeal.split(/,|;/).map((str) => str.toUpperCase().trim()).filter(str => str);
      setInputSeal('');
      updateEdit((old) =>
        old.map((row, i) =>
          index === i
            ? { ...old[index], [getType(CONTAINER_SEAL)]: [...new Set([...value, ...input])] }
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
    const { title, rows, ...prop } = props;
    const type = inqType === CONTAINER_DETAIL ? CDTitle : CMTitle;
    const field = type.find((f) => f.title === title);
    // TODO: Case for Dummy ContainerNo
    const isUpperCase = field.title !== CONTAINER_NUMBER;

    return (
      <TextField
        {...prop}
        variant="outlined"
        rows={rows}
        error={Boolean(errors[title])}
        helperText={errors[title]?.message}
        autoComplete="off"
        className={clsx(classes.textField, !isEdit && classes.lock)}
        value={!isUpperCase ? formatContainerNo(field.value) : field.value}
        onChange={(e) => handleChange(field, e.target.value)}
        InputProps={{
          disabled: !isEdit,
          endAdornment: <>{!isEdit && <Icon>lock</Icon>}</>
        }}
        inputProps={{ style: { textTransform: isUpperCase ? 'uppercase' : 'none' } }}
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
                <Tooltip key={i} title={tag} enterDelay={1000}>
                  <StyledChip
                    label={tag}
                    onDelete={() => onDelete(value, i)}
                    deleteIcon={<ClearIcon fontSize="small" />}
                  />
                </Tooltip>
              ))}
            </>
            <input
              style={{
                width: 20,
                minHeight: 26,
                flexGrow: 1,
                border: 'none',
                fontSize: 15,
                fontFamily: 'Montserrat',
                textTransform: 'uppercase'
              }}
              value={inputSeal}
              onKeyDown={(e) => onKeyDown(e, value)}
              onChange={(e) => {
                setInputSeal(e.target.value)
                setDirty()
              }}
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
              endAdornment: <>{!unlock && <Icon style={{ paddingRight: 12 }}>lock</Icon>}</>
            }}
          />
        )}
      </>
    );
  };

  const CustomSelect = (props) => {
    const { title, options, required } = props;
    const type = inqType === CONTAINER_DETAIL ? CDTitle : CMTitle;
    const field = type.find((f) => f.title === title);
    const isError = errors[title];
    const defaultValue = options.length === 1 ? options[0] : options.find(v => v.value === field.value)

    useEffect(() => {
      if (!field.value && options.length === 1)
        handleChange(field, options[0].value);
    }, []);

    return (
      <>
        {isEdit ? (
          <FormControl style={{ width: '100%' }} error={isError}>
            <Controller
              control={control}
              name={title}
              rules={{ required }}
              defaultValue={defaultValue}
              render={({ field: { onChange } }) => (
                <WindowedSelect
                  options={options}
                  onChange={({ value }) => {
                    onChange(value)
                    handleChange(field, value)
                  }}
                  components={{
                    IndicatorSeparator: () => null
                  }}
                  value={defaultValue}
                  styles={{
                    control: (base) => ({
                      ...base,
                      height: 35,
                      minHeight: 35,
                      borderRadius: 8,
                      border: isError ? '1px solid red' : '',
                    }),
                    dropdownIndicator: (base) => ({
                      ...base,
                      color: '#BD0F72'
                    }),
                  }}
                />
              )}
            />

            {isError && <FormHelperText>This is required!</FormHelperText>}
          </FormControl>
        ) : (
          <TextField
            fullWidth={true}
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
      { field: CONTAINER_PACKAGE, title: 'PACKAGE', unit: packageUnits, required: 'This is required', pattern: regInteger },
      { field: CONTAINER_WEIGHT, title: 'WEIGHT', unit: weightUnits, required: 'This is required', pattern: regNumber },
      { field: CONTAINER_MEASUREMENT, title: 'MEASUREMENT', unit: measurementUnits, required: false, pattern: regNumber }
    ];
    return (
      <>
        <p style={{ fontWeight: 600 }}>CONTAINER NUMBER</p>
        {CustomTextField({ fullWidth: true, title: CONTAINER_NUMBER })}
        <p style={{ fontWeight: 600 }}>CONTAINER SEAL</p>
        {CustomContainerSeal(data[getType(CONTAINER_SEAL)])}
        <p style={{ fontWeight: 600 }}>CONTAINER TYPE</p>
        {CustomSelect({ options: containerTypeUnit, title: CONTAINER_TYPE })}
        {cdUnit.map(({ field, title, unit, required, pattern }, i) => (
          <div key={i} className="flex justify-start">
            <div style={{ flex: '0 0 50%' }}>
              <p style={{ fontWeight: 600 }}>{title}
                {required && <span style={{ color: 'red' }}> *</span>}
              </p>
              {CustomTextField({
                style: { width: '90%' }, title: field, ...register(field, { required, pattern })
              })}
            </div>
            <div style={{ flexGrow: 1 }}>
              <p style={{ fontWeight: 600 }}>{`${title} UNIT`}
                {required && <span style={{ color: 'red' }}> *</span>}
              </p>
              {CustomSelect({ options: unit, title: mapUnit[field], required })}
            </div>
          </div>
        ))}
      </>
    );
  };

  const CMFields = () => {
    const cmUnit = [
      { field: CM_PACKAGE, title: 'PACKAGE', unit: packageUnits, required: 'This is required', pattern: regInteger },
      { field: CM_WEIGHT, title: 'WEIGHT', unit: weightUnits, required: 'This is required', pattern: regNumber },
      { field: CM_MEASUREMENT, title: 'MEASUREMENT', unit: measurementUnits, required: false, pattern: regNumber }
    ];
    return (
      <>
        <p style={{ fontWeight: 600 }}>CONTAINER NUMBER</p>
        {CustomTextField({ fullWidth: true, title: CONTAINER_NUMBER })}
        <p style={{ fontWeight: 600 }}>CONTAINER SEAL</p>
        {CustomContainerSeal(CMTitle.find((f) => f.title === CONTAINER_SEAL).value)}
        <p style={{ fontWeight: 600 }}>MARKS</p>
        {CustomTextField({ fullWidth: true, multiline: true, title: CM_MARK, rows: 3 })}
        {[HS_CODE, HTS_CODE, NCM_CODE].map((title) => {
          const value = CMTitle.find((f) => f.title === title).value;
          return (
            show(value) && (
              <>
                <p style={{ fontWeight: 600 }}>{title}</p>
                {CustomTextField({ fullWidth: true, title: title })}
              </>
            )
          );
        })}
        <p style={{ fontWeight: 600 }}>C/M DESCRIPTION
          <span style={{ color: 'red' }}> *</span>
        </p>
        {CustomTextField({ fullWidth: true, multiline: true, title: CM_DESCRIPTION, rows: 6, ...register(CM_DESCRIPTION, { required: "This is required" }) })}
        {cmUnit.map(({ field, title, unit, required, pattern }, i) => (
          <div key={i} className="flex justify-start">
            <div style={{ flex: '0 0 50%' }}>
              <p style={{ fontWeight: 600 }}>{`C/M ${title}`}
                {required && <span style={{ color: 'red' }}> *</span>}
              </p>
              {CustomTextField({ style: { width: '90%' }, title: field, ...register(field, { required, pattern }) })}
            </div>
            <div style={{ flexGrow: 1 }}>
              <p style={{ fontWeight: 600 }}>{`${title} UNIT`}
                {required && <span style={{ color: 'red' }}> *</span>}
              </p>
              {CustomSelect({ options: unit, title: mapUnit[field], required })}
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
      <div style={{ padding: '20px 30px' }}>
        {inqType === CONTAINER_DETAIL ? CDFields() : CMFields()}
      </div>
      {isEdit && (
        <div className="text-center my-16">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit(onSave)}
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
