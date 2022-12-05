import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import axios from 'axios';
import { Button, Typography, FormHelperText, FormControl } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from 'react-redux';
import { uploadFile } from 'app/services/fileService';
import { saveEditedField } from 'app/services/draftblService';
import * as AppActions from 'app/store/actions';
import { CONTAINER_DETAIL, CONTAINER_MANIFEST } from '@shared/keyword';
import { FuseChipSelect } from '@fuse';
import * as DraftBLActions from 'app/main/apps/draft-bl/store/actions';

import * as FormActions from '../store/actions/form';
import * as InquiryActions from '../store/actions/inquiry';

import UserInfo from './UserInfo';
import ImageAttach from './ImageAttach';
import FileAttach from './FileAttach';
import AttachFileAmendment from './AttachFileAmendment';
import ContainerDetailForm from './ContainerDetailForm';

const colorInq = '#DC2626';
const white = '#FFFFFF';
const pink = '#BD0F72';
const greyText = '#999999';

const useStyles = makeStyles((theme) => ({
  btn: {
    width: 120,
    height: 40,
    borderRadius: 8,
    boxShadow: 'none',
    textTransform: 'capitalize',
    margin: theme.spacing(1),
  },
  btnCancel: {
    color: greyText,
    background: white,
    border: `1px solid ${greyText}`
  },
  inqTitle: {
    fontFamily: 'Montserrat',
    color: '#BD0F72',
    fontSize: 22,
    fontWeight: 600,
    wordBreak: 'break-word'
  },
}));

