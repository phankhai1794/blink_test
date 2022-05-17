import { saveComment, loadComment, editComment, deleteComment } from 'app/services/inquiryService';
import { getFile } from 'app/services/fileService';
import { displayTime } from '@shared';
import React, { useEffect, useState } from 'react';
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
  IconButton
} from '@material-ui/core';

import * as InquiryActions from '../store/actions/inquiry';
import InquiryEditor from '../admin/components/InquiryEditor';

import ChoiceAnswer from './ChoiceAnswer';
import ParagraphAnswer from './ParagraphAnswer';
import AttachmentAnswer from './AttachmentAnswer';
import ImageAttach from './ImageAttach';
import FileAttach from './FileAttach';
import UserInfo from './UserInfo';

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
  const user = useSelector(({ user }) => user);
  const open = Boolean(anchorEl);
  useEffect(() => {
    loadComment(q.id)
      .then((res) => {
        dispatch(InquiryActions.setDisplayComment(Boolean(res.length || userType === 'guest')));
        setComment(res);
      })
      .catch((error) => console.log(error));
  }, [currentField]);
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
              <input
                placeholder="Comment here"
                style={inputStyle}
                onKeyPress={(e) => onEnterComment(e, id)}
                value={k.content}
                onChange={(e) => changeComment(e, id)}
              />
            ) : (
              <>
                <div
                  className="flex justify-between"
                  onMouseEnter={() => setKey(id)}
                  onMouseLeave={() => setKey('')}
                >
                  <UserInfo name={k.creator} time={displayTime(k.createdAt)} />
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
                        keepMounted
                      >
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
                <Typography variant="h5">{k.content}</Typography>{' '}
              </>
            )}
          </div>
        );
      })}
      {reply && (
        <input
          placeholder="Comment here"
          style={inputStyle}
          onKeyPress={addComment}
          value={value}
          onChange={changeValue}
        />
      )}
    </>
  );
};

const Inquiry = (props) => {
  const dispatch = useDispatch();
  const { user } = props;
  const [inquiries, currentField, metadata] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.inquiries,
    workspace.inquiryReducer.currentField,
    workspace.inquiryReducer.metadata
  ]);
  const inquiry = inquiries.filter((q) => q.field === currentField);
  const indexes = inquiries.findIndex((q) => q.field === currentField);
  const [edit, setEdit] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
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
    if (inquiry[0] && inquiry[0].mediaFile.length && !inquiry[0].mediaFile[0].src) {
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
          .catch((error) => console.log(error));
      }
    }
  }, [currentField]);
  return (
    <>
      {inquiry.map((q, index) => {
        const type = q.ansType;
        const username = q.creator;
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
                  <UserInfo name={username} time={displayTime(q.createdAt)} />
                  {user === 'workspace' && (
                    <IconButton onClick={handleClick}>
                      <MoreVertIcon />
                    </IconButton>
                  )}
                  <Menu
                    id="customized-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    keepMounted
                  >
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
                      // disabled={true}
                    />
                  )}
                </div>
                {q.mediaFile.map((file, index) =>
                  file.ext.match(/jpeg|jpg|png/g) ? (
                    <ImageAttach src={file.src} style={{ margin: '1rem' }} />
                  ) : (
                    <FileAttach file={file} />
                  )
                )}
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
