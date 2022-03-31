import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions';
import {
  TextField,
  Grid,
  IconButton,
  Fab,
  FormControlLabel,
  Checkbox,
  Card,
  Divider,
  FormGroup
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CloseIcon from '@material-ui/icons/Close';
import { grey } from '@material-ui/core/colors';
import { styled } from '@material-ui/core/styles';
import _ from '@lodash';
import Dropzone from '../../shared-components/Dropzone';
import ImageAttach from '../../shared-components/ImageAttach';
import FileAttach from '../../shared-components/FileAttach';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';
import AttachFile from './AttachFile';
import CustomSelect from './CustomSelect';
import Select from 'react-select'
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
      borderBottom: 'none'
    },
    '&:hover:not($disabled):before': {
      borderBottom: `1px dashed ${theme.palette.text.primary} !important`
    },
    '&&&:before': {
      borderStyle: 'dashed'
    }
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
  'BL TYPE':
    'Please provide the missing information below',
  '':
    'We found discrepancy in the routing information between SI and OPUS booking details'
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
  const dispatch = useDispatch()
  const { questions, question, index, saveQuestion } = props
  const classes_disabled = inputStyleDisabled();
  const classes = inputStyle();

  const handleAddChoice = () => {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[index].choices.push("Option " + (optionsOfQuestion[index].choices.length + 1))
    saveQuestion(optionsOfQuestion)
  };
  const handleRemoveChoice = (id) => {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[index].choices.splice(id, 1)
    saveQuestion(optionsOfQuestion)
  };
  const handleChangeChoice = (e, id) => {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[index].choices[id] = e.target.value
    saveQuestion(optionsOfQuestion)
  };

  const {
    uploadImageAttach,
    handleRemoveImageAttach
  } = props;
  return (
    <div style={{ paddingTop: '2rem' }}>
      {question.choices.map((value, k) => {
        return (
          <Choice
            value={value}
            index={k}
            handleChangeChoice={handleChangeChoice}
            handleRemoveChoice={handleRemoveChoice}
          />
        );
      })
      }
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
const InquiryEditor = (props) => {
  // custom attribute must be lowercase
  const dispatch = useDispatch()
  const classes = useStyles();
  const { defaultContent, index, question, questions, saveQuestion } = props;
  const [metadata, removeOptions] = useSelector((state) => [state.workspace.metadata, state.workspace.removeOptions])
  const [valueType, setValueType] = useState(metadata.inq_type_options.filter(v => question.inqType === v.value))
  const [fieldType, setFieldType] = useState(metadata.field_options)
  const removeQuestion = () => {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion.splice(index, 1)
    if (index > 0) {
      dispatch(Actions.setEdit(index - 1));
    }
    saveQuestion(optionsOfQuestion)
  }

  useEffect(() => {
    let list = [...removeOptions]
    list[index] = ""
    setFieldType(metadata.field_options.filter(v => !list.includes(v.value)))
  }, [])

  const copyQuestion = () => {
    const temp = JSON.parse(JSON.stringify(question));
    saveQuestion([...questions, temp])
  }

  const handleTypeChange = (e) => {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[index].inqType = e.value
    setValueType(e)
    saveQuestion(optionsOfQuestion)
  };

  const handleFieldChange = (e) => {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[index].field = e.target.value
    var options = [...removeOptions]
    options[index] = e.target.value
    dispatch(Actions.removeSelectedOption(options));
    saveQuestion(optionsOfQuestion)
  };

  const handleNameChange = (e) => {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[index].content = e.target.value
    saveQuestion(optionsOfQuestion)
  };

  const handleReceiverChange = (e) => {
    var optionsOfQuestion = [...questions];
    if (e.target.checked) {
      optionsOfQuestion[index].receiver.push(e.target.value)
    }
    else {
      const i = optionsOfQuestion[index].receiver.indexOf(e.target.value);
      optionsOfQuestion[index].receiver.splice(i, 1)
    }
    saveQuestion(optionsOfQuestion)
  };

  const handleAnswerTypeChange = (e) => {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[index].ansType = e.target.value
    saveQuestion(optionsOfQuestion)
  };

  const handleUploadImageAttach = (src) => {
    var optionsOfQuestion = [...questions];
    var list = optionsOfQuestion[index].files
    optionsOfQuestion[index].files = [...list, { src: URL.createObjectURL(src), type: src.type, name: src.name }]
    saveQuestion(optionsOfQuestion)
  };
  const handleRemoveImageAttach = (i) => {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[index].files.splice(i, 1)
    saveQuestion(optionsOfQuestion)
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "6px", backgroundColor: "#4285f4", borderTopLeftRadius: "8px", borderBottomLeftRadius: "8px" }} />
      <Card style={{ padding: '1rem' }}>
        <div className="flex justify-end" style={{ marginRight: '-1rem' }}>
          <FormGroup row>
            <FormControlLabel
              value="onshore"
              control={<Checkbox
                checked={question.receiver.includes("onshore")}
                onChange={handleReceiverChange}
                color="primary" />}
              label="Onshore" />
            <FormControlLabel
              value="customer"
              control={<Checkbox
                checked={question.receiver.includes("customer")}
                onChange={handleReceiverChange}
                color="primary" />}
              label="Customer"
            />
          </FormGroup>
        </div>
        <Grid container style={{ width: '750px' }} spacing={1}>
          <Grid item xs={12} className="flex justify-between">
            <Select
              value={valueType}
              options={metadata.inq_type_options}
              onChange={handleTypeChange}
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
              options={fieldType}
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
        <Divider className='mt-12' />
        <div className="flex justify-end items-center mr-2 ">
          <AttachFile uploadImageAttach={handleUploadImageAttach} />
          <IconButton className='p-8' onClick={copyQuestion}><FileCopyIcon /></IconButton>
          <IconButton disabled={questions.length === 1} className='p-8' onClick={removeQuestion}><DeleteIcon /></IconButton>
        </div>
        {question.files && (
          question.files.map((file, index) => (
            file.type.includes("image") ?
              <div style={{ position: 'relative' }}>
                <Fab
                  classes={{
                    root: classes.root
                  }}
                  size="small"
                  onClick={() => handleRemoveImageAttach(index)}
                >
                  <CloseIcon style={{ fontSize: 20 }} />
                </Fab>
                <ImageAttach src={file.src} style={{ margin: '1rem' }} />
              </div> :
              <FileAttach file={file} />
          ))
        )}
      </Card>
    </div>
  );
};

export default InquiryEditor;
