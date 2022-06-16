import { FuseChipSelect } from '@fuse';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField,
  Grid,
  IconButton,
  Divider,
  FormControl,
  FormHelperText
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CloseIcon from '@material-ui/icons/Close';
import { grey } from '@material-ui/core/colors';
import { styled } from '@material-ui/core/styles';
import { PERMISSION, PermissionProvider } from "@shared/permission";

import * as InquiryActions from '../store/actions/inquiry';

import CustomSelect from './CustomSelect';
import FileAttach from './FileAttach';
import ImageAttach from './ImageAttach';
import AttachmentAnswer from "./AttachmentAnswer";

const DisabledRadioButtonUncheckedIcon = styled(RadioButtonUncheckedIcon)({
  color: grey['500']
});
// show border bottom when input is hovered (split to single style to prevent error)
const inputStyle = makeStyles((theme) => ({
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

  const handleAddChoice = () => {
    const optionsOfQuestion = [...questions];
    optionsOfQuestion[index].answerObj.push({
      id: null,
      content: 'Option ' + (optionsOfQuestion[index].answerObj.length + 1)
    });
    saveQuestion(optionsOfQuestion);
  };
  const handleRemoveChoice = (id) => {
    const optionsOfQuestion = [...questions];
    optionsOfQuestion[index].answerObj.splice(id, 1);
    saveQuestion(optionsOfQuestion);
  };
  const handleChangeChoice = (e, id) => {
    const optionsOfQuestion = [...questions];
    optionsOfQuestion[index].answerObj[id].content = e.target.value;
    saveQuestion(optionsOfQuestion);
  };

  return (
    <div style={{ paddingTop: '2rem' }}>
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
  const [metadata, removeOptions, currentField, fields, valid] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.metadata,
    workspace.inquiryReducer.removeOptions,
    workspace.inquiryReducer.currentField,
    workspace.inquiryReducer.fields,
    workspace.inquiryReducer.validation
  ]);
  const allowCreateAttachmentAnswer = PermissionProvider({ action: PERMISSION.INQUIRY_ANSWER_ATTACHMENT });
  const fullscreen = useSelector(({ workspace }) => workspace.formReducer.fullscreen);

  const [fieldType, setFieldType] = useState(metadata.field_options);
  const [valueType, setValueType] = useState(
    metadata.inq_type_options.filter((v) => question.inqType === v.value)[0]
  );
  const [fieldValue, setFieldValue] = useState(
    metadata.field_options.filter((v) => question.field === v.value)[0]
  );
  const [inqTypeOption, setInqTypeOption] = useState(metadata.inq_type_options);
  const styles = (valid, width) => {
    return {
      control: {
        border: !valid && '1px solid red',
        borderRadius: '9px',
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
      setInqTypeOption(
        metadata.inq_type_options.filter((v) => fieldValue.value === v.field || !v.field)
      );
    }
  }, [fieldValue]);

  useEffect(() => {
    const list = [...removeOptions];
    list[index] = '';
    setFieldType(metadata.field_options.filter((v) => !list.includes(v.value) && !fields.includes(v.value)));
    const optionsOfQuestion = [...questions];

    if (questions.length - 1 === index && !questions.filter((q) => q.field === currentField).length) {
      setFieldValue(metadata.field_options.filter((v) => currentField === v.value)[0]);
      optionsOfQuestion[index].field = currentField;
      list[index] = currentField;
      dispatch(InquiryActions.removeSelectedOption(list));
    }

    if (!question.ansType) {
      optionsOfQuestion[index].ansType = metadata.ans_type.choice;
    }
    if (!question.field && !removeOptions.includes(currentField)) {
      optionsOfQuestion[index].field = currentField;
      setFieldValue(metadata.field_options.filter((v) => currentField === v.value)[0]);
      const options = [...removeOptions];
      options[index] = currentField;
      dispatch(InquiryActions.removeSelectedOption(options));
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
    const options = [...removeOptions];
    options[index] = e.value;
    dispatch(InquiryActions.removeSelectedOption(options));
    setFieldValue(e);
    saveQuestion(optionsOfQuestion);
  };

  const handleNameChange = (e) => {
    const optionsOfQuestion = [...questions];
    optionsOfQuestion[index].content = e.target.value;
    saveQuestion(optionsOfQuestion);
  };

  const handleAnswerTypeChange = (e) => {
    const optionsOfQuestion = [...questions];
    optionsOfQuestion[index].ansType = e.target.value;
    saveQuestion(optionsOfQuestion);
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12} className="flex justify-between">
          <FormControl error={!valid.field}>
            <FuseChipSelect
              className="m-auto"
              customStyle={styles(valid.field, fullscreen ? 320 : 290)}
              value={fieldValue}
              onChange={handleFieldChange}
              placeholder="Select Field Type"
              textFieldProps={{
                variant: 'outlined'
              }}
              options={fieldType}
            />
            {!valid.field && <FormHelperText>This is required!</FormHelperText>}
          </FormControl>
          <FormControl error={!valid.inqType}>
            <FuseChipSelect
              className="m-auto"
              value={valueType}
              customStyle={styles(valid.inqType, fullscreen ? 330 : 290)}
              onChange={handleTypeChange}
              placeholder="Select Inquiry Type"
              textFieldProps={{
                variant: 'outlined'
              }}
              options={inqTypeOption}
            />
            {!valid.inqType && <FormHelperText>This is required!</FormHelperText>}
          </FormControl>
          <CustomSelect
            value={question.ansType}
            name="Question answer type"
            onChange={handleAnswerTypeChange}
            options={[
              {
                title: 'Choice Answer',
                value: metadata.ans_type.choice,
                icon: 'radio_button_checked'
              },
              {
                title: 'Paragraph Answer',
                value: metadata.ans_type.paragraph,
                icon: 'subject'
              },
              {
                title: 'Attachment Answer',
                value: metadata.ans_type.attachment,
                icon: 'attachment'
              }
            ]}
          />
        </Grid>
      </Grid>
      <div className="mt-32 mx-8">
        <TextField
          value={question.content.replace('{{INQ_TYPE}}', '')}
          multiline
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
          <div style={{ position: 'relative' }} key={mediaIndex}>
            {file.ext.match(/jpeg|jpg|png/g) ? (
              <ImageAttach src={file.src} style={{ margin: '2.5rem' }} />
            ) : (
              <FileAttach file={file} />
            )}
          </div>
        ))}
      </>
      <>
        {question.answerObj[0]?.mediaFiles?.length > 0 && <h3>Attachment Answer:</h3>}
        {question.answerObj[0]?.mediaFiles?.map((file, mediaIndex) => (
          <div style={{ position: 'relative' }} key={mediaIndex}>
            {file.ext.match(/jpeg|jpg|png/g) ? (
              <ImageAttach src={file.src} style={{ margin: '2.5rem' }} />
            ) : (
              <FileAttach file={file} />
            )}
          </div>
        ))}
      </>
    </>
  );
};

export default InquiryEditor;
