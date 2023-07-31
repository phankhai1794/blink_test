import { FuseChipSelect } from '@fuse';
import React, { useEffect, useRef, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { combineCDCM, getLabelById, toFindDuplicates, generateFileName } from '@shared';
import { handleError } from '@shared/handleError';
import {
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Icon,
  InputLabel,
  ListItemText,
  MenuItem,
  Popover,
  Radio,
  RadioGroup,
  Select
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import { ORIGINAL_BL, SEAWAY_BILL, CONTAINER_DETAIL, CONTAINER_MANIFEST, BL_TYPE, OTHERS } from '@shared/keyword';
import { uploadFile } from 'app/services/fileService';
import { getUpdatedAtAnswer, saveInquiry, updateInquiry } from 'app/services/inquiryService';
import * as AppActions from 'app/store/actions';
import clsx from 'clsx';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import ContentEditable from 'react-contenteditable';
import cloneDeep from 'lodash/cloneDeep';
import { SocketContext } from 'app/AppContext';

import * as Actions from '../store/actions';
import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from '../store/actions/form';
import { MSG_INQUIRY_CONTENT } from '../store/reducers/inquiry';

import ChoiceAnswerEditor from './ChoiceAnswerEditor';
import ParagraphAnswerEditor from './ParagraphAnswerEditor';
import AttachmentAnswer from './AttachmentAnswer';
import FileAttach from './FileAttach';
import AttachFile from './AttachFile';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '15px',
    position: 'absolute',
    left: '215px',
    top: '-5px',
    height: '25px',
    width: '25px',
    backgroundColor: 'silver'
  },
  formControl: {
    '& .MuiFormGroup-root': {
      flexDirection: 'row'
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
  checkedIcon: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '& .MuiFormGroup-root': {
      flexDirection: 'row'
    }
  },
  button: {
    margin: theme.spacing(1),
    marginRight: 3,
    borderRadius: 8,
    width: 120,
    boxShadow: 'none',
    textTransform: 'capitalize',
    fontFamily: 'Montserrat',
    fontWeight: 600,
    '&.reply': {
      backgroundColor: 'white',
      color: '#BD0F72',
      border: '1px solid #BD0F72'
    }
  },
  positionBtnImg: {
    left: '0',
    top: '-3rem'
  },
  positionBtnNotImg: {
    left: '0',
    top: '4rem'
  },
  form: {
    '& .fuse-chip-select--is-disabled': {
      '& fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.38)'
      },
      '& .MuiInputBase-input p': {
        color: 'rgba(0, 0, 0, 0.38)'
      },
      '& .MuiSvgIcon-root': {
        color: 'rgba(0, 0, 0, 0.38)'
      }
    }
  },
  menuList: {
    width: 400,
    maxHeight: 350
  },
  formRadio: {
    display: 'block',
    margin: '10px 10px 5px'
  },
  radioLabel: {
    display: 'block',
    marginLeft: 35,
    fontFamily: 'Montserrat',
    whiteSpace: 'pre-line',
    fontSize: 12
  },
  radioRoot: {
    padding: 0
  },
  contentCDCM: {
    '& .popover-temp': {
      position: 'absolute !important',
      width: '100%',
      height: '100%',
    },
    '& .form-control-cdcm': {
      overflow: 'visible !important'
    }
  },
  menuListCDCM: {
    width: 400,
    maxHeight: 350,
    left: '47rem !important',
    top: '4rem !important'
  },
  formInqType: {
    '& .MuiFormControl-root': {
      width: 295,
    },
    '& .MuiInputBase-root': {
      border: '1px solid #BD0F72',
      borderRadius: 9
    },
    '& label + .MuiInput-formControl': {
      marginTop: 0
    },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
      borderBottom: '0',
    },
    '& .MuiInputLabel-shrink': {
      transform: 'translate(0, 24px) scale(1)'
    },
    '& .MuiSelect-selectMenu': {
      height: '76%'
    },
    '& #demo-mutiple-checkbox-label': {
      left: 11,
      color: '#BD0F72',
      overflow: 'hidden',
      fontSize: 16,
      top: -7,
    },
    '& .MuiSelect-root': {
      height: 46
    },
    '& .MuiInput-underline:after': {
      borderBottom: '0',
    },
    '& .MuiInput-underline:before': {
      borderBottom: '0',
    }
  },
  disableSelect: {
    '& .MuiInputBase-root': {
      borderColor: 'rgba(0, 0, 0, 0.38)',
    },
  }
}));

const ITEM_HEIGHT = 100;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 2.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

