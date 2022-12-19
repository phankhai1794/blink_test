import {
  CONTAINER_DETAIL,
  CONTAINER_NUMBER,
  CONTAINER_LIST,
  HS_CODE,
  HTS_CODE,
  NCM_CODE,
  mapUnit
} from '@shared/keyword';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Icon, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Drawer, Popover } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import AmendmentPopup from './AmendmentPopup';

const useStyles = makeStyles(() => ({
  paper: {
    width: 450,
    backgroundColor: '#FDF2F2'
  },
  popover: {
    width: 250,
    padding: 15,
    boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.15)'
  }
}))
const isArray = (value) => {
  return Array.isArray(value) ? value.join(', ') : value;
}

const ContainerDetailForm = ({ container, originalValues, setEditContent, disableInput = false }) => {
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const content = useSelector(({ workspace }) => workspace.inquiryReducer.content);
  const user = useSelector(({ user }) => user);
  const classes = useStyles();

  const getField = (field) => {
    return metadata.field?.[field] || '';
  };

  const getType = (type) => {
    return metadata.inq_type?.[type] || '';
  };

  const getValueField = (field) => {
    return content[getField(field)] || '';
  };

  const originalData = originalValues || getValueField(container) || [{}];
  const [values, setValues] = useState(originalValues || getValueField(container) || [{}]);
  const [openEdit, setOpenEdit] = useState(false);
  const [rowIndex, setRowIndex] = useState(0);
  const [valueEdit, setValueEdit] = useState(originalValues || getValueField(container) || [{}]);
  const [popover, setPopover] = useState({ open: false, text: '' });
  const [anchorEl, setAnchorEl] = useState(null);

  const CDTitle = CONTAINER_LIST.cd
  const CMTitle = user.role === 'Guest' ? [CONTAINER_NUMBER, ...CONTAINER_LIST.cm].filter(item => ![HS_CODE, HTS_CODE, NCM_CODE].includes(item)) : [CONTAINER_NUMBER, ...CONTAINER_LIST.cm]
  const type = (container === CONTAINER_DETAIL) ? CDTitle : CMTitle;
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (!originalValues) {
      setValues(originalData);
      setValueEdit(originalData);
    }
  }, [container])

  const handleEdit = (state) => {
    setOpenEdit(state)
    setEditContent(valueEdit);
  }

  const getTotals = (data, name) => {
    if (!Object.keys(mapUnit).includes(name)) return ''
    const key = getType(name)
    let total = 0;
    data.forEach(item => {
      if (typeof (item[key] || '') === "string") {
        total += Number((item[key] || '').replace(/,/g, ''));
      }
      else {
        total += item[key];
      }
    });
    return total === 0 ? '' : parseFloat(total.toFixed(6)).toLocaleString() + ` ${values[0][getType(mapUnit[name])] || ''}`;
  };

  const combineValueUnit = (name, row) => {
    const value = isArray(row[getType(name)]);
    if (Object.keys(mapUnit).includes(name)) {
      const id = getType(mapUnit[name]);
      const unit = row[id] || '';
      return value ? `${value} ${unit}` : value;
    }
    return value;
  }

  const isValueChange = (key, index, row) => {
    const originalValue = combineValueUnit(key, originalData[index]);
    return originalValue !== combineValueUnit(key, row) ? '#FEF4E6' : '';
  }

  const handleClose = () => {
    handleEdit(false)
  }

  const checkPopover = (e) => {
    const overflow = e.target.scrollWidth > e.target.clientWidth;
    if (overflow) {
      setAnchorEl(e.currentTarget);
      setPopover({ open: true, text: e.target.innerHTML });
    }
  }

  const closePopover = () => {
    setAnchorEl(null);
    setPopover({ open: false });
  }

  return (
    <>
      <Drawer
        classes={{ paper: classes.paper }}
        anchor='right'
        open={openEdit}
        onClose={handleClose}
      >
        <AmendmentPopup
          onClose={handleClose}
          inqType={container}
          containerDetail={getValueField(CONTAINER_DETAIL)}
          data={valueEdit[rowIndex]}
          isEdit={!disableInput}
          updateData={(value) => setValues(value)}
          updateEdit={(value) => setValueEdit(value)}
          index={rowIndex}
        />
      </Drawer>
      <Popover
        classes={{ paper: classes.popover }}
        style={{ pointerEvents: 'none', width: 300 }}
        anchorEl={anchorEl}
        open={open}
        onClose={closePopover}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transitionDuration={500}
      >
        <span style={{ color: '#515E6A' }}>{popover.text}</span>
      </Popover>

      <div style={{ maxWidth: 880, overflowX: 'auto' }}>
        <Table className='amend_table' aria-label="simple table" >
          <TableHead>
            <TableRow>
              {type.map((cell, i) =>
                <TableCell
                  className={i === 0 ? 'cell_frozen cell_amend' : 'cell_amend'}
                  key={i}
                  style={{ backgroundColor: '#FDF2F2', fontSize: 14, color: '#132535' }}>
                  {cell.toUpperCase()}
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {values.map((row, vindex) => (
              <TableRow key={vindex}>
                {type.map((cell, i) => {
                  const value = isArray(row[getType(cell)])
                  return (
                    <TableCell
                      key={i}
                      className={i === 0 ? 'cell_frozen cell_amend' : 'cell_amend'}
                      style={{ backgroundColor: isValueChange(cell, vindex, row) }}
                      onMouseEnter={checkPopover}
                      onMouseLeave={closePopover}
                    >
                      {i === 0 ?
                        <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between' }} >
                          <span>{value}</span>
                          <IconButton onClick={() => {
                            setRowIndex(vindex)
                            handleEdit(true);
                          }} className="w-16 h-16 p-0">
                            <Icon className="text-16 arrow-icon" color="disabled">
                              {disableInput ? 'visibility' : 'edit_mode'}
                            </Icon>
                          </IconButton>
                        </div> : combineValueUnit(cell, row)
                      }
                    </TableCell>
                  )
                }
                )}
              </TableRow>
            ))}
            <TableRow>
              {type.map((cell, i) =>
                <TableCell
                  style={{ color: '#BD0F72', fontWeight: 600 }}
                  className={i === 0 ? 'cell_frozen cell_amend' : 'cell_amend'}
                  key={i}>
                  {i === 0 ? 'Total' : getTotals(values, cell)}
                </TableCell>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default ContainerDetailForm;