import React, { useState, useEffect, useRef } from 'react';
import TextInput from 'react-autocomplete-input';
import 'react-autocomplete-input/dist/bundle.css';
import { makeStyles } from '@material-ui/styles';
import { useDispatch, useSelector } from 'react-redux';

import * as MailActions from '../store/actions/mail';

const TagsInput = ({ id, tagLimit, type, isCc, isBcc, onChanged, onCc, onBcc }) => {
  const dispatch = useDispatch();
  const [isFocus, setIsFocus] = useState(false);
  const textInput = useRef(null);

  const suggestMails = useSelector(({ workspace }) => workspace.mailReducer.suggestMails);
  const validateMail = useSelector(({ workspace }) => workspace.mailReducer.validateMail);
  const _tags = useSelector(({ workspace }) => workspace.mailReducer.tags);
  const tags = _tags[id] || []
  const input = validateMail[id]

  const validateEmail = (email) => {
    const regexp =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(email);
  };

  const handleChange = (value) => {
    dispatch(MailActions.validateMail({ ...validateMail, [id]: value.trim() === 'undefined' ? '' : value }))
  }

  const handleKeyDown = (e) => {
    if (['Enter', 'Tab'].includes(e.key)) {
      const { value } = e.target;
      if (value !== '') {
        e.preventDefault();
        if (!validateEmail(value)) return alert('Please enter a valid email address');
        dispatch(MailActions.validateMail({ ...validateMail, [id]: '' }))
        dispatch(MailActions.setTags({ ..._tags, [id]: [...tags, value] }))
        e.target.value = '';
      }
    }
  };

  const changeOnSelect = (trigger, slug) => {
    const newTags = [...tags, slug]
    dispatch(MailActions.setTags({ ..._tags, [id]: newTags }))
    onChanged(id, newTags);
    dispatch(MailActions.validateMail({ ...validateMail, [id]: '' }))
    textInput.current.refInput.current.focus();
  };

  const handleKeyUp = (e) => {
    if (!['Enter', 'Tab'].includes(e.key)) return dispatch(MailActions.validateMail({ ...validateMail, [id]: e.target.value }));
    onChanged(id, tags);
  };

  const handleBlur = (e) => {
    if (input && validateEmail(input.trim())) {
      const newTags = [...tags, input.trim()]
      onChanged(id, newTags);
      dispatch(MailActions.setTags({ ..._tags, [id]: newTags }))
      dispatch(MailActions.validateMail({ ...validateMail, [id]: '' }))
    }
    setIsFocus(false);
  };

  const removeTag = (index) => {
    const newTags = tags.filter((el, i) => i !== index)
    dispatch(MailActions.setTags({ ..._tags, [id]: newTags }))
    onChanged(id, newTags);
  };

  const useStyles = makeStyles((theme) => ({
    buttonCcBcc: {
      paddingLeft: '7px',
      paddingRight: '7px',
      background: '#FFFFFF',
      border: '1px solid #BD0F72',
      borderRadius: '4px',
      justifyContent: 'center'
    },
    buttonCcBccDisable: {
      paddingLeft: '7px',
      paddingRight: '7px',
      background: '#FFFFFF',
      border: '1px solid #BAC3CB',
      borderRadius: '4px',
      justifyContent: 'center'
    },
    buttonText: {
      fontStyle: 'normal',
      fontWeight: '500',
      fontSize: '14px',
      lineHeight: '17px',
      width: '100%',
      color: '#BD0F72'
    }
  }));
  const classes = useStyles();

  const getTagsShow = (tags) => {
    let tagsShow = [];
    let length = 0;
    for (const tag of tags) {
      if(tag.length + length > 66){
        break;
      }
      tagsShow.push(tag);
      length += tag.length;
      length +=10;

    }
    return tagsShow;
  };

  return (
    <div className="tags-input-container" style={{paddingRight: (type=='Cc'||type=='Bcc')? '0px' : '90px',}} onFocus={() => setIsFocus(true)}>
      {type !== 'Cc' && type !== 'Bcc' && <div style={{
        position: 'absolute',
        paddingLeft: '7px',
        paddingRight: '7px',
        right: '5px',
        top: '5px',
        display: 'flex',
        flexDirection: 'row'
      }}>
        <button className={classes.buttonCcBcc} style={{ border: isCc ? '1px solid #BAC3CB' : '1px solid #BD0F72' }} disabled={isCc} onClick={onCc}>
          <span className={classes.buttonText} style={{ color: isCc ? '#BAC3CB' : '#BD0F72' }}>Cc</span>
        </button>
        <div style={{ width: '2px' }} />
        <button className={classes.buttonCcBcc} style={{ border: isBcc ? '1px solid #BAC3CB' : '1px solid #BD0F72' }} disabled={isBcc} onClick={onBcc}>
          <span className={classes.buttonText} style={{ color: isBcc ? '#BAC3CB' : '#BD0F72' }}>Bcc</span>
        </button>
      </div>
      }
      {(!isFocus? getTagsShow(tags):tags).map((tag, index) => (
        <div className="tag-item" key={index}>
          <span className="text">{tag}</span>
          <span className="close" onClick={() => removeTag(index)}>
              &times;
          </span>
        </div>
      ))}
      {
        !isFocus &&tags.length>getTagsShow(tags).length&& <div style={{backgroundColor: '#00000008', padding:'3px', borderRadius: '4px'}}>
          <span style={{width: '100%', color: '#515e6a'}}>+{tags.length - getTagsShow(tags).length}</span>
        </div>
      }
      <div style={{flex: 'auto', display: 'inline-block'}}>
        <TextInput
          style={{ flex: 'auto' }}
          ref={textInput}
          Component="input"
          options={suggestMails}
          trigger={['']}
          disabled={tags.length >= tagLimit}
          onKeyDown={handleKeyDown}
          changeOnSelect={changeOnSelect}
          onKeyUp={handleKeyUp}
          onBlur={handleBlur}
          onFocus={() => setIsFocus(true)}
          defaultValue=""
          onChange={handleChange}
          value={input}
          type="text"
          className="tags-input"
          placeholder={
            tags.length > 0
              ? tags.length < tagLimit
                ? 'Enter your email'
                : ''
              : 'Enter your email'
          }
        />
      </div>
    </div>
  );
};
export default TagsInput;
