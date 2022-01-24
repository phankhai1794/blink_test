import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions';

import {
  Button,
  TextField,
  Select,
  OutlinedInput,
  Grid,
  MenuItem,
  IconButton,
  Fab,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Card
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FormControl } from '@material-ui/core';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import CloseIcon from '@material-ui/icons/Close';
import { grey } from '@material-ui/core/colors';
import { styled } from '@material-ui/core/styles';
import _ from '@lodash';
import Dropzone from '../../shared-components/Dropzone';
import ImageAttach from '../../shared-components/ImageAttach';
import SubjectIcon from '@material-ui/icons/Subject';
import BackupIcon from '@material-ui/icons/Backup';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import DeleteIcon from '@material-ui/icons/Delete';
import AttachFile from './AttachFile';

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
      borderBottom: `1px solid ${theme.palette.text.primary} !important`
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
    whiteSpace: 'unset',
    wordBreak: 'break-all',
    width: '100%',
    height: '100%',
    '& .MuiSelect-outlined': {
      width: '100%'
    }
  }
}));
const typeToNameDict = {
  'ROUTING INQUIRY/DISCREPANCY':
    'We found discrepancy in the routing information between SI and OPUS booking details',
  'BL TYPE':
    'Please provide the missing information below',
  'BROKEN ROUTE ERROR':
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
            onChange={(e) => handleChangeChoice(e,index)}
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
  const {questions, question, index} = props
  const classes_disabled = inputStyleDisabled();
  const classes = inputStyle();

  const handleAddChoice = () => {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[index].choices.push("Option " + (optionsOfQuestion[index].choices.length + 1))
    dispatch((Actions.setQuestion(optionsOfQuestion)))
  };
  const handleRemoveChoice = (id) => {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[index].choices.splice(id, 1)
    dispatch((Actions.setQuestion(optionsOfQuestion)))
  };
  const handleChangeChoice = (e, id) => {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[index].choices[id] = e.target.value
    dispatch((Actions.setQuestion(optionsOfQuestion)))
  };

  const {
    uploadImageAttach,
    handleRemoveImageAttach
  } = props;
  return (
    <div style={{ paddingTop: '2rem' }}>
      { question.choices.map((value, k) => {
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
      <div className="flex">
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
  const selectStyle = useStyles();
  const { questionIsEmpty, defaultContent, index } = props;
  const [ftitle, questions] = useSelector((state) => [state.workspace.currentField, state.workspace.question])
  const question = questions[index]
  const [questionInfo, setQuestionInfo] = useState(
    !questionIsEmpty
      ? {
          name: question.name,
          type: question.type,
          answerType: question.answerType,
          selectedChoice: question.selectedChoice,
          addOther: question.addOther,
          otherChoice: question.otherChoice
          // divRef will be add on function OnSave to prevent storing too much temp state info
        }
      : {
          name: typeToNameDict['ROUTING INQUIRY/DISCREPANCY'],
          type: 'ROUTING INQUIRY/DISCREPANCY',
          answerType: 'CHOICE ANSWER',
          selectedChoice: '',
          addOther: false,
          otherChoice: '',
          src: ''
        }
  );
  const [questionTitle, setQuestionTitle] = useState(ftitle || ' ');  

  const removeQuestion = () => {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion.splice(index, 1)
    if (index > 0) {
      dispatch(Actions.setEdit(index - 1));
    }
    dispatch((Actions.setQuestion(optionsOfQuestion)))
  }

  const copyQuestion = () => {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion.splice(index, 1)
    dispatch((Actions.setQuestion(optionsOfQuestion)))
  }

  const handleTypeChange = (e) => {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[index].type = e.target.value
    optionsOfQuestion[index].name = typeToNameDict[e.target.value]
    dispatch((Actions.setQuestion(optionsOfQuestion)))
  };

  const handleTitleChange = (e) => {
    setQuestionTitle(e.target.value);
    // onSave()
    // console.log(questionTitle)
  };
  const handleFieldChange = (e) => {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[index].field = e.target.value
    dispatch((Actions.setQuestion(optionsOfQuestion)))
  };

  const handleNameChange = (e) => {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[index].name = e.target.value
    dispatch((Actions.setQuestion(optionsOfQuestion)))
  };

  const handleAnswerTypeChange = (e) => {
    var optionsOfQuestion = [...questions];
    optionsOfQuestion[index].answerType = e.target.value
    dispatch((Actions.setQuestion(optionsOfQuestion)))
  };

  const handleUploadImageAttach = (src) => {
    setQuestionInfo({
      ...questionInfo,
      src: src
    });
  };
  const handleRemoveImageAttach = () => {
    setQuestionInfo({
      ...questionInfo,
      src: null
    });
  };
 
  return (
    <div style={{display: "flex"}}>
      <div style={{width: "6px", backgroundColor: "#4285f4", borderTopLeftRadius: "8px", borderBottomLeftRadius: "8px"}}/>
      <Card style={{ padding: '1rem' }}>
        <div className="flex justify-end mt-12 " style={{ marginRight: '-1rem' }}>
          <RadioGroup defaultValue="onshore" aria-label="target-inquiry" name="target-inquiry" row>
            <FormControlLabel value="onshore" control={<Checkbox color="primary" />} label="Onshore" />
            <FormControlLabel
              value="customer"
              control={<Checkbox color="primary" />}
              label="Customer"
            />
          </RadioGroup>
        </div>
        <Grid container style={{ width: '750px' }} spacing={1}>
          <Grid item xs={5}>
            <FormControl>
              <Select
                value={question.type}
                name="Question type"
                onChange={handleTypeChange}
                input={<OutlinedInput />}
              >
                <MenuItem value="ROUTING INQUIRY/DISCREPANCY">
                  {' '}
                  Routing Inquiry/Discripancy
                </MenuItem>
                <MenuItem value="BL TYPE">
                  BL Type
                </MenuItem>
                <MenuItem value="BROKEN ROUTE ERROR">Broken Route Error</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl>
              <Select
                value={question.answerType}
                name="Question answer type"
                onChange={handleAnswerTypeChange}
                input={<OutlinedInput />}
              >
                <MenuItem value="CHOICE ANSWER" classes={{ root: selectStyle.root }}>
                  {/* <ListItem style={{ p: 0 }}> */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <RadioButtonCheckedIcon fontSize="small" style={{ marginRight: '1rem' }} />
                    <div>Option selection</div>
                  </div>
                </MenuItem>
                <MenuItem value="PARAGRAPH ANSWER">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <SubjectIcon fontSize="small" style={{ marginRight: '1rem' }} />
                    <div>Customer input</div>
                  </div>
                </MenuItem>
                <MenuItem value="ATTACHMENT ANSWER">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <BackupIcon fontSize="small" style={{ marginRight: '1rem' }} />
                    <div>Customer add attachment</div>
                  </div>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <div className="flex justify-end" style={{ marginLeft: 'auto', width: '90%' }}>
              <FormControl style={{ width: '100%', height: '100%' }}>
                <Select
                  value={question.field}
                  name="Question title"
                  input={<OutlinedInput />}
                  onChange={handleFieldChange}
                >
                  <MenuItem value="other">Other Field</MenuItem>
                  <MenuItem value="shipper">Shipper/Exporter</MenuItem>
                  <MenuItem value="consignee">Consignee</MenuItem>
                  <MenuItem value="port_of_loading">Poft of Loading</MenuItem>
                  <MenuItem value="place_of_receipt">Place of Receipt</MenuItem>
                  <MenuItem value="place_of_delivery">Place of Delivery</MenuItem>
                  <MenuItem value="port_of_discharge">Port of Discharge</MenuItem>
                </Select>
              </FormControl>
            </div>
          </Grid>
        </Grid>
        <div style={{ marginTop: '1rem' }}>
          <TextField
            value={question.name}
            variant="outlined"
            multiline
            onFocus={(e) => e.target.select()}
            onChange={handleNameChange}
            style={{ width: '100%', resize: 'none' }}
          />
        </div>
        {question.answerType === 'CHOICE ANSWER' && (
          <ChoiceAnswer
            questions={questions}
            question={question}
            index={index}
          />
        )}
        {question.answerType === 'PARAGRAPH ANSWER' && (
          <div style={{ marginTop: '2rem' }}>
            <ParagraphAnswer />
          </div>
        )}
        {question.answerType === 'ATTACHMENT ANSWER' && (
          <AttachmentAnswer style={{ marginTop: '1rem' }} />
        )}

        <div className="flex justify-end mt-12 mr-2 ">
          <AttachFile uploadImageAttach={handleUploadImageAttach} />
          <IconButton style={{ padding: '2px' }} onClick={copyQuestion}><FileCopyIcon /></IconButton>
          <IconButton style={{ padding: '2px' }} onClick={removeQuestion}><DeleteIcon /></IconButton>
        </div>
        {question.src && (
          <div style={{ position: 'relative' }}>
            <Fab
              color="primary"
              style={{
                position: 'absolute',
                left: '185px',
                top: '-15px'
              }}
              size="small"
              variant="contained"
              onClick={handleRemoveImageAttach}
            >
              <CloseIcon />
            </Fab>
            <ImageAttach src={question.src} style={{ margin: '1rem' }} />
          </div>
        )}
      </Card>
    </div>
  );
};

export default InquiryEditor;
