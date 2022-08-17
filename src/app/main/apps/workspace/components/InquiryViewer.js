import { resolveInquiry, deleteInquiry, uploadOPUS } from 'app/services/inquiryService';
import {
  CONTAINER_DETAIL, CONTAINER_MANIFEST, CONTAINER_NUMBER, CONTAINER_SEAL, CONTAINER_TYPE, CONTAINER_PACKAGE, CONTAINER_WEIGHT, CONTAINER_MEASUREMENT,
  CM_MARK, CM_PACKAGE, CM_DESCRIPTION, CM_WEIGHT, CM_MEASUREMENT
} from '@shared/keyword';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import { stateResquest, displayTime } from '@shared';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Tooltip, Grid, Button, Radio, FormControlLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import clsx from "clsx";
import * as AppAction from 'app/store/actions';

import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from '../store/actions/form';

import ChoiceAnswer from './ChoiceAnswer';
import ParagraphAnswer from './ParagraphAnswer';
import ImageAttach from './ImageAttach';
import FileAttach from './FileAttach';
import UserInfo from './UserInfo';
import AttachFile from './AttachFile';

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
    borderColor: '#36B37E',
  },
  text: {
    height: 40,
    width: 170,
    border: '1px solid #BAC3CB',
    textAlign: 'center',
    color: '#132535',
  }
}));