const Amendment = ({ question, inquiriesLength }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(({ user }) => user);
  const [metadata, content, myBL, inquiries] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.metadata,
    workspace.inquiryReducer.content,
    workspace.inquiryReducer.myBL,
    workspace.inquiryReducer.inquiries,
  ]);
  const currentField = useSelector(({ draftBL }) => draftBL.currentField);
  const filterInqDrf = inquiries.filter(inq => inq.process === 'draft').map(val => val.field);
  const openAmendmentList = useSelector(({ workspace }) => workspace.formReducer.openAmendmentList);
  const fullscreen = useSelector(({ workspace }) => workspace.formReducer.fullscreen);
  const listMinimize = useSelector(({ workspace }) => workspace.inquiryReducer.listMinimize);

  const [attachments, setAttachments] = useState(question?.content?.mediaFile || []);
  const [fieldValue, setFieldValue] = useState("");
  const [fieldValueSelect, setFieldValueSelect] = useState();
  const [fieldType, setFieldType] = useState(metadata.field_options.filter(filDrf => !filterInqDrf.includes(filDrf.value)));

  const getAttachment = (value) => setAttachments([...attachments, ...value]);

  const removeAttachment = (index) => {
    const optionsAttachmentList = [...attachments];
    optionsAttachmentList.splice(index, 1);
    setAttachments(optionsAttachmentList)
  }

  const handleChangeField = (e) => {
    setFieldValueSelect(e);
    setFieldValue(content[e.value] || "");
  };

  const handleChange = (e) => setFieldValue(e.target.value);

  const handleSave = () => {
    const uploads = [];
    const fieldReq = openAmendmentList ? fieldValueSelect?.value : currentField;
    const optionsInquires = [...inquiries];
    const optionsMinimize = [...listMinimize];
    if (attachments.length) {
      attachments.forEach((file) => {
        if (!file.id) {
          const formData = new FormData();
          formData.append('files', file.data);
          uploads.push(formData);
        }
      });
    }
    if (openAmendmentList && !fieldReq) {
      return;
    }

    axios
      .all(uploads.map((endpoint) => uploadFile(endpoint)))
      .then((files) => {
        const mediaList = attachments.filter((file) => file.id);
        files.forEach((file) => {
          const mediaFileList = file.response.map((item) => { return { id: item.id, ext: item.ext, name: item.name } });
          mediaList.push(mediaFileList[0]);
        });

        let service;
        // if (edit) service = updateDraftBLReply({ content: { content: fieldValue, mediaFile: mediaList } }, question.id);
        service = saveEditedField({ field: fieldReq, content: { content: fieldValue, mediaFile: mediaList }, mybl: myBL.id });
        service.then((res) => {
          dispatch(AppActions.showMessage({ message: 'Edit field successfully', variant: 'success' })
          );
          dispatch(DraftBLActions.setCurrentField());
          dispatch(InquiryActions.addAmendment());
          if (!openAmendmentList) {
            dispatch(FormActions.toggleReload());
          } else {
            const response = {
              ...res?.newAmendment,
              showIconEditInq: true,
            };
            optionsInquires.push(response);
            optionsMinimize.push(response);
            dispatch(InquiryActions.setInquiries(optionsInquires));
            dispatch(InquiryActions.setListMinimize(optionsMinimize));
          }
        }).catch((err) => console.error(err));
      })

    dispatch(InquiryActions.setContent({ ...content, [fieldReq]: fieldValue }));
    dispatch(FormActions.toggleCreateAmendment(false));
  }

  const handleCancel = () => {
    dispatch(InquiryActions.addAmendment());
    dispatch(FormActions.toggleCreateAmendment(false));
  }

  const getField = (field) => {
    return metadata.field?.[field] || '';
  };

  const containerCheck = [getField(CONTAINER_DETAIL), getField(CONTAINER_MANIFEST)];

  useEffect(() => {
    !openAmendmentList ? setFieldValue(content[currentField] || "") : setFieldValue('');
  }, [content, currentField])

  const styles = (width) => {
    return {
      control: {
        width: `${width}px`,
        borderRadius: 11
      }
    };
  };

  return (
    <div style={{ paddingLeft: 18, borderLeft: `2px solid ${colorInq}` }}>
      {!openAmendmentList && (
        <p style={{
          color: pink,
          fontSize: 14,
          fontWeight: 600,
          lineHeight: '17px',
          padding: '3.5px 10px',
          background: '#FDF2F2',
          borderRadius: 4,
          display: 'inline-block',
          marginTop: 0,
          marginBottom: 15,
        }}>
          AMENDMENT
        </p>
      )}

      <div className='flex justify-between'>
        {!openAmendmentList ? (
          <UserInfo
            name={user?.displayName}
            time=""
            avatar=""
          />
        ) : <Typography color="primary" variant="h5" className={classes.inqTitle}>New Amendment</Typography>}
        <div className={'flex'} style={{ alignItems: 'center' }}>
          <AttachFileAmendment setAttachment={getAttachment} />
        </div>
      </div>

      {openAmendmentList && (
        <FormControl error={!fieldValueSelect}>
          <FuseChipSelect
            customStyle={styles(fullscreen ? 320 : 295)}
            value={fieldValueSelect}
            onChange={handleChangeField}
            placeholder="Select Field Type"
            textFieldProps={{
              variant: 'outlined'
            }}
            options={fieldType}
            errorStyle={fieldValueSelect}
          />
          <div style={{ height: '20px' }}>
            {!fieldValueSelect && (<FormHelperText style={{ marginLeft: '4px' }}>This is required!</FormHelperText>
            )}
          </div>
        </FormControl>
      )}

      {containerCheck.includes(fieldValueSelect?.value || (!openAmendmentList && currentField)) ? (
        <div style={{ margin: '15px 0' }}>
          <ContainerDetailForm
            container={
              (fieldValueSelect?.value || currentField) === containerCheck[0] ? CONTAINER_DETAIL : CONTAINER_MANIFEST
            }
            setEditContent={(value) => {
              setFieldValue(value);
            }}
            disableInput={false}
          />
        </div>
      ) : <div className="flex" style={{ alignItems: 'flex-end', margin: '15px 0' }}>
        <textarea
          style={{
            width: '100%',
            paddingTop: 10,
            paddingLeft: 5,
            marginTop: 10,
            minHeight: 50,
            border: '1px solid #BAC3CB',
            borderRadius: 8,
            resize: 'none',
            fontFamily: 'Montserrat',
            fontSize: 15
          }}
          multiline="true"
          type="text"
          value={fieldValue}
          onChange={handleChange}
        />
      </div>
      }

      {attachments?.map((file, mediaIndex) => (
        <div style={{ position: 'relative', display: 'inline-block' }} key={mediaIndex}>
          {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
            <ImageAttach file={file} draftBL={true} removeAttachmentDraftBL={() => removeAttachment(mediaIndex)} />)
            : (
              <FileAttach file={file} draftBL={true} removeAttachmentDraftBL={() => removeAttachment(mediaIndex)} />
            )}
        </div>
      ))}

      <div style={{ marginTop: 20 }}>
        <Button
          className={classes.btn}
          disabled={fieldValue.length === 0}
          onClick={handleSave}
          color="primary"
          variant="contained"
        >
          Save
        </Button>
        {
          (
            (openAmendmentList && inquiriesLength > 0)
            ||
            !openAmendmentList
          ) && (
            <Button className={clsx(classes.btn, classes.btnCancel)} onClick={handleCancel}>
              Cancel
            </Button>
          )
        }
      </div>
    </div>
  );
};

export default Amendment;