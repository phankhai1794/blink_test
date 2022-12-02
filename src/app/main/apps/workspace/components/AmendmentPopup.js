import { Icon, Button, TextField, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react'
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import {
  CONTAINER_DETAIL,
  CONTAINER_NUMBER,
  CONTAINER_SEAL,
  CONTAINER_LIST,
  CONTAINER_PACKAGE,
  CM_PACKAGE,
  CM_PACKAGE_UNIT,
  HS_CODE,
  HTS_CODE,
  NCM_CODE,
  mapUnit
} from '@shared/keyword';

const useStyles = makeStyles((theme) => ({
  textField: {
    '& fieldset': {
      border: '1px solid #BAC3CB',
      borderRadius: '8px',
      backgroundColor: 'white',
      zIndex: '-1'
    },
    '& .MuiOutlinedInput-multiline': {
      padding: 2,
    },
    '& .MuiOutlinedInput-input': {
      padding: 8,
    }
  },
  lock: {
    '& fieldset': {
      backgroundColor: '#EFEFEF',
      color: '#515E6A'
    },
    "& .MuiInputBase-root.Mui-disabled": {
      color: "#515E6A"
    },
    '& .MuiOutlinedInput-multiline': {
      padding: 2,
    },
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
}));

const AmendmentPopup = (props) => {
  const { onClose, inqType, isEdit, data, index, updateData, updateEdit, containerDetail } = props;
  const classes = useStyles();
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const user = useSelector(({ user }) => user);
  const [errors, setErrors] = useState({});

  const getType = (type) => {
    return metadata.inq_type?.[type] || '';
  };

  const getTypeName = (type) => {
    return Object.keys(metadata.inq_type).find(key => metadata.inq_type[key] === type);
  };

  const CDTitle = CONTAINER_LIST.cd.map(title => {
    return { title: title, value: data[getType(title)], id: getType(title) }
  });

  const CMTitle = [CONTAINER_NUMBER, CONTAINER_SEAL, ...CONTAINER_LIST.cm].map(title => {
    return {
      title: title,
      value: CONTAINER_SEAL === title ? containerDetail.find(c => c[getType(CONTAINER_NUMBER)] === data[getType(CONTAINER_NUMBER)])?.[getType(CONTAINER_SEAL)] : data[getType(title)],
      id: getType(title)
    }
  });

  const type = (inqType === CONTAINER_DETAIL) ? CDTitle : CMTitle;

  const isValid = (id, value) => {
    if (!value) return [true, '']
    else if ([CONTAINER_PACKAGE, CM_PACKAGE].includes(getTypeName(id))) {
      const pattern = /^\s*\d*\s*$/g
      return [pattern.test(value), 'Must be an integer']
    }
    else {
      const pattern = /^\s*(([1-9]\d{0,2}(,?\d{3})*)|0)(\.\d+)?\s*$/g
      return [pattern.test(value), "Must be a number"]
    }
  }

  const isUnitValid = (id, value) => {
    if (CM_PACKAGE_UNIT === getTypeName(id)) {
      const pattern = /^\s*\w{2}?\s*$/g
      return !pattern.test(value)
    }
    return false
  }

  const onSave = () => {
    if (!Object.values(errors).includes(false)) {
      updateData(old => old.map((row, i) => index === i ? data : row));
      onClose();
    }
  }

  const lock = (title) => ((inqType !== CONTAINER_DETAIL || user.role === 'Guest') && [CONTAINER_NUMBER, CONTAINER_SEAL].includes(title)) || !isEdit;
  const show = (title, value) => (user.role === 'Admin' && [HS_CODE, HTS_CODE, NCM_CODE].includes(title) && value) || ![HS_CODE, HTS_CODE, NCM_CODE].includes(title)
  const onChange = (id, value) => {
    const name = getTypeName(id)
    if (Object.keys(mapUnit).includes(name)) {
      setErrors({ ...errors, [id]: isValid(id, value)[0] });
    }
    else if (CM_PACKAGE_UNIT === getTypeName(id)) {
      setErrors({ ...errors, [id]: !isUnitValid(id, value) });
    }
    updateEdit(old => old.map((row, i) => index === i ? { ...old[index], [id]: value } : row));
  }

  return (
    <>
      <div style={{ justifyContent: 'end', alignItems: 'center', display: 'flex', height: 56, borderBottom: '2px solid #8A97A3', overflow: 'hidden' }}>
        <IconButton style={{ marginRight: '1rem' }} onClick={onClose}>
          <Icon style={{ color: '#8A97A3' }}>close</Icon>
        </IconButton>
      </div>
      <div style={{ padding: '20px 30px', overflow: 'auto' }}>
        {
          type.map((field, index) =>
            <React.Fragment key={index}>
              {Object.keys(mapUnit).includes(field.title) ?
                <div className='flex justify-between'>
                  <div>
                    <p style={{ fontWeight: 600 }}>{field.title.replace(/\(.*\)/g, '')}</p>
                    <TextField
                      variant="outlined"
                      error={!isValid(field.id, field.value)[0]}
                      helperText={!isValid(field.id, field.value)[0] && isValid(field.id, field.value)[1]}
                      className={clsx(
                        classes.textField,
                        !isEdit && classes.lock
                      )}
                      style={{ width: '90%' }}
                      value={field.value}
                      onChange={(e) => onChange(field.id, e.target.value)}
                      InputProps={{
                        disabled: !isEdit,
                        endAdornment: (
                          <>
                            {!isEdit && <Icon>lock</Icon>}
                          </>
                        )
                      }}
                    />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600 }}>{`${field.title} Unit`.replace(/Container|C\/M|\(.*\)/g, '')}</p>
                    <TextField
                      variant="outlined"
                      error={isUnitValid(getType(mapUnit[field.title]), data[getType(mapUnit[field.title])])}
                      helperText={isUnitValid(getType(mapUnit[field.title]), data[getType(mapUnit[field.title])]) && 'Invalid unit'}
                      className={clsx(
                        classes.textField,
                        !isEdit && classes.lock
                      )}
                      value={data[getType(mapUnit[field.title])]}
                      onChange={(e) => onChange(getType(mapUnit[field.title]), e.target.value)}
                      InputProps={{
                        disabled: !isEdit,
                        endAdornment: (
                          <>
                            {!isEdit && <Icon>lock</Icon>}
                          </>
                        )
                      }}
                    />
                  </div>
                </div>
                :
                <>
                  {show(field.title, field.value) &&
                    <>
                      <p style={{ fontWeight: 600 }}>{field.title}</p>
                      <TextField
                        variant="outlined"
                        fullWidth={true}
                        multiline={true}
                        className={clsx(
                          classes.textField,
                          lock(field.title) && classes.lock
                        )}
                        value={field.value}
                        onChange={(e) => onChange(field.id, e.target.value)}
                        InputProps={{
                          disabled: lock(field.title),
                          endAdornment: (
                            <>
                              {lock(field.title) && <Icon>lock</Icon>}
                            </>
                          )
                        }}
                      />
                    </>
                  }
                </>
              }
            </React.Fragment>
          )
        }
      </div>
      {isEdit &&
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
      }
    </>
  )
}

export default AmendmentPopup