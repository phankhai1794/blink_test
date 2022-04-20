import React from 'react';
import * as Actions from '../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { updateInquiry } from 'app/main/api/inquiry';
import { uploadFile } from 'app/main/api/file';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1)
  }
}));
const PopoverFooter = () => {
  const classes = useStyles();
  const dispatch = useDispatch()
  const [inquiries, originalInquiry] = useSelector((state) => [
    state.workspace.inquiries,
    state.workspace.originalInquiry
  ]);

  const inq = (inq) => {
    return {
      content: inq.content,
      field: inq.field,
      inqType: inq.inqType,
      ansType: inq.ansType,
      receiver: inq.receiver,
    }
  }
  const onSave = async () => {
    try {
      for (let i = 0; i < originalInquiry.length; i++) {
        const ansCreate = inquiries[i].answerObj.filter(({ id: id1 }) => !originalInquiry[i].answerObj.some(({ id: id2 }) => id2 === id1))
        const ansDelete = originalInquiry[i].answerObj.filter(({ id: id1 }) => !inquiries[i].answerObj.some(({ id: id2 }) => id2 === id1))
        const ansUpdate = inquiries[i].answerObj.filter(({ id: id1, content: c1 }) => originalInquiry[i].answerObj.some(({ id: id2, content: c2 }) => id2 === id1 && c1 !== c2))
        const mediaCreate = inquiries[i].mediaFile.filter(({ id: id1 }) => !originalInquiry[i].mediaFile.some(({ id: id2 }) => id2 === id1))
        const mediaDelete = originalInquiry[i].mediaFile.filter(({ id: id1 }) => !inquiries[i].mediaFile.some(({ id: id2 }) => id2 === id1))
        for (const form of mediaCreate) {
          const form_data = form.data;
          form_data.append('id', form.id);
          await uploadFile(form_data)
        }
        if (JSON.stringify(inq(inquiries[i])) !== JSON.stringify(inq(originalInquiry[i])) ||
          JSON.stringify(inquiries[i].answerObj) !== JSON.stringify(originalInquiry[i].answerObj) ||
          mediaCreate.length || mediaDelete.length
        ) {
          await updateInquiry(inquiries[i].id, {
            inq: inq(inquiries[i]),
            ans: { ansDelete, ansCreate, ansUpdate },
            files: { mediaCreate, mediaDelete }
          })
        }
      }
      dispatch(Actions.displaySuccess(true));
      dispatch(Actions.toggleReload())
    }
    catch (error) {
      dispatch(Actions.displayFail(true, error))
      console.log(error)
    }
  };

  return (
    <div className="text-right p-5">
      <Button variant="contained" className={classes.button} color="primary" onClick={onSave}>
        {' '}
        <SaveIcon /> Save
      </Button>
    </div>

  );
};

export default PopoverFooter;
