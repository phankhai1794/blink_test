import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../admin/store/actions';
import ChoiceAnswer from './ChoiceAnswer';
import ParagraphAnswer from './ParagraphAnswer';
import AttatchmentAnswer from './AttatchmentAnswer';
import InquiryEditor from '../admin/components/InquiryEditor';
import ImageAttach from './ImageAttach';
import FileAttach from './FileAttach';
import { getKeyByValue } from 'app/main/shared-functions';
import { getFile } from 'app/main/api/file';
import { Card, Typography } from '@material-ui/core';

const AllInquiry = (props) => {
  const dispatch = useDispatch();
  const { user } = props;
  const [inquiries, openEdit, metadata] = useSelector((state) => [
    state[user].inquiries,
    state[user].openEdit1,
    state[user].metadata
  ]);

  const changeToEditor = (index) => {
    if (index !== openEdit) dispatch(Actions.setEdit1(index));
  };

  useEffect(() => {
    const optionsOfQuestion = [...inquiries];
    for (let i in inquiries) {
      if (inquiries[i].media.length && !inquiries[i].files[0].src) {
        for (let f in inquiries[i].media) {
          getFile(inquiries[i].media[f].id)
            .then((file) => {
              let url = '';
              if (inquiries[i].files[f].type.match(/jpeg|jpg|png/g)) {
                url = URL.createObjectURL(new Blob([file], { type: 'image/jpeg' }));
              } else {
                url = URL.createObjectURL(new Blob([file]));
              }
              optionsOfQuestion[i].files[f].src = url;
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
        const type = q.ansType;
        return (
          <div
            style={{ width: '770px', marginBottom: '24px' }}
            onClick={() => changeToEditor(index)}
          >
            {openEdit === index ? (
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
                {q.files &&
                  q.files.map((file, index) =>
                    file.type.match(/jpeg|jpg|png/g) ? (
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