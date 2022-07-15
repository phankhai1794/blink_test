import { FuseChipSelect } from '@fuse';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, FormControl, FormHelperText, Grid, IconButton, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CloseIcon from '@material-ui/icons/Close';
import { grey } from '@material-ui/core/colors';
import { styled } from '@material-ui/core/styles';
import { PERMISSION, PermissionProvider } from "@shared/permission";

import * as InquiryActions from '../store/actions/inquiry';

import FileAttach from './FileAttach';
import ImageAttach from './ImageAttach';
import AttachmentAnswer from "./AttachmentAnswer";

const DisabledRadioButtonUncheckedIcon = styled(RadioButtonUncheckedIcon)({
  color: grey['500']
});
// show border bottom when input is hovered (split to single style to prevent error)
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
      lineHeight: '1em',
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
const inputStyleDisabled = makeStyles((theme) => ({
  underline: {
    '&&&:before': {
      borderBottom: 'none',
      borderStyle: 'dashed'
    },
    '&:hover:not($disabled):before': {
      borderBottom: `1px dashed ${theme.palette.text.primary} !important`
    },
  }
}));
const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '15px',
    position: 'absolute',
    left: '215px',
    top: '-5px',
    height: '25px',
    width: '25px',
    backgroundColor: 'silver'
  },
  positionBtnImg: {
    left: '0',
    top: '-3rem'
  },
  positionBtnNotImg: {
    left: '0',
    top: '4rem'
  }
}));

// Sub Commporent
const Choice = (props) => {
  const { index, value, handleChangeChoice, handleRemoveChoice } = props;
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
            autoFocus={true}
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
const ChoiceAnswer = (props) => {
  const { questions, question, index, saveQuestion } = props;
  const classes = inputStyle();
  const dispatch = useDispatch();
  const [valid, metadata] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.validation,
    workspace.inquiryReducer.metadata
  ]);

  const checkOptionsEmpty = () => {
    const optionsOfQuestion = [...questions];
    //check at least has one option
    if (optionsOfQuestion[index].answerObj.length > 0) {
      // check empty option
      const checkEmpty = optionsOfQuestion[index].answerObj.filter(item => !item.content);
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
    const optionsOfQuestion = [...questions];
    optionsOfQuestion[index].answerObj.push({
      id: null,
      content: 'Option ' + (optionsOfQuestion[index].answerObj.length + 1)
    });
    saveQuestion(optionsOfQuestion);
    checkOptionsEmpty();
  };
  const handleRemoveChoice = (id) => {
    const optionsOfQuestion = [...questions];
    optionsOfQuestion[index].answerObj.splice(id, 1);
    saveQuestion(optionsOfQuestion);
    checkOptionsEmpty();
  };

  const handleChangeChoice = (e, id) => {
    const optionsOfQuestion = [...questions];
    optionsOfQuestion[index].answerObj[id].content = e.target.value;
    saveQuestion(optionsOfQuestion);
    checkOptionsEmpty();
  };

  return (
    <div style={{ paddingTop: '2rem' }} className={classes.root}>
      {question.answerObj.map((value, k) => {
        return (
          <Choice
            key={k}
            value={value.content}
            index={k}
            handleChangeChoice={handleChangeChoice}
            handleRemoveChoice={handleRemoveChoice}
          />
        );
      })}
      <div className="flex items-center">
        <div style={{ paddingTop: '6px', marginRight: '1rem' }}>
          <DisabledRadioButtonUncheckedIcon />
        </div>
        <TextField
          style={{ border: 'none' }}
          placeholder="Add Option"
          onClick={handleAddChoice}
          InputProps={{ classes }}
        />
      </div>
      {!valid.answerContent && <span className={'errorChoice'}>Invalid Option !</span>}
    </div>
  );
};

const ParagraphAnswer = () => {
  const classes_disabled = inputStyleDisabled();
  return (
    <div className="flex">
      <TextField
        style={{ border: 'none' }}
        placeholder='Add "Customer Input"'
        fullWidth
        disabled
        InputProps={{ classes_disabled }}
      />
    </div>
  );
};

