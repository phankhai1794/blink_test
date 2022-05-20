import React, { useState } from 'react';

const TagsInput = ({ id, tagLimit, onChanged }) => {
  const [input, setInput] = useState('');
  const [tags, setTags] = useState([]);

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

  const handleKeyUp = (e) => {
    if (e.key !== 'Enter') return setInput(e.target.value);
    onChanged(id, tags);
  };

  const handleBlur = (e) => {
    if (input !== '' && validateEmail(input)) {
      setTags([...tags, input]);
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
      <input
        disabled={tags.length >= tagLimit}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onBlur={handleBlur}
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
