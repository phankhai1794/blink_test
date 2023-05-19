import {
  CONTAINER_DETAIL,
  CONTAINER_NUMBER,
  CONTAINER_LIST,
  HS_CODE,
  HTS_CODE,
  NCM_CODE,
  mapUnit,
  CONTAINER_MANIFEST,
  CONTAINER_PACKAGE,
  CM_PACKAGE,
  CONTAINER_WEIGHT,
  CONTAINER_MEASUREMENT,
  CM_WEIGHT,
  CM_MEASUREMENT
} from '@shared/keyword';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Drawer,
  Popper,
  TextField
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import styled from 'styled-components';
import { formatContainerNo, NumberFormat } from '@shared';

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

const StyledPopper = styled(Popper)`&&{
  z-index: 1301;
  width: 300px;
  padding: 15px;
  background: white;
  border-radius: 8px;

  &[x-placement*="right"] {
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15);
  }

  &[x-placement*="left"] {
    box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.15);
  }

  &[x-placement*="right"] .arrow{
    left: 0;
    margin-left: -0.9em;

    &:before {
      left: 3px;
      border-color: transparent white transparent transparent;
      box-shadow: -1px 1px 1px rgba(0, 0, 0, 0.15);
    }
  }

  &[x-placement*="left"] .arrow{
    right: 0;
    margin-right: -0.9em;

    &:before {
      right: 3px;
      border-color: transparent transparent transparent white;
      box-shadow: 1px -1px 1px rgba(0, 0, 0, 0.15);
    }
  }

  .arrow {
    position: absolute;
    font-size: 10px;
    width: 3em;
    height: 3em;

    &:before {
      content: "";
      margin: auto;
      background: white;
      margin-top: 5px;
      position: absolute;
      display: block;
      width: 10px;
      height: 10px;
      border-style: solid;
      transform: rotate(45deg)
    }
  }
}`;

