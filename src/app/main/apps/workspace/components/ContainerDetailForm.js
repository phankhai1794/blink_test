import { getLabelById } from '@shared';
import {
  CONTAINER_DETAIL,
  CONTAINER_NUMBER,
  CONTAINER_SEAL,
  CM_PACKAGE
} from '@shared/keyword';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Icon, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import ReactTable from "react-table";
import "react-table/react-table.css";
import $ from "jquery";

import AmendmentPopup from './AmendmentPopup';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiButtonBase-root': {
      backgroundColor: 'silver !important'
    }
  },
  icon: {
    border: '1px solid #BAC3CB',
    borderRadius: 4,
    position: 'relative',
    width: 16,
    height: 16,
    backgroundColor: '#f5f8fa',
    '&.borderChecked': {
      border: '1px solid #BD0F72'
    },
    '&.disabledCheck': {
      backgroundColor: '#DDE3EE'
    }
  },
  labelStatus: {
    backgroundColor: '#EBF7F2',
    color: '#36B37E',
    padding: '2px 9px',
    fontWeight: 600,
    fontSize: 14,
    borderRadius: 4
  },
  hideText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 5,
    '-webkit-box-orient': 'vertical'
  },
  viewMoreBtn: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: 'fit-content',
    position: 'sticky',
    left: '100%',
    color: '#BD0F72',
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: '16px',
    cursor: 'pointer'
  },
  button: {
    margin: theme.spacing(1),
    marginLeft: 0,
    borderRadius: 8,
    boxShadow: 'none',
    textTransform: 'capitalize',
    fontFamily: 'Montserrat',
    fontWeight: 600,
    '&.reply': {
      backgroundColor: 'white',
      color: '#BD0F72',
      border: '1px solid #BD0F72'
    },
    '&.w120': {
      width: 120
    }
  },
  boxItem: {
    borderLeft: '2px solid',
    borderColor: '#DC2626',
    paddingLeft: '2rem'
  },
  boxResolve: {
    borderColor: '#36B37E'
  },
  text: {
    height: 40,
    width: 158,
    border: '1px solid #BAC3CB',
    textAlign: 'center',
    color: '#132535'
  },
}));

