import { saveComment, loadComment, editComment, deleteComment } from 'app/services/inquiryService';
import { getFile } from 'app/services/fileService';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import { displayTime, validateExtensionFile } from '@shared';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  Card,
  ListItemText,
  Typography,
  IconButton,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  TextField,
  Divider
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';
import { withStyles } from '@material-ui/core/styles';
import * as AppAction from 'app/store/actions';
import clsx from "clsx";

import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from '../store/actions/form';

import InquiryEditor from './InquiryEditor';
import ChoiceAnswer from './ChoiceAnswer';
import ParagraphAnswer from './ParagraphAnswer';
import AttachmentAnswer from './AttachmentAnswer';
import ImageAttach from './ImageAttach';
import FileAttach from './FileAttach';
import UserInfo from './UserInfo';
import AttachFile from "./AttachFile";

const StyledTextField = withStyles({
  root: {
    width: '100%',
    margin: '1rem 0',
    '& .MuiInputBase-root': {
      backgroundColor: '#f0f2f5'
    },
    '& .MuiInputBase-root .MuiInputBase-input': {
      fontSize: '1.5rem',
      padding: '10px'
    },
    '& .MuiFormLabel-root': {
      fontSize: '1.5rem'
    },
    '& .MuiInputLabel-formControl': {
      top: '-18%'
    }
  }
})(TextField);

const Comment = (props) => {
  const dispatch = useDispatch();
  const { q, userType } = props;
  const [value, setValue] = useState('');
  const [key, setKey] = useState();
  const [comment, setComment] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [edit, setEdit] = useState('');
  const [reply, currentField] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.reply,
    workspace.inquiryReducer.currentField
  ]);
  const inputRef = useRef(null);
  const user = useSelector(({ user }) => user);
  const open = Boolean(anchorEl);
  useEffect(() => {
    loadComment(q.id)
      .then((res) => {
        dispatch(InquiryActions.setDisplayComment(Boolean(res.length || userType === 'guest')));
        setComment(res);
      })
      .catch((error) => console.error(error));
  }, [currentField]);
  const scroll = () => {
    inputRef.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
  };
  useEffect(() => {
    if (reply) {
      scroll();
    }
  }, [reply]);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const changeValue = (e) => {
    setValue(e.target.value);
  };
  const changeComment = (e, id) => {
    const temp = [...comment];
    temp[id].content = e.target.value;
    setComment(temp);
  };
  const addComment = async (e) => {
    const targetValue = e.target.value;
    if (e.key === 'Enter') {
      if (targetValue) {
        const inqAns = {
          inquiry: q.id,
          confirm: false,
          type: 'REP'
        };
        const answer = {
          content: targetValue,
          type: q.ansType
        };
        const res = await saveComment({ inqAns, answer });
        setComment([
          ...comment,
          {
            answer: res.id,
            createdAt: new Date(),
            content: targetValue,
            creator: { userName: user.displayName, avatar: user.photoURL }
          }
        ]);
      }
      setValue('');
    }
  };

  const onEnterComment = (e, id) => {
    if (e.key === 'Enter') {
      editComment(comment[id].answer, e.target.value);
      setEdit('');
    }
  };
  const onDelete = (id) => {
    deleteComment(comment[id].answer);
    const temp = [...comment];
    temp.splice(id, 1);
    setComment(temp);
    setAnchorEl(null);
  };
  const onEdit = (id) => {
    setEdit(id);
    setAnchorEl(null);
  };
  return (
    <>
      {comment.map((k, id) => {
        return (
          <div key={id} style={{ marginBottom: '20px' }}>
            {edit === id ? (
              <StyledTextField
                id="outlined-helperText"
                label="Comment here"
                value={k.content}
                variant="outlined"
                onKeyPress={(e) => onEnterComment(e, id)}
                onChange={(e) => changeComment(e, id)}
              />
            ) : (
              <>
                <div
                  className="flex justify-between"
                  onMouseEnter={() => setKey(id)}
                  onMouseLeave={() => setKey('')}
                >
                  <UserInfo name={k.creator.userName} time={displayTime(k.createdAt)} avatar={k.creator.avatar} />
                  {user.displayName === k.creator.userName && key === id && (
                    <>
                      <IconButton onClick={handleClick}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id="customized-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        keepMounted>
                        <MenuItem onClick={() => onEdit(id)}>
                          <ListItemIcon style={{ minWidth: '0px', marginRight: '1rem' }}>
                            <EditIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Edit" />
                        </MenuItem>
                        <MenuItem onClick={() => onDelete(key)}>
                          <ListItemIcon style={{ minWidth: '0px', marginRight: '1rem' }}>
                            <DeleteIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Delete" />
                        </MenuItem>
                      </Menu>
                    </>
                  )}
                </div>
                <Typography variant="h5" style={{ wordBreak: 'break-word' }}>{k.content}</Typography>
              </>
            )}
          </div>
        );
      })}

      <div className="comment" ref={inputRef}>
        {reply && (
          <StyledTextField
            id="outlined-helperText"
            label="Comment here"
            value={value}
            variant="outlined"
            onKeyPress={addComment}
            onChange={changeValue}
          />
        )}
      </div>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiButtonBase-root': {
      backgroundColor: 'silver !important'
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
  icon: {
    border: '1px solid #BAC3CB',
    borderRadius: 4,
    position: 'relative',
    width: 16,
    height: 16,
    backgroundColor: '#f5f8fa',
    '&.borderChecked': {
      border: '1px solid #BD0F72',
    }
  },
  checkedIcon: {
    display: 'block',
    position: 'absolute',
    top: '0px',
    left: '4px',
    width: '5px',
    height: '10px',
    border: '1px solid #BD0F72',
    borderWidth: '0 2px 2px 0',
    transform: 'rotate(45deg)',
  },
}));

