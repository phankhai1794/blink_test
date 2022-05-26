import { saveComment, loadComment, editComment, deleteComment } from 'app/services/inquiryService';
import { getFile } from 'app/services/fileService';
import { PERMISSION, PermissionProvider } from '@shared/permission';
import { displayTime } from '@shared';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
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
  Fab,
  TextField, InputAdornment, Button
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';
import { withStyles } from '@material-ui/core/styles';

import * as InquiryActions from '../store/actions/inquiry';

import InquiryEditor from './InquiryEditor';
import ChoiceAnswer from './ChoiceAnswer';
import ParagraphAnswer from './ParagraphAnswer';
import AttachmentAnswer from './AttachmentAnswer';
import ImageAttach from './ImageAttach';
import FileAttach from './FileAttach';
import UserInfo from './UserInfo';

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
  const inputStyle = {
    borderRadius: '18px',
    padding: '10px',
    borderStyle: 'none',
    backgroundColor: '#f0f2f5',
    fontSize: '17px',
    width: '97%'
  };
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
            creator: user.displayName
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
                  {user.displayName === k.creator && key === id && (
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
  }
}));

const Inquiry = (props) => {
  const dispatch = useDispatch();
  const { user } = props;
  const classes = useStyles();
  const [inquiries, currentField, metadata] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.inquiries,
    workspace.inquiryReducer.currentField,
    workspace.inquiryReducer.metadata
  ]);
  const inquiry = inquiries.filter((q) => q.field === currentField);
  const indexes = inquiries.findIndex((q) => q.field === currentField);
  const [edit, setEdit] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [isShowBtn, setShowBtn] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const toggleEdit = (id) => {
    setEdit(id);
  };
  useEffect(() => {
    if (inquiry[0]?.mediaFile.length && !inquiry[0].mediaFile[0].src) {
      const optionsOfQuestion = [...inquiries];
      for (let f in inquiry[0].mediaFile) {
        getFile(inquiry[0].mediaFile[f].id)
          .then((file) => {
            let url = '';
            if (inquiry[0].mediaFile[f].ext.match(/jpeg|jpg|png/g)) {
              url = URL.createObjectURL(new Blob([file], { type: 'image/jpeg' }));
            } else {
              url = URL.createObjectURL(new Blob([file]));
            }
            optionsOfQuestion[indexes].mediaFile[f].src = url;
            dispatch(InquiryActions.editInquiry(optionsOfQuestion));
          })
          .catch((error) => console.error(error));
      }
    }
  }, [currentField]);
  const handleRemoveImageAttach = (mediaIndex, inquiryIndex) => {
    const optionsOfQuestion = [...inquiries];
    const mediaFiles = optionsOfQuestion[inquiryIndex].answerObj[0]?.mediaFiles;
    mediaFiles.splice(mediaIndex, 1);
    dispatch(InquiryActions.setEdit(optionsOfQuestion));
    if (optionsOfQuestion[inquiryIndex].answerObj[0]?.mediaFiles.length === 0) {
      setShowBtn(false);
    }
  };
  return (
    <>
      {inquiry.map((q, index) => {
        const type = q.ansType;
        const user = q.creator;
        return (
          <>
            {edit === index ? (
              <InquiryEditor
                index={indexes}
                questions={inquiries}
                question={q}
                saveQuestion={(q) => dispatch(InquiryActions.editInquiry(q))}
              />
            ) : (
              <Card style={{ padding: '1rem ', marginBottom: '24px' }}>
                <div className="flex justify-between">
                  <UserInfo name={user.userName} time={displayTime(q.createdAt)} avatar={user.avatar} />
                  <PermissionProvider action={PERMISSION.VIEW_EDIT_INQUIRY}>
                    <IconButton onClick={handleClick}>
                      <MoreVertIcon />
                    </IconButton>
                  </PermissionProvider>
                  <Menu
                    id="customized-menu"
                    anchorEl={anchorEl}
                    // open={open}
                    open={false}
                    onClose={handleClose}
                    keepMounted>
                    <MenuItem onClick={() => toggleEdit(index)}>
                      <ListItemIcon style={{ minWidth: '0px', marginRight: '1rem' }}>
                        <EditIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Edit" />
                    </MenuItem>
                    <MenuItem>
                      <ListItemIcon style={{ minWidth: '0px', marginRight: '1rem' }}>
                        <NoteAddIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Add Inquiry" />
                    </MenuItem>
                  </Menu>
                </div>
                <Typography variant="h5">{q.content}</Typography>
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
                      user={user}
                      index={indexes}
                      questions={inquiries}
                      saveQuestion={(q) => dispatch(InquiryActions.editInquiry(q))}
                    />
                  )}
                  {type === metadata.ans_type.attachment && (
                    <AttachmentAnswer
                      question={q}
                      user={user}
                      index={indexes}
                      questions={inquiries}
                      saveQuestion={(q) => dispatch(InquiryActions.editInquiry(q))}
                      isShowBtn={isShowBtn}
                      // disabled={true}
                    />
                  )}
                </div>
                <>
                  {q.mediaFile?.length > 0 && <h3>Attachment Inquiry:</h3>}
                  {q.mediaFile?.map((file, mediaIndex) => (
                    <div style={{ position: 'relative' }} key={mediaIndex} className={classes.root}>
                      <Fab
                        size="small"
                        classes={
                          file.ext.match(/jpeg|jpg|png/g)
                            ? { root: classes.positionBtnImg }
                            : { root: classes.positionBtnNotImg }
                        }>
                        <CloseIcon style={{ fontSize: 20 }} />
                      </Fab>
                      {file.ext.match(/jpeg|jpg|png/g) ? (
                        <ImageAttach src={file.src} style={{ margin: '2.5rem' }} />
                      ) : (
                        <FileAttach file={file} />
                      )}
                    </div>
                  ))}
                </>
                <>
                  {q.answerObj[0]?.mediaFiles.length > 0 && <h3>Attachment Answer:</h3>}
                  {q.answerObj[0]?.mediaFiles.map((file, mediaIndex) => (
                    <div style={{ position: 'relative' }} key={mediaIndex} className={classes.root}>
                      {user === 'guest' && <Fab
                        size="small"
                        onClick={() => handleRemoveImageAttach(mediaIndex, indexes)}
                        classes={
                          file.ext.match(/jpeg|jpg|png/g)
                            ? { root: classes.positionBtnImg }
                            : { root: classes.positionBtnNotImg }
                        }>
                        <CloseIcon style={{ fontSize: 20 }} />
                      </Fab>
                      }
                      {file.ext.match(/jpeg|jpg|png/g) ? (
                        <ImageAttach src={file.src} style={{ margin: '2.5rem' }} />
                      ) : (
                        <FileAttach file={file} />
                      )}
                    </div>
                  ))}
                </>
                <Comment q={q} inquiries={inquiries} indexes={indexes} userType={user} />
              </Card>
            )}
          </>
        );
      })}
    </>
  );
};

export default Inquiry;
