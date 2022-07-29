import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField,
  Grid,
  IconButton,
  Fab,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Card,
  Divider

} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CloseIcon from '@material-ui/icons/Close';
import { grey } from '@material-ui/core/colors';
import { styled } from '@material-ui/core/styles';
import _ from '@lodash';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';

import Dropzone from '../../shared-components/Dropzone';
import ImageAttach from '../../shared-components/ImageAttach';
import FileAttach from '../../shared-components/FileAttach';
import * as Actions from '../store/actions';

import AttachFile from './AttachFile';
import CustomSelect from './CustomSelect';

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
  }
}));
const typeToNameDict = {
  'ROUTING INQUIRY/DISCREPANCY':
    'We found discrepancy in the routing information between SI and OPUS booking details',
  'BL TYPE': 'Please provide the missing information below',
  '': 'We found discrepancy in the routing information between SI and OPUS booking details'
};
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
        }}
      >
        <div style={{ paddingTop: '6px', marginRight: '1rem' }}>
          <DisabledRadioButtonUncheckedIcon />
        </div>
        <div style={{ height: '50px', width: '95%' }}>
          <TextField
            fullWidth
            value={value}
            style={{ marginLeft: '1rem' }}
            autoFocus={true}
            onFocus={(e) => e.target.select()}
            onChange={(e) => handleChangeChoice(e, index)}
            onnFocus={handleFocus}
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
  const dispatch = useDispatch();
  const { questions, question, index, saveQuestion } = props;
  const classes_disabled = inputStyleDisabled();
  const classes = inputStyle();

  const handleAddChoice = () => {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[index].answerObj.push(
      'Option ' + (optionsOfQuestion[index].answerObj.length + 1)
    );
    saveQuestion(optionsOfQuestion);
  };
  const handleRemoveChoice = (id) => {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[index].answerObj.splice(id, 1);
    saveQuestion(optionsOfQuestion);
  };
  const handleChangeChoice = (e, id) => {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[index].answerObj[id] = e.target.value;
    saveQuestion(optionsOfQuestion);
  };

  const { uploadImageAttach, handleRemoveImageAttach } = props;
  return (
    <div style={{ paddingTop: '2rem' }}>
      {question.answerObj.map((value, k) => {
        return (
          <Choice
            key={k}
            value={value}
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

const AttachmentAnswer = () => {
  return (
    <div style={{ marginTop: '1rem' }}>
      <Dropzone disabled={true} />
    </div>
  );
};

// Main Component
const InquiryPreview = (props) => {
  // custom attribute must be lowercase
  const dispatch = useDispatch();
  const classes = useStyles();
  const { defaultContent, index, question, questions, saveQuestion } = props;
  const metadata = useSelector((state) => state.workspace.inquiryReducer.metadata);

  const removeQuestion = () => {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion.splice(index, 1);
    if (index > 0) {
      dispatch(Actions.setEdit(index - 1));
    }
    saveQuestion(optionsOfQuestion);
  };

  const copyQuestion = () => {
    const temp = JSON.parse(JSON.stringify(question));
    saveQuestion([...questions, temp]);
  };

  const handleTypeChange = (e) => {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[index].inqType = e.target.value;
    optionsOfQuestion[index].content = typeToNameDict[e.target.value];
    saveQuestion(optionsOfQuestion);
  };

  const handleFieldChange = (e) => {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[index].field = e.target.value;
    saveQuestion(optionsOfQuestion);
  };

  const handleNameChange = (e) => {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[index].content = e.target.value;
    saveQuestion(optionsOfQuestion);
  };

  const handleAnswerTypeChange = (e) => {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[index].ansType = e.target.value;
    saveQuestion(optionsOfQuestion);
  };
  
  const handleRemoveImageAttach = (i) => {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[index].mediaFile.splice(i, 1);
    saveQuestion(optionsOfQuestion);
  };

  return (
    <div style={{ display: 'flex' }}>
      <div
        style={{
          width: '6px',
          backgroundColor: '#4285f4',
          borderTopLeftRadius: '8px',
          borderBottomLeftRadius: '8px'
        }}
      />
      <Card style={{ padding: '1rem' }}>
        <div className="flex justify-end" style={{ marginRight: '-1rem' }}>
          <RadioGroup defaultValue="onshore" aria-label="target-inquiry" name="target-inquiry" row>
            <FormControlLabel
              value="onshore"
              control={<Checkbox color="primary" />}
              label="Onshore"
            />
            <FormControlLabel
              value="customer"
              control={<Checkbox color="primary" />}
              label="Customer"
            />
          </RadioGroup>
        </div>
        <Grid container style={{ width: '750px' }} spacing={1}>
          <Grid item xs={12} className="flex justify-between">
            <CustomSelect
              value={question.inqType}
              name="Question type"
              onChange={handleTypeChange}
              options={metadata.inq_type_options}
            />
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
            <CustomSelect
              value={question.field}
              name="Question title"
              onChange={handleFieldChange}
              options={metadata.field_options}
            />
          </Grid>
        </Grid>
        <div className="mt-32 mx-8">
          <TextField
            value={question.content}
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
          <AttachmentAnswer style={{ marginTop: '1rem' }} />
        )}
        <Divider className="mt-12" />
        <div className="flex justify-end items-center mr-2 ">
          <AttachFile index={index}/>
          <IconButton className="p-8" onClick={copyQuestion}>
            <FileCopyIcon />
          </IconButton>
          <IconButton disabled={questions.length === 1} className="p-8" onClick={removeQuestion}>
            <DeleteIcon />
          </IconButton>
        </div>
        {question.mediaFile.map((file, index) =>
          file.ext.includes('image') ? (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <Fab
                classes={{
                  root: classes.root
                }}
                size="small"
                onClick={() => handleRemoveImageAttach(index)}
              >
                <CloseIcon style={{ fontSize: 20 }} />
              </Fab>
              <ImageAttach file={file} style={{ margin: '1rem' }} />
            </div>
          ) : (
            
            <FileAttach file={file} field = {question.field} />

          )
        )}
      </Card>
    </div>
  );
};

export default InquiryPreview;
