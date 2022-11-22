import React, { useState, useRef, useCallback } from 'react';
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

const InputUI = (props) => {
  const { id, title, type, onChanged, isCc, isBcc, onCc, onBcc } = props;
  const classes = useStyles();
  return (
    <Grid
      container
      direction="row"
      style={{ alignItems: 'center', justifyContent: "flex-start", marginTop: 10 }}>
      <Grid item xs={1}>
        {title === 'Cc' || title === 'Bcc' ? (
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
              {title}
            </label>
          </div>
        ) : (
          <label style={{ fontSize: 14 }} className={clsx(classes.label)}>
            {title}
          </label>
        )}
      </Grid>
      <Grid style={{ paddingLeft: 20 }} item xs={11}>
        <TagsInput
          id={id}
          tagLimit={10}
          type={title}
          isCc={isCc}
          isBcc={isBcc}
          onCc={onCc}
          onBcc={onBcc}
          onChanged={onChanged}
        />
      </Grid>
    </Grid>
  );
};
const TagsInput = ({ id, tagLimit, type, isCc, isBcc, onChanged, onCc, onBcc }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [isFocus, setIsFocus] = useState(false);
  const [focus, setFocus] = useState(false);
  const textInput = useRef(null);

  const suggestMails = useSelector(({ workspace }) => workspace.mailReducer.suggestMails);
  const validateMail = useSelector(({ workspace }) => workspace.mailReducer.validateMail);
  const _tags = useSelector(({ workspace }) => workspace.mailReducer.tags);
  const tags = _tags[id] || []
  const input = validateMail[id]
  const validateEmail = (tag) => {
    const regexp =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(tag);
  };

  const convertObject = (list) => {
    return list.map((name, id) => ({ id, name }))
  }

  const validateListEmail = (e) => {
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
      dispatch(MailActions.setTags({ ..._tags, [id]: [...new Set([...tags, ...result])] }))
      dispatch(MailActions.validateMail({ ...validateMail, [id]: temp.slice(0, -1) }))
      textInput.current.state.query = temp
    }
  }

  const onDelete = useCallback((tagIndex) => {
    const newTags = tags.filter((_, i) => i !== tagIndex)
    dispatch(MailActions.setTags({ ..._tags, [id]: newTags }))
    onChanged(id, newTags);
  }, [tags])

  const onAddition = (newTag) => {
    const newTags = [...new Set([...tags, newTag.name])]
    dispatch(MailActions.validateMail({ ...validateMail, [id]: '' }))
    dispatch(MailActions.setTags({ ..._tags, [id]: newTags }))
    onChanged(id, newTags);
  }

  const onInput = (value) => {
    dispatch(MailActions.validateMail({ ...validateMail, [id]: value }))
  }

  const handleBlur = () => {
    if (input && validateEmail(input.trim())) {
      const newTags = [...new Set([...tags, input.trim()])]
      onChanged(id, newTags);
      dispatch(MailActions.setTags({ ..._tags, [id]: newTags }))
      dispatch(MailActions.validateMail({ ...validateMail, [id]: '' }))
      textInput.current.state.query = ''
    }
    if (!focus) {
      setIsFocus(false);
    }
  };

  const limitTags = (tags) => {
    if (!isFocus && tags.length > 3) {
      let tagsShow = tags.slice(0, 3);
      tagsShow.push(`+${tags.length - 3}`)
      return convertObject(tagsShow);
    }
    return convertObject(tags);
  };

  return (
    <div
      className="tags-input-container"
      style={{ paddingRight: (type == 'Cc' || type == 'Bcc') ? '0px' : '90px' }}
      onMouseEnter={() => setFocus(true)}
      onMouseLeave={() => setFocus(false)}
      onFocus={() => setIsFocus(true)}
    >
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
      <div style={{ flex: 'auto', display: 'inline-block' }}>
        <ReactTags
          allowNew
          ref={textInput}
          tags={limitTags(tags)}
          placeholderText={!tags.length ? "Enter your email" : ""}
          suggestions={convertObject(suggestMails)}
          onAddition={onAddition}
          onDelete={onDelete}
          onValidate={({ name }) => validateEmail(name)}
          inputAttributes={{ onPaste: validateListEmail }}
          onBlur={handleBlur}
          onInput={onInput}
          maxSuggestionsLength={3}
          suggestionsTransform={(query, suggestions) => {
            return matchSorter(suggestions, query, { keys: ["name"], threshold: matchSorter.rankings.CONTAINS });
          }}
          tagComponent={({ tag, _, onDelete }) => {
            return (
              <div className="react-tags__selected-tag" >
                <span className="text">{tag.name}</span>
                {((!isFocus && Number(tag.id) < 3) || isFocus) &&
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
  );
};
export default InputUI;
