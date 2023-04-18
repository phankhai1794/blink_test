import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CloseIcon from '@material-ui/icons/Close';
import { grey } from '@material-ui/core/colors';
import { styled } from '@material-ui/core/styles';

import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from '../store/actions/form';

const DisabledRadioButtonUncheckedIcon = styled(RadioButtonUncheckedIcon)({
  color: grey[ '500' ]
});

const inputStyle = makeStyles((theme) => ({
  root: {
    '& .errorChoice': {
      color: '#f44336',
      fontSize: '1.2rem',
      display: 'block',
      marginTop: '8px',
      marginLeft: '33px',
      minHeight: '1em',
      textAlign: 'left',
      fontFamily: `Roboto,"Helvetica",Arial,sans-serif`,
      fontWeight: 400,
      lineHeight: '1em'
    }
  },
  underline: {
    '&&&:before': {
      borderBottom: 'none'
    },
    '&:hover:not($disabled):before': {
      borderBottom: `1px dashed ${theme.palette.text.primary} !important`
    }
  }
}));

// Sub Commporent
const Choice = (props) => {
  const { index, value, handleChangeChoice, handleRemoveChoice, isAddChoice } = props;
  const [ isHover, setIsHover ] = useState(false);
  const [ isOnFocus, setIsOnFocus ] = useState(false);
  const handleFocus = (e) => {
    setIsOnFocus(true);
    e.target.select();
  };
  const classes = inputStyle();
  return (
    <div key={index}>
      <div
        className="flex"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => {
          isOnFocus ? setIsHover(true) : setIsHover(false);
        }}>
        <div style={{ paddingTop: '6px', marginRight: '1rem' }}>
          <DisabledRadioButtonUncheckedIcon />
        </div>
        <div style={{ height: '50px', width: '95%' }}>
          <TextField
            fullWidth
            value={value}
            style={{ marginLeft: '1rem' }}
            autoFocus={isAddChoice}
            onFocus={handleFocus}
            onChange={(e) => handleChangeChoice(e, index)}
            InputProps={{
              classes
            }}
          />
        </div>
        <div style={{ marginLeft: '1rem' }}>
          <IconButton onClick={() => handleRemoveChoice(index)} style={{ padding: '2px' }}>
            <CloseIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};
const ChoiceAnswerEditor = (props) => {
  // const { questions, question, index, saveQuestion } = props;
  const classes = inputStyle();
  const dispatch = useDispatch();
  const [ valid, currentEditInq ] =
    useSelector(({ workspace }) => [
      workspace.inquiryReducer.validation,
      workspace.inquiryReducer.currentEditInq
    ]);
  const [ isAddChoice, setAddChoice ] = useState(false);

  const checkOptionsEmpty = () => {
    const inq = { ...currentEditInq };
    //check at least has one option
    if (inq.answerObj.length > 0) {
      // check empty option
      const checkEmpty = inq.answerObj.filter((item) => !item.content);
      if (checkEmpty.length > 0) {
        dispatch(InquiryActions.validate({ ...valid, answerContent: false }));
      } else {
        dispatch(InquiryActions.validate({ ...valid, answerContent: true }));
      }
    } else {
      dispatch(InquiryActions.validate({ ...valid, answerContent: false }));
    }
  };

  const handleAddChoice = () => {
    const inq = { ...currentEditInq };
    inq.answerObj.push({
      id: null,
      content: 'Option ' + (inq.answerObj.length + 1),
      createdAt: new Date(),
    });
    dispatch(InquiryActions.setEditInq(inq));
    checkOptionsEmpty();
    dispatch(FormActions.setEnableSaveInquiriesList(false));
    setAddChoice(true);
  };
  const handleRemoveChoice = (id) => {
    const inq = { ...currentEditInq };
    inq.answerObj.splice(id, 1);
    dispatch(InquiryActions.setEditInq(inq));
    checkOptionsEmpty();
    dispatch(FormActions.setEnableSaveInquiriesList(false));
  };

  const handleChangeChoice = (e, id) => {
    const inq = { ...currentEditInq };
    inq.answerObj[ id ].content = e.target.value;
    dispatch(InquiryActions.setEditInq(inq));
    checkOptionsEmpty();
    dispatch(FormActions.setEnableSaveInquiriesList(false));
  };

  return (
    <div style={{ paddingTop: '2rem' }} className={classes.root}>
      {currentEditInq.answerObj.map((value, k) => {
        return (
          <Choice
            key={k}
            value={value.content}
            index={k}
            handleChangeChoice={handleChangeChoice}
            handleRemoveChoice={handleRemoveChoice}
            isAddChoice={isAddChoice}
          />
        );
      })}
      <div className="flex items-center">
        <div style={{ paddingTop: '6px', marginRight: '1rem' }}>
          <DisabledRadioButtonUncheckedIcon />
        </div>
        <TextField
          style={{ border: 'none' }}
          placeholder="Add an option"
          onClick={handleAddChoice}
          InputProps={{ classes }}
          disabled
        />
      </div>
      {!valid.answerContent && <span className={'errorChoice'}>Invalid Option !</span>}
    </div>
  );
};

export default ChoiceAnswerEditor;
