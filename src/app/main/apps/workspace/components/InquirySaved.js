

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton
} from '@material-ui/core';

import * as Actions from '../store/actions';

import AllInquiry from './AllInquiry';
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
  const { q, inquiries, indexes } = props;
  const [value, setValue] = useState('');
  const [key, setKey] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [edit, setEdit] = useState('');
  const reply = useSelector((state) => state.workspace.inquiryReducer.reply);
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const changeValue = (e) => {
    setValue(e.target.value);
  };
  const changeValue1 = (e, id) => {
    var optionsOfQuestion = [...inquiries];
    optionsOfQuestion[indexes].reply[id] = e.target.value;
    dispatch(Actions.editInquiry(optionsOfQuestion));
  };
  const addComment = (e) => {
    if (e.key === 'Enter') {
      var optionsOfQuestion = [...inquiries];
      var list = [];
      if ('reply' in optionsOfQuestion[indexes]) {
        list = optionsOfQuestion[indexes].reply;
      }
      if (e.target.value) {
        list.push(e.target.value);
      }
      optionsOfQuestion[indexes].reply = list;
      dispatch(Actions.editInquiry(optionsOfQuestion));
      setValue('');
    }
  };

  const editComment = (e, id) => {
    if (e.key === 'Enter') {
      var optionsOfQuestion = [...inquiries];
      optionsOfQuestion[indexes].reply[id] = e.target.value;
      dispatch(Actions.editInquiry(optionsOfQuestion));
      setEdit('');
    }
  };
  const onDelete = (id) => {
    var optionsOfQuestion = [...inquiries];
    optionsOfQuestion[indexes].reply.splice(id, 1);
    dispatch(Actions.editInquiry(optionsOfQuestion));
    setAnchorEl(null);
  };
  const onEdit = (id) => {
    setEdit(id);
    setAnchorEl(null);
  };
  return (
    <>
      {q.reply !== undefined &&
        q.reply.map((k, id) => (
          <div style={{ marginBottom: '20px' }} key={id}>
            {edit === id ? (
              <input
                placeholder="Comment here"
                style={inputStyle}
                onKeyPress={(e) => editComment(e, id)}
                value={k}
                onChange={(e) => changeValue1(e, id)}
              />
            ) : (
              <>
                <div
                  className="flex justify-between"
                  onMouseEnter={() => setKey(id)}
                  onMouseLeave={() => setKey('')}
                >
                  <UserInfo name="Carl" date="Today" time="10:48PM" />
                  {key === id && (
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
                <Typography variant="h5">{k}</Typography>{' '}
              </>
            )}
          </div>
        ))}
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

const InquirySaved = (props) => {
  const dispatch = useDispatch();
  const { user } = props;
  const state = useSelector((state) => state[user]);
  const [inquiries] = useSelector((state) => [state[user].inquiryReducer.inquiries]);
  const question = inquiries;
  const [edit, setEdit] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  return (
    <>
      {question.map((q, index) => {
        const type = q.ansType;
        return (
          <>
            <AllInquiry
              index={1}
              questions={inquiries}
              question={q}
              saveQuestion={(q) => dispatch(Actions.editInquiry(q))}
            />
          </>
        );
      })}
    </>
  );
};

export default InquirySaved;