const Inquiry = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const inquiries = useSelector(({ workspace }) =>
    workspace.inquiryReducer.inquiries
  );
  const currentField = useSelector(({ workspace }) =>
    workspace.inquiryReducer.currentField
  );
  const originalInquiry = useSelector(({ workspace }) =>
    workspace.inquiryReducer.originalInquiry
  );
  const valid = useSelector(({ workspace }) =>
    workspace.inquiryReducer.validation
  );
  const metadata = useSelector(({ workspace }) =>
    workspace.inquiryReducer.metadata
  );
  const listIndex = originalInquiry.map((q, index) => q.field === currentField && index).filter(q => Number.isInteger(q));
  const indexes = originalInquiry.findIndex((q) => q.field === currentField);
  const [edit, setEdit] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [isShowBtn, setShowBtn] = useState(null);
  const open = Boolean(anchorEl);
  const allowCreateAttachmentAnswer = PermissionProvider({ action: PERMISSION.INQUIRY_ANSWER_ATTACHMENT });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const toggleEdit = (id) => {
    dispatch(FormActions.toggleSaveInquiry(true))
    setEdit(id);
  };
  const urlMedia = (fileExt, file) => {
    if (fileExt.match(/jpeg|jpg|png/g)) {
      return URL.createObjectURL(new Blob([file], { type: 'image/jpeg' }));
    } else if (fileExt.match(/pdf/g)) {
      return URL.createObjectURL(new Blob([file], { type: 'application/pdf' }));
    } else {
      return URL.createObjectURL(new Blob([file]));
    }
  }
  const handleReceiverChange = (e) => {
    const optionsOfQuestion = [...inquiries];
    if (e.target.checked) {
      dispatch(InquiryActions.validate({ ...valid, receiver: true }));
      optionsOfQuestion[indexes].receiver.push(e.target.value);
    } else {
      const i = optionsOfQuestion[indexes].receiver.indexOf(e.target.value);
      optionsOfQuestion[indexes].receiver.splice(i, 1);
    }
    dispatch(InquiryActions.editInquiry(optionsOfQuestion));
  };

  const handleUploadImageAttach = (files, index) => {
    const optionsOfQuestion = [...inquiries];
    const inValidFile = files.find(elem => !validateExtensionFile(elem));
    if (inValidFile) {
      dispatch(AppAction.showMessage({ message: 'Invalid file extension', variant: 'error' }));
    } else {
      files.forEach(src => {
        const formData = new FormData();
        formData.append('file', src);
        formData.append('name', src.name);
        optionsOfQuestion[indexes].mediaFile.push({ id: null, src: URL.createObjectURL(src), ext: src.type, name: src.name, data: formData });
      });
      dispatch(InquiryActions.editInquiry(optionsOfQuestion));
    }
  }

  useEffect(() => {
    for (let index in listIndex) {
      const i = listIndex[index]
      if (inquiries[i]?.mediaFile.length && !inquiries[i].mediaFile[0].src) {
        const optionsOfQuestion = [...inquiries];
        for (let f in inquiries[i].mediaFile) {
          getFile(inquiries[i].mediaFile[f].id)
            .then((file) => {
              optionsOfQuestion[i].mediaFile[f].src = urlMedia(inquiries[i].mediaFile[f].ext, file);
              dispatch(InquiryActions.editInquiry(optionsOfQuestion));
            })
            .catch((error) => console.error(error));
        }
      }
      if (inquiries[i]?.answerObj[0]?.mediaFiles && inquiries[i]?.answerObj[0]?.mediaFiles.length) {
        const optionsOfQuestion = [...inquiries];
        for (let f in inquiries[i]?.answerObj[0].mediaFiles) {
          getFile(inquiries[i]?.answerObj[0].mediaFiles[f].id)
            .then((file) => {
              optionsOfQuestion[i].answerObj[0].mediaFiles[f].src = urlMedia(inquiries[i].answerObj[0].mediaFiles[f].ext, file);
              dispatch(InquiryActions.editInquiry(optionsOfQuestion));
            })
            .catch((error) => console.error(error));
        }
      }
    }
  }, [currentField]);

  return (
    <>
      {listIndex.map((i, index) => {
        const q = inquiries[i]
        const type = q.ansType;
        const user = q.creator;
        return (
          <div key={index}>
            {edit === index ? (
              <>
                <FormControl error={!valid.receiver && !q.receiver.length}>
                  <FormGroup row>
                    <FormControlLabel
                      value="onshore"
                      control={
                        <Checkbox
                          checked={q.receiver.includes('onshore')}
                          onChange={handleReceiverChange}
                          color="primary"
                          checkedIcon={
                            <>
                              <span className={clsx(classes.icon, 'borderChecked')}>
                                <span className={classes.checkedIcon} />
                              </span>
                            </>
                          }
                          icon={<span className={classes.icon} />}
                        />
                      }
                      label="Onshore"
                    />
                    <FormControlLabel
                      value="customer"
                      control={
                        <Checkbox
                          checked={q.receiver.includes('customer')}
                          onChange={handleReceiverChange}
                          color="primary"
                          checkedIcon={
                            <>
                              <span className={clsx(classes.icon, 'borderChecked')}>
                                <span className={classes.checkedIcon} />
                              </span>
                            </>
                          }
                          icon={<span className={classes.icon} />}
                        />
                      }
                      label="Customer"
                    />
                    <FormControlLabel
                      control={
                        <AttachFile uploadImageAttach={handleUploadImageAttach} index={index} />
                      }
                    />
                  </FormGroup>
                  {(!valid.receiver && !q.receiver.length) ? <FormHelperText>Pick at least one!</FormHelperText> : null}
                </FormControl>
                <InquiryEditor
                  index={indexes}
                  questions={inquiries}
                  question={q}
                  saveQuestion={(q) => dispatch(InquiryActions.editInquiry(q))}
                />
              </>
            ) : (
              <Card style={{ padding: '1rem ', marginBottom: '24px' }}>
                <div className="flex justify-between">
                  <UserInfo name={user.userName} time={displayTime(q.createdAt)} avatar={user.avatar} />
                  {/* <PermissionProvider action={PERMISSION.VIEW_EDIT_INQUIRY}>
                    <IconButton onClick={handleClick}>
                      <MoreVertIcon />
                    </IconButton>
                  </PermissionProvider>
                  <Menu
                    id="customized-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    keepMounted>
                    <MenuItem onClick={() => toggleEdit(index)}>
                      <ListItemIcon style={{ minWidth: '0px', marginRight: '1rem' }}>
                        <EditIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Edit" />
                    </MenuItem>
                  </Menu> */}
                </div>
                <Typography variant="h5" style={{ wordBreak: 'break-word' }}>{q.content}</Typography>
                <div style={{ display: 'block', margin: '1rem 0rem' }}>
                  {type === metadata.ans_type.choice && (
                    <ChoiceAnswer
                      index={indexes}
                      questions={inquiries}
                      question={q}
                      saveQuestion={(q) => dispatch(InquiryActions.editInquiry(q))}
                    />
                  )}
                  {type === metadata.ans_type.paragraph && (
                    <ParagraphAnswer
                      question={q}
                      index={indexes}
                      questions={inquiries}
                      saveQuestion={(q) => dispatch(InquiryActions.editInquiry(q))}
                    />
                  )}
                  {type === metadata.ans_type.attachment && (
                    <AttachmentAnswer
                      question={q}
                      index={indexes}
                      questions={inquiries}
                      saveQuestion={(q) => dispatch(InquiryActions.editInquiry(q))}
                      isShowBtn={isShowBtn}
                      isPermissionAttach={allowCreateAttachmentAnswer}
                    // disabled={true}
                    />
                  )}
                </div>
                <>
                  {q.mediaFile?.length > 0 && <h3>Attachment Inquiry:</h3>}
                  {q.mediaFile?.length > 0 && q.mediaFile?.map((file, mediaIndex) => (
                    <div style={{ position: 'relative', display: 'inline-block' }} key={mediaIndex} className={classes.root}>
                      {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
                        <ImageAttach hiddenRemove={true} file={file} field={q.field} style={{ margin: '2.5rem' }} />
                      ) : (
                        <FileAttach hiddenRemove={true} file={file} field={q.field} />
                      )}
                    </div>
                  ))}
                </>
                <>
                  {q.answerObj[0]?.mediaFiles?.length > 0 && <h3>Attachment Answer:</h3>}
                  {q.answerObj[0]?.mediaFiles?.map((file, mediaIndex) => (
                    <div style={{ position: 'relative', display: 'inline-block' }} key={mediaIndex} className={classes.root}>
                      {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
                        <ImageAttach hiddenRemove={true} file={file} field={q.field} style={{ margin: '2.5rem' }} />
                      ) : (
                        <FileAttach hiddenRemove={true} file={file} field={q.field} />
                      )}
                    </div>
                  ))}
                </>

                <Divider className="mt-16 mb-16" />

                <Comment q={q} inquiries={inquiries} indexes={indexes} userType={props.user} />
              </Card>
            )}
          </div>
        );
      })}
    </>
  );
};

export default Inquiry;
