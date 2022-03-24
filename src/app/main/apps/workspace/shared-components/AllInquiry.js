import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../admin/store/actions';
import ChoiceAnswer from './ChoiceAnswer';
import ParagraphAnswer from './ParagraphAnswer';
import AttatchmentAnswer from './AttatchmentAnswer';
import InquiryEditor from '../admin/components/InquiryEditor';
import ImageAttach from './ImageAttach';
import FileAttach from './FileAttach';
import {getKeyByValue} from '../shared-functions';
import { Card, Typography } from '@material-ui/core';

const AllInquiry = (props) => {
  const dispatch = useDispatch()
  const { user } = props
  const [question, openEdit, metadata] = useSelector((state) => [state[user].inquiries, state[user].openEdit1, state[user].metadata])

  const changeToEditor = (index) => {
    if (index !== openEdit)
      dispatch(Actions.setEdit1(index));
  };
  return (
    <>
      {question.map((q, index) => {
        const type = q.ansType
        return (
          <div style={{ width: '770px', marginBottom: "24px" }} onClick={() => changeToEditor(index)}>
            {openEdit === index ? <InquiryEditor index={index} questions={question} question={q} saveQuestion={(e) => dispatch((Actions.editInquiry(e)))} /> :
              <Card style={{ padding: '1rem ', marginBottom: '24px' }}>
                <div className="flex justify-between">
                  <Typography color='primary' variant="h5">Inquiry {index + 1} -  {getKeyByValue(metadata["field"], q.field)}</Typography>
                </div>
                <Typography variant="h5">{q.name}</Typography>
                <div style={{ display: 'block', margin: '1rem 0rem' }}>
                  {type === metadata.ans_type.choice && (
                    <ChoiceAnswer question={q} />
                  )}
                  {type === metadata.ans_type.paragraph && (
                    <ParagraphAnswer question={q} />
                  )}
                  {type === metadata.ans_type.attachment && (
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
              </Card>}
          </div>
        )
      })
      }

    </>
  );
};

export default AllInquiry;
