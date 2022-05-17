import { uploadFile } from 'app/services/fileService';
import { updateInquiry } from 'app/services/inquiryService';

import * as FormActions from '../store/actions/form';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: '34px',
    width: '120px'
  },
  button: {
    margin: theme.spacing(1)
  }
}));
const PopoverFooter = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [inquiries, originalInquiry] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.inquiries,
    workspace.inquiryReducer.originalInquiry
  ]);

  const inq = (inq) => {
    return {
      content: inq.content,
      field: inq.field,
      inqType: inq.inqType,
      ansType: inq.ansType,
      receiver: inq.receiver
    };
  };
  const onSave = async () => {
    try {
      for (let i = 0; i < originalInquiry.length; i++) {
        const ansCreate = inquiries[i].answerObj.filter(
          ({ id: id1 }) => !originalInquiry[i].answerObj.some(({ id: id2 }) => id2 === id1)
        );
        const ansDelete = originalInquiry[i].answerObj.filter(
          ({ id: id1 }) => !inquiries[i].answerObj.some(({ id: id2 }) => id2 === id1)
        );
        const ansUpdate = inquiries[i].answerObj.filter(({ id: id1, content: c1 }) =>
          originalInquiry[i].answerObj.some(({ id: id2, content: c2 }) => id2 === id1 && c1 !== c2)
        );
        const mediaCreate = inquiries[i].mediaFile.filter(
          ({ id: id1 }) => !originalInquiry[i].mediaFile.some(({ id: id2 }) => id2 === id1)
        );
        const mediaDelete = originalInquiry[i].mediaFile.filter(
          ({ id: id1 }) => !inquiries[i].mediaFile.some(({ id: id2 }) => id2 === id1)
        );
        for (const f in mediaCreate) {
          const form_data = mediaCreate[f].data;
          const res = await uploadFile(form_data);
          mediaCreate[f].id = res.id
        }
        if (
          JSON.stringify(inq(inquiries[i])) !== JSON.stringify(inq(originalInquiry[i])) ||
          JSON.stringify(inquiries[i].answerObj) !== JSON.stringify(originalInquiry[i].answerObj) ||
          mediaCreate.length ||
          mediaDelete.length
        ) {
          await updateInquiry(inquiries[i].id, {
            inq: inq(inquiries[i]),
            ans: { ansDelete, ansCreate, ansUpdate },
            files: { mediaCreate, mediaDelete }
          });
        }
      }
      dispatch(FormActions.displaySuccess(true));
      dispatch(FormActions.toggleReload());
    } catch (error) {
      dispatch(FormActions.displayFail(true, error));
      console.log(error);
    }
  };

  return (
    <div className="text-right p-5">
      <Button variant="contained" className={classes.root} color="primary" onClick={onSave}>
        Save
      </Button>
    </div>
  );
};

export default PopoverFooter;