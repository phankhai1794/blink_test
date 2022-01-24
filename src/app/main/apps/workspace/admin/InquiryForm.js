import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
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


const InquiryForm = (props) => {
  const { FabTitle } = props;
  const [questions , title] = useSelector((state) =>[state.workspace.question, state.workspace.currentField] )
  const tempQuestionNum = questions.length
  return (
      <Form
        FabTitle={FabTitle}
        title={tempQuestionNum === 1 ? title : 'open Inquiries'}
      >
        <>
          { questions.map((question, index) => (
            <Inquiry style={{ marginBottom: '2rem' }} index={index} question={question} />
          ))
          }
        </>
      </Form>
  );
};

export default InquiryForm;
