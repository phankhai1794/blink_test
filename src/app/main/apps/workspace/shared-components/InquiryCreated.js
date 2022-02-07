import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../admin/store/actions';
import ChoiceAnswer from './ChoiceAnswer';
import ParagraphAnswer from './ParagraphAnswer';
import AttatchmentAnswer from './AttatchmentAnswer';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import InquiryEditor from '../admin/components/InquiryEditor';
import EditIcon from '@material-ui/icons/Edit';
import UserInfo from './UserInfo';
import { Menu, MenuItem, ListItemIcon, Card, ListItemText, Typography, IconButton } from '@material-ui/core';

const InquiryCreated = (props) => {
  const dispatch = useDispatch()
  const [openEdit,questionSaved, currentField] = useSelector((state) => 
  [state.workspace.openEdit, state.workspace.questionSaved, state.workspace.currentField])
  const question = questionSaved.filter((q) =>  q.field === currentField)
  const indexes = questionSaved.findIndex((q) => q.field === currentField)

  const [edit, setEdit] = useState("")
  const onSaveSelectedChoice = (savedQuestion) => {
    props.onSaveSelectedChoice(savedQuestion);
  };
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
      {question.map(q => {
        const type = q.answerType
       return (
        <>
          {edit === q.id ? <InquiryEditor index={indexes[edit]} questions={questionSaved} question={q} saveQuestion={(q) => dispatch((Actions.editQuestion(q)))} /> :
            <Card style={{ padding: '1rem ' }}>
                <div className="flex justify-between">
                    <UserInfo name="Andrew" date="Today" time="10:45PM" />
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
                      <MenuItem onClick={() => toggleEdit(q.id)}>
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
                  <ChoiceAnswer question={q} onSaveSelectedChoice={onSaveSelectedChoice} />
                )}
                {type === 'PARAGRAPH ANSWER' && (
                  <ParagraphAnswer question={q} onSaveSelectedChoice={onSaveSelectedChoice} />
                )}
                {type === 'ATTACHMENT ANSWER' && (
                  <AttatchmentAnswer
                    question={q}
                    onSaveSelectedChoice={onSaveSelectedChoice}
                    // disabled={true}
                  />
                )}
              </div>
          </Card> } 
        </>)})
        }
    
    </>
  );
};

export default InquiryCreated;
