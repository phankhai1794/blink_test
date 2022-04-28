import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as InquiryActions from '../admin/store/actions/inquiry';
import ChoiceAnswer from './ChoiceAnswer';
import ParagraphAnswer from './ParagraphAnswer';
import AttachmentAnswer from './AttachmentAnswer';
import InquiryEditor from '../admin/components/InquiryEditor';
import ImageAttach from './ImageAttach';
import FileAttach from './FileAttach';
import { getKeyByValue } from '@shared';
import { getFile } from 'app/services/fileService';
import { Card, Typography } from '@material-ui/core';
import { PERMISSION, PermissionProvider } from '@shared';

const AllInquiry = (props) => {
  const dispatch = useDispatch();
  const { receiver } = props;
  const [inquiries, currentEdit, metadata] = useSelector((state) => [
    state.workspace.inquiryReducer.inquiries,
    state.workspace.inquiryReducer.currentEditInq,
    state.workspace.inquiryReducer.metadata
  ]);

  const changeToEditor = (index) => {
    if (index !== currentEdit) dispatch(InquiryActions.setEditInq(index));
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
              dispatch(InquiryActions.editInquiry(optionsOfQuestion));
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
              style={{ display: 'flex', marginBottom: '24px' }}
              onClick={() => changeToEditor(index)}
            ></div>
          );
        }
        const type = q.ansType;
        return (
          <div
            style={{ marginBottom: '24px' }}
            onClick={() => changeToEditor(index)}
          >
            <PermissionProvider
              action={PERMISSION.EDIT_INQUIRY}
              extraCondition={[currentEdit === index]}
              fallback={
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
                      <AttachmentAnswer
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
              }
            >
              <InquiryEditor
                index={index}
                questions={inquiries}
                question={q}
                saveQuestion={(e) => dispatch(InquiryActions.editInquiry(e))}
              />
            </PermissionProvider>
          </div>
        );
      })}
    </>
  );
};

export default AllInquiry;
