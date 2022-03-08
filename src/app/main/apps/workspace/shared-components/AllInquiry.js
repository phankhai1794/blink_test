import React, {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../admin/store/actions';
import ChoiceAnswer from './ChoiceAnswer';
import ParagraphAnswer from './ParagraphAnswer';
import AttatchmentAnswer from './AttatchmentAnswer';
import InquiryEditor from '../admin/components/InquiryEditor';
import ImageAttach from './ImageAttach';
import FileAttach from './FileAttach';
import { Card, Typography } from '@material-ui/core';

const AllInquiry = (props) => {
  const dispatch = useDispatch()
  const {user} = props
  const [question , openEdit] = useSelector((state) => [state[user].questionSaved,state[user].openEdit1])

  const changeToEditor = (index) => {
    if (index !== openEdit)
      dispatch(Actions.setEdit1(index));
  };
  return (
    <>
      {question.map((q, index) => {
        const type = q.answerType
       return (
        <div style={{ width: '770px', marginBottom: "24px" }} onClick={() => changeToEditor(index)}>
        {openEdit === index ? <InquiryEditor index={index} questions={question} question={q} saveQuestion={(e) => dispatch((Actions.editQuestion(e)))}  /> :
            <Card style={{ padding: '1rem ', marginBottom: '24px' }}>
                <div className="flex justify-between">
                    <Typography color='primary' variant="h5">Inquiry {index + 1} - {q.field}</Typography>
                </div>
            <Typography variant="h5">{q.name}</Typography>
              <div style={{ display: 'block', margin: '1rem 0rem' }}>
                {type === 'CHOICE ANSWER' && (
                  <ChoiceAnswer question={q}  />
                )}
                {type === 'PARAGRAPH ANSWER' && (
                  <ParagraphAnswer question={q}  />
                )}
                {type === 'ATTACHMENT ANSWER' && (
                  <AttatchmentAnswer
                    question={q}
                    // disabled={true}
                  />
                )}
              </div>
              {q.files && (
                q.files.map((file, index) => (
                  file.type.includes("image") ? 
                  <ImageAttach src={file.src} style={{ margin: '1rem' }} /> : <FileAttach file={file} />
                ))
              )}
          </Card> }
          </div>
       )})
        }
    
    </>
  );
};

export default AllInquiry;