// Main Component
const InquiryEditor = (props) => {
  // custom attribute must be lowercase
  const dispatch = useDispatch();
  const classes = useStyles();
  const { onCancel } = props;
  const scrollTopPopup = useRef(null);
  const socket = useContext(SocketContext);

  const [metadata, valid, inquiries, currentEditInq, myBL, listMinimize, enableSubmit] = useSelector(
    ({ workspace }) => [
      workspace.inquiryReducer.metadata,
      workspace.inquiryReducer.validation,
      workspace.inquiryReducer.inquiries,
      workspace.inquiryReducer.currentEditInq,
      workspace.inquiryReducer.myBL,
      workspace.inquiryReducer.listMinimize,
      workspace.inquiryReducer.enableSubmit,
    ]
  );
  const currentTabs = useSelector(({ workspace }) => workspace.formReducer.tabs);
  const openAllInquiry = useSelector(({ workspace }) => workspace.formReducer.openAllInquiry);
  const [allPasteFiles, setAllPasteFile] = useState([]);

  const user = useSelector(({ user }) => user);
  const getField = (field) => {
    return metadata.field?.[field] || '';
  };
  const containerCheck = [getField(CONTAINER_DETAIL), getField(CONTAINER_MANIFEST)];

  const optionsAnsType = getField(BL_TYPE) === currentEditInq.field ?
    [{
      label: 'Option Selection',
      value: metadata.ans_type.choice
    }] :
    !containerCheck.includes(currentEditInq.field) ? [
      {
        label: 'Option Selection',
        value: metadata.ans_type.choice
      },
      {
        label: 'Onshore/Customer Input',
        value: metadata.ans_type.paragraph
      }
    ] : [{
      label: 'Onshore/Customer Input',
      value: metadata.ans_type.paragraph
    }];

  const allowCreateAttachmentAnswer = PermissionProvider({
    action: PERMISSION.INQUIRY_ANSWER_ATTACHMENT
  });
  const fullscreen = useSelector(({ workspace }) => workspace.formReducer.fullscreen);
  const fieldDefault = metadata.field_options.filter(field => field.display && field.keyword !== 'containerManifest')
  const [fieldType, setFieldType] = useState(fieldDefault);

  const getValType = () => {
    const types = currentEditInq.inqGroup && currentEditInq.inqGroup.length && currentEditInq.inqGroup.map(inq => inq.inqType);
    if (containerCheck.includes(currentEditInq.field)) {
      if (types) {
        types.push(currentEditInq.inqType);
        return metadata.inq_type_options.filter((v) => types.includes(v.value))
      }
      return metadata.inq_type_options.filter((v) => currentEditInq.inqType === v.value);
    } else {
      return metadata.inq_type_options.filter((v) => currentEditInq.inqType === v.value)[0] || [];
    }
  }

  const [valueType, setValueType] = useState(getValType());
  const [contentsInqCDCM, setContentsInqCDCM] = useState([]);
  const [valueAnsType, setValueAnsType] = useState(
    optionsAnsType.filter((ansType) => ansType.value === currentEditInq.ansType)
  );
  const metadataFieldOptions = combineCDCM(metadata.field_options);
  const [fieldValue, setFieldValue] = useState(
    metadataFieldOptions.filter((v) => currentEditInq.field === v.value)[0]
  );
  const [inqTypeOption, setInqTypeOption] = useState(metadata.inq_type_options);
  const [filepaste, setFilepaste] = useState('');
  const [dropfiles, setDropfiles] = useState([]);
  const [fieldEdited, setFieldEdited] = useState();
  const [nameTypeEdited, setNameTypeEdited] = useState();
  const [contentEdited, setContentEdited] = useState(valueType?.label);
  const [isDisabled, setDisabled] = useState(false);
  const [prevField, setPrevField] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [templateList, setTemplateList] = useState([]);
  const [template, setTemplate] = useState(valueType?.value || '0');
  const [content, setContent] = useState(currentEditInq.content || '');
  const [openCD, setOpenCD] = useState(false);
  const [openCM, setOpenCM] = useState(false);
  const [keepTrack, setTrack] = useState({ blCreateChoice: false })
  const userType = useSelector(({ user }) => user.role?.toUpperCase());

  const syncData = (data, syncOptSite = "") => {
    socket.emit("sync_data", { data, syncOptSite });
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // auto create 2 choice for BL Type
  const autoCreateChoiceBLType = () => {
    const inquiriesOp = [...inquiries];
    const isEdit = inquiriesOp.find((q) => q.id === currentEditInq.id)
    if (!isEdit && !keepTrack.blCreateChoice) {
      const inq = { ...currentEditInq };
      const timeB = new Date();
      const timeW = new Date(timeB.getTime() + 1);
      inq.answerObj.push({ id: null, content: ORIGINAL_BL, createdAt: timeB }, { id: null, content: SEAWAY_BILL, createdAt: timeW });
      dispatch(InquiryActions.setEditInq(inq));
      setTrack({ ...keepTrack, blCreateChoice: true })
    }
  }

  const handleShowTemplateCDCM = (type) => {
    const objCdCm = [...contentsInqCDCM];
    if (objCdCm && objCdCm.length) {
      objCdCm.forEach(o => {
        if (o.type === type) o.showTemplate = true;
      })
    }
    setContentsInqCDCM(objCdCm)
  }

  const handleCloseTemplateCDCM = () => {
    const objCdCm = [...contentsInqCDCM];
    if (objCdCm && objCdCm.length) {
      objCdCm.forEach(o => {
        o.showTemplate = false;
      })
    }
    setContentsInqCDCM(objCdCm)
  }

  const formatTemplate = (content) => {
    let parts = content.split(/(\[.*\])|(\(insert[^)]*\))|(\([lL]ist[^)]*\))/).filter(e => e);
    parts = parts.map((p, i) => {
      const test = /\[.*\]|^\(.*\)$/.test(p);
      return test ? `<span style='color: #BD1874; text-decoration: underline'>${p}</span>` : p;
    })
    return parts.join("");
  }

  const handleChange = (event) => {
    const index = event.target.value;
    setTemplate(index);
    const inq = { ...currentEditInq };
    inq.content = templateList[index];
    setContent(formatTemplate(templateList[index]));
    dispatch(InquiryActions.setEditInq(inq));
  };

  const handleChangeCDCM = (e, type) => {
    const index = e.target.value;
    const objCdCm = [...contentsInqCDCM];
    if (objCdCm && objCdCm.length) {
      objCdCm.forEach(o => {
        if (o.type === type && o.content.length > 1) {
          o.contentShow = o.content[index];
          o.templateIndex = index;
        }
      })
    }
    setContentsInqCDCM(objCdCm)
  }

  const handleNameChangeCDCM = (e, valEdited) => {
    const inqCDCM = [...contentsInqCDCM];
    if (inqCDCM && inqCDCM.length) {
      inqCDCM.forEach(inq => {
        if (inq.type === valEdited.type) {
          inq.contentShow = e.currentTarget.textContent;
        }
      })
    }
    setContentsInqCDCM(inqCDCM)
  }

  const handleReceiverChangeCDCM = (e, type) => {
    const inqCDCM = [...contentsInqCDCM];
    if (inqCDCM && inqCDCM.length) {
      inqCDCM.forEach(inq => {
        if (inq.type === type) {
          inq.receiver = e.target.value;
        }
      })
    }
    setContentsInqCDCM(inqCDCM)
  }

  const styles = (width) => {
    return {
      control: {
        width: `${width}px`,
        borderRadius: 11
      }
    };
  };

  const initContentType = (contentArr) => {
    const currInq = { ...currentEditInq };
    const currentTab = (openAllInquiry && currentTabs === 1) ? 'onshore' : 'customer';
    if (containerCheck.includes(currInq.field)) {
      const valResult = [...valueType]
      if (valResult.length && !currInq.id) {
        valResult.forEach(v => {
          const filter = metadata.template.find(({ field, type }) => {
            return type === v.value && ['containerDetail', 'containerManifest'].includes(field) && v.value !== 'select-all';
          });
          if (filter) {
            filter.showTemplate = false;
            filter.templateIndex = '0';
            filter.contentShow = filter.content[0];
            filter.receiver = `${currentTab}-${v.value}`;
            contentArr.push(filter);
          }
        });
      } else if (currInq.id) {
        const filter = metadata.template.find(({ field, type }) => {
          return type === currInq.inqType && ['containerDetail', 'containerManifest'].includes(field);
        });
        contentArr.push({
          id: currInq.id,
          showTemplate: false,
          content: filter ? filter.content : '',
          contentShow: currInq ? currInq.content : '',
          receiver: `${currInq.receiver}-${currInq.inqType}`,
          type: currInq.inqType,
        });
        if (currInq.inqGroup.length) {
          currInq.inqGroup.forEach(cur => {
            const filter = metadata.template.find(({ field, type }) => {
              return type === cur.inqType && ['containerDetail', 'containerManifest'].includes(field);
            });
            contentArr.push({
              id: cur.id,
              showTemplate: false,
              content: filter ? filter.content : '',
              contentShow: cur ? cur.content : '',
              receiver: `${cur.receiver}-${cur.inqType}`,
              type: cur.inqType
            })
          })
        }
      }
      setContentsInqCDCM(contentArr);
    }
  }

  useEffect(() => {
    dispatch(FormActions.setDirtyReload({ createInq: true }))
    if (valueType?.value) {
      const filter = metadata.template.find(({ field, type }) => type === valueType.value && fieldValue.keyword === field);
      setTemplateList(filter?.content || []);
      let filterField = metadata.inq_type_options.find(({ value }) => value === valueType.value).field;
      filterField = metadata.field_options
        .filter(({ value, display, keyword }) => (
          display
          && filterField.includes(value)
          && metadata.template.some((temp) => (
            temp.field === keyword
            && temp.type === valueType.value
            && temp.content[0]
          ))
        ));
      setFieldType(filterField);
    }
    setPrevField(currentEditInq.field);

    const contentArr = [];
    initContentType(contentArr);

    const inq = { ...currentEditInq };
    if (containerCheck.includes(inq.field) && optionsAnsType) {
      inq.ansType = metadata.ans_type.paragraph
      setValueAnsType(optionsAnsType);
      dispatch(InquiryActions.setEditInq(inq));
    }

    if (openAllInquiry && inquiries.length > 0) {
      if (inquiries.every((i) => i.receiver.includes('onshore'))) {
        inq.receiver = ['onshore'];
      } else if (inquiries.every((i) => i.receiver.includes('customer'))) {
        inq.receiver = ['customer'];
      } else {
        inq.receiver = [currentTabs === 0 ? 'customer' : 'onshore'];
      }
    } else inq.receiver = ['customer']

    if (!containerCheck.includes(inq.field)) dispatch(InquiryActions.setEditInq(inq));

    return () => dispatch(FormActions.setDirtyReload({ inputInquiryEditor: false, createInq: false }))
  }, []);

  useEffect(() => {
    if (fieldValue) {
      // filter inq type according to field and check if template in inq type has content
      const filter = metadata.inq_type_options.filter((data) => {
        let getDataField = data.field?.includes(fieldValue.value);
        let getTemplate = metadata.template.some((temp) => (
          temp.field === fieldValue.keyword
          && temp.type === data.value
          && (temp.content[0]) || data.label === OTHERS)
        );
        if ([containerCheck[0], containerCheck[1]].includes(fieldValue?.value)) {
          getDataField = (data.field?.includes(containerCheck[0]) || data.field?.includes(containerCheck[1]));
          getTemplate = metadata.template.some((temp) => (
            ['containerDetail', 'containerManifest'].includes(temp.field)
            && temp.type === data.value
            && (temp.content[0]) || data.label === OTHERS)
          );
        }
        return getDataField && getTemplate
      }).sort((a, b) => a.label.localeCompare(b.label));
      const inq = { ...currentEditInq };
      
      if (!filter.some(f => f.value === inq.inqType)) {
        inq.inqType = '';
        dispatch(InquiryActions.setEditInq(inq));
        setValueType([]);
      }
      setFieldType(fieldDefault);
      setInqTypeOption(filter);
      if (fieldValue.value === containerCheck[0]) {
        setOpenCM(false);
        setOpenCD(true);
      } else if (fieldValue.value === containerCheck[1]) {
        setOpenCD(false);
        setOpenCM(true);
      }
    }
    if (scrollTopPopup.current) {
      scrollTopPopup.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [fieldValue]);

  const isAllSelected = (
    containerCheck.includes(currentEditInq.field)
    && Array.isArray(inqTypeOption)
    && Array.isArray(valueType)
    && inqTypeOption.length
    && inqTypeOption.length === valueType.length
  );

  const containerFieldValueCheck = (inq) => {
    if (containerCheck.includes(inq.field) && inq.inqType) {
      const inqCdCm = [...contentsInqCDCM];
      const contentArr = [];
      const findByIdType = inqCdCm.find(cdcm => inq.inqType === cdcm.type);
      const currentTab = (openAllInquiry && currentTabs === 1) ? 'onshore' : 'customer';
      if (!findByIdType) {
        const filter = metadata.template.find(({ field, type }) => {
          return type === inq.inqType && ['containerDetail', 'containerManifest'].includes(field);
        });
        if (filter) {
          filter.showTemplate = false;
          filter.templateIndex = '0';
          filter.contentShow = filter.content[0];
          filter.receiver = `${currentTab}-${inq.inqType}`;
          contentArr.push(filter);
        }
        else if (valueType[0]?.label === OTHERS) {
          contentArr.push({
            showTemplate: false,
            templateIndex: '0',
            content: [currentEditInq.content],
            contentShow: currentEditInq.content,
            receiver: `${currentTab}-${inq.inqType}`,
            type: inq.inqType,
          });
        }
      } else if (findByIdType) {
        contentArr.push(findByIdType);
      }

      inq.ansType = metadata.ans_type.paragraph;
      setContentsInqCDCM(contentArr);
      setValueAnsType({
        label: 'Onshore/Customer Input',
        value: metadata.ans_type.paragraph
      });
    }
  }

  const handleTypeChange = (e) => {
    const inq = { ...currentEditInq };
    if (containerCheck.includes(inq.field)) {
      let valResult = e.target.value;
      const inqCdCm = [...contentsInqCDCM];
      // list content display
      if (valResult.length) {
        if (valResult[valResult.length - 1].value === 'select-all') {
          valResult = valResult.filter(inq => inq.value !== 'select-all');
          if (inqTypeOption.length === valueType.length) {
            valResult = [];
          } else {
            valResult = inqTypeOption
          }
          setValueType(inqTypeOption.length === valueType.length ? [] : inqTypeOption);
        } else {
          setValueType(valResult)
        }
      } else {
        setValueType(valResult)
      }
      const contentArr = [];
      const currentTab = (openAllInquiry && currentTabs === 1) ? 'onshore' : 'customer';
      valResult.forEach(v => {
        const findByIdType = inqCdCm.find(inq => v.value === inq.type);
        if (!findByIdType) {
          const filter = metadata.template.find(({ field, type }) => {
            return type === v.value && ['containerDetail', 'containerManifest'].includes(field);
          });
          if (filter) {
            filter.showTemplate = false;
            filter.templateIndex = '0';
            filter.contentShow = filter.content[0];
            filter.receiver = `${currentTab}-${v.value}`;
            contentArr.push(filter);
          } else if (v.label === OTHERS) {
            contentArr.push({
              showTemplate: false,
              templateIndex: '0',
              content: [currentEditInq.content],
              contentShow: currentEditInq.content,
              receiver: `${currentTab}-${v.value}`,
              type: v.value,
            });
          }
        } else if (findByIdType) {
          contentArr.push(findByIdType);
        }
      });
      setContentsInqCDCM(contentArr);
      setValueAnsType({
        label: 'Onshore/Customer Input',
        value: metadata.ans_type.paragraph
      });
      inq.inqType = valResult.length ? valResult : '';
      inq.ansType = metadata.ans_type.paragraph;
    }
    else {
      inq.inqType = e.value;
      let keyword = fieldValue;
      let filterField = metadata.inq_type_options.find(({ value }) => value === e.value).field;
      filterField = e.label === OTHERS ? fieldDefault : metadata.field_options.filter(({ value, display, keyword }) => (
        display && filterField.includes(value)
        && metadata.template.some((temp) => (temp.field === keyword && temp.type === e.value && temp.content[0]))
      ));

      if (filterField.length === 1) {
        setFieldValue(filterField[0]);
        inq.field = filterField[0].value;
        dispatch(InquiryActions.validate({ ...valid, field: true }));
        containerFieldValueCheck(inq);
        if (!keyword) {
          keyword = filterField[0];
        }
      }
      if (keyword?.keyword === BL_TYPE) {
        autoCreateChoiceBLType()
        inq.ansType = metadata.ans_type.choice
        setValueAnsType({
          label: 'Option Selection',
          value: metadata.ans_type.choice
        });
      }

      dispatch(InquiryActions.validate({ ...valid, inqType: true }));

      const filterTemp = metadata.template.find(({ field, type }) => {
        let getTemplate = type === e.value && keyword?.keyword === field;
        if ([containerCheck[0], containerCheck[1]].includes(keyword?.field)) {
          getTemplate = (type === e.value && ['containerDetail', 'containerManifest'].includes(field))
        }
        return getTemplate;
      });
      if (inq.field === fieldEdited && inq.inqType === nameTypeEdited) {
        inq.content = contentEdited;
      } else {
        inq.content = filterTemp?.content[0] || MSG_INQUIRY_CONTENT;
        setContent(formatTemplate(filterTemp?.content[0] || MSG_INQUIRY_CONTENT));
      }

      if (!keyword) setFieldType(filterField);
      // case filter CD CM to BL Data Field
      const keyWord = filterField.map(f => f.keyword);
      if (keyWord.includes('containerManifest') || keyWord.includes('containerDetail')) {
        setValueType([e]);
      } else {
        setValueType(e);
      }

      setTemplateList(filterTemp?.content || []);
      setTemplate('0');
      dispatch(FormActions.setEnableSaveInquiriesList(false));
    }
    dispatch(InquiryActions.setEditInq(inq));
  };

  const handleFieldChange = (e) => {
    const inq = { ...currentEditInq };
    inq.field = e.value;
    const filter = metadata.template.find(({ field, type }) => type === valueType?.value && e.keyword === field);

    if (inq.field === fieldEdited && inq.inqType === nameTypeEdited) {
      inq.content = contentEdited;
    } else {
      inq.content = filter?.content[0] || MSG_INQUIRY_CONTENT;
      setContent(formatTemplate(filter?.content[0] || MSG_INQUIRY_CONTENT));
    }

    if (containerCheck.includes(e.value) && !Array.isArray(valueType)) {
      setValueType([valueType]);
    } else if (!containerCheck.includes(e.value) && Array.isArray(valueType)) {
      setValueType(valueType[0]);
    }
    containerFieldValueCheck(inq)

    if (e.keyword === BL_TYPE && valueAnsType[0]?.label === 'Option Selection') autoCreateChoiceBLType();

    setTemplateList(filter?.content || []);
    setTemplate('0');
    dispatch(InquiryActions.validate({ ...valid, field: true }));
    setFieldValue(e);
    dispatch(InquiryActions.setEditInq(inq));
    dispatch(FormActions.setEnableSaveInquiriesList(false));
  };

  const checkInqChanged = (currInq, valInput, isTypeChoice) => {
    const checkContent = currInq.content.trim().localeCompare(valInput.content.trim());
    const checkField = (currInq.inqType === valInput.inqType && currInq.field === valInput.field);
    const checkAnsType = currInq.ansType === valInput.ansType;
    const checkReceiver = currInq.receiver[0] === valInput.receiver[0];

    let isSameFile = false;
    const listId1 = currInq.mediaFile.map(item => item.id);
    const listId2 = valInput.mediaFile.map(item => item.id);

    if (listId1.length === listId2.length) {
      isSameFile = Boolean(listId1.length === 0 || listId1.every(id => listId2.includes(id)));
    }

    if (isTypeChoice) {
      if (currInq.answerObj.length && valInput.answerObj.length) {
        const arrContentInq = currInq.answerObj.map(ans => ans.content.trim());
        const arrContentInput = valInput.answerObj.map(ans => ans.content.trim());
        if (arrContentInq.length !== arrContentInput.length) return false;
        else if (arrContentInq.length === arrContentInput.length) {
          let countDuplicate = 0;
          arrContentInq.forEach(content => {
            if (arrContentInput.includes(content)) {
              countDuplicate = countDuplicate + 1;
            }
          });
          if (countDuplicate !== arrContentInq.length) return false;
        }
      }
    }

    if (!checkField || checkContent !== 0 || !checkAnsType || !checkReceiver || !isSameFile) return false;

    return true;
  }

  const handleNameChange = (e) => {
    const inq = { ...currentEditInq };
    // setContent(filepaste ? inq.content : e.target.value);
    setContent(filepaste ? e.target.value.replace(/<img.*>\n?/, '') : e.target.value);

    inq.content = e.currentTarget.textContent;
    setFieldEdited(inq.field);
    setNameTypeEdited(inq.inqType);
    setContentEdited(inq.content);

    dispatch(InquiryActions.validate({ ...valid, content: inq.content }));
    dispatch(InquiryActions.setEditInq(inq));
    dispatch(FormActions.setEnableSaveInquiriesList(false));
    dispatch(FormActions.setDirtyReload({ inputInquiryEditor: true }))
  };

  const handleAnswerTypeChange = (e) => {
    const inq = { ...currentEditInq };
    inq.ansType = e.value;

    if (fieldValue?.keyword === BL_TYPE && e.label === 'Option Selection') autoCreateChoiceBLType();

    dispatch(InquiryActions.validate({ ...valid, ansType: true }));
    setValueAnsType(optionsAnsType.filter((ansType) => ansType.value === e.value));
    dispatch(InquiryActions.setEditInq(inq));
    dispatch(FormActions.setEnableSaveInquiriesList(false));
  };
  const inq = (inq) => {
    return {
      content: inq.content,
      field: inq.field,
      inqType: inq.inqType,
      ansType: inq.ansType,
      receiver: inq.receiver,
      groupId: inq.groupId || '',
      state: ['ANS_DRF'].includes(inq.state) ? 'INQ_SENT' : inq.state
    };
  };

  const handleReceiverChange = (e) => {
    const optionsOfQuestion = { ...currentEditInq };
    optionsOfQuestion.receiver = [];
    dispatch(InquiryActions.validate({ ...valid, receiver: true }));
    optionsOfQuestion.receiver.push(e.target.value);
    dispatch(InquiryActions.setEditInq(optionsOfQuestion));
  };

  const checkDuplicateInq = () => {
    const listInqOfField = [...inquiries.filter((inq) => {
      if (containerCheck.includes(inq.field)) {
        return containerCheck.includes(currentEditInq.field)
      }
      return inq.field === currentEditInq.field
    })];
    if (currentEditInq.id) {
      listInqOfField.splice(
        listInqOfField.findIndex((inq) => inq.id === currentEditInq.id),
        1
      );
    }
    if (listInqOfField.length) {
      let checkDuplicate = false;
      if (containerCheck.includes(currentEditInq.field)) {
        // checkDuplicate
        const listInqType = listInqOfField.map(l => {
          return {
            inqType: l.inqType,
            receiver: l.receiver[0]
          }
        });
        listInqOfField.forEach(l => {
          if (l.inqGroup && l.inqGroup.length) {
            l.inqGroup.forEach(inqG => {
              listInqType.push({
                inqType: inqG.inqType,
                receiver: inqG.receiver[0]
              })
            })
          }
        });
        if (contentsInqCDCM.length) {
          contentsInqCDCM.forEach(l => {
            const receiverCurr = l.receiver.split('-')[0];
            listInqType.forEach(linq => {
              if (linq.inqType === l.type && receiverCurr === linq.receiver) {
                checkDuplicate = true
              }
            })
          });
        }
      } else {
        checkDuplicate = Boolean(
          listInqOfField.filter(
            (inq) =>
              inq.inqType === currentEditInq.inqType && inq.receiver[0] === currentEditInq.receiver[0]
          ).length
        );
      }
      if (checkDuplicate) {
        dispatch(
          FormActions.openConfirmPopup({
            openConfirmPopup: true,
            confirmPopupMsg: 'The inquiry already existed!',
            confirmPopupType: 'warningInq'
          })
        );
        return true;
      }
    }
    return false;
  };

  const dispatchSetTab = (condition, contents, receiver) => {
    if (condition) {
      if (contents.every(item => (item.receiver.includes("onshore")))) dispatch(FormActions.setTabs(1));
      if (contents.every(item => (item.receiver.includes("customer")))) dispatch(FormActions.setTabs(0));
    } else {
      dispatch(FormActions.setTabs(receiver === 'customer' ? 0 : 1));
    }
  }

  const onSave = async (isCdCm) => {
    setDisabled(true);
    const inquiriesOp = [...inquiries];
    let check = true;
    const ansTypeChoice = metadata.ans_type['choice'];
    let validate = {};

    if (
      !currentEditInq.inqType ||
      !currentEditInq.field ||
      !currentEditInq.receiver.length ||
      !currentEditInq.ansType.length ||
      !currentEditInq.content ||
      ansTypeChoice === currentEditInq.ansType
    ) {
      validate = {
        ...valid,
        field: Boolean(currentEditInq.field),
        inqType: Boolean(currentEditInq.inqType),
        receiver: Boolean(currentEditInq.receiver.length),
        ansType: Boolean(currentEditInq.ansType.length),
        content: Boolean(currentEditInq.content)
      };
      if (ansTypeChoice === currentEditInq.ansType) {
        // check empty a field
        if (currentEditInq.answerObj.length > 0) {
          const checkOptionEmpty = currentEditInq.answerObj.filter((item) => !item.content.trim());
          if (checkOptionEmpty.length > 0) {
            validate = { ...validate, answerContent: false };
          } else {
            validate = { ...validate, answerContent: true };
          }
          const dupArray = currentEditInq.answerObj.map((ans) => ans.content.trim());
          if (toFindDuplicates(dupArray).length) {
            dispatch(
              AppActions.showMessage({
                message: 'Options value must not be duplicated',
                variant: 'error'
              })
            );
            setDisabled(false);
            return;
          }
        } else {
          validate = { ...validate, answerContent: false };
        }
      }
      dispatch(InquiryActions.validate(validate));
      check =
        validate.inqType &&
        validate.field &&
        validate.receiver &&
        validate.ansType &&
        validate.content &&
        validate.answerContent;
    }
    if (ansTypeChoice !== currentEditInq.ansType) {
      dispatch(
        InquiryActions.validate({
          field: Boolean(currentEditInq.field),
          inqType: Boolean(currentEditInq.inqType),
          receiver: Boolean(currentEditInq.receiver.length),
          ansType: Boolean(currentEditInq.ansType.length),
          content: Boolean(currentEditInq.content),
          answerContent: true
        })
      );
    }
    if (!check) {
      setDisabled(false);
      return;
    }
    let error = false;

    let inquiry = inquiriesOp.find((q) => q.id === currentEditInq.id);
    if (inquiry) {
      if (checkDuplicateInq()) {
        setDisabled(false);
        return;
      }

      if (ansTypeChoice === currentEditInq.ansType) {
        if (currentEditInq.answerObj.length === 1) {
          dispatch(
            AppActions.showMessage({ message: 'Please add more options!', variant: 'error' })
          );
          setDisabled(false);
          return;
        }
        // check empty a field
        if (currentEditInq.answerObj.length > 0) {
          const checkOptionEmpty = currentEditInq.answerObj.filter((item) => !item.content);
          if (checkOptionEmpty.length > 0) {
            dispatch(InquiryActions.validate({ ...valid, answerContent: false }));
            setDisabled(false);
            error = true;
            // break;
          }
        } else {
          dispatch(AppActions.showMessage({ message: 'Options not empty!', variant: 'error' }));
          setDisabled(false);
          error = true;
          // break;
        }
      }

      const editInquiry = cloneDeep(currentEditInq);

      if (ansTypeChoice === editInquiry.ansType) {
        editInquiry.answerObj.push({
          id: null,
          content: '',
          createdAt: new Date(),
        })
      }
      else {
        editInquiry.answerObj = []
      }
      if (checkInqChanged(inquiry, editInquiry, ansTypeChoice === editInquiry.ansType) && !containerCheck.includes(editInquiry.field)) {
        dispatch(
          FormActions.openConfirmPopup({
            openConfirmPopup: true,
            confirmPopupMsg: 'The inquiry has not changed !',
            confirmPopupType: 'warningInq'
          })
        );
        setDisabled(false);
        return;
      }
      const ansCreate = editInquiry.answerObj.filter(
        ({ id: id1 }) => !inquiry.answerObj.some(({ id: id2 }) => id2 === id1)
      );

      const ansDelete = inquiry.answerObj.filter(
        ({ id: id1 }) => !editInquiry.answerObj.some(({ id: id2 }) => id2 === id1)
      );
      //
      const ansUpdate = editInquiry.answerObj.filter(({ id: id1, content: c1 }) =>
        inquiry.answerObj.some(({ id: id2, content: c2 }) => id2 === id1 && c1 !== c2)
      );
      const ansCreated = editInquiry.answerObj.filter((ans) => ans.id);
      const mediaCreate = editInquiry.mediaFile.filter(
        ({ id: id1 }) => !inquiry.mediaFile.some(({ id: id2 }) => id2 === id1)
      );
      const mediaDelete = inquiry.mediaFile.filter(
        ({ id: id1 }) => !editInquiry.mediaFile.some(({ id: id2 }) => id2 === id1)
      );

      for (const f in mediaCreate) {
        const form_data = mediaCreate[f].data;
        const res = await uploadFile(form_data).catch((err) => handleError(dispatch, err));
        mediaCreate[f].id = res.response[0].id;
      }
      // Edit INQUIRY
      if (
        JSON.stringify(inq(editInquiry)) !== JSON.stringify(inq(inquiry)) ||
        JSON.stringify(editInquiry.answerObj) !== JSON.stringify(inquiry.answerObj) ||
        mediaCreate.length ||
        mediaDelete.length || isCdCm
      ) {
        const optionsMinimize = [...listMinimize];
        const index = optionsMinimize.findIndex((e) => e.id === inquiry.id);
        optionsMinimize[index].field = editInquiry.field;
        dispatch(InquiryActions.setListMinimize(optionsMinimize));
        const editedIndex = inquiriesOp.findIndex((inq) => inq.id === inquiry.id);
        inquiriesOp[editedIndex] = editInquiry;

        const currFieldEdit = containerCheck.includes(fieldValue.value);
        const update = await updateInquiry(inquiry.id, {
          inq: inq(editInquiry),
          inqCdCm: contentsInqCDCM,
          isEditCdCm: currFieldEdit,
          blId: myBL.id,
          ans: { ansDelete, ansCreate, ansUpdate, ansCreated },
          files: { mediaCreate, mediaDelete }
        }).catch(err => handleError(dispatch, err));

        if (!isCdCm) {
          if (editedIndex !== -1) {
            if (update.data.length) {
              inquiriesOp[editedIndex].answerObj = [
                ...editInquiry.answerObj,
                ...update.data
              ].filter((inq) => inq.id);
            }
            inquiriesOp[editedIndex].inqGroup = [];
            //
            const dataDate = await getUpdatedAtAnswer(inquiry.id).catch(err => handleError(dispatch, err));
            inquiriesOp[editedIndex].createdAt = dataDate.data;
          }
          //
          const dataDate = await getUpdatedAtAnswer(inquiry.id).catch(err => handleError(dispatch, err));
          inquiriesOp[editedIndex].createdAt = dataDate.data;
        } else if (isCdCm) {
          const optionsMinimize = [...listMinimize];
          const { data } = update;
          if (data.length) {
            data.forEach(d => {
              if (d.id === inquiriesOp[editedIndex].id) {
                inquiriesOp[editedIndex].content = d.content;
                inquiriesOp[editedIndex].inqType = d.inqType;
                inquiriesOp[editedIndex].receiver = d.receiver;
                inquiriesOp[editedIndex].groupId = d.groupId;
                inquiriesOp[editedIndex].inqGroup = d.inqGroup || [];
              } else {
                const object = {
                  ...d,
                  id: d.id,
                  ansType: d.ansType,
                  content: d.content,
                  createdAt: d.createdAt,
                  createdBy: d.createdBy,
                  field: d.field,
                  receiver: d.receiver,
                  groupId: d.groupId,
                  process: 'pending',
                  mediaFile: [],
                  mediaFilesAnswer: [],
                  answerObj: [],
                  inqGroup: d.inqGroup || [],
                  inqType: d.inqType,
                  state: d.state,
                  updatedAt: d.updatedAt,
                  updatedBy: d.updatedBy
                }
                inquiriesOp.push(object);
                optionsMinimize.push(object);
              }
            })
          }
          dispatch(InquiryActions.setListMinimize(optionsMinimize));
        }

        if (prevField !== currentEditInq.field) {
          const hasInq = inquiriesOp.filter((inq) => inq.field === prevField);
          if (!hasInq.length) {
            dispatch(InquiryActions.setOneInq({}));
            dispatch(FormActions.toggleCreateInquiry(false));
          }
        }

        inquiriesOp[editedIndex].showIconAttachAnswerFile = false;
        dispatch(InquiryActions.setEditInq());
        dispatch(InquiryActions.setInquiries(inquiriesOp));

        dispatchSetTab(isCdCm, contentsInqCDCM, inquiriesOp[editedIndex].receiver[0]);

        // sync edit inquiry
        syncData({ inquiries: inquiriesOp });

        props.getUpdatedAt();
        setDisabled(false);
        // setSave();
        dispatch(InquiryActions.checkSubmit(!enableSubmit));
      } else {
        dispatch(InquiryActions.setEditInq());
      }
    } else {
      // Create INQUIRY
      if (checkDuplicateInq()) {
        setDisabled(false);
        return;
      }
      if (ansTypeChoice === currentEditInq.ansType) {
        if (currentEditInq.answerObj.length === 1) {
          dispatch(
            AppActions.showMessage({ message: 'Please add more options!', variant: 'error' })
          );
          setDisabled(false);
          return;
        }
      }
      const uploads = [];
      if (currentEditInq.mediaFile.length) {
        currentEditInq.mediaFile.forEach((file) => {
          const formData = new FormData();
          formData.append('files', file.fileUpload);
          uploads.push(formData);
        });
      }
      let inqContentTrim = [];
      if (isCdCm) {
        if (contentsInqCDCM.length) {
          contentsInqCDCM.forEach(c => {
            inqContentTrim.push({
              content: c.contentShow,
              field: containerCheck[0],
              inqType: c.type,
              ansType: metadata.ans_type['paragraph'],
              receiver: [`${c.receiver.split('-')[0]}`],
              answerObj: [],
              mediaFile: currentEditInq.mediaFile
            })
          })
        }
      } else {
        const question = JSON.parse(JSON.stringify([{ ...currentEditInq }]));
        inqContentTrim = question.map((op) => {
          let contentTrim = { ...op, content: op.content.trim() };
          const ansTypeChoice = metadata.ans_type['choice'];
          if (ansTypeChoice === op.ansType) {
            op.answerObj.forEach((ans) => {
              ans.content = ans.content.trim();
            });
            op.answerObj.push({
              id: null,
              content: '',
              createdAt: new Date(),
            })
          } else contentTrim.answerObj = [];
          return contentTrim;
        });
      }
      axios
        .all(uploads.map((endpoint) => uploadFile(endpoint).catch((err) => handleError(dispatch, err))))
        .then((media) => {
          let mediaList = [];
          media.forEach((file) => {
            const mediaFileList = file.response.map((item) => item);
            mediaList = [...mediaList, ...mediaFileList];
          });
          saveInquiry({ question: inqContentTrim, media: mediaList, blId: myBL.id, isCdCm })
            .then((res) => {
              const mediaFile = [];
              mediaList.forEach(({ id, name, ext }) => mediaFile.push({ id, name, ext, creator: userType }));
              const inqResponse = res.inqResponse || {};
              const optionsMinimize = [...listMinimize];
              const optionsInquires = [...inquiries];
              if (isCdCm && Array.isArray(inqResponse)) {
                inqResponse.forEach(inq => {
                  inq.creator = {
                    userName: user.displayName || '',
                    avatar: user.photoURL || ''
                  };
                  inq.mediaFile = mediaFile;
                  inq.process = 'pending';
                  optionsInquires.push(inq);
                  optionsMinimize.push(inq);
                })
              } else {
                inqResponse.creator = {
                  userName: user.displayName || '',
                  avatar: user.photoURL || ''
                };
                inqResponse.mediaFile = mediaFile;
                optionsInquires.push(inqResponse);
                optionsMinimize.push(inqResponse);
              }
              if (optionsInquires.length === 1) {
                dispatch(Actions.updateOpusStatus(myBL.bkgNo, "BC", "")) // Draft of Inquiry Created (BC)
              }
              dispatch(InquiryActions.saveInquiry());
              dispatch(InquiryActions.setField());
              dispatch(InquiryActions.setOpenedInqForm(false));
              dispatch(InquiryActions.setEditInq());
              dispatch(InquiryActions.setInquiries(optionsInquires));
              dispatch(InquiryActions.setListMinimize(optionsMinimize));
              dispatch(InquiryActions.checkSubmit(!enableSubmit));
              dispatch(FormActions.toggleAllInquiry(true));
              dispatch(FormActions.toggleCreateInquiry(false));
              dispatch(InquiryActions.setOneInq());
              props.getUpdatedAt();

              dispatchSetTab(isCdCm, inqContentTrim, inqContentTrim[0].receiver[0]);
              setDisabled(false);

              // sync create inquiry
              syncData({ inquiries: optionsInquires, listMinimize: optionsMinimize });
            })
            .catch((error) => handleError(dispatch, error));
        })
        .catch((error) => handleError(dispatch, error));
    }
    dispatch(FormActions.setDirtyReload({ inputInquiryEditor: false }))
  };

  const onPaste = (e) => {
    if (e.clipboardData.files.length) {
      let fileObject = e.clipboardData.files[0];
      const newFileName = generateFileName(fileObject.name, currentEditInq.mediaFile.map(fItem => { return fItem.name }));
      const myRenamedFile = new File(
        [fileObject],
        newFileName, {
          type: "image/png"
        }
      );
      if (!allPasteFiles.includes(newFileName)) {
        setFilepaste(myRenamedFile);
        setAllPasteFile([...allPasteFiles, newFileName])
      }
    }
  }

  const { isDragActive, getRootProps } = useDropzone({
    onDrop: files => setDropfiles(files),
    noClick: true
  });

  return (
    <div style={{ position: 'relative' }} onPaste={onPaste} {...getRootProps({})}>
      {isDragActive && <div className='dropzone'>Drop files here</div>}
      <>
        <div className="flex justify-between" style={{ padding: '0.5rem', marginRight: '-15px' }}>
          <div ref={scrollTopPopup} style={{ fontSize: '22px', fontWeight: 'bold', color: '#BD0F72' }}>
            {currentEditInq.field
              ? getLabelById(metadata['field_options'], currentEditInq.field)
              : 'New Inquiry'}
          </div>

          <FormControl className={classes.checkedIcon}>
            {containerCheck.includes(currentEditInq.field) ? `` : (
              <RadioGroup
                aria-label="receiver"
                name="receiver"
                value={currentEditInq.receiver[0]}
                onChange={(e) => handleReceiverChange(e)}>
                <FormControlLabel
                  value="customer"
                  control={<Radio color={'primary'} />}
                  label="Customer"
                />
                <FormControlLabel
                  value="onshore"
                  control={<Radio color={'primary'} />}
                  label="Onshore"
                />
              </RadioGroup>
            )}
            <AttachFile filepaste={filepaste} dropfiles={dropfiles} />
          </FormControl>
        </div>
        {currentEditInq && (
          <div className={classes.form} style={isDragActive ? { visibility: 'hidden' } : {}}>
            <Grid container spacing={4}>
              <Grid item xs={4}>
                <FormControl error={!valid.field}>
                  <FuseChipSelect
                    customStyle={styles(fullscreen ? 320 : 295)}
                    value={fieldValue}
                    isDisabled={['ANS_DRF', 'INQ_SENT'].includes(currentEditInq.state)}
                    onChange={handleFieldChange}
                    placeholder="BL Data Field"
                    textFieldProps={{
                      variant: 'outlined'
                    }}
                    options={fieldType}
                    errorStyle={valid.field}
                  />
                  <div style={{ height: '20px' }}>
                    {!valid.field && (
                      <FormHelperText style={{ marginLeft: '4px' }}>This is required!</FormHelperText>
                    )}
                  </div>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                {Array.isArray(valueType) && containerCheck.includes(currentEditInq.field) ? (
                  <div className={clsx(classes.formInqType, ['ANS_DRF', 'INQ_SENT'].includes(currentEditInq.state) ? classes.disableSelect : '')}>
                    <FormControl error={!valid.inqType}>
                      {valueType.length === 0 ? <InputLabel id="demo-mutiple-checkbox-label">Type of Question</InputLabel> : ``}
                      <Select
                        labelId="demo-mutiple-checkbox-label"
                        id="demo-mutiple-checkbox"
                        multiple
                        value={valueType}
                        onChange={(e) => handleTypeChange(e)}
                        inputProps={{
                          style: { width: '100%' }
                        }}
                        disabled={['ANS_DRF', 'INQ_SENT'].includes(currentEditInq.state)}
                        renderValue={(selected) =>
                          <div>
                            {selected.map((value) => value.value !== 'select-all' && (
                              <Chip key={value.type} label={value.label} />
                            ))}
                          </div>}
                        MenuProps={MenuProps}
                      >
                        <MenuItem key={'select-all'} value={{
                          label: 'Select All',
                          value: 'select-all'
                        }}>
                          <Checkbox checked={isAllSelected} />
                          <ListItemText primary={'Select All'} />
                        </MenuItem>
                        {inqTypeOption.map((name) => {
                          const mapType = valueType.map(v => v.value);
                          return (
                            <MenuItem key={name.value} value={name}>
                              <Checkbox checked={mapType.includes(name.value)} />
                              <ListItemText primary={name.label} />
                            </MenuItem>
                          )
                        })}
                      </Select>
                      <div style={{ height: '20px' }}>
                        {!valid.inqType && (
                          <FormHelperText style={{ marginLeft: '4px' }}>This is required!</FormHelperText>
                        )}
                      </div>
                    </FormControl>
                  </div>
                ) : (
                  <FormControl error={!valid.inqType}>
                    <FuseChipSelect
                      value={valueType}
                      customStyle={styles(fullscreen ? 330 : 295)}
                      isDisabled={['ANS_DRF', 'INQ_SENT'].includes(currentEditInq.state)}
                      onChange={handleTypeChange}
                      placeholder="Type of Question"
                      textFieldProps={{
                        variant: 'outlined'
                      }}
                      options={inqTypeOption}
                      errorStyle={valid.inqType}
                    />
                    <div style={{ height: '20px' }}>
                      {!valid.inqType && (
                        <FormHelperText style={{ marginLeft: '4px' }}>This is required!</FormHelperText>
                      )}
                    </div>
                  </FormControl>
                )}
              </Grid>
              <Grid item xs={4}>
                <FormControl error={!valid.ansType}>
                  <FuseChipSelect
                    value={valueAnsType}
                    customStyle={styles(fullscreen ? 330 : 295)}
                    isDisabled={['ANS_DRF', 'INQ_SENT'].includes(currentEditInq.state)}
                    onChange={handleAnswerTypeChange}
                    placeholder="Type of Answer"
                    textFieldProps={{
                      variant: 'outlined'
                    }}
                    options={optionsAnsType}
                    errorStyle={valid.ansType}
                  />
                  <div style={{ height: '15px' }}>
                    {!valid.ansType && (
                      <FormHelperText style={{ marginLeft: '4px' }}>This is required!</FormHelperText>
                    )}
                  </div>
                </FormControl>
              </Grid>
            </Grid>
            {!containerCheck.includes(currentEditInq.field) && templateList.length > 1 &&
              <Button
                style={{ float: 'right', color: '#515F6B', fontWeight: 500, textTransform: 'none' }}
                onClick={handleClick}
              >
                Template
                <Icon>{anchorEl ? 'arrow_drop_up' : 'arrow_drop_down'}</Icon>
              </Button>
            }
            <Popover
              id="simple-menu"
              anchorEl={anchorEl}
              // keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              classes={{ paper: classes.menuList }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <RadioGroup value={template} onChange={handleChange}>
                {templateList.map((temp, index) => (
                  <FormControlLabel
                    key={index}
                    classes={{ root: classes.formRadio, label: classes.radioLabel }}
                    value={index.toString()}
                    control={<Radio color={'primary'} classes={{ root: classes.radioRoot }} style={{ position: 'absolute' }} />}
                    label={temp}
                  />
                ))}
              </RadioGroup>
            </Popover>
            {containerCheck.includes(currentEditInq.field) ? (
              <>
                {contentsInqCDCM.length ? (
                  contentsInqCDCM.map((val, index) => (
                    <div key={val.type} className={classes.contentCDCM}>
                      <div className="mt-24 mx-8 form-control-cdcm" style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative' }} id={'content-temp-' + val.type}>
                        <FormControl className={classes.formControl}>
                          <RadioGroup
                            aria-label={"receiver-" + val.type}
                            name={"receiver-" + val.type}
                            value={val.receiver}
                            onChange={(e) => handleReceiverChangeCDCM(e, val.type)}>
                            <FormControlLabel
                              value={"customer-" + val.type}
                              control={<Radio color={'primary'} />}
                              label="Customer"
                            />
                            <FormControlLabel
                              value={"onshore-" + val.type}
                              control={<Radio color={'primary'} />}
                              label="Onshore"
                            />
                          </RadioGroup>
                        </FormControl>
                        {val.content && val.content.length > 1 ? (
                          <Button
                            style={{ float: 'right', color: '#515F6B', fontWeight: 500, textTransform: 'none' }}
                            onClick={() => handleShowTemplateCDCM(val.type)}
                          >
                            Template
                            <Icon>{val.showTemplate ? 'arrow_drop_up' : 'arrow_drop_down'}</Icon>
                          </Button>
                        ) : ``}
                        <Popover
                          id={val.type}
                          className={'popover-temp'}
                          anchorEl={val.showTemplate}
                          open={val.showTemplate}
                          onClose={() => handleCloseTemplateCDCM()}
                          classes={{ paper: classes.menuListCDCM }}
                          container={() => document.getElementById('content-temp-' + val.type)}
                        >
                          <RadioGroup value={val.templateIndex} onChange={(e) => handleChangeCDCM(e, val.type)}>
                            {val.content && val.content.length > 1 && val.content.map((temp, index) => (
                              <>
                                <FormControlLabel
                                  classes={{ root: classes.formRadio, label: classes.radioLabel }}
                                  value={index.toString()}
                                  control={<Radio color={'primary'} classes={{ root: classes.radioRoot }} style={{ position: 'absolute' }} />}
                                  label={temp}
                                />
                              </>
                            ))}
                          </RadioGroup>
                        </Popover>
                      </div>
                      <div className="mt-24 mx-8" style={{ minHeight: 32 }}>
                        <ContentEditable
                          html={val.contentShow} // innerHTML of the editable div
                          disabled={false} // use true to disable editing
                          onChange={(e) => handleNameChangeCDCM(e, val)} // handle innerHTML change
                          style={{ whiteSpace: 'pre-wrap', display: 'inline' }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="mt-32 mx-8" style={{ minHeight: 32 }}>
                    <ContentEditable
                      html={currentEditInq.content} // innerHTML of the editable div
                      disabled={false} // use true to disable editing
                      onChange={handleNameChange} // handle innerHTML change
                      style={{ whiteSpace: 'pre-wrap', display: 'inline' }}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="mt-32 mx-8" style={{ minHeight: 32 }}>
                <ContentEditable
                  html={content} // innerHTML of the editable div
                  disabled={false} // use true to disable editing
                  onChange={handleNameChange} // handle innerHTML change
                  style={{ whiteSpace: 'pre-wrap', display: 'inline' }}
                />
              </div>
            )}

            {currentEditInq.ansType === metadata.ans_type.choice && (
              <div className="mt-16">
                <ChoiceAnswerEditor />
              </div>
            )}
            {currentEditInq.ansType === metadata.ans_type.paragraph && (
              <div className="mt-40">
                <ParagraphAnswerEditor />
              </div>
            )}
            {currentEditInq.ansType === metadata.ans_type.attachment && (
              <AttachmentAnswer
                style={{ marginTop: '1rem' }}
                isPermissionAttach={allowCreateAttachmentAnswer}
              />
            )}
            <Divider className="mt-12" />
            <div className={'attachment'}>
              {currentEditInq.mediaFile?.length > 0 && <h3>Attachment Inquiry:</h3>}
              {currentEditInq.mediaFile?.length > 0 &&
                currentEditInq.mediaFile?.map((file, mediaIndex) => (
                  <>
                    <FileAttach
                      file={file}
                      files={currentEditInq.mediaFile}
                      field={currentEditInq.field}
                      question={currentEditInq}
                      isEdit={true}
                    />
                  </>
                ))}
            </div>

            <>
              {user.role !== 'Admin' && (
                <>
                  {currentEditInq.mediaFilesAnswer?.length > 0 && <h3>Attachment Answer:</h3>}
                  {currentEditInq.mediaFilesAnswer?.map((file) => (
                    <>
                      <FileAttach
                        file={file}
                        files={currentEditInq.mediaFilesAnswer}
                        field={currentEditInq.field}
                        isAnswer={true}
                        question={currentEditInq}
                        isEdit={true}
                      />
                    </>
                  ))}
                </>
              )}
            </>
            <div className="flex">
              <div className="flex">
                <Button
                  variant="contained"
                  color="primary"
                  disabled={isDisabled}
                  onClick={() => onSave(containerCheck.includes(currentEditInq.field))}
                  classes={{ root: classes.button }}>
                  Save
                </Button>
                <Button
                  variant="contained"
                  classes={{ root: clsx(classes.button, 'reply') }}
                  color="primary"
                  onClick={onCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default InquiryEditor;
