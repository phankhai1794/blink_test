import React, { useState, useEffect, useRef } from 'react';
import TextInput from 'react-autocomplete-input';
import 'react-autocomplete-input/dist/bundle.css';
import { useDispatch, useSelector } from 'react-redux';

const TagsInput = ({ id, tagLimit, onChanged }) => {
  const [input, setInput] = useState('');
  const [tags, setTags] = useState([]);
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
    setTags([...tags, slug]);
    setInput('');
    textInput.current.refInput.current.focus();
  };
  
  const handleKeyUp = (e) => {
    if (e.key !== 'Enter') return setInput(e.target.value);
    onChanged(id, tags);
  };

  const handleBlur = (e) => {
    if (input && validateEmail(input.trim())) {
      setTags([...tags, input.trim()]);
      setInput('');
      e.target.value = '';
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((el, i) => i !== index));
    onChanged(id, tags);
  };

  return (
    <div className="tags-input-container">
      {tags.map((tag, index) => (
        <div className="tag-item" key={index}>
          <span className="text">{tag}</span>
          <span className="close" onClick={() => removeTag(index)}>
            &times;
          </span>
        </div>
      ))}
      <TextInput
        ref={textInput}
        Component="input"
        options={mails}
        trigger={['']}
        disabled={tags.length >= tagLimit}
        onKeyDown={handleKeyDown}
        changeOnSelect={changeOnSelect}
        onKeyUp={handleKeyUp}
        onBlur={handleBlur}
        defaultValue=""
        onChange={(value) => setInput(value.trim() === 'undefined' ? '' : value)}
        value={input}
        type="text"
        className="tags-input"
        placeholder={
          tags.length > 0
            ? tags.length < tagLimit
              ? 'Type email'
              : ''
            : 'Example: abc@gmail.com, ...'
        }
      />
    </div>
  );
};
export default TagsInput;
