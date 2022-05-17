import React from 'react';
import { useState } from 'react';
function TagsInput(props) {
  const [tags, setTags] = useState([]);
  const { id , tagLimit} = props;

  function handleKeyDown(e) {
    if (e.key !== 'Enter') return;
    const value = e.target.value;
    if (!value.trim()) return;
    if(!validateEmail(value)){
      alert('Please enter a valid email address');
      return;
    }
    setTags([...tags, value]);
    e.target.value = '';
  }
  function validateEmail (email) {
  const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regexp.test(email);
}
  function handleKeyUp(e) {
    if (e.key !== 'Enter') return;
    props.onChanged(id, tags);
  }
  function removeTag(index) {
    setTags(tags.filter((el, i) => i !== index));
    props.onChanged(id, tags);
  }

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
        type="text"
        className="tags-input"
        placeholder={tags.length> 0? (tags.length< tagLimit?'Type email':"") :'Example: abc@gmail.com, ...'}
      />
    </div>
  );
}
export default TagsInput;
