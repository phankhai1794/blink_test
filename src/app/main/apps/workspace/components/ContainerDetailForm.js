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
  CM_MEASUREMENT,
  CM_DESCRIPTION,
  CM_MARK,
  CONTAINER_TYPE, CONTAINER_PACKAGE_UNIT, CM_PACKAGE_UNIT, SEQ
} from '@shared/keyword';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Drawer,
  Popover,
  Paper
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { formatContainerNo, NumberFormat } from '@shared';
import { containerTypeUnit } from '@shared/units';

import EllipsisPopper from '../shared-components/EllipsisPopper';
import * as FormActions from '../store/actions/form';
import Diff from "../shared-components/react-diff";

import AmendmentPopup from './AmendmentPopup';
import clsx from 'clsx';

const useStyles = makeStyles(() => ({
  drawer: {
    width: 450,
    backgroundColor: '#FDF2F2'
  },
  paper: {
    maxHeight: 400,
    maxWidth: 400,
    overflow: "auto",
    padding: 15,
    color: '#515E6A'
  },
  popover: {
    width: 250,
    padding: 15,
    boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.15)'
  },
  actionCdCmStyle: {
    '& .handleContNo': {
      cursor: 'pointer'
    },
    '& .handleContNo:hover': {
      color: '#BD0F72'
    }
  },
  iconHistory: {
    cursor: 'pointer',
    '&:hover': {
      color: '#BD0F72'
    }
  },
}))
const isArray = (value) => {
  return Array.isArray(value) ? value.join(', ') : value;
}


