import { Divider } from '@material-ui/core';
import { displayTime, isJsonText } from '@shared';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { CONTAINER_MANIFEST, CONTAINER_DETAIL } from '@shared/keyword';

import ContainerDetailForm from './ContainerDetailForm';
import UserInfo from './UserInfo';
import ImageAttach from './ImageAttach';
import FileAttach from './FileAttach';
import ChoiceAnswer from './ChoiceAnswer';
import ParagraphAnswer from "./ParagraphAnswer";
import { ContainerDetailFormOldVersion } from './InquiryViewer';

const useStyles = makeStyles(() => ({
  root: {
    border: '1px solid #BAC3CB',
    borderRadius: 8,
    margin: '20px 0',
    maxHeight: 350,
    overflow: 'overlay',
    '& .content-reply': {
      fontSize: 15,
      fontWeight: 500,
      '& .markReopen': {
        color: 'gray',
        fontStyle: 'italic'
      }
    },
    '& .attachment-reply': {
      marginTop: 15
    },
    '& .attachment-answer': {
      marginTop: 15
    }
  },
  backgroundSystem: '#FDF2F2',
  labelStatus: {
    backgroundColor: '#EBF7F2',
    color: '#36B37E',
    padding: '3px 9px',
    fontWeight: 600,
    fontSize: 14,
    borderRadius: 4
  },
  labelText: {
    color: '#36B37E',
    fontWeight: 400,
    fontSize: 12,
  },
  timeSent: {
    position: 'relative',
    '& img': {
      position: 'absolute',
      left: -19,
      bottom: 2
    }
  },
}));

