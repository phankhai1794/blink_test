import React, { useState, useRef, useEffect } from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import { Chip, Avatar, Link, TextField } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { matchSorter } from 'match-sorter';
import { cyan } from '@material-ui/core/colors';

import * as MailActions from '../store/actions/mail';

const useStyles = makeStyles(() => ({
  chip: {
    borderRadius: '4px',
    background: 'rgba(0, 0, 0, 0.03)',
    height: 26,
    margin: 'auto 3px'
  }
}));

const CustomLink = withStyles({
  root: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'Montserrat',
    '&[disabled]': {
      color: 'grey',
      cursor: 'default',
      '&:hover': {
        textDecoration: 'none'
      }
    }
  }
})(Link);

const InputUI = ({ id, onChanged }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [focus, setFocus] = useState(false);
  const [state, setState] = useState({
    activeSuggestion: -1,
    filteredSuggestions: [],
    showSuggestions: false,
    id: '',
    input: ''
  });
  const [ctrlA, setCtrlA] = useState({ state: false, id: '' });
  const refInput = {
    [`to${id}Cc`]: useRef(null),
    [`to${id}Bcc`]: useRef(null),
    [`to${id}`]: useRef(null)
  };
  const ref = useRef(null);
  const suggestMails = useSelector(({ workspace }) => workspace.mailReducer.suggestMails);
  const inputMail = useSelector(({ workspace }) => workspace.mailReducer.inputMail);
  const tags = useSelector(({ workspace }) => workspace.mailReducer.tags);
  const mode = useSelector(({ workspace }) => workspace.mailReducer.mode);
  const isCc = mode[`isCc${id}`];
  const isBcc = mode[`isBcc${id}`];

  const onCc = (value) => dispatch(MailActions.setCc({ ...mode, [`isCc${id}`]: value }));
  const onBcc = (value) => dispatch(MailActions.setCc({ ...mode, [`isBcc${id}`]: value }));

  const isEmailValid = (tag) => {
    const regexp =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(tag);
  };

  useEffect(() => {
    if (isCc && refInput[`to${id}Cc`].current) {
      refInput[`to${id}Cc`].current.focus();
      setState({
        activeSuggestion: -1,
        showSuggestions: false
      });
    }
  }, [isCc]);

  useEffect(() => {
    if (isBcc && refInput[`to${id}Bcc`].current) {
      refInput[`to${id}Bcc`].current.focus();
      setState({
        activeSuggestion: -1,
        showSuggestions: false
      });
    }
  }, [isBcc]);

  useEffect(() => {
    if (focus && refInput[`to${id}`].current) refInput[`to${id}`].current.focus();
  }, [focus]);

  const splitEmailValid = (id, values) => {
    const result = [];
    const temp = [];
    values.forEach((v) => {
      if (isEmailValid(v)) {
        result.push(v);
      } else if (v) {
        temp.push(v);
      }
    });
    if (result.length) {
      const newTags = [...new Set([...tags[id], ...result])]
      onChanged(id, newTags);
      dispatch(MailActions.setTags({ ...tags, [id]: newTags }));
      dispatch(MailActions.inputMail({ ...inputMail, [id]: temp.join(',') }));
    }
  }

  const onPaste = (id, e) => {
    e.preventDefault();
    const removeDuplicate = [
      ...new Set(
        e.clipboardData
          .getData('text')
          .split(/,|;|\n/)
          .map((str) => str.trim())
      )
    ];
    splitEmailValid(id, removeDuplicate)
  };
  const onDelete = (id, tagIndex) => {
    const newTags = ctrlA.state ? [] : tags[id].filter((_, i) => i !== tagIndex);
    dispatch(MailActions.setTags({ ...tags, [id]: newTags }));
    onChanged(id, newTags);
  };

  const onChange = (id, value) => {
    setCtrlA({ state: false });
    // Filter our suggestions that don't contain the user's input
    const strArr = value.split(/,|;/);
    const str = inputMail[id].split(/,|;/);

    let index = -1;
    if (strArr.length === str.length) {
      strArr.forEach((s, i) => {
        if (s !== str[i]) {
          index = i;
          return;
        }
      });
    }
    dispatch(MailActions.inputMail({ ...inputMail, [id]: value }));

    if (index >= 0 && strArr[index].trim().length >= 2) {
      const filteredSuggestions = matchSorter(suggestMails, strArr[index].trim(), {
        keys: ['email'],
        threshold: matchSorter.rankings.CONTAINS
      }).slice(0, 3);
      strArr.splice(index, 1);
      setState({
        activeSuggestion: -1,
        filteredSuggestions,
        showSuggestions: true,
        id: id,
        input: strArr.join(', ')
      });
    } else {
      setState({
        activeSuggestion: -1,
        showSuggestions: false
      });
    }
  };

  const onAddition = (id, value) => {
    const newTags = [...new Set([...tags[id], value])];
    dispatch(MailActions.inputMail({ ...inputMail, [id]: state.input || '' }));
    dispatch(MailActions.setTags({ ...tags, [id]: newTags }));
    onChanged(id, newTags);
  };

  const onClickSuggestion = (id, value) => {
    setState({
      activeSuggestion: -1,
      filteredSuggestions: [],
      showSuggestions: false
    });
    onAddition(id, value);
  };

  const onKeyDown = (id, e) => {
    const input = inputMail[id];
    if (['Enter', 'Tab'].includes(e.key)) {
      e.preventDefault();
      const value = input.trim();
      if (value && isEmailValid(value)) {
        onAddition(id, value);
      }
    }
    if (['Backspace', 'Delete'].includes(e.key) && !input) {
      e.preventDefault();
      const value = input.trim();
      if (!value) {
        onDelete(id, tags[id].length - 1);
      }
    }
    const { showSuggestions, activeSuggestion, filteredSuggestions } = state;
    if (showSuggestions) {
      if (e.keyCode === 13 && activeSuggestion !== -1) {
        setState({
          activeSuggestion: -1,
          showSuggestions: false
        });
        onAddition(id, filteredSuggestions[activeSuggestion].email);
      } else if (e.keyCode === 38) {
        setState({
          ...state,
          activeSuggestion:
            activeSuggestion > 0 ? activeSuggestion - 1 : filteredSuggestions.length - 1
        });
      } else if (e.keyCode === 40) {
        setState({
          ...state,
          activeSuggestion:
            activeSuggestion < filteredSuggestions.length - 1 ? activeSuggestion + 1 : 0
        });
      }
    }
    if (!input && e.key === 'a' && e.ctrlKey) setCtrlA({ state: true, id });
  };

  const onBlur = (id) => {
    const input = inputMail[id].split(/,|;|\n/).map((str) => str.trim());
    splitEmailValid(id, input)
    setCtrlA({ state: false });
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onBlur(`to${id}`)
        onBlur(`to${id}Cc`)
        onBlur(`to${id}Bcc`)
        if (isCc && !inputMail[`to${id}Cc`] && !tags[`to${id}Cc`].length) {
          onCc(false);
        }
        if (isBcc && !inputMail[`to${id}Bcc`] && !tags[`to${id}Bcc`].length) {
          onBcc(false);
        }
        setState({
          activeSuggestion: -1,
          filteredSuggestions: [],
          showSuggestions: false
        });
        setFocus(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, inputMail, tags, isCc, isBcc]);

  const totalStringLength = (array) => {
    let total = 0,
      index = 0;
    array.forEach((e, i) => {
      total += e.length;
      if (total >= 90) {
        return;
      }
      index = i;
    });
    return index;
  };

  const toReceiver = (id) => {
    const temp1 = inputMail[`to${id}`]
      ? [...tags[`to${id}`], ...inputMail[`to${id}`].split(/,|;/)]
      : tags[`to${id}`];
    const temp2 = inputMail[`to${id}Cc`]
      ? [...tags[`to${id}Cc`], ...inputMail[`to${id}Cc`].split(/,|;/)]
      : tags[`to${id}Cc`];
    const temp3 = inputMail[`to${id}Bcc`]
      ? [...tags[`to${id}Bcc`], ...inputMail[`to${id}Bcc`].split(/,|;/)]
      : tags[`to${id}Bcc`];
    const size = temp1.length;
    const ccSize = temp2.length;
    const bccSize = temp3.length;
    const arr = [...temp1, ...temp2];
    const len = totalStringLength([...arr, ...temp3]);
    const length = len + 1;
    let text = '';
    let arg = [];
    let invalidText = false;
    if (size + ccSize >= length) {
      const total = arr.length + bccSize - length;
      if (arr.length - length) {
        text += `${total} more`;
      }
      if (bccSize) {
        text += arr.length - length ? ` (${bccSize} Bcc)` : `${bccSize} Bcc`;
      }
      arg = arr.slice(0, length).map((e, i) => (
        <span key={i} className={isEmailValid(e) ? '' : 'invalidEmail'}>
          {' '}
          {e}
        </span>
      ));
      invalidText = [...arr.slice(length), ...temp3].some((e) => !isEmailValid(e));
    } else {
      arg = arr.map((e, i) => (
        <span key={i} className={isEmailValid(e) ? '' : 'invalidEmail'}>
          {' '}
          {e}
        </span>
      ));
      if (bccSize) {
        arg.push(
          <>
            Bcc:{' '}
            {temp3.slice(0, length - arr.length).map((e, i, a) => (
              <>
                <span key={i} className={isEmailValid(e) ? '' : 'invalidEmail'}>
                  {' '}
                  {e}
                </span>
                {i !== a.length - 1 && ', '}
              </>
            ))}
          </>
        );
        if (arr.length + bccSize > length) {
          text += `${bccSize - length + arr.length} Bcc`;
        }
        invalidText = temp3.slice(length - arr.length).some((e) => !isEmailValid(e));
      }
    }
    if (text) text = <span className={invalidText ? 'moreTag_invalid' : 'moreTag'}> {text}</span>;
    return [arg, text];
  };

  const TagsInput = (id, type) => {
    return (
      <>
        <div className="flex flex-wrap flex-grow" >
          <>
            {tags[id].map((tag, i) => (
              <Chip
                className={ctrlA.state && ctrlA.id === id ? 'ctrlA' : ''}
                classes={{ root: classes.chip }}
                key={i}
                label={tag}
                onDelete={() => onDelete(id, i)}
                deleteIcon={<ClearIcon />}
              />
            ))}
          </>
          <TextField
            className="flex-grow"
            inputRef={refInput[id]}
            value={inputMail[id]}
            onKeyDown={(e) => onKeyDown(id, e)}
            onChange={(e) => onChange(id, e.target.value)}
            onPaste={(e) => onPaste(id, e)}
            onBlur={() => onBlur(id)}
            InputProps={{
              disableUnderline: true,
              endAdornment: (
                <>
                  {type !== 'Cc' && type !== 'Bcc' && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}>
                      <CustomLink
                        component="button"
                        color="primary"
                        disabled={isCc}
                        style={{ marginRight: 4 }}
                        onClick={() => onCc(true)}>
                        Cc
                      </CustomLink>
                      <CustomLink
                        component="button"
                        color="primary"
                        disabled={isBcc}
                        onClick={() => onBcc(true)}>
                        Bcc
                      </CustomLink>
                    </div>
                  )}
                </>
              )
            }}
          />
        </div>
        {state.showSuggestions &&
          state.id === id &&
          inputMail[id] &&
          state.filteredSuggestions.length > 0 && (
          <ul className="suggestions">
            {state.filteredSuggestions.map(({ email, firstName, lastName, avatar }, index) => {
              let className = 'suggestion';
              // Flag the active suggestion with a class
              if (index === state.activeSuggestion) {
                className = 'suggestion-active';
              }
              return (
                <div
                  className={`flex ${className}`}
                  key={index}
                  onClick={() => onClickSuggestion(id, email)}>
                  <Avatar
                    // className={classes.fitAvatar}
                    style={{ background: cyan[400] }}
                    src={avatar ? avatar : 'assets/images/avatars/unnamed.png'}
                    alt="User photo"
                  />
                  <div className="flex flex-col ml-8">
                    <div>{firstName || lastName ? <>{`${firstName} ${lastName}`}</> : email}</div>
                    <div style={{ fontSize: 12 }}>{email}</div>
                  </div>
                </div>
              );
            })}
          </ul>
        )}
      </>
    );
  };
  return (
    <>
      {focus ? (
        <div ref={ref} onFocus={() => setFocus(true)}>
          <div className="flex" style={{ position: 'relative' }}>
            <span className='m-auto mr-8'>To</span>
            {TagsInput(`to${id}`, `To ${id}`)}
          </div>
          {isCc &&
            <div className="flex m-auto" style={{ position: 'relative' }}>
              <span className='m-auto mr-8'>Cc</span>
              {TagsInput(`to${id}Cc`, 'Cc')}
            </div>
          }
          {isBcc &&
            <div className="flex m-auto" style={{ position: 'relative' }}>
              <span className='m-auto mr-8'>Bcc</span>
              {TagsInput(`to${id}Bcc`, 'Bcc')}
            </div>
          }
        </div>
      ) : (
        <div
          style={{
            height: 22,
            cursor: 'text',
            padding: '5px 0'
          }}
          onClick={() => setFocus(true)}>
          {toReceiver(id)[0].length ? (
            toReceiver(id)[0].map((e, i, arr) => (i !== arr.length - 1 ? <>{e}, </> : e))
          ) : (
            <input placeholder="Recipients" style={{ border: 'none', fontSize: 16 }} />
          )}
          {toReceiver(id)[1]}
        </div>
      )}
    </>
  );
};
export default InputUI;
