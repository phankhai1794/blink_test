import React, { useState, useEffect, useRef } from 'react';
import TextInput from 'react-autocomplete-input';
import 'react-autocomplete-input/dist/bundle.css';
import { makeStyles } from '@material-ui/styles';
import { useDispatch, useSelector } from 'react-redux';

const TagsInput = ({ id, tagLimit, type, isCc, isBcc, onChanged, onCc, onBcc }) => {
  const [input, setInput] = useState('');
  const [tags, setTags] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const textInput = useRef(null);

  const [mails] = useSelector(({ workspace }) => [workspace.mailReducer.mails]);

  const validateEmail = (email) => {
    const regexp =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(email);
  };

  const handleKeyDown = (e) => {
    if (['Enter', 'Tab'].includes(e.key)) {
      const { value } = e.target;
      if (value !== '') {
        e.preventDefault();
        if (!validateEmail(value)) return alert('Please enter a valid email address');

        setTags([...tags, value]);
        setInput('');
        e.target.value = '';
      }
    }
  };

  const changeOnSelect = (trigger, slug) => {
    const newTags = [...tags, slug]
    setTags(newTags);
    onChanged(id, newTags);
    setInput('');
    textInput.current.refInput.current.focus();
  };
  
  const handleKeyUp = (e) => {
    if (!['Enter', 'Tab'].includes(e.key)) return setInput(e.target.value);
    onChanged(id, tags);
  };

  const handleBlur = (e) => {
    if (input && validateEmail(input.trim())) {
      const newTags = [...tags, input.trim()]
      onChanged(id, newTags);
      setTags(newTags);
      setInput('');
    }
    setIsFocus(false);
  };

  const removeTag = (index) => {
    setTags(tags.filter((el, i) => i !== index));
    onChanged(id, tags);
  };
  
  const useStyles = makeStyles((theme) => ({
    buttonCcBcc: 
      {
        paddingLeft: '7px',
        paddingRight: '7px',
        background: '#FFFFFF',
        border: '1px solid #BD0F72',
        borderRadius: '4px',
        justifyContent: 'center'
      },
    buttonCcBccDisable: 
      {
        paddingLeft: '7px',
        paddingRight: '7px',
        background: '#FFFFFF',
        border: '1px solid #BAC3CB',
        borderRadius: '4px',
        justifyContent: 'center'
      },
    buttonText:{
      fontStyle: 'normal',
      fontWeight: '500',
      fontSize: '14px',
      lineHeight: '17px',
      width: '100%',
      color: '#BD0F72'
    }
  }));
  const classes = useStyles();

  return (
    <div className="tags-input-container" onFocus={() => setIsFocus(true)}>
      {type !== 'Cc'&& type !== 'Bcc'&&<div style={{position: 'absolute',
        paddingLeft: '7px',
        paddingRight: '7px',
        right: '5px',
        top: '5px',
        display: 'flex',
        flexDirection: 'row'}}>
        <button className={classes.buttonCcBcc} style={{border: isCc? '1px solid #BAC3CB': '1px solid #BD0F72'}} disabled={isCc} onClick={onCc}>
          <span className={classes.buttonText} style={{color: isCc?'#BAC3CB': '#BD0F72'}}>Cc</span>
        </button>
        <div style={{width: '2px'}}/>
        <button className={classes.buttonCcBcc} style={{border: isBcc? '1px solid #BAC3CB': '1px solid #BD0F72'}} disabled={isBcc} onClick={onBcc}>
          <span className={classes.buttonText} style={{color: isBcc?'#BAC3CB': '#BD0F72'}}>Bcc</span>
        </button>
      </div>
      }
      {(!isFocus? tags.slice(0,3):tags).map((tag, index) => (
        <div className="tag-item" key={index}>
          <span className="text">{tag}</span>
          <span className="close" onClick={() => removeTag(index)}>
            &times;
          </span>
        </div>
      ))}
      {
        !isFocus &&tags.length>3&& <div style={{backgroundColor: '#00000008', padding:'3px', borderRadius: '4px'}}>
          <span style={{width: '100%', color: '#515e6a'}}>+{tags.length - 3}</span>
        </div>
      }
      <div style={{flex: 'auto', display: 'inline-block', marginRight: (type=='Cc'||type=='Bcc')? '0px' : '90px',}}>
        <TextInput
          style={{flex: 'auto'}}
          ref={textInput}
          Component="input"
          options={mails}
          trigger={['']}
          disabled={tags.length >= tagLimit}
          onKeyDown={handleKeyDown}
          changeOnSelect={changeOnSelect}
          onKeyUp={handleKeyUp}
          onBlur={handleBlur}
          onFocus={() => setIsFocus(true)}
          defaultValue=""
          onChange={(value) => setInput(value.trim() === 'undefined' ? '' : value)}
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
