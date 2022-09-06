import { saveComment, loadComment, editComment, deleteComment } from 'app/services/inquiryService';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  TextField,
  Divider
} from '@material-ui/core';
import { displayTime } from '@shared';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import * as InquiryActions from '../store/actions/inquiry';

import UserInfo from './UserInfo';
import ImageAttach from './ImageAttach';
import FileAttach from './FileAttach';
import ParagraphAnswer from './ParagraphAnswer';
import ChoiceAnswer from './ChoiceAnswer';

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

const useStyles = makeStyles(() => ({
  root: {
    border: '2px solid #bac3cb9e',
    borderRadius: 8,
    margin: '20px 0',
    maxHeight: 350,
    padding: '23px 32px',
    overflow: 'scroll',
    '& .content-reply': {
      fontSize: 15,
      fontWeight: 500
    },
    '& .attachment-reply': {
      marginTop: 15
    }
  }
}));

const Comment = (props) => {
  const dispatch = useDispatch();
  const { question, comment, userType } = props;

  const [comments, setComments] = useState(comment?.length > 1 ? comment.slice(0, comment.length -1) : []);
  const [value, setValue] = useState('');
  const [answer, setAnswer] = useState(null);
  const [key, setKey] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [edit, setEdit] = useState('');
  const classes = useStyles();
  const [reply, currentField] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.reply,
    workspace.inquiryReducer.currentField
  ]);
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);

  const user = useSelector(({ user }) => user);
  const open = Boolean(anchorEl);

  useEffect(() => {
    let answerObj = null;
    if (question.ansType === metadata.ans_type.choice) {
      answerObj = question.answerObj.filter((item) => item.confirmed);
    } else {
      answerObj = question.answerObj;
    }
    if (answerObj.length > 0 &&comment.length >0 ) {
      setAnswer({
        id: answerObj[0]?.id,
        content: `The updated information is "${answerObj[0]?.content}"`,
        userName: answerObj[0]?.updater.userName || '',
        avatar: answerObj[0]?.updater.avatar || '',
        createdAt: answerObj[0]?.updatedAt,
        media: question.mediaFilesAnswer || []
      });
    }
  }, []);

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
    const temp = [...comments];
    temp[id].content = e.target.value;
    setComments(temp);
  };
  const addComment = async (e) => {
    const targetValue = e.target.value;
    if (e.key === 'Enter') {
      if (targetValue) {
        const inqAns = {
          inquiry: question.id,
          confirm: false,
          type: 'REP'
        };
        const answer = {
          content: targetValue,
          type: question.ansType
        };
        const res = await saveComment({ inqAns, answer });
        setComments([
          ...comments,
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
      editComment(comments[id].answer, e.target.value);
      setEdit('');
    }
  };
  const onDelete = (id) => {
    deleteComment(comments[id].answer);
    const temp = [...comments];
    temp.splice(id, 1);
    setComments(temp);
    setAnchorEl(null);
  };
  const onEdit = (id) => {
    setEdit(id);
    setAnchorEl(null);
  };

  const contentUI = ({ userName, createdAt, avatar, content, media, id }) => {
    return (
      <>
        <div className="comment-detail" key={id}>
          <div className="flex justify-between">
            <UserInfo name={userName} time={displayTime(createdAt)} avatar={avatar} />
            {user.displayName === userName && key === id && (
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
          <div className={'content-reply'} style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
            {content}
          </div>
          <div className="attachment-reply">
            {media?.length > 0 &&
              media?.map((file, mediaIndex) => (
                <div style={{ position: 'relative', display: 'inline-block' }} key={mediaIndex}>
                  {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
                    <ImageAttach
                      file={file}
                      hiddenRemove={true}
                      indexInquiry={id}
                      style={{ margin: '2.5rem' }}
                    />
                  ) : (
                    <FileAttach hiddenRemove={true} file={file} indexInquiry={id} />
                  )}
                </div>
              ))}
          </div>
        </div>
        <Divider
          variant="fullWidth"
          style={{ height: 1, color: '#E2E6EA', margin: '14px 0', opacity: 0.6 }}
        />
      </>
    );
  };

  return (
    <div className={classes.root}>
      <div style={{ paddingTop: 10 }} className="flex justify-between">
        <UserInfo
          name={question.creator.userName}
          time={displayTime(question.createdAt)}
          avatar={question.creator.avatar}
        />
      </div>
      <Typography variant="h5">{question.name}</Typography>
      <Typography
        variant="h5"
        style={{
          wordBreak: 'break-word',
          fontFamily: 'Montserrat',
          fontSize: 15,
          color: '#132535',
          whiteSpace: 'pre-wrap'
        }}>
        {question.content}
      </Typography>
      <div style={{ display: 'block', margin: '1rem 0rem' }}>
        {question.ansType === metadata.ans_type.choice && (
          <ChoiceAnswer disable={true} question={question} />
        )}
        {question.ansType === metadata.ans_type.paragraph && (
          <ParagraphAnswer disable={true} question={question} />
        )}
      </div>
      <div className="comment">
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
      {question.mediaFile?.length > 0 &&
        question.mediaFile?.map((file, mediaIndex) => (
          <div style={{ position: 'relative', display: 'inline-block' }} key={mediaIndex}>
            {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
              <ImageAttach
                file={file}
                hiddenRemove={true}
                field={question.field}
                indexInquiry={0}
                style={{ margin: '2.5rem' }}
              />
            ) : (
              <FileAttach hiddenRemove={true} file={file} field={question.field} indexInquiry={0} />
            )}
          </div>
        ))}
      <Divider className="mt-12" />
      {answer && (
        <div style={{ paddingTop: '10px' }}>
          {contentUI({ ...answer })}
          <Divider className="mt-12" />
        </div>
      )}

      <div style={{ paddingTop: '10px' }}>
        {comments.map((k, id) => {
          return contentUI({
            userName: k.creator.userName,
            createdAt: k.createdAt,
            avatar: k.creator.avatar,
            content: k.content,
            media: k.answersMedia,
            id
          });
        })}
      </div>
    </div>
  );
};

export default Comment;
