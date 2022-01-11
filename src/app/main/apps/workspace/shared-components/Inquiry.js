import React, { useState } from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import EditIcon from '@material-ui/icons/Edit';
import ChoiceAnswer from './ChoiceAnswer';
import ParagraphAnswer from './ParagraphAnswer';
import AttatchmentAnswer from './AttatchmentAnswer';
import UserInfo from './UserInfo';
import { Menu, MenuItem, ListItemIcon, ListItemText, IconButton } from '@material-ui/core';

const Inquiry = (props) => {
  const { mockQuestion, forCustomer } = props;
  const { question } = mockQuestion;
  const [anchorEl, setAnchorEl] = useState(null);
  const onSaveSelectedChoice = (savedQuestion) => {
    props.onSaveSelectedChoice(savedQuestion);
  };
  return (
    <>
      <div className="flex justify-between">
        <div>
          <UserInfo name="Andrew" date="Today" time="10:45PM" />
        </div>
        {!forCustomer && (
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MoreVertIcon />
          </IconButton>
        )}
        <Menu
          id="customized-menu"
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          keepMounted
        >
          <MenuItem onClick={() => props.toggleEdit(true)}>
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
      <div style={{ width: '100%', height: '100%' }}>
        <h2>{question.name}</h2>
        <div style={{ display: 'block', margin: '1rem 0rem' }}>
          {question.answerType === 'CHOICE ANSWER' && (
            <ChoiceAnswer question={question} onSaveSelectedChoice={onSaveSelectedChoice} />
          )}
          {question.answerType === 'PARAGRAPH ANSWER' && (
            <ParagraphAnswer question={question} onSaveSelectedChoice={onSaveSelectedChoice} />
          )}
          {question.answerType === 'ATTACHMENT ANSWER' && (
            <AttatchmentAnswer
              question={question}
              onSaveSelectedChoice={onSaveSelectedChoice}
              // disabled={true}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Inquiry;
