import { FuseChipSelect } from '@fuse';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, FormControl, FormHelperText, Grid, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { PERMISSION, PermissionProvider } from "@shared/permission";

import * as InquiryActions from '../store/actions/inquiry';
import * as FormActions from "../store/actions/form";

import ChoiceAnswerEditor from './ChoiceAnswerEditor';
import ParagraphAnswerEditor from './ParagraphAnswerEditor';
import AttachmentAnswer from './AttachmentAnswer';
import ImageAttach from './ImageAttach';
import FileAttach from './FileAttach';

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
  button: {
    margin: theme.spacing(1),
    borderRadius: 8,
    width: 120,
    boxShadow: 'none',
    textTransform: 'capitalize',
    fontFamily: 'Montserrat',
    fontWeight: 600,
    '&.reply': {
      backgroundColor: 'white',
      color: '#BD0F72',
      border: '1px solid #BD0F72'
    }
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
    label: 'Onshore/Customer Input',
    value: metadata.ans_type.paragraph,
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
        width: `${width}px`,
        borderRadius: 11
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
      const found = metadata.inq_type_options.some(el => el.field === fieldValue.value);
      const filter = metadata.inq_type_options.filter(data => {
        return (found ? fieldValue.value === data.field : !data.field) && list.filter(q =>
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
    const contentQuestionTrim = optionsOfQuestion.map(op => {
      let contentTrim = {...op, content: op.content.trim()};
      const ansTypeChoice = metadata.ans_type['choice'];
      if (ansTypeChoice === op.ansType) {
        op.answerObj.forEach(ans => {
          ans.content = ans.content.trim();
        });
      }
      return contentTrim;
    });
    saveQuestion(contentQuestionTrim);
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
    dispatch(FormActions.setEnableSaveInquiriesList(false));
  };

  const handleFieldChange = (e) => {
    const optionsOfQuestion = [...questions];
    optionsOfQuestion[index].field = e.value;
    dispatch(InquiryActions.validate({ ...valid, field: true }));
    setFieldValue(e);
    saveQuestion(optionsOfQuestion);
    dispatch(FormActions.setEnableSaveInquiriesList(false));
  };

  const handleNameChange = (e) => {
    const optionsOfQuestion = [...questions];
    optionsOfQuestion[index].content = e.target.value;
    dispatch(InquiryActions.validate({ ...valid, content: optionsOfQuestion[index].content }));
    saveQuestion(optionsOfQuestion);
    dispatch(FormActions.setEnableSaveInquiriesList(false));
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
    dispatch(FormActions.setEnableSaveInquiriesList(false));
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
              errorStyle={valid.field}
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
              errorStyle={valid.inqType}
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
              errorStyle={valid.ansType}
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
          <ChoiceAnswerEditor
            questions={questions}
            question={question}
            index={index}
            saveQuestion={saveQuestion}
          />
        </div>
      )}
      {question.ansType === metadata.ans_type.paragraph && (
        <div className="mt-40">
          <ParagraphAnswerEditor />
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
            {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
              <ImageAttach file={file} field={question.field} indexInquiry={index} />
            ) : (
              <FileAttach file={file} field={question.field} indexInquiry={index} />
            )}
          </div>
        ))}
      </>
      <>
        {question.answerObj[0]?.mediaFiles?.length > 0 && <h3>Attachment Answer:</h3>}
        {question.answerObj[0]?.mediaFiles?.map((file, mediaIndex) => (
          <div style={{ position: 'relative', display: 'inline-block' }} key={mediaIndex}>
            {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
              <ImageAttach file={file} field={question.field} style={{ margin: '2.5rem' }} />
            ) : (
              <FileAttach file={file} field={question.field} />
            )}
          </div>
        ))}
      </>
      {/* <div className="flex">
        <Button
          variant="contained"
          color="primary"
          classes={{ root: classes.button }}
        >
        Save
        </Button>
      </div> */}
    </>
  );
};

export default InquiryEditor;