const InquiryViewer = (props) => {
  const { index, question, toggleEdit, viewGuestDropDown, setViewGuestDropDown, openInquiryReview } = props;
  const type = question.ansType;
  const user = useSelector(({ user }) => user);
  const dispatch = useDispatch();
  const classes = useStyles();
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const currentEditInq = useSelector(({ workspace }) => workspace.inquiryReducer.currentEditInq);
  const myBL = useSelector(({ workspace }) => workspace.inquiryReducer.myBL);
  const content = useSelector(({ workspace }) => workspace.inquiryReducer.content);
  const [allowDeleteInq, setAllowDeleteInq] = useState(true);
  const [viewDropDown, setViewDropDown] = useState();
  const [isDisableSave, setDisableSave] = useState(true);
  const [isResolve, setIsResolve] = useState(false)
  const [textResolve, setTextResolve] = useState(content[question.field] || '')
  const containerDetailType = [CONTAINER_NUMBER, CONTAINER_SEAL, CONTAINER_TYPE, CONTAINER_PACKAGE, CONTAINER_WEIGHT, CONTAINER_MEASUREMENT]
  const containerManifestType = [CM_MARK, CM_PACKAGE, CM_DESCRIPTION, CM_WEIGHT, CM_MEASUREMENT]

  const handleViewMore = (id) => {
    if (user.role !== "Admin") {
      toggleEdit();
      setViewGuestDropDown(id);
    } else {
      if (viewDropDown === id) {
        setViewDropDown('');
      } else {
        setViewDropDown(id);
      }
    }
  };
  useEffect(() => {
    if (viewGuestDropDown === '') {
      dispatch(InquiryActions.setEditInq({}));
    }
  }, [viewGuestDropDown]);

  const getField = (field) => {
    return metadata.field?.[field] || '';
  };

  const containerCheck = [getField(CONTAINER_DETAIL), getField(CONTAINER_MANIFEST)]

  const selectChoiceHandle = (e) => {
    const inq = { ...currentEditInq };
    inq.selectChoice = e;
    dispatch(InquiryActions.setEditInq(inq));
  };
  useEffect(() => {
    myBL?.state !== stateResquest && setAllowDeleteInq(false);
  }, []);
  const paragraphAnswerHandle = (e) => {
    const inq = { ...currentEditInq };
    inq.paragraphAnswer = e;
    dispatch(InquiryActions.setEditInq(inq));
  };

  const removeQuestion = (index) => {
    const optionsOfQuestion = [...inquiries];
    const inqDelete = optionsOfQuestion.splice(index, 1)[0];
    deleteInquiry(inqDelete.id)
      .then(() => {
        dispatch(InquiryActions.setInquiries(optionsOfQuestion));
      })
      .catch((error) => console.error(error));
  };

  const changeToEditor = (inq) => {
    const index = inquiries.findIndex((q) => q.id === inq.id);
    if (index >= 0) {
      const inqEdit = JSON.parse(JSON.stringify(inq));
      dispatch(InquiryActions.setEditInq(inqEdit));
      dispatch(InquiryActions.setField(inq.field));
    }
  };

  const onResolve = () => {
    setIsResolve(true)
  }

  const onConfirm = () => {
    const body = {
      fieldId: question.field,
      inqId: question.id,
      fieldContent: textResolve,
      blId: myBL.id
    }
    resolveInquiry(body)
      .then(() => {
        dispatch(FormActions.toggleReload());
        setIsResolve(false)
      })
      .catch((error) => dispatch(AppAction.showMessage({ message: error, variant: 'error' })));
  }

  const onUpload = () => {
    uploadOPUS(question.id).then(() => {
      dispatch(AppAction.showMessage({ message: 'Upload to OPUS successfully', variant: 'success' }));
    }).catch((error) => dispatch(AppAction.showMessage({ message: error, variant: 'error' })));
  }
  const cancelResolve = () => {
    setIsResolve(false)
  }

  const inputText = (e) => {
    setTextResolve(e.target.value)
  }

  return (
    <>
      <div>
        <div style={{ paddingTop: 10 }} className="flex justify-between">
          <UserInfo
            name={question.creator.userName}
            time={displayTime(question.createdAt)}
            avatar={question.creator.avatar}
          />
          {user.role === "Admin" ? ( // TODO
            <div className="flex items-center mr-2">
              <PermissionProvider
                action={PERMISSION.INQUIRY_RESOLVE_INQUIRY}
                extraCondition={question.state === 'COMPL'}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onUpload}
                  classes={{ root: classes.button }}
                >
                  Upload to OPUS
                </Button>
              </PermissionProvider>
              <Tooltip title="Edit Inquiry">
                <div onClick={() => changeToEditor(question)}>
                  <img style={{ width: 20, cursor: 'pointer' }} src="/assets/images/icons/edit.svg" />
                </div>
              </Tooltip>
              {allowDeleteInq && (
                <Tooltip title="Delete Inquiry">
                  <div style={{ marginLeft: '10px' }} onClick={() => removeQuestion(index)}>
                    <img
                      style={{ height: '22px', cursor: 'pointer' }}
                      src="/assets/images/icons/trash-gray.svg"
                    />
                  </div>
                </Tooltip>
              )}
            </div>
          ) : (
            <FormControlLabel control={<AttachFile isAnswer={true} question={question} />} />
          )}
        </div>
        <Typography variant="h5">{question.name}</Typography>
        <Typography
          className={viewGuestDropDown !== question.id || viewDropDown !== question.id ? classes.hideText : ''}
          variant="h5"
          style={{
            wordBreak: 'break-word',
            fontFamily: 'Montserrat',
            fontSize: 15,
            color: '#132535'
          }}>
          {question.content}
        </Typography>
        {(viewGuestDropDown === question.id || viewDropDown === question.id) && (
          <div style={{ display: 'block', margin: '1rem 0rem' }}>
            {type === metadata.ans_type.choice && (
              <ChoiceAnswer
                index={index}
                questions={inquiries}
                question={question}
                selectChoice={(e) => selectChoiceHandle(e)}
                isDisableSave={(e) => setDisableSave(e)}
              />
            )}
            {type === metadata.ans_type.paragraph && (
              <ParagraphAnswer
                question={question}
                index={index}
                questions={inquiries}
                paragrapAnswer={(e) => paragraphAnswerHandle(e)}
                isDisableSave={(e) => setDisableSave(e)}
              />
            )}
          </div>
        )}
        <>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={6}>
              {question.mediaFile?.length > 0 && <h3>Attachment Inquiry:</h3>}
            </Grid>
            <Grid item xs={6}>
              <div className={classes.viewMoreBtn} onClick={() => handleViewMore(question.id)}>
                {user.role === "Admin" && (viewDropDown !== question.id ? ( // TODO
                  <>
                    View All
                    <ArrowDropDown />
                  </>
                ) : (
                  <>
                    Hide All
                    <ArrowDropUp />
                  </>
                ))}
                {user.role !== "Admin" && (viewGuestDropDown !== question.id ? (
                  <>
                    View All
                    <ArrowDropDown />
                  </>
                ) : (
                  <>
                    Hide All
                    <ArrowDropUp />
                  </>
                ))}
              </div>
            </Grid>
          </Grid>
          {question.mediaFile?.length > 0 &&
            question.mediaFile?.map((file, mediaIndex) => (
              <div style={{ position: 'relative', display: 'inline-block' }} key={mediaIndex}>
                {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
                  <ImageAttach
                    file={file}
                    hiddenRemove={true}
                    field={question.field}
                    indexInquiry={index}
                    style={{ margin: '2.5rem' }}
                  />
                ) : (
                  <FileAttach
                    hiddenRemove={true}
                    file={file}
                    field={question.field}
                    indexInquiry={index}
                  />
                )}
              </div>
            ))}
        </>
        {
          (user.role === 'Admin' && !["ANS_SENT", "REP_A_SENT", "COMPL"].includes(question.state)) ? null :
            <>
              {question.mediaFilesAnswer?.length > 0 && <h3>Attachment Answer:</h3>}
              {question.mediaFilesAnswer?.map((file, mediaIndex) => (

                <div style={{ position: 'relative', display: 'inline-block' }} key={mediaIndex}>
                  {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
                    <ImageAttach
                      hiddenRemove={viewGuestDropDown !== question.id}
                      file={file}
                      field={question.field}
                      style={{ margin: '2.5rem' }}
                      indexMedia={mediaIndex}
                      isAnswer={true}
                    />
                  ) : (
                    <FileAttach
                      hiddenRemove={viewGuestDropDown !== question.id}
                      file={file}
                      field={question.field}
                      indexMedia={mediaIndex}
                      isAnswer={true}
                    />
                  )}
                </div>
              ))}
            </>
        }

      </div>
      {question.state !== 'COMPL' && question.state !== 'UPLOADED' &&
        <>
          {isResolve ?
            <>
              {containerCheck.includes(question.field) ?
                <ContainerDetailForm
                  container={question.field === containerCheck[0] ? CONTAINER_DETAIL : CONTAINER_MANIFEST}
                  question={question}
                  typeList={question.field === containerCheck[0] ? containerDetailType : containerManifestType}
                  setTextResolve={setTextResolve}
                />
                :
                <textarea
                  style={{
                    width: '100%',
                    paddingTop: 10,
                    paddingLeft: 5,
                    marginTop: 10,
                    minHeight: 50,
                    borderWidth: '0.5px',
                    borderStyle: 'solid',
                    borderColor: 'lightgray',
                    borderRadius: 6,
                    resize: 'none'
                  }}
                  multiline={true}
                  type="text"
                  value={textResolve}
                  onChange={inputText} />
              }
              <div className="flex">
                <PermissionProvider action={PERMISSION.INQUIRY_RESOLVE_INQUIRY}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onConfirm}
                    classes={{ root: clsx(classes.button, 'w120') }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    classes={{ root: clsx(classes.button, 'w120', 'reply') }}
                    color="primary"
                    onClick={cancelResolve}
                  >
                    Cancel
                  </Button>
                </PermissionProvider>
              </div>
            </>
            :
            <div className="flex">
              <PermissionProvider
                action={PERMISSION.INQUIRY_RESOLVE_INQUIRY}
                extraCondition={question.state === 'ANS_SENT' || question.state === 'REP_A_SENT'}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onResolve}
                  classes={{ root: clsx(classes.button, 'w120') }}
                >
                  Resolved
                </Button>
              </PermissionProvider>
              <PermissionProvider
                action={PERMISSION.INQUIRY_CREATE_COMMENT}
              // extraCondition={displayCmt}
              >
                <Button
                  variant="contained"
                  classes={{ root: clsx(classes.button, 'w120', 'reply') }}
                  color="primary"
                // onClick={onReply}
                >
                  Reply
                </Button>
              </PermissionProvider>
            </div>
          }
        </>
      }
    </>
  );
};
const ContainerDetailForm = ({ container, typeList, question, setTextResolve }) => {
  const classes = useStyles();
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);
  const content = useSelector(({ workspace }) => workspace.inquiryReducer.content);

  const getField = (field) => {
    return metadata.field?.[field] || '';
  };
  const getType = (type) => {
    return metadata.inq_type?.[type] || '';
  };
  const getValueField = (field) => {
    return content[getField(field)] || '';
  };
  const [values, setValues] = useState(getValueField(container))
  const onChange = (e, index, type) => {
    const temp = JSON.parse(JSON.stringify(values))
    temp[index][type] = e.target.value
    setValues(temp)
    setTextResolve(temp)
  }
  return (
    <>
      {typeList.map((type, index) => (
        <div key={index} style={{ display: 'flex', marginTop: 10 }}>
          <input
            className={clsx(classes.text)}
            style={{
              backgroundColor: '#FDF2F2',
              fontWeight: 600,
              borderTopLeftRadius: index === 0 && 8,
              fontSize: 14,
              borderBottomLeftRadius: index === typeList.length - 1 && 8
            }}
            disabled
            defaultValue={type}
          />
          {values.map((cd, index1) => {
            const disabled = question.inqType !== getType(type)
            return (
              <input
                className={clsx(classes.text)}
                key={index1}
                style={{
                  marginLeft: 10,
                  backgroundColor: disabled && '#FDF2F2',
                  fontSize: 15,
                  borderTopRightRadius: index === 0 && values.length - 1 === index1 ? 8 : null,
                  borderBottomRightRadius: index1 === values.length - 1 && index === typeList.length - 1 ? 8 : null
                }}
                disabled={disabled}
                value={cd[getType(type)]}
                onChange={(e) => onChange(e, index1, getType(type))}
              />
            )
          })}
        </div>
      ))}
    </>
  )
}
export default InquiryViewer;
