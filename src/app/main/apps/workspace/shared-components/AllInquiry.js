import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../admin/store/actions';
import ChoiceAnswer from './ChoiceAnswer';
import ParagraphAnswer from './ParagraphAnswer';
import AttatchmentAnswer from './AttatchmentAnswer';
import InquiryEditor from '../admin/components/InquiryEditor';
import ImageAttach from './ImageAttach';
import FileAttach from './FileAttach';
import { getKeyByValue } from '@shared';
import { getFile } from 'app/services/fileService';
import { Card, Typography } from '@material-ui/core';

const AllInquiry = (props) => {
  const { user, receiver } = props;
  const isAdmin = user === 'workspace';
  const dispatch = useDispatch();
  const [inquiries, openEdit, metadata] = useSelector((state) => [
    state.workspace.inquiryReducer.inquiries,
    state.workspace.inquiryReducer.openEditInq,
    state.workspace.inquiryReducer.metadata
  ]);

  const changeToEditor = (index) => {
    if (index !== openEdit) dispatch(Actions.setEditInq(index));
  };

  useEffect(() => {
    const optionsOfQuestion = [...inquiries];
    for (let i in inquiries) {
      if (inquiries[i].mediaFile.length && !inquiries[i].mediaFile[0].src) {
        for (let f in inquiries[i].mediaFile) {
          getFile(inquiries[i].mediaFile[f].id)
            .then((file) => {
              let url = '';
              if (inquiries[i].mediaFile[f].ext.match(/jpeg|jpg|png/g)) {
                url = URL.createObjectURL(new Blob([file], { type: 'image/jpeg' }));
              } else {
                url = URL.createObjectURL(new Blob([file]));
              }
              optionsOfQuestion[i].mediaFile[f].src = url;
              dispatch(Actions.editInquiry(optionsOfQuestion));
            })
            .catch((error) => console.log(error));
        }
      }
    }
  }, []);
  return (
    <>
      {inquiries.map((q, index) => {
        if (receiver && !q.receiver.includes(receiver)) {
          return (
            <div
              style={{ display: 'flex', width: '770px', marginBottom: '24px' }}
              onClick={() => changeToEditor(index)}
            ></div>
          );
        }
        const type = q.ansType;
        return (
          <div
            style={{ width: '770px', marginBottom: '24px' }}
            onClick={() => changeToEditor(index)}
          >
            {isAdmin && openEdit === index ? (
              <InquiryEditor
                index={index}
                questions={inquiries}
                question={q}
                saveQuestion={(e) => dispatch(Actions.editInquiry(e))}
              />
            ) : (
              <Card style={{ padding: '1rem ', marginBottom: '24px' }}>
                <div className="flex justify-between">
                  <Typography color="primary" variant="h5">
                    Inquiry {index + 1} - {getKeyByValue(metadata['field'], q.field)}
                  </Typography>
                </div>
                <Typography variant="h5">{q.name}</Typography>
                <Typography variant="h5">{q.content}</Typography>

                <div style={{ display: 'block', margin: '1rem 0rem' }}>
                  {type === metadata.ans_type.choice && <ChoiceAnswer question={q} />}
                  {type === metadata.ans_type.paragraph && <ParagraphAnswer question={q} />}
                  {type === metadata.ans_type.attachment && (
                    <AttatchmentAnswer
                      question={q}
                      // disabled={true}
                    />
                  )}
                </div>
                {q.mediaFile.map((file, index) =>
                  file.ext.match(/jpeg|jpg|png/g) ? (
                    <ImageAttach src={file.src} style={{ margin: '1rem' }} />
                  ) : (
                    <FileAttach file={file} />
                  )
                )}
              </Card>
            )}
          </div>
        );
      })}
    </>
  );
};

export default AllInquiry;
