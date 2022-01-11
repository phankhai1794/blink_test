import React, { useState, useEffect } from 'react';
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
  Radio,
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
  'MISSING DESTINATION REQUIREMENT':
    'We found discrepancy in the routing information between SI and OPUS booking details',
  'BROKEN ROUTE ERROR':
    'We found discrepancy in the routing information between SI and OPUS booking details'
};
// Sub Commporent
const FirstChoice = (props) => {
  const { handleChange, question } = props;
  const [isHover, setIsHover] = useState(false);
  const [isOnFocus, setIsOnFocus] = useState(false);
  const classes = inputStyle();
  const handleFocus = (e) => {
    setIsOnFocus(true);
    e.target.select();
  };
  return (
    <>
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
            style={{ border: 'none' }}
            name="input"
            value={question.content}
            onChange={(e) => handleChange(e, question.id)}
            fullWidth={true}
            onFocus={handleFocus}
            InputProps={{
              classes
            }}
          />
        </div>
      </div>
    </>
  );
};
const Choice = (props) => {
  const { id, question, handleChange, handleRemoveChoice } = props;
  const [isHover, setIsHover] = useState(false);
  const [isOnFocus, setIsOnFocus] = useState(false);
  const handleFocus = (e) => {
    setIsOnFocus(true);
    e.target.select();
  };
  const classes = inputStyle();
  return (
    <div key={id}>
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
            value={question.content}
            style={{ marginLeft: '1rem' }}
            autoFocus={true}
            onFocus={(e) => e.target.select()}
            onChange={(e) => handleChange(e, question.id)}
            onnFocus={handleFocus}
            InputProps={{
              classes
            }}
          />
        </div>
        <div style={{ marginLeft: '1rem' }}>
          <IconButton onClick={() => handleRemoveChoice(question.id)} style={{ padding: '2px' }}>
            <CloseIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
};
const ChoiceAnswer = (props) => {
  const classes_disabled = inputStyleDisabled();
  const classes = inputStyle();
  const {
    addOther,
    choiceList,
    handleAddOtherChoice,
    handleAddChoice,
    handleChange,
    handleRemoveChoice,
    handleRemoveOtherChoice,
    uploadImageAttach,
    handleRemoveImageAttach
  } = props;
  return (
    <div style={{ paddingTop: '2rem' }}>
      {/* if there are 1 choice -> remove close button in the end */}
      {choiceList.length === 1 ? (
        <FirstChoice question={choiceList[0]} id={choiceList[0]} handleChange={handleChange} />
      ) : (
        choiceList.map((question, index) => {
          return (
            <Choice
              question={question}
              key={index}
              handleChange={handleChange}
              handleRemoveChoice={handleRemoveChoice}
              handleChange={handleChange}
            />
          );
        })
      )}
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
  const selectStyle = useStyles();
  const { question, questionIsEmpty, defaultContent } = props;
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
  const [questionTitle, setQuestionTitle] = useState(props.defaultTitle || ' ');
  const [choiceList, setChoiceList] = useState(
    !questionIsEmpty
      ? question.choices
      : [
          {
            id: 1,
            content: defaultContent
          }
        ]
  );
  const handleAddChoice = () => {
    setChoiceList((prevQuestion) => [
      ...prevQuestion,
      {
        id: choiceList[choiceList.length - 1].id + 1,
        content: `Add Option ${choiceList.length + 1}`
      }
    ]);
  };
  const handleAddOtherChoice = () => {
    setQuestionInfo({
      ...questionInfo,
      addOther: true
    });
  };
  const handleRemoveOtherChoice = () => {
    setQuestionInfo({
      ...questionInfo,
      addOther: false
    });
  };
  const handleRemoveChoice = (id) => {
    const data = choiceList.filter((question) => question.id !== id);
    setChoiceList(data);
  };
  const handleChange = (e, id) => {
    e.preventDefault();
    const questionIndex = choiceList.findIndex((question) => question.id === id);
    let temp = [...choiceList];
    temp[questionIndex].content = e.target.value;
    setChoiceList(temp);
  };
  const handleTypeChange = (e) => {
    setQuestionInfo({
      ...questionInfo,
      type: e.target.value,
      name: typeToNameDict[e.target.value]
    });
  };
  const handleTitleChange = (e) => {
    setQuestionTitle(e.target.value);
    // onSave()
    // console.log(questionTitle)
  };
  useEffect(() => {
    if (questionTitle && questionTitle !== ' ') {
      let savedQuestion = {
        name: questionInfo.name,
        type: questionInfo.type,
        answerType: questionInfo.answerType,
        choices: choiceList,
        addOther: questionInfo.addOther,
        src: questionInfo.src
      };
      props.handleUpdateQuestion(
        {
          savedQuestion
        },
        questionTitle
      );
    }
  }, [questionInfo, choiceList, questionTitle]);
  const handleNameChange = (e) => {
    setQuestionInfo({
      ...questionInfo,
      name: e.target.value
    });
  };
  const handleAnswerTypeChange = (e) => {
    setQuestionInfo({
      ...questionInfo,
      answerType: e.target.value
    });
  };
  const onSave = () => {
    let savedQuestion = {
      name: questionInfo.name,
      type: questionInfo.type,
      answerType: questionInfo.answerType,
      choices: choiceList,
      addOther: questionInfo.addOther,
      src: questionInfo.src
    };
    props.handleUpdateQuestion(savedQuestion, questionTitle);
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
  const handleAddQuestion = () => {
    let savedQuestion = {
      name: questionInfo.name,
      type: questionInfo.type,
      answerType: questionInfo.answerType,
      choices: choiceList,
      addOther: questionInfo.addOther,
      src: questionInfo.src
    };
    props.handleAddQuestion(savedQuestion, questionTitle);
    setQuestionTitle(' ');
  };
  return (
    <div>
      <Card style={{ padding: '1rem' }}>
        <div className="flex justify-end mt-12 " style={{ marginRight: '-1rem' }}>
          <RadioGroup defaultValue="onshore" aria-label="target-inquiry" name="target-inquiry" row>
            <FormControlLabel value="onshore" control={<Radio color="primary" />} label="Onshore" />
            <FormControlLabel
              value="customer"
              control={<Radio color="primary" />}
              label="Customer"
            />
          </RadioGroup>
        </div>
        <Grid container style={{ width: '750px' }} spacing={1}>
          <Grid item xs={5}>
            <FormControl>
              <Select
                value={questionInfo.type}
                name="Question type"
                onChange={handleTypeChange}
                input={<OutlinedInput />}
              >
                <MenuItem value="ROUTING INQUIRY/DISCREPANCY">
                  {' '}
                  Routing Inquiry/Discripancy
                </MenuItem>
                <MenuItem value="MISSING DESTINATION REQUIREMENT">
                  Missing Destination Requirment
                </MenuItem>
                <MenuItem value="BROKEN ROUTE ERROR">Broken Route Error</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl>
              <Select
                value={questionInfo.answerType}
                name="Question answer type"
                onChange={handleAnswerTypeChange}
                input={<OutlinedInput />}
              >
                <MenuItem value="CHOICE ANSWER" classes={{ root: selectStyle.root }}>
                  {/* <ListItem style={{ p: 0 }}> */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <RadioButtonCheckedIcon fontSize="small" style={{ marginRight: '1rem' }} />
                    <div>Choice Answer</div>
                  </div>
                </MenuItem>
                <MenuItem value="PARAGRAPH ANSWER">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <SubjectIcon fontSize="small" style={{ marginRight: '1rem' }} />
                    <div>Paragraph Answer</div>
                  </div>
                </MenuItem>
                <MenuItem value="ATTACHMENT ANSWER">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <BackupIcon fontSize="small" style={{ marginRight: '1rem' }} />
                    <div>Attachment Answer</div>
                  </div>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <div className="flex justify-end" style={{ marginLeft: 'auto', width: '90%' }}>
              <FormControl style={{ width: '100%', height: '100%' }}>
                <Select
                  value={questionTitle}
                  name="Question title"
                  input={<OutlinedInput />}
                  onChange={(e) => setQuestionTitle(e.target.value)}
                >
                  <MenuItem value=" ">OTHER FIELD</MenuItem>
                  {props.filteredTitles.map((title, index) => {
                    return (
                      <MenuItem value={title} key={index}>
                        {title.replace(/<[^>]*>?/gm, '')}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
          </Grid>
        </Grid>
        <div style={{ marginTop: '1rem' }}>
          <TextField
            value={questionInfo.name}
            variant="outlined"
            multiline
            onFocus={(e) => e.target.select()}
            onChange={handleNameChange}
            style={{ width: '100%', resize: 'none' }}
          />
        </div>
        {questionInfo.answerType === 'CHOICE ANSWER' && (
          <ChoiceAnswer
            addOther={questionInfo.addOther}
            choiceList={choiceList}
            handleAddOtherChoice={handleAddOtherChoice}
            handleAddChoice={handleAddChoice}
            handleChange={handleChange}
            handleRemoveChoice={handleRemoveChoice}
            handleRemoveOtherChoice={handleRemoveOtherChoice}
          />
        )}
        {questionInfo.answerType === 'PARAGRAPH ANSWER' && (
          <div style={{ marginTop: '2rem' }}>
            <ParagraphAnswer />
          </div>
        )}
        {questionInfo.answerType === 'ATTACHMENT ANSWER' && (
          <AttachmentAnswer style={{ marginTop: '1rem' }} />
        )}

        <div className="flex justify-end mt-12 mr-2 ">
          <RadioGroup aria-label="quiz" name="quiz" row>
            <FormControlLabel
              value="best"
              control={<AttachFile uploadImageAttach={handleUploadImageAttach} />}
            />
            <FormControlLabel value="best" control={<FileCopyIcon />} />
            <FormControlLabel value="worst" control={<DeleteIcon />} />
          </RadioGroup>
        </div>
        {questionInfo.src && (
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
            <ImageAttach src={questionInfo.src} style={{ margin: '1rem' }} />
          </div>
        )}
      </Card>
    </div>
  );
};

export default InquiryEditor;
