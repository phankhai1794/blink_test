import React, {useEffect, useState} from 'react';
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
import { Menu, MenuItem, ListItemIcon, Card, ListItemText, Typography, IconButton } from '@material-ui/core';

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
  const {q, questionSaved, indexes} = props
  const [value, setValue] = useState("")
  const [key, setKey] = useState()
  const [anchorEl, setAnchorEl] = useState(null);
  const [edit, setEdit] = useState("")
  const reply = useSelector((state) => state.workspace.reply)
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
 
  const changeValue = (e) => {
    setValue(e.target.value)
  }
  const changeValue1 = (e, id) => {
    var optionsOfQuestion = [...questionSaved];
    optionsOfQuestion[indexes].reply[id] = e.target.value
    dispatch((Actions.editQuestion(optionsOfQuestion)))
  }
  const addComment = (e) => {
    if(e.key === "Enter"){
      var optionsOfQuestion = [...questionSaved];
      var list = []
      if ('reply' in optionsOfQuestion[indexes]) {
        list = optionsOfQuestion[indexes].reply
      }
      if (e.target.value) {
        list.push(e.target.value)
      }
      optionsOfQuestion[indexes].reply = list
      dispatch((Actions.editQuestion(optionsOfQuestion)))
      setValue("")
   }
  }
  
  const editComment = (e, id) => {
    if(e.key === "Enter"){
      var optionsOfQuestion = [...questionSaved];
      optionsOfQuestion[indexes].reply[id] = e.target.value
      dispatch((Actions.editQuestion(optionsOfQuestion)))
      setEdit("")
   }
  }
  const onDelete = (id) => {
    var optionsOfQuestion = [...questionSaved];
    optionsOfQuestion[indexes].reply.splice(id, 1)
    dispatch((Actions.editQuestion(optionsOfQuestion)))
    setAnchorEl(null);
  }
  const onEdit = (id) => {
    setEdit(id) 
    setAnchorEl(null)
  }
  return (
    <>
      {q.reply !== undefined && q.reply.map((k,id) => (
        <div style={{marginBottom: "20px"}}>
        {edit === id ?
          <input 
            placeholder="Comment here"
            style={inputStyle} 
            onKeyPress={(e) => editComment(e,id)} 
            value={k} 
            onChange={(e) => changeValue1(e, id)} />
            :
         <>
          <div className="flex justify-between" onMouseEnter={() => setKey(id)} onMouseLeave={() => setKey("")}>
            <UserInfo name="Carl" date="Today" time="10:48PM" />
            {key === id &&
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
          <Typography variant="h5">{k}</Typography> </> 
        }
        </div>
      ))}
      {reply &&  
        <input 
          placeholder="Comment here"
          style={inputStyle} 
          onKeyPress={addComment} 
          value={value} 
          onChange={changeValue}   />
      }
    </>
  )
}

const InquiryCreated = (props) => {
  const dispatch = useDispatch()
  const {user} = props
  const state = useSelector((state) =>  state[user])
  const [questionSaved, currentField] = useSelector((state) =>  [state[user].questionSaved, state[user].currentField]) 
  const question = questionSaved.filter((q) =>  q.field === currentField)
  const indexes = questionSaved.findIndex((q) => q.field === currentField)
  const [edit, setEdit] = useState("")
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  console.log("State: ",state)
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
        const type = q.answerType
       return (
        <>
          {edit === index ? 
            <InquiryEditor 
              index={indexes} 
              questions={questionSaved} 
              question={q} 
              saveQuestion={(q) => dispatch((Actions.editQuestion(q)))} 
            /> :
            <Card style={{ padding: '1rem ', marginBottom: '24px' }}>
                <div className="flex justify-between">
                    <UserInfo name="Andrew" date="Today" time="10:45PM" />
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
            <Typography variant="h5">{q.name}</Typography>
              <div style={{ display: 'block', margin: '1rem 0rem' }}>
                {type === 'CHOICE ANSWER' && (
                  <ChoiceAnswer question={q}  />
                )}
                {type === 'PARAGRAPH ANSWER' && (
                  <ParagraphAnswer question={q}  />
                )}
                {type === 'ATTACHMENT ANSWER' && (
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
              <Comment q={q} questionSaved={questionSaved} indexes={indexes}/>
          </Card> } 
        </>)})
        }
    
    </>
  );
};

export default InquiryCreated;
