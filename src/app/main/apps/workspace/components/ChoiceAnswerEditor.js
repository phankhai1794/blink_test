import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CloseIcon from '@material-ui/icons/Close';
import { grey } from '@material-ui/core/colors';
import { styled } from '@material-ui/core/styles';
import styledC from 'styled-components';

import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from '../store/actions/form';

const DisabledRadioButtonUncheckedIcon = styled(RadioButtonUncheckedIcon)({
  color: grey['500']
});

const StyledDiv = styledC.div`
  color: rgba(0, 0, 0, 0.38);
  &:hover {
    border-bottom: 1px dotted black;
  }
`;

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
  const { index, value, handleChangeChoice, handleRemoveChoice, isAddChoice, indexType } = props;
  const [isHover, setIsHover] = useState(false);
  const [isOnFocus, setIsOnFocus] = useState(false);
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
            onChange={(e) => handleChangeChoice(e, index, indexType)}
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
  const { indexType } = props;
  const classes = inputStyle();
  const dispatch = useDispatch();
  const [valid, currentEditInq] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.validation,
    workspace.inquiryReducer.currentEditInq
  ]);
  const [isAddChoice, setAddChoice] = useState(false);
  useEffect(() => {
    const inq = { ...currentEditInq };
    const length = inq.answerObj.length;
    if (length && !inq.answerObj[length - 1].content) {
      inq.answerObj.pop();
      dispatch(InquiryActions.setEditInq(inq));
    }
  }, []);

  const handleAddChoice = () => {
    const inq = { ...currentEditInq };
    inq.answerObj.push({
      id: null,
      content: 'Option ' + (inq.answerObj.filter(({ index }) => index === indexType).length + 1),
      createdAt: new Date(),
      index: indexType,
    });
    inq.answerObj.sort((a, b) => a.index - b.index)
    dispatch(InquiryActions.setEditInq(inq));
    dispatch(FormActions.setEnableSaveInquiriesList(false));
    setAddChoice(true);
  };

  const handleRemoveChoice = (id) => {
    const inq = { ...currentEditInq };
    const ind = inq.answerObj.findIndex((ans) => ans.index === indexType)
    inq.answerObj.splice(ind + id, 1);
    dispatch(InquiryActions.setEditInq(inq));
    dispatch(FormActions.setEnableSaveInquiriesList(false));
  };

  const handleChangeChoice = (e, id, indexType) => {
    const inq = { ...currentEditInq };
    inq.answerObj.filter(({ index }) => index === indexType)[id].content = e.target.value;
    dispatch(InquiryActions.setEditInq(inq));
    dispatch(FormActions.setEnableSaveInquiriesList(false));
  };

  return (
    <div style={{ paddingTop: '2rem' }} className={classes.root}>
      {currentEditInq.answerObj.filter(({ index }) => index === indexType).map((value, k) => {
        return (
          <Choice
            key={k}
            value={value.content}
            index={k}
            handleChangeChoice={handleChangeChoice}
            handleRemoveChoice={handleRemoveChoice}
            isAddChoice={isAddChoice}
            indexType={indexType}
          />
        );
      })}
      <div className="flex items-center">
        <div style={{ paddingTop: '6px', marginRight: '1rem' }}>
          <DisabledRadioButtonUncheckedIcon />
        </div>
        <StyledDiv onClick={handleAddChoice}>Add an option</StyledDiv>
      </div>
      {!valid.answerContent && <span className={'errorChoice'}>Invalid Option !</span>}
    </div>
  );
};

export default ChoiceAnswerEditor;