const Comment = (props) => {
  const { question, comment } = props;
  const [comments, setComments] = useState(comment?.length > 1 ? comment.slice(0, comment.length - 1) : []);
  const [value, setValue] = useState('');
  const [key, setKey] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [edit, setEdit] = useState('');
  const classes = useStyles();
  const reply = useSelector(({ workspace }) => workspace.inquiryReducer.reply);
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);

  const user = useSelector(({ user }) => user);
  const open = Boolean(anchorEl);
  function isJson(str) {
    try {
      return (typeof JSON.parse(str) === 'object');
    } catch (e) {
      return false;
    }
  }

  const getField = (field) => {
    return metadata.field ? metadata.field[field] : '';
  };

  const containerCheck = [getField(CONTAINER_DETAIL), getField(CONTAINER_MANIFEST)];

  const checkSystemResolved = (process, key) => {
    return (process === 'draft' && key === 0) ? true : false;
  }

  const contentUI = ({ userName, createdAt, avatar, content, title, media, answersMedia, id, type, reply }) => {
    return (
      <div key={id}>
        <div className="comment-detail" style={{ padding: '20px', backgroundColor: `${checkSystemResolved(question?.process, id) && '#FDF2F2'}` }}>
          <div className="flex justify-between" style={{ alignItems: 'self-start' }}>
            <UserInfo name={checkSystemResolved(question?.process, id) ? 'System' : userName} time={displayTime(createdAt)} avatar={avatar} state={reply.state} status={reply.status} />

            {['COMPL', 'RESOLVED'].includes(reply.state) && (<div><span className={classes.labelStatus}>Resolved</span></div>)}
            {reply.sentAt && (
              <div className={classes.timeSent}>
                <img alt={'vectorIcon'} src={`/assets/images/icons/vector2.svg`} />
                <span className={classes.labelText}>{displayTime(reply.sentAt)}</span>
              </div>
            )}
            {/*{user.displayName === userName && key === id && (*/}
            {/*  <>*/}
            {/*    <IconButton onClick={handleClick}>*/}
            {/*      <MoreVertIcon />*/}
            {/*    </IconButton>*/}
            {/*    <Menu*/}
            {/*      id="customized-menu"*/}
            {/*      anchorEl={anchorEl}*/}
            {/*      open={open}*/}
            {/*      onClose={handleClose}*/}
            {/*      keepMounted>*/}
            {/*      <MenuItem onClick={() => onEdit(id)}>*/}
            {/*        <ListItemIcon style={{ minWidth: '0px', marginRight: '1rem' }}>*/}
            {/*          <EditIcon fontSize="small" />*/}
            {/*        </ListItemIcon>*/}
            {/*        <ListItemText primary="Edit" />*/}
            {/*      </MenuItem>*/}
            {/*      <MenuItem onClick={() => onDelete(key)}>*/}
            {/*        <ListItemIcon style={{ minWidth: '0px', marginRight: '1rem' }}>*/}
            {/*          <DeleteIcon fontSize="small" />*/}
            {/*        </ListItemIcon>*/}
            {/*        <ListItemText primary="Delete" />*/}
            {/*      </MenuItem>*/}
            {/*    </Menu>*/}
            {/*  </>*/}
            {/*)}*/}
          </div>
          {(content instanceof Array || isJson(content)) && containerCheck.includes(question.field) ?
            (!['REOPEN_A', 'REOPEN_Q'].includes(reply.state) ?
              (
                question?.process === 'pending' ?
                  <ContainerDetailFormOldVersion
                    container={
                      question.field === containerCheck[0] ? CONTAINER_DETAIL : CONTAINER_MANIFEST
                    }
                    question={question}
                    originalValues={JSON.parse(content)}
                    disableInput={true}
                  /> :
                  <ContainerDetailForm
                    container={
                      question.field === containerCheck[0] ? CONTAINER_DETAIL : CONTAINER_MANIFEST
                    }
                    setEditContent={() => null}
                    originalValues={content}
                    disableInput={true}
                  />
              ) : <span className={'markReopen'}>Marked as reopened</span>
            ) :
            <div className={'content-reply'} style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
              {!['REOPEN_A', 'REOPEN_Q'].includes(reply.state) ? `${title ? `${title} "${content}"` : content}` : (
                type === 'INQ' ? content : <span className={'markReopen'}>Marked as reopened</span>
              )}
            </div>
          }

          {<div style={{ display: 'block', margin: '1rem 0rem' }}>
            {reply.ansType === metadata.ans_type.choice && (
              <ChoiceAnswer disable={true} question={reply} disableChecked={false} />
            )}
            {reply.ansType === metadata.ans_type.paragraph && (
              <ParagraphAnswer disable={true} question={reply} />
            )}
          </div>}

          <div className="attachment-reply">
            {media?.length > 0 &&
              media?.map((file, mediaIndex) => (
                <div style={{ position: 'relative', display: 'inline-block' }} key={mediaIndex}>
                  {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
                    <ImageAttach
                      file={file}
                      hiddenRemove={true}
                      indexInquiry={id}
                      style={{ margin: '2.5rem' }}
                    />
                  ) : (
                    <FileAttach hiddenRemove={true} file={file} indexInquiry={id} />
                  )}
                </div>
              ))}
          </div>
          <div className='attachment-answer'>
            {answersMedia?.length > 0 && (
              <>
                {reply.process !== 'draft' && <div style={{ fontWeight: 600 }}>Attachment Answer: </div>}
                {answersMedia?.map((file, mediaIndex) => (
                  <div style={{ position: 'relative', display: 'inline-block' }} key={mediaIndex}>
                    {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
                      <ImageAttach
                        file={file}
                        hiddenRemove={true}
                        indexInquiry={id}
                        style={{ margin: '2.5rem' }}
                      />
                    ) : (
                      <FileAttach hiddenRemove={true} file={file} indexInquiry={id} />
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        <Divider
          variant="fullWidth"
          style={{ height: 1, color: '#E2E6EA', opacity: 0.6 }}
        />
      </div>
    );
  };

  return (
    <div className={classes.root}>
      {comments.map((k, id) => {
        let content = k.content;
        if (k.content && isJsonText(k.content) && !JSON.parse(k.content).length) {
          content = `${JSON.parse(k.content).name}\n${JSON.parse(k.content).address}`
        }
        return contentUI({
          id,
          userName: k.updater?.userName,
          createdAt: k.updatedAt,
          avatar: k.updater?.avatar,
          title: k.title || '',
          content,
          media: k.mediaFile,
          answersMedia: k.answersMedia,
          type: k.type,
          reply: k,
        });
      })}
    </div>
  );
};

export default Comment;
