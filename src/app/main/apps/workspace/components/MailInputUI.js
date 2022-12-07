import React, { useState, useRef, useEffect } from 'react';
import ReactTags from 'react-tag-autocomplete'
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { matchSorter } from "match-sorter";

import * as MailActions from '../store/actions/mail';
const useStyles = makeStyles(() => ({
  label: {
    whiteSpace: 'nowrap',
    color: '#132535',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Montserrat'
  },
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
}))

const InputUI = ({ id, onChanged, tab }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [inputFocus, setInputFocus] = useState(false);
  const [checkFocus, setCheckFocus] = useState(false);

  const [ctrlA, setCtrlA] = useState(false)
  const [isCc, setIsCc] = useState(false);
  const [isBcc, setIsBcc] = useState(false);
  const textInput = useRef(null);
  const ref = useRef(null);

  const suggestMails = useSelector(({ workspace }) => workspace.mailReducer.suggestMails);
  const validateMail = useSelector(({ workspace }) => workspace.mailReducer.validateMail);
  const tags = useSelector(({ workspace }) => workspace.mailReducer.tags);

  const onCc = (value) => setIsCc(value);

  const onBcc = (value) => setIsBcc(value);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setInputFocus(false);
        dispatch(MailActions.validateMail({ ...validateMail, [`to${id}Cc`]: '', [`to${id}Bcc`]: '', [`to${id}`]: '' }));

        if (isCc && !validateMail[`to${id}Cc`] && !tags[`to${id}Cc`].length) {
          onCc(false);
        }
        if (isBcc && !validateMail[`to${id}Bcc`] && !tags[`to${id}Bcc`].length) {
          onBcc(false);
        }
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, validateMail, tags]);

  const validateEmail = (tag) => {
    const regexp =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(tag);
  };

  const convertObject = (list) => {
    return list.map((name, id) => ({ id, name }))
  }

  useEffect(() => {
    if (isCc) document.getElementById(`to${id}Cc`).focus();
  }, [isCc]);

  useEffect(() => {
    if (isBcc) document.getElementById(`to${id}Bcc`).focus();
  }, [isBcc]);

  useEffect(() => {
    if (checkFocus) document.getElementById(`to${id}`).focus();
  }, [checkFocus]);

  const validateListEmail = (id, e) => {
    e.preventDefault()
    const result = []
    let temp = ''
    const removeDuplicate = [...new Set(e.clipboardData.getData('text').split(/,|;|\n/).map(str => str.trim()))]
    removeDuplicate.forEach(v => {
      if (validateEmail(v)) {
        result.push(v)
      }
      else if (v) {
        temp += v + ','
      }
    })
    if (result.length) {
      dispatch(MailActions.setTags({ ...tags, [id]: [...new Set([...tags[id], ...result])] }));
      dispatch(MailActions.validateMail({ ...validateMail, [id]: temp.slice(0, -1) }))
      textInput.current.state.query = temp
    }
  }
  const onDelete = (id, tagIndex) => {
    const newTags = ctrlA ? [] : tags[id].filter((_, i) => i !== tagIndex);
    dispatch(MailActions.setTags({ ...tags, [id]: newTags }));
    onChanged(id, newTags);
  }

  const onAddition = (id, newTag) => {
    const newTags = [...new Set([...tags[id], newTag.name])];
    dispatch(MailActions.validateMail({ ...validateMail, [id]: '' }));
    dispatch(MailActions.setTags({ ...tags, [id]: newTags }));
    onChanged(id, newTags);
  }

  const onInput = (id, value) => {
    setCtrlA(false);
    dispatch(MailActions.validateMail({ ...validateMail, [id]: value }));
  }

  const handleKeyDown = (id, e) => {
    if (!validateMail[id] && e.key === 'a' && e.ctrlKey) setCtrlA(true);
  }


  const handleBlur = (id) => {
    const input = validateMail[id]
    if (input && validateEmail(input.trim())) {
      const newTags = [...new Set([...tags[id], input.trim()])];
      onChanged(id, newTags);
      dispatch(MailActions.setTags({ ...tags, [id]: newTags }));
      dispatch(MailActions.validateMail({ ...validateMail, [id]: '' }));
      textInput.current.state.query = '';
    }
    setCtrlA(false);
    setCheckFocus(false);
  };

  const limitTags = (tags) => {
    if (!inputFocus && tags.length > 3) {
      let tagsShow = tags.slice(0, 3);
      tagsShow.push(`+${tags.length - 3}`);
      return convertObject(tagsShow);
    }
    return convertObject(tags);
  };

  const toReceiver = (id) => {
    const length = 3;
    const size = tags[`to${id}`].length;
    const ccSize = tags[`to${id}Cc`].length;
    const bccSize = tags[`to${id}Bcc`].length;
    const arr = [...tags[`to${id}`], ...tags[`to${id}Cc`]];
    if (size + ccSize >= length) {
      const total = arr.length + bccSize - length;
      let text = "";
      if (arr.length - length) {
        text += `${total} more`;
      }
      if (bccSize) {
        text += arr.length - length ? ` (${bccSize} Bcc)` : `${bccSize} Bcc`;
      }
      return [arr.slice(0, length).join(', '), text];
    }
    else {
      let text = "";
      let arg = arr.join(', ');
      if (bccSize) {
        if (arg) arg += ', ';
        arg += `Bcc: ${tags[`to${id}Bcc`].slice(0, length - arr.length)}`;
        if (arr.length + bccSize > length) {
          text += `${bccSize - length + arr.length} Bcc`;
        }
      }
      return [arg, text];
    }
  }

  const TagsInput = (id, type) => {
    return (
      <Grid
        container
        direction="row"
        style={{ alignItems: 'center', justifyContent: "flex-start", marginTop: 10 }}>
        <Grid item xs={1}>
          {type === 'Cc' || type === 'Bcc' ? (
            <div
              style={{
                paddingLeft: '7px',
                paddingRight: '7px',
                width: 'fit-content',
                background: '#FFFFFF',
                border: '1px solid #BD0F72',
                borderRadius: '4px',
                justifyContent: 'center'
              }}>
              <label
                style={{
                  fontStyle: 'normal',
                  fontWeight: '500',
                  fontSize: '14px',
                  lineHeight: '17px',
                  width: '100%',
                  fontFamily: 'Montserrat',
                  color: '#BD0F72'
                }}
                className={clsx(classes.label)}>
                {type}
              </label>
            </div>
          ) : (
            <label style={{ fontSize: 14 }} className={clsx(classes.label)}>
              {type}
            </label>
          )}
        </Grid>
        <Grid style={{ paddingLeft: 20 }} item xs={11}>
          <div
            className="tags-input-container"
            style={{ paddingRight: (type == 'Cc' || type == 'Bcc') ? '0px' : '90px' }}
            onFocus={() => setInputFocus(true)}
          >
            {type !== 'Cc' && type !== 'Bcc' && <div
              style={{
                position: 'absolute',
                paddingLeft: '7px',
                paddingRight: '7px',
                right: '5px',
                top: '5px',
                display: 'flex',
                flexDirection: 'row'
              }}>
              <button className={classes.buttonCcBcc} style={{ border: isCc ? '1px solid #BAC3CB' : '1px solid #BD0F72' }} disabled={isCc} onClick={() => onCc(true)}>
                <span className={classes.buttonText} style={{ color: isCc ? '#BAC3CB' : '#BD0F72' }}>Cc</span>
              </button>
              <div style={{ width: '2px' }} />
              <button className={classes.buttonCcBcc} style={{ border: isBcc ? '1px solid #BAC3CB' : '1px solid #BD0F72' }} disabled={isBcc} onClick={() => onBcc(true)}>
                <span className={classes.buttonText} style={{ color: isBcc ? '#BAC3CB' : '#BD0F72' }}>Bcc</span>
              </button>
            </div>
            }
            <div style={{ flex: 'auto', display: 'inline-block' }} onKeyDown={(e) => handleKeyDown(id, e)}>
              <ReactTags
                allowNew
                ref={textInput}
                tags={limitTags(tags[id])}
                placeholderText={!tags[id].length ? "Enter your email" : ""}
                suggestions={convertObject(suggestMails)}
                onAddition={(newTag) => onAddition(id, newTag)}
                onDelete={(tagIndex) => onDelete(id, tagIndex)}
                onValidate={({ name }) => validateEmail(name)}
                inputAttributes={{
                  id: id,
                  onPaste: (e) => validateListEmail(id, e)
                }}
                onBlur={() => handleBlur(id)}
                onInput={(value) => onInput(id, value)}
                maxSuggestionsLength={3}
                suggestionsTransform={(query, suggestions) => {
                  return matchSorter(suggestions, query, { keys: ["name"], threshold: matchSorter.rankings.CONTAINS });
                }}
                tagComponent={({ tag, _, onDelete }) => {
                  return (
                    <div className={`react-tags__selected-tag ${ctrlA ? "ctrlA" : ""}`} >
                      <span className="text">{tag.name}</span>
                      {((!inputFocus && Number(tag.id) < 3) || inputFocus) &&
                        <span className="close" onClick={onDelete}>
                          &times;
                        </span>
                      }
                    </div>
                  )
                }}
              />
            </div>
          </div>
        </Grid>
      </Grid>
    );
  };
  return (
    <>
      {tab === id.toLowerCase() &&
        (inputFocus ?
          <div ref={ref}>
            {TagsInput(`to${id}`, `To ${id}`)}
            {isCc && TagsInput(`to${id}Cc`, 'Cc')}
            {isBcc && TagsInput(`to${id}Bcc`, 'Bcc')}
          </div>
          :
          <Grid
            container
            direction="row"
            style={{ alignItems: 'center', justifyContent: "flex-start", marginTop: 10 }}>
            <Grid item xs={1}>
              <label style={{ fontSize: 14 }} className={clsx(classes.label)}>
                {`To ${id}`}
              </label>

            </Grid>
            <Grid style={{ paddingLeft: 23 }} item xs={11}>
              <div
                style={{ height: 22, borderBottom: '1px solid #cfcfcf', cursor: 'text' }}
                onClick={() => {
                  setInputFocus(true)
                  setCheckFocus(true)
                }}>
                <span>{toReceiver(id)[0]}</span>
                {toReceiver(id)[1] &&
                  <span className='ccTag'>{toReceiver(id)[1]}</span>
                }
              </div>
            </Grid>
          </Grid>
        )
      }
    </>
  );
};
export default InputUI;
