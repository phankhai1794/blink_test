import React from 'react';
import { Grid } from '@material-ui/core';
import SubmitInquiriesForm from './components/InquiryEditor';
import Form from '../shared-components/Form';
import InquiryEditor from './components/InquiryEditor';
import Inquiry from '../shared-components/Inquiry';
const mockQuestion = {
  paragraphAnswer: {
    title: 'OCEAN VESSEL VOYAGE NO. FlAG',
    question: {
      name: 'We found discrepancy in the routing information between SI and OPUS booking details',
      type: 'ROUTING INQUIRY/DISCREPANCY',
      answerType: 'PARAGRAPH ANSWER',
      paragraph: '',
      selectedChoice: ''
    },
    content: 'CONFIDENCE 021W',
    open: false
  },
  choiceAnwer: {
    title: 'PORT OF LOADING',
    question: {
      name: 'We found discrepancy in the routing information between SI and OPUS booking details',
      type: 'ROUTING INQUIRY/DISCREPANCY',
      answerType: 'CHOICE ANSWER',
      choices: [
        {
          id: 1,
          content: 'TOKYO, JAPPAN'
        },
        {
          id: 2,
          content: 'BUSAN, KOREA'
        }
      ],
      addOther: true,
      selectedChoice: '',
      otherChoiceContent: 'MANILA, MALAYSIA'
    },
    content: 'TOKYO,JAPAN',
    open: false
  },
  AttatchmentAnswer: {
    'PORT OF DISCHARGE': {
      title: 'PORT OF DISCHARGE',
      question: {
        name: 'We found discrepancy in the routing information between SI and OPUS booking details',
        type: 'ROUTING INQUIRY/DISCREPANCY',
        answerType: 'ATTACHMENT ANSWER',
        choices: [],
        selectedChoice: '',
        fileName: 'document.pdf'
      },
      content: 'BUSAN, KOREA',
      open: false
    }
  }
};
const renderPrevInquiry = (questionNumber) => {
  let result = [];
  for (var i = 0; i < questionNumber; ++i) {
    result.push(
      <Inquiry style={{ marginBottom: '2rem' }} mockQuestion={mockQuestion.choiceAnwer} />
    );
  }
  return result;
};
const InquiryForm = (props) => {
  const { handleAddTempQuestion, open, toggle, FabTitle, filteredTitles, tempQuestionNum } = props;

  return (
    <Form
      open={open}
      toggleForm={toggle}
      FabTitle={FabTitle}
      onClickAddButton={handleAddTempQuestion}
      title={tempQuestionNum === 0 ? mockQuestion.choiceAnwer.title : 'open Inquiries'}
    >
      <div>
        {tempQuestionNum === 0 ? (
          <Grid container>
            <InquiryEditor filteredTitles={filteredTitles} questionIsEmpty={true} />
          </Grid>
        ) : (
          <>
            {renderPrevInquiry(tempQuestionNum)}
            <Grid container>
              <SubmitInquiriesForm filteredTitles={filteredTitles} questionIsEmpty={true} />
            </Grid>
          </>
        )}
      </div>
    </Form>
  );
};

export default InquiryForm;