const ContainerDetailForm = ({ container, fieldType, setTextResolve, disableInuput = false }) => {
  const classes = useStyles();
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const content = useSelector(({ workspace }) => workspace.inquiryReducer.content);

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

  const [tableScrollTop, setTableScrollTop] = useState(0);
  const [values, setValues] = useState(getValueField(container) || [{}]);
  const [openEdit, setOpenEdit] = useState(false)
  const [dataRow, setDataRow] = useState({})
  const inqType = getLabelById(metadata['inq_type_options'], fieldType);
  const cdType =
    inqType !== CONTAINER_NUMBER ? [CONTAINER_NUMBER, inqType] : [CONTAINER_NUMBER, CONTAINER_SEAL];
  const cmType = inqType !== CONTAINER_NUMBER ? [CONTAINER_NUMBER, inqType] : [CONTAINER_NUMBER, CM_PACKAGE];
  const typeList = container === CONTAINER_DETAIL ? cdType : cmType;
  const onChange = (e, index, type) => {
    const temp = JSON.parse(JSON.stringify(values));
    temp[index][type] = e.target.value;
    setValues(temp);
    setTextResolve(temp);
  };

  useEffect(() => {
    setValues(getValueField(container) || [{}]);
  }, [content]);
  /**
   * @description
   * Takes an Array<V>, and a grouping function,
   * and returns a Map of the array grouped by the grouping function.
   *
   * @param list An array of type V.
   * @param keyGetter A Function that takes the the Array type V as an input, and returns a value of type K.
   *                  K is generally intended to be a property key of V.
   *
   * @returns Map of the array grouped by the grouping function.
   */
  // export function groupBy<K, V>(list: Array<V>, keyGetter: (input: V) => K): Map<K, Array<V>> {
  //    const map = new Map<K, Array<V>>();
  function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach(item => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  function makeData(len = 5553) {
    return values;
  }

  const handleEdit = (state) => {
    setOpenEdit(state)
  }

  const renderNewTB = () => {
    const columns = [];
    for (var key in values[0]) {
      if (columns.length == 0) {
        columns.push({
          //   Header: getTypeName(key),
          accessor: key,
          width: 200,
          className: "cell_frozen",
          headerClassName: "frozen",
          Header: <div width={60} textColor="#fff" text="Image" >
            <span style={{ fontWeight: 'bold' }} className="pl-12">{getTypeName(key)}</span>
          </div>,
          Cell: props => <div style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            flex: 1,
            justifyContent: 'space-between'
          }} textColor="#fff" text="Image" >
            <span className="pl-12">{props.value}</span>
            <IconButton onClick={() => {
              handleEdit(true);
              setDataRow(props.row)
            }} className="w-16 h-16 p-0">
              <Icon className="text-16 arrow-icon" color="inherit">
                {'expand_more'}
              </Icon>
            </IconButton>
          </div>
        });
      } else {
        columns.push({
          Header: <div width={60} textColor="#fff" text="Image" >
            <span style={{ fontWeight: 'bold' }} className="pl-12">{getTypeName(key)}</span>
          </div>,
          accessor: key,
          width: 200,
          headerClassName: "header_layout"
        });
      }
    }
    columns.push(columns.shift());

    return <ReactTable
      data={makeData()}
      defaultPageSize={values.length}
      columns={columns}
      showPagination={false}
      // className="-striped -highlight"
      getTableProps={() => {
        return {
          onScroll: e => {
            if (tableScrollTop === e.target.scrollTop) {
              let left = e.target.scrollLeft > 0 ? e.target.scrollLeft : 0;
              $(".ReactTable .rt-tr .frozen").css({ left: left });
              $(".ReactTable .rt-tr .cell_frozen").css({ left: left });
            } else {
              setTableScrollTop(e.target.scrollTop);
            }
          }
        };
      }}
    />
  }

  const renderTB = () => {
    let td = [];
    const valueCopy = JSON.parse(JSON.stringify(values));
    let index = 0;
    valueCopy.map((item) => {
      item.index = index;
      index += 1;
    })
    const groups = groupBy(valueCopy, value => value[getType(CONTAINER_NUMBER)]);
    const groupsValues = [...groups].map(([name, value]) => ({ name, value }));
    while (groupsValues.length) {
      let rowValues = groupsValues.splice(0, 4);
      let rowIndex = 0;
      let isRunning = true;

      while (isRunning) {
        let type;
        if (rowIndex == 0) {
          type = typeList[rowIndex];
        }
        else {
          type = typeList[typeList.length - 1];
        }
        let hasData = false;
        td.push(<div key={rowIndex} style={{ display: 'flex', marginTop: type === typeList[0] ? 10 : 5 }}>
          <input
            className={clsx(classes.text)}
            style={{
              backgroundColor: '#FDF2F2',
              fontWeight: 600,
              borderTopLeftRadius: rowIndex === 0 && 8,
              fontSize: 14,
              // borderBottomLeftRadius: rowIndex === typeList.length - 1 && 8
            }}
            disabled
            defaultValue={type}
          />
          {
            rowValues.map((item, index1) => {
              if (item.value.length > rowIndex) {
                hasData = true;
              }
              let nodeValue = null;
              if (rowIndex - 1 < item.value.length) {
                nodeValue = item.value[rowIndex > 0 ? rowIndex - 1 : 0];
              }
              const disabled = !(rowIndex > 0 && nodeValue && !disableInuput);
              return (
                <input
                  className={clsx(classes.text)}
                  key={index1}
                  style={{
                    marginLeft: 5,
                    backgroundColor: disabled && '#FDF2F2',
                    fontSize: 15,
                    borderTopRightRadius: rowIndex === 0 && rowValues.length - 1 === index1 ? 8 : null,
                    // borderBottomRightRadius:
                    //     index1 === rowValues.length - 1 && rowIndex === typeList.length - 1 ? 8 : null
                  }}
                  disabled={disabled}
                  value={nodeValue ? nodeValue[getType(type)] : ''}
                  onChange={(e) => onChange(e, nodeValue.index, getType(type))}
                />
              );
            })
          }
        </div>);
        if (!hasData) {
          isRunning = false;
        }
        rowIndex += 1;
      }
    }
    return td;
  };

  return (
    <>
      <AmendmentPopup open={openEdit} onClose={() => handleEdit(false)} inqType={container} data={dataRow} />
      {renderNewTB()}
    </>
  );
};

export default ContainerDetailForm;