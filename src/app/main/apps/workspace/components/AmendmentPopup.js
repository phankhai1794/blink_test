import { Drawer, Icon, Button, TextField, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react'
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import {
  CONTAINER_DETAIL,
  CONTAINER_NUMBER,
  CONTAINER_SEAL,
  CONTAINER_TYPE,
  CONTAINER_PACKAGE,
  CONTAINER_WEIGHT,
  CONTAINER_MEASUREMENT,
  CM_MARK,
  CM_PACKAGE,
  CM_DESCRIPTION,
  CM_WEIGHT,
  CM_MEASUREMENT
} from '@shared/keyword';

const useStyles = makeStyles((theme) => ({
  paper: {
    width: 450,
    backgroundColor: '#FDF2F2'
  },
  textField: {
    '& fieldset': {
      border: '1px solid #BAC3CB',
      backgroundColor: '#EFEFEF',
      borderRadius: '8px',
      zIndex: '-1'
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
  scrollbar: {
    '&::-webkit-scrollbar': {
      width: 10
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#FCDDEC',
    }
  }
}));

const AmendmentPopup = (props) => {
  const { open, lock, onClose, inqType, data } = props
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const classes = useStyles();

  const getType = (type) => {
    return metadata.inq_type?.[type] || '';
  };

  const CDTitle = [CONTAINER_NUMBER, CONTAINER_SEAL, CONTAINER_TYPE, CONTAINER_PACKAGE, CONTAINER_WEIGHT, CONTAINER_MEASUREMENT].map(title => { return { title: title, value: data[getType(title)] } })
  const CMTitle = [CM_MARK, CM_PACKAGE, CM_DESCRIPTION, CM_WEIGHT, CM_MEASUREMENT].map(title => { return { title: title, value: data[getType(title)] } })
  const type = inqType === CONTAINER_DETAIL ? CDTitle : CMTitle

  const onSave = () => { }
  console.log("metadata: ", metadata)

  console.log("data: ", data)

  console.log("CDTitle: ", CDTitle)
  return (
    <Drawer
      classes={{ paper: classes.paper }}
      anchor='right'
      open={open}
      onClose={onClose}
    >
      <div style={{ justifyContent: 'end', alignItems: 'center', display: 'flex', height: 56, borderBottom: '2px solid #8A97A3', overflow: 'hidden' }}>
        <Icon style={{ color: '#8A97A3', marginRight: '1rem' }}>close</Icon>
      </div>
      <div className={clsx(classes.scrollbar)} style={{ padding: '20px 30px 0 30px', overflow: 'auto' }}>
        {
          type.map(data => (
            <>
              <p style={{ fontWeight: 600 }}>{data.title}</p>
              <TextField
                variant="outlined"
                fullWidth={true}
                className={clsx(
                  classes.textField,
                )}
                defaultValue={data.value}
                InputProps={{
                  disabled: true,
                  endAdornment: (
                    <>
                      {
                        <Icon> lock</Icon>
                      }
                    </>
                  )
                }}
              />
            </>
          ))
        }
      </div>
      <Link
        component="button"
        variant="body2"
        style={{ display: 'flex', alignItems: 'center', padding: '20px 30px' }}
        onClick={() => null}>
        <Icon
          style={{ border: '2px', width: 25 }}
        >add_circle_outline </Icon>
        <span
          style={{
            fontSize: 16,
            fontWeight: '600',
            fontFamily: 'Montserrat',
            paddingLeft: 5,
            height: 20,
            fontStyle: 'normal'
          }}>
          Add Attachment
        </span>
      </Link>
      <div className="text-center mb-8">
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
    </Drawer >
  )
}

export default AmendmentPopup