const ContainerDetailForm = ({ container, originalValues, setEditContent, disableInput = false, isResolveCDCM, isPendingProcess, setDataCD, isInqCDCM, setAddContent }) => {
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const content = useSelector(({ workspace }) => workspace.inquiryReducer.content);
  const contentInqResolved = useSelector(({ workspace }) => workspace.inquiryReducer.contentInqResolved);
  const user = useSelector(({ user }) => user);
  const originValueCancel = useSelector(({ workspace }) => workspace.inquiryReducer.originValueCancel);
  const classes = useStyles();

  const getField = (field) => {
    return metadata.field?.[field] || '';
  };

  const getType = (type) => {
    return metadata.inq_type?.[type] || '';
  };

  const getValueField = (field) => {
    return content[getField(field)] || [];
  };

  const originalData = originalValues && originalValues.length ? originalValues : (getValueField(container) || [{}]);
  const [values, setValues] = useState(originalData);
  const [openEdit, setOpenEdit] = useState(false);
  const [rowIndex, setRowIndex] = useState(0);
  const [valueEdit, setValueEdit] = useState(originalData);
  const [popover, setPopover] = useState({ open: false, text: '' });
  const [anchorEl, setAnchorEl] = useState(null);
  const [arrowRef, setArrowRef] = useState(null);
  const [isSave, setSaveCDCM] = useState(false);

  const CDTitle = CONTAINER_LIST.cd
  const CMTitle = user.role === 'Guest' ? [CONTAINER_NUMBER, ...CONTAINER_LIST.cm].filter(item => ![HS_CODE, HTS_CODE, NCM_CODE].includes(item)) : [CONTAINER_NUMBER, ...CONTAINER_LIST.cm]
  const type = (container === CONTAINER_DETAIL) ? CDTitle : CMTitle;
  const open = Boolean(anchorEl);

  const sortValues = (vals) => {
    let valuesSorted = [];
    if (container === CONTAINER_MANIFEST && !isResolveCDCM) {
      let cms = [...vals];
      const contentCD = getValueField(CONTAINER_DETAIL) || [];
      const contsNo = [
        ...new Set((contentCD || []).map((cd) => cd?.[metadata?.inq_type?.[CONTAINER_NUMBER]]))
      ];
      if (contsNo.length) {
        contsNo.forEach((contNo) => {
          valuesSorted = [
            ...valuesSorted,
            ...cms.filter((cm) => contNo === cm?.[metadata?.inq_type?.[CONTAINER_NUMBER]])
          ];
          cms = cms.filter((cm) => contNo !== cm?.[metadata?.inq_type?.[CONTAINER_NUMBER]]);
        });
      }
      valuesSorted = [...valuesSorted, ...cms];
      return valuesSorted;
    }
    return vals;
  }

  useEffect(() => {
    if (!originalValues) {
      setValues(originalData);
      setValueEdit(originalData);
    }
  }, [container])

  useEffect(() => {
    const sort = sortValues(originalData)
    setValues(sort)
    setValueEdit(sort);
  }, [originalData]);

  useEffect(() => {
    if (!isResolveCDCM) {
      setValues(originalData);
      setValueEdit(originalData);
    }
  }, [isResolveCDCM]);

  const handleEdit = (state) => {
    setOpenEdit(state);
    valueEdit.forEach(data => {
      const containerNoId = metadata.inq_type[CONTAINER_NUMBER];
      data[containerNoId] = formatContainerNo(data[containerNoId]);
    })
    if (!disableInput) {
      setEditContent(valueEdit);
    }
  }

  useEffect(() => {
    const sort = sortValues(values)
    setValues(sort)
    setValueEdit(sort)
  }, [])

  useEffect(() => {
    if (isSave) {
      setAddContent(values)
      setSaveCDCM(false)
    }
  }, [isSave])


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
    let minFrac = -1;
    if ([CM_MEASUREMENT, CM_WEIGHT, CONTAINER_MEASUREMENT, CONTAINER_WEIGHT].includes(name)) minFrac = 3;
    else if ([CM_PACKAGE, CONTAINER_PACKAGE].includes(name)) minFrac = 0;
    return total === 0 ? '' : NumberFormat(total, minFrac) + ` ${values[0][getType(mapUnit[name])] || ''}`;
  };

  const combineValueUnit = (name, row) => {
    if (row) {
      let value = isArray(row[getType(name)]);
      if (value) {
        let minFrac = -1;
        if ([CM_MEASUREMENT, CM_WEIGHT, CONTAINER_MEASUREMENT, CONTAINER_WEIGHT].includes(name)) minFrac = 3;
        if ([CM_PACKAGE, CONTAINER_PACKAGE].includes(name)) minFrac = 0;
        if (minFrac !== -1) {
          value = NumberFormat(value, minFrac);
          row[getType(name)] = value;
        }
      }

      if (Object.keys(mapUnit).includes(name)) {
        const id = getType(mapUnit[name]);
        const unit = row[id] || '';
        return value ? `${value} ${unit}` : value;
      }
      return value;
    }
    return ""
  }

  const isValueChange = (key, index, row) => {
    const originalValue = combineValueUnit(key, contentInqResolved[getField(container)]?.[index]);
    return originalValue !== combineValueUnit(key, row) ? '#FEF4E6' : '';
  }

  // TODO
  const handleClose = (type = 'cancel') => {
    // set data before after cancel resolve
    if (Object.keys(originValueCancel).length && type == 'cancel') {
      valueEdit[rowIndex] = originValueCancel;
      setValues(valueEdit)
      setValueEdit(valueEdit);
    }
    handleEdit(false);
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

  const handleArrorRef = (node) => setArrowRef(node);

  return (
    <>
      <Drawer
        classes={{ paper: classes.paper }}
        anchor='right'
        open={openEdit}
        onClose={() => handleClose('cancel')}
      >
        <AmendmentPopup
          onClose={(type) => handleClose(type)}
          inqType={container}
          containerDetail={getValueField(CONTAINER_DETAIL)}
          data={valueEdit[rowIndex]}
          isEdit={!disableInput}
          setSave={() => setSaveCDCM(true)}
          updateData={(value) => setValues(value)}
          updateEdit={(value) => setValueEdit(value)}
          index={rowIndex}
          isInqCDCM={isInqCDCM}
        />
      </Drawer>
      <StyledPopper
        anchorEl={anchorEl}
        open={open}
        placement="right"
        modifiers={{
          flip: {
            enabled: true,
          },
          preventOverflow: {
            enabled: true,
            boundariesElement: 'scrollParent',
          },
          arrow: {
            enabled: true,
            element: arrowRef,
          },
        }}
      >
        <div className='arrow' ref={handleArrorRef} />
        <span style={{ color: '#515E6A' }}>{popover.text}</span>
      </StyledPopper>

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