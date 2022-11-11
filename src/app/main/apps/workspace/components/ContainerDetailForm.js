import {
  CONTAINER_DETAIL,
  CONTAINER_NUMBER,
  CM_PACKAGE,
  CM_WEIGHT,
  CM_MEASUREMENT,
  CONTAINER_PACKAGE,
  CONTAINER_MEASUREMENT,
  CONTAINER_WEIGHT,
  SEQ,
  HS_CODE,
  HTS_CODE,
  NCM_CODE,
  mapUnit
} from '@shared/keyword';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Icon, IconButton } from '@material-ui/core';
import ReactTable from "react-table";
import "react-table/react-table.css";

import AmendmentPopup from './AmendmentPopup';

const ContainerDetailForm = ({ container, originalValues, setEditContent, disableInuput = false }) => {
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const content = useSelector(({ workspace }) => workspace.inquiryReducer.content);
  const user = useSelector(({ user }) => user);

  const getField = (field) => {
    return metadata.field?.[field] || '';
  };

  const getType = (type) => {
    return metadata.inq_type?.[type] || '';
  };

  const getTypeName = (type) => {
    return Object.keys(metadata.inq_type).find(key => metadata.inq_type[key] === type);
  };

  const getValueField = (field) => {
    return content[getField(field)] || '';
  };

  const originalData = originalValues || getValueField(container) || [{}];
  const [values, setValues] = useState(originalValues || getValueField(container) || [{}]);
  const [openEdit, setOpenEdit] = useState(false);
  const [rowIndex, setRowIndex] = useState(0);
  const [valueEdit, setValueEdit] = useState(originalValues || getValueField(container) || [{}]);
  const showColumn = user.role === 'Guest' ? [...Object.values(mapUnit), SEQ, HS_CODE, HTS_CODE, NCM_CODE] : [...Object.values(mapUnit), SEQ]

  const handleEdit = (state) => {
    setOpenEdit(state)
    setEditContent(valueEdit);
  }

  const getTotals = (data, key) => {
    let total = 0;
    data.forEach(item => {
      if (typeof (item[key] || '') === "string") {
        total += Number((item[key] || '').replace(',', ''));
      }
      else {
        total += item[key];
      }
    });
    return total === 0 ? '' : parseFloat(total.toFixed(6)).toLocaleString();
  };

  const renderNewTB = () => {
    const columns = [];
    for (var key in values[0]) {
      if (columns.length == 0) {
        columns.push({
          accessor: key,
          width: 200,
          className: "cell_frozen",
          headerClassName: "frozen",
          Header: <div width={60} >
            <span style={{ fontWeight: 'bold' }} className="pl-12">{getTypeName(key).toUpperCase()}</span>
          </div>,
          Cell: props => <div style={{
            display: 'flex',
            flex: 1,
            justifyContent: 'space-between'
          }} >
            <span className="pl-12">{props.value}</span>
            {props.index !== originalData.length && <IconButton onClick={() => {
              setRowIndex(props.index)
              handleEdit(true);
            }} className="w-16 h-16 p-0">
              <Icon className="text-16 arrow-icon" color="disabled">
                {disableInuput ? 'visibility' : 'edit_mode'}
              </Icon>
            </IconButton>}
          </div>,
          getProps: (_, rowInfo, column) => {
            let originalValue = ''
            let editValue = ''
            let index = rowInfo ? rowInfo.index : ''
            const check = (index !== originalData.length)
            if (check) {
              originalValue = originalData[rowInfo.index][column.id]
              editValue = rowInfo.original[column.id]
            }
            return {
              style: {
                backgroundColor: originalValue !== editValue && '#FEF4E6',
                color: !check && '#BD0F72',
                fontWeight: !check && 600,
              }
            }
          }
        });
      }
      else {
        columns.push({
          Header: <div width={60} >
            <span style={{ fontWeight: 'bold' }} className="pl-12">{getTypeName(key).toUpperCase()}</span>
          </div>,
          accessor: key,
          width: 200,
          headerClassName: "header_layout",
          show: !showColumn.includes(getTypeName(key)),
          Cell: (props) => {
            if (Object.keys(mapUnit).includes(getTypeName(props.column.id))) {
              const id = getType(mapUnit[getTypeName(props.column.id)])
              const unit = props.index === originalData.length ? values[0][id] : props.row[id]
              return (props.value ? (props.value + ' ' + (unit || '')) : '')
            }
            return props.value || ''
          },
          getProps: (_, rowInfo, column) => {
            let originalValue = ''
            let editValue = ''
            let index = rowInfo ? rowInfo.index : ''
            const check = (index !== originalData.length)
            if (check) {
              originalValue = originalData[rowInfo.index][column.id]
              editValue = rowInfo.original[column.id]
            }
            return {
              style: {
                backgroundColor: originalValue !== editValue && '#FEF4E6',
                color: !check && '#BD0F72',
                fontWeight: !check && 600,
              }
            }
          }
        });
      }
    }
    columns.push(columns.shift());

    return <ReactTable
      style={{ backgroundColor: 'white' }}
      data={[...values, container === CONTAINER_DETAIL ? {
        [getType(CONTAINER_PACKAGE)]: getTotals(values, getType(CONTAINER_PACKAGE)),
        [getType(CONTAINER_MEASUREMENT)]: getTotals(values, getType(CONTAINER_MEASUREMENT)),
        [getType(CONTAINER_WEIGHT)]: getTotals(values, getType(CONTAINER_WEIGHT)),
        [getType(CONTAINER_NUMBER)]: 'TOTAL'
      } : {
        [getType(CM_PACKAGE)]: getTotals(values, getType(CM_PACKAGE)),
        [getType(CM_WEIGHT)]: getTotals(values, getType(CM_WEIGHT)),
        [getType(CM_MEASUREMENT)]: getTotals(values, getType(CM_MEASUREMENT)),
        [getType(CONTAINER_NUMBER)]: 'TOTAL'
      }
      ]}
      columns={columns}
      showPagination={false}
      defaultPageSize={values.length + 1}
    />
  }

  return (
    <>
      <AmendmentPopup
        open={openEdit}
        onClose={() => handleEdit(false)}
        inqType={container}
        containerDetail={getValueField(CONTAINER_DETAIL)}
        data={valueEdit[rowIndex]}
        isEdit={!disableInuput}
        updateData={(value) => setValues(value)}
        updateEdit={(value) => setValueEdit(value)}
        index={rowIndex}
      />
      {
        renderNewTB()
      }
    </>
  );
};

export default ContainerDetailForm;