// Main Component
const InquiryEditor = (props) => {
  // custom attribute must be lowercase
  const dispatch = useDispatch();
  const classes = useStyles();
  const { index, question, questions, saveQuestion } = props;
  const [metadata, removeOptions, currentField, fields, valid, inquiries] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.metadata,
    workspace.inquiryReducer.removeOptions,
    workspace.inquiryReducer.currentField,
    workspace.inquiryReducer.fields,
    workspace.inquiryReducer.validation,
    workspace.inquiryReducer.inquiries,
  ]);
  const optionsAnsType = [{
    label: 'Option Selection',
    value: metadata.ans_type.choice,
  },
  {
    label: 'Customer Input',
    value: metadata.ans_type.paragraph,
  },
  {
    label: 'Customer Add Attachment',
    value: metadata.ans_type.attachment,
  }];
  const allowCreateAttachmentAnswer = PermissionProvider({ action: PERMISSION.INQUIRY_ANSWER_ATTACHMENT });
  const fullscreen = useSelector(({ workspace }) => workspace.formReducer.fullscreen);

  const [fieldType, setFieldType] = useState(metadata.field_options);
  const [valueType, setValueType] = useState(
    metadata.inq_type_options.filter((v) => question.inqType === v.value)[0]
  );
  const [valueAnsType, setValueAnsType] = useState(optionsAnsType.filter(ansType => ansType.value === question.ansType));
  const [fieldValue, setFieldValue] = useState(
    metadata.field_options.filter((v) => question.field === v.value)[0]
  );
  const [inqTypeOption, setInqTypeOption] = useState(metadata.inq_type_options);

  const styles = (valid, width) => {
    return {
      control: {
        border: !valid && '2px solid red',
        borderRadius: 11,
        width: `${width}px`
      }
    };
  };
  useEffect(() => {
    if (fieldValue) {
      if (!metadata.inq_type_options.filter((v) => (fieldValue.value === v.field || !v.field) && valueType?.value === v.value).length) {
        const optionsOfQuestion = [...questions];
        optionsOfQuestion[index].inqType = '';
        optionsOfQuestion[index].content = question.content.replace(valueType?.label, '{{INQ_TYPE}}');
        setValueType(null);
        saveQuestion(optionsOfQuestion);
      }
      const list = [...inquiries, ...questions]
      const filter = metadata.inq_type_options.filter((data) => {
        return (fieldValue.value === data.field || !data.field) && list.filter(q =>
          q.inqType === data.value && q.field === fieldValue.value
        ).length === 0
      })
      setInqTypeOption(filter);
    }
  }, [fieldValue]);

  useEffect(() => {
    const optionsOfQuestion = [...questions];

    if (questions.length - 1 === index && !questions.filter((q) => q.field === currentField).length) {
      setFieldValue(metadata.field_options.filter((v) => currentField === v.value)[0]);
      optionsOfQuestion[index].field = currentField;
    }

    if (!question.field && !removeOptions.includes(currentField)) {
      optionsOfQuestion[index].field = currentField;
      setFieldValue(metadata.field_options.filter((v) => currentField === v.value)[0]);
    }
    saveQuestion(optionsOfQuestion);
  }, []);

  const handleTypeChange = (e) => {
    const optionsOfQuestion = [...questions];
    optionsOfQuestion[index].inqType = e.value;
    dispatch(InquiryActions.validate({ ...valid, inqType: true }));
    const temp = valueType ? `\\b${valueType.label}\\b` : '{{INQ_TYPE}}';
    let re = new RegExp(`${temp}`, 'g');
    optionsOfQuestion[index].content = question.content.replace(re, e.label);
    setValueType(e);
    saveQuestion(optionsOfQuestion);
  };

  const handleFieldChange = (e) => {
    const optionsOfQuestion = [...questions];
    optionsOfQuestion[index].field = e.value;
    dispatch(InquiryActions.validate({ ...valid, field: true }));
    setFieldValue(e);
    saveQuestion(optionsOfQuestion);
  };

  const handleNameChange = (e) => {
    const optionsOfQuestion = [...questions];
    optionsOfQuestion[index].content = e.target.value;
    dispatch(InquiryActions.validate({ ...valid, content: optionsOfQuestion[index].content }));
    saveQuestion(optionsOfQuestion);
  };

  const handleAnswerTypeChange = (e) => {
    const optionsOfQuestion = [...questions];
    optionsOfQuestion[index].ansType = e.value;
    if (e.value !== metadata.ans_type.choice) {
      optionsOfQuestion[index].answerObj = []
    }
    dispatch(InquiryActions.validate({ ...valid, ansType: true }));
    setValueAnsType(optionsAnsType.filter(ansType => ansType.value === e.value));
    saveQuestion(optionsOfQuestion);
  };

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={4}>
          <FormControl error={!valid.field}>
            <FuseChipSelect
              customStyle={styles(valid.field, fullscreen ? 320 : 295)}
              value={fieldValue}
              onChange={handleFieldChange}
              placeholder="Select Field Type"
              textFieldProps={{
                variant: 'outlined'
              }}
              options={fieldType}
            />
            <div style={{ height: '20px' }}>
              {!valid.field && <FormHelperText style={{ marginLeft: '4px' }}>This is required!</FormHelperText>}
            </div>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl error={!valid.inqType}>
            <FuseChipSelect
              value={valueType}
              customStyle={styles(valid.inqType, fullscreen ? 330 : 295)}
              onChange={handleTypeChange}
              placeholder="Type of Inquiry"
              textFieldProps={{
                variant: 'outlined'
              }}
              options={inqTypeOption}
            />
            <div style={{ height: '20px' }}>
              {!valid.inqType && <FormHelperText style={{ marginLeft: '4px' }}>This is required!</FormHelperText>}
            </div>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl error={!valid.ansType}>
            <FuseChipSelect
              value={valueAnsType}
              customStyle={styles(valid.ansType, fullscreen ? 330 : 295)}
              onChange={handleAnswerTypeChange}
              placeholder="Type of Question"
              textFieldProps={{
                variant: 'outlined'
              }}
              options={optionsAnsType}
            />
            <div style={{ height: '15px' }}>
              {!valid.ansType && <FormHelperText style={{ marginLeft: '4px' }}>This is required!</FormHelperText>}
            </div>
          </FormControl>
        </Grid>
      </Grid>
      <div className="mt-32 mx-8">
        <TextField
          value={question.content.replace('{{INQ_TYPE}}', '')}
          multiline
          error={!valid.content}
          helperText={!valid.content ? 'This is required!' : ''}
          onFocus={(e) => e.target.select()}
          onChange={handleNameChange}
          style={{ width: '100%', resize: 'none' }}
        />
      </div>
      {question.ansType === metadata.ans_type.choice && (
        <div className="mt-16">
          <ChoiceAnswer
            questions={questions}
            question={question}
            index={index}
            saveQuestion={saveQuestion}
          />
        </div>
      )}
      {question.ansType === metadata.ans_type.paragraph && (
        <div className="mt-40">
          <ParagraphAnswer />
        </div>
      )}
      {question.ansType === metadata.ans_type.attachment && (
        <AttachmentAnswer
          style={{ marginTop: '1rem' }}
          question={question}
          isPermissionAttach={allowCreateAttachmentAnswer}
        />
      )}
      <Divider className="mt-12" />
      <>
        {question.mediaFile?.length > 0 && <h3>Attachment Inquiry:</h3>}
        {question.mediaFile?.length > 0 && question.mediaFile?.map((file, mediaIndex) => (
          <div style={{ position: 'relative', display: 'inline-block' }} key={mediaIndex}>
            {file.ext.match(/jpeg|jpg|png/g) ? (
              <ImageAttach file={file} field={question.field} indexInquiry={index} style={{}} />
            ) : (
              <FileAttach file={file} ield={question.field} indexInquiry={index} />
            )}
          </div>
        ))}
      </>
      <>
        {question.answerObj[0]?.mediaFiles?.length > 0 && <h3>Attachment Answer:</h3>}
        {question.answerObj[0]?.mediaFiles?.map((file, mediaIndex) => (
          <div style={{ position: 'relative', display: 'inline-block' }} key={mediaIndex}>
            {file.ext.match(/jpeg|jpg|png/g) ? (
              <ImageAttach file={file} field={question.field} style={{ margin: '2.5rem' }} />
            ) : (
              <FileAttach file={file} field={question.field} />
            )}
          </div>
        ))}
      </>
    </>
  );
};

export default InquiryEditor;
