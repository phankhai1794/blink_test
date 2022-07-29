import {
  saveComment,
  loadComment,
  editComment,
  deleteComment,
} from 'app/services/inquiryService';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  TextField,
} from '@material-ui/core';
import { displayTime } from '@shared';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';
import { withStyles } from '@material-ui/core/styles';

import * as InquiryActions from '../store/actions/inquiry';

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
                  onMouseLeave={() => setKey('')}>
                  <UserInfo
                    name={k.creator.userName}
                    time={displayTime(k.createdAt)}
                    avatar={k.creator.avatar}
                  />
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
                <Typography variant="h5" style={{ wordBreak: 'break-word' }}>
                  {k.content}
                </Typography>
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

export default Comment;