const ContainerDetailForm = ({ container, originalValues, setEditContent, disableInput = false, isResolveCDCM, isPendingProcess, setDataCD, isInqCDCM, setAddContent, setEventClickContNo, isAllowEdit, currentQuestion, dataCdGetSeal, dataCmMapSeq }) => {
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const content = useSelector(({ workspace }) => workspace.inquiryReducer.content);
  const contentInqResolved = useSelector(({ workspace }) => workspace.inquiryReducer.contentInqResolved);
  const orgContent = useSelector(({ workspace }) => workspace.inquiryReducer.orgContent);
  const user = useSelector(({ user }) => user);
  const originValueCancel = useSelector(({ workspace }) => workspace.inquiryReducer.originValueCancel);
  const classes = useStyles();
  const dispatch = useDispatch();

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
  const [historyValue, setHistoryValue] = useState({ originalValue: '', value: '' })
  const [anchorElHover, setAnchorElHover] = useState(null);
  const [anchorElHistory, setAnchorElHistory] = useState(null);
  const [arrowRef, setArrowRef] = useState(null);
  const [isSave, setSaveCDCM] = useState(false);

  const CDTitle = CONTAINER_LIST.cd;
  const CMTitle = [SEQ, CONTAINER_NUMBER, ...CONTAINER_LIST.cm];
  const type = (container === CONTAINER_DETAIL) ? CDTitle : CMTitle;

  const sortValues = (vals) => {
    let valuesSorted = [];
    if (!isResolveCDCM) {
      let cms = container === CONTAINER_MANIFEST ? [...vals] : [...dataCmMapSeq];
      cms = cms.sort((a, b) => (parseInt(a?.[metadata?.inq_type?.[SEQ]]) > parseInt(b?.[metadata?.inq_type?.[SEQ]]) ? 1 : -1));
      if (container === CONTAINER_MANIFEST) {
        valuesSorted = [...valuesSorted, ...cms];
      } else if (container === CONTAINER_DETAIL) {
        const cdContent = [...vals];
        const contsNo = [
          ...new Set((cms || []).map((cm) => cm?.[metadata?.inq_type?.[CONTAINER_NUMBER]]))
        ];
        if (contsNo.length) {
          contsNo.forEach((contNo) => {
            valuesSorted = [
              ...valuesSorted,
              ...cdContent.filter((cd) => contNo === cd?.[metadata?.inq_type?.[CONTAINER_NUMBER]])
            ];
            cms = cms.filter((cm) => contNo !== cm?.[metadata?.inq_type?.[CONTAINER_NUMBER]]);
          });
        }
      }
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

  const checkUnitPackage = () => {
    const arrTypeCD = [];
    const arrTypeCM = [];
    if (values && values.length) {
      values.forEach(ori => {
        const packageCdUnit = ori[getType(CONTAINER_PACKAGE_UNIT)];
        const packageCmUnit = ori[getType(CM_PACKAGE_UNIT)];
        if (packageCdUnit && !arrTypeCD.includes(packageCdUnit)) {
          arrTypeCD.push(packageCdUnit);
        } else if (packageCmUnit && !arrTypeCM.includes(packageCmUnit)) {
          arrTypeCM.push(packageCmUnit);
        }
      })
    }
    return {arrTypeCD, arrTypeCM};
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
    let minFrac = -1;
    let arrayCdTypes = [];
    let arrayCmTypes = [];
    if ([CM_MEASUREMENT, CM_WEIGHT, CONTAINER_MEASUREMENT, CONTAINER_WEIGHT].includes(name)) minFrac = 3;
    else if ([CM_PACKAGE, CONTAINER_PACKAGE].includes(name)) {
      if (name === CONTAINER_PACKAGE) arrayCdTypes = checkUnitPackage().arrTypeCD;
      if (name === CM_PACKAGE) arrayCmTypes = checkUnitPackage().arrTypeCM;
      minFrac = 0;
    }
    let valueType = values[0][getType(mapUnit[name])] || '';
    if (arrayCdTypes.length > 1 || arrayCmTypes.length > 1) {
      valueType = 'PK';
    }
    return total === 0 ? '' : NumberFormat(total, minFrac) + ` ${valueType}`;
  };

  const renderContent = (name, row) => {
    if (row) {
      let value = isArray(row[getType(name)]);
      if (name === CONTAINER_TYPE) {
        const contTypeVal = containerTypeUnit.find(contType => contType.value === value);
        value = contTypeVal ? contTypeVal.label : '';
      }
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
    const originalValue = renderContent(key, sortValues(orgContent[getField(container)])?.[index]);
    return originalValue !== renderContent(key, row);
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
    dispatch(FormActions.setDirtyReload({ inputAmendment: false }));
  }

  const checkPopover = (e, value) => {
    const overflow = e.target.scrollWidth > e.target.clientWidth;
    if (overflow) {
      setAnchorElHover(e.currentTarget);
      setPopover({ open: true, text: value });
    }
  }

  const closePopover = () => {
    setAnchorElHover(null);
    setPopover({ open: false, text: '' });
  }

  const handleArrorRef = (node) => setArrowRef(node);

  const handleClickConNo = (vindex) => {
    // open popup amendment
    dispatch(FormActions.eventClickContNo({
      status: true,
      questionId: currentQuestion ? currentQuestion.id : '',
      isHasActionClick: true
    }));
    setRowIndex(vindex)
    handleEdit(true);
  }

  const openHistory = (e, key, index, row) => {
    setAnchorElHistory(e.currentTarget)
    setHistoryValue({
      originalValue: renderContent(key, contentInqResolved[getField(container)]?.[index]),
      value: renderContent(key, row)
    })
  }

  const closeHistory = () => {
    setAnchorElHistory(null);
  }

  return (
    <>
      <Drawer
        classes={{ paper: classes.drawer }}
        anchor='right'
        open={openEdit}
        onClose={() => handleClose('cancel')}
      >
        <AmendmentPopup
          onClose={(type) => handleClose(type)}
          inqType={container}
          containerDetail={getValueField(CONTAINER_DETAIL)}
          data={valueEdit[rowIndex]}
          dataCdGetSeal={dataCdGetSeal}
          dataValues={values}
          dataEdited={valueEdit}
          isEdit={!disableInput || isAllowEdit}
          setSave={() => setSaveCDCM(true)}
          updateData={(value) => setValues(value)}
          updateEdit={(value) => setValueEdit(value)}
          index={rowIndex}
          isInqCDCM={isInqCDCM}
        />
      </Drawer>

      <EllipsisPopper
        open={Boolean(anchorElHover)}
        anchorEl={anchorElHover}
        arrow={true}
        flip={true}
        transition
        placement={'left'}
        disablePortal={false}
        preventOverflow={'scrollParent'}>
        {({ TransitionProps, placement, arrow }) => (
          <>
            {arrow}
            <Paper className={classes.paper}>{popover.text}</Paper>
          </>
        )}
      </EllipsisPopper>

      <Popover
        PaperProps={{
          style: { padding: '0px 20px' }
        }}
        open={Boolean(anchorElHistory)}
        anchorEl={anchorElHistory}
        onClose={closeHistory}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Diff inputA={historyValue.originalValue || ''} inputB={historyValue.value || ''} type="chars" />
      </Popover>

      <div style={{ maxWidth: '100̀%', overflowX: 'auto' }}>
        <Table className='amend_table' aria-label="simple table" >
          <TableHead>
            <TableRow>
              {type.map((cell, i) =>
                <TableCell
                  className={[0, 1].includes(i) ? clsx('cell_frozen cell_amend') : 'cell_amend'}
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
                      className={(container === CONTAINER_MANIFEST ? [0, 1].includes(i) : i === 0) ? 'cell_frozen cell_amend' : 'cell_amend'}
                      style={{ backgroundColor: isValueChange(cell, vindex, row) ? '#FEF4E6' : '' }}
                      onMouseEnter={(e) => checkPopover(e, renderContent(cell, row))}
                      onMouseLeave={closePopover}
                    >
                      {(container === CONTAINER_MANIFEST ? i === 1 : i === 0) ?
                        <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between' }} className={classes.actionCdCmStyle}>
                          {currentQuestion && currentQuestion.process === 'pending' ? (
                            <span className={'handleContNo'} onClick={() => handleClickConNo(vindex)}>{value}</span>
                          ) : <span >{value}</span>}
                          <IconButton onClick={() => {
                            setRowIndex(vindex)
                            handleEdit(true);
                          }} className="w-16 h-16 p-0">
                            <Icon className="text-16 arrow-icon" color="disabled">
                              {disableInput ? 'visibility' : 'edit_mode'}
                            </Icon>
                          </IconButton>
                        </div> :
                        <>
                          {[CM_DESCRIPTION, CM_MARK].includes(cell) && isValueChange(cell, vindex, row) ?
                            <div
                              onMouseEnter={(e) => checkPopover(e, renderContent(cell, row))}
                              onMouseLeave={closePopover}
                              style={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}
                            >
                              <span style={{ width: 160, textOverflow: 'ellipsis', overflow: 'hidden' }}>{renderContent(cell, row)}</span>
                              {isValueChange(cell, vindex, row) && <Icon classes={{ root: classes.iconHistory }} onClick={(e) => openHistory(e, cell, vindex, row)}>history</Icon>}
                            </div>
                            : renderContent(cell, row)
                          }
                        </>
                      }
                    </TableCell>
                  )
                })}
              </TableRow>
            ))}
            <TableRow>
              {type.map((cell, i) =>
                <TableCell
                  style={{ color: '#BD0F72', fontWeight: 600 }}
                  className={(container === CONTAINER_MANIFEST ? [0, 1].includes(i) : i === 0) ? 'cell_frozen cell_amend' : 'cell_amend'}
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