import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../admin/store/actions';
import ChoiceAnswer from './ChoiceAnswer';
import ParagraphAnswer from './ParagraphAnswer';
import AttatchmentAnswer from './AttatchmentAnswer';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import InquiryEditor from '../admin/components/InquiryEditor';
import ImageAttach from './ImageAttach';
import FileAttach from './FileAttach';
import EditIcon from '@material-ui/icons/Edit';
import UserInfo from './UserInfo';
import { saveComment, loadComment, editComment, deleteComment } from '../api/inquiry';
import { displayTime } from '../shared-functions';
import { Menu, MenuItem, ListItemIcon, Card, ListItemText, Typography, IconButton } from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';

const Comment = (props) => {
  const inputStyle = {
    borderRadius: "18px",
    padding: "10px",
    borderStyle: "none",
    backgroundColor: "#f0f2f5",
    fontSize: "17px",
    width: "97%"
  };
  const dispatch = useDispatch()
  const { q, inquiries, indexes } = props
  const [value, setValue] = useState("")
  const [key, setKey] = useState()
  const [comment, setComment] = useState([])
  const [anchorEl, setAnchorEl] = useState(null);
  const [edit, setEdit] = useState("")
  const [reply, user] = useSelector((state) => [state.workspace.reply, state.auth.user])
  const open = Boolean(anchorEl);
  useEffect(() => {
    loadComment(q.id).then((res) => {
      setComment(res)
    }).catch(error => console.log(error))
  }, [])
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const changeValue = (e) => {
    setValue(e.target.value)
  }
  const changeComment = (e, id) => {
    var temp = [...comment];
    temp[id].answer_TB_ANSWER.content = e.target.value
    setComment(temp)
  }
  const addComment = (e) => {
    if (e.key === "Enter") {
      if (e.target.value) {
        const ans_id = uuidv4()
        const inqAns = {
          inquiry: q.id,
          answer: ans_id,
          confirm: false,
          type: 'REP',
        }
        const answer = {
          id: ans_id,
          content: e.target.value,
          type: q.ansType,
        }
        saveComment({ inqAns, answer })
        setComment([...comment, {
          answer: ans_id,
          createdAt: new Date(),
          answer_TB_ANSWER: {
            content: e.target.value
          },
          createdBy_TB_ACCOUNT: {
            userName: user.displayName
          }
        }])
      }
      setValue("")
    }
  }

  const onEnterComment = (e, id) => {
    if (e.key === "Enter") {
      editComment(comment[id].answer, e.target.value)
      setEdit("")
    }
  }
  const onDelete = (id) => {
    deleteComment(comment[id].answer)
    var temp = [...comment];
    temp.splice(id, 1)
    setComment(temp)
    setAnchorEl(null);
  }
  const onEdit = (id) => {
    setEdit(id)
    setAnchorEl(null)
  }
  return (
    <>
      {comment.map((k, id) => {
        const content = k.answer_TB_ANSWER.content
        const username = k.createdBy_TB_ACCOUNT.userName
        const time = k.createdAt
        return (
          <div style={{ marginBottom: "20px" }}>
            {edit === id ?
              <input
                placeholder="Comment here"
                style={inputStyle}
                onKeyPress={(e) => onEnterComment(e, id)}
                value={content}
                onChange={(e) => changeComment(e, id)} />
              :
              <>
                <div className="flex justify-between" onMouseEnter={() => setKey(id)} onMouseLeave={() => setKey("")}>
                  <UserInfo name={username} time={displayTime(time)} />
                  {user.username === username && key === id &&
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
                  }
                </div>
                <Typography variant="h5">{content}</Typography> </>
            }
          </div>
        )
      })}
      {reply &&
        <input
          placeholder="Comment here"
          style={inputStyle}
          onKeyPress={addComment}
          value={value}
          onChange={changeValue} />
      }
    </>
  )
}

const InquiryCreated = (props) => {
  const dispatch = useDispatch()
  const { user } = props
  const [inquiries, currentField, metadata] = useSelector((state) => [
    state[user].inquiries,
    state[user].currentField,
    state[user].metadata
  ])
  const question = inquiries.filter((q) => q.field === currentField)
  const indexes = inquiries.findIndex((q) => q.field === currentField)
  const [edit, setEdit] = useState("")
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleEdit = (id) => {
    setEdit(id)
  }
  return (
    <>
      {question.map((q, index) => {
        const type = q.ansType
        const username = q.createdBy_TB_ACCOUNT.userName
        return (
          <>
            {edit === index ?
              <InquiryEditor
                index={indexes}
                questions={inquiries}
                question={q}
                saveQuestion={(q) => dispatch((Actions.editInquiry(q)))}
              /> :
              <Card style={{ width: '770px', padding: '1rem ', marginBottom: '24px' }}>
                <div className="flex justify-between">
                  <UserInfo name={username} time={displayTime(q.createdAt)} />
                  {user === 'workspace' &&
                    <IconButton onClick={handleClick}>
                      <MoreVertIcon />
                    </IconButton>
                  }
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
                    <ChoiceAnswer question={q} />
                  )}
                  {type === metadata.ans_type.paragraph && (
                    <ParagraphAnswer question={q} />
                  )}
                  {type === metadata.ans_type.attachment && (
                    <AttatchmentAnswer
                      question={q}
                    // disabled={true}
                    />
                  )}
                </div>
                {q.files && (
                  q.files.map((file, index) => (
                    file.type.includes("image") ?
                      <ImageAttach src={file.src} style={{ margin: '1rem' }} /> : <FileAttach file={file} />
                  ))
                )}
                <Comment q={q} inquiries={inquiries} indexes={indexes} />
              </Card>}
          </>)
      })
      }

    </>
  );
};

export default InquiryCreated;
