import { saveComment, editComment, deleteComment } from 'app/services/inquiryService';
import { Divider } from '@material-ui/core';
import { displayTime } from '@shared';
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
    color: '#36B37E',
    padding: '2px 9px',
    fontWeight: 600,
    fontSize: 14,
    borderRadius: 4
  },
}));

const Comment = (props) => {
  const { question, comment, userType } = props;
  const [ comments, setComments ] = useState(comment?.length > 1 ? comment.slice(0, comment.length - 1) : []);
  const [ value, setValue ] = useState('');
  const [ key, setKey ] = useState();
  const [ anchorEl, setAnchorEl ] = useState(null);
  const [ edit, setEdit ] = useState('');
  const classes = useStyles();
  const reply = useSelector(({ workspace }) => workspace.inquiryReducer.reply);
  const metadata = useSelector(({ workspace }) => workspace.inquiryReducer.metadata);

  const user = useSelector(({ user }) => user);
  const open = Boolean(anchorEl);

  const getField = (field) => {
    return metadata.field ? metadata.field[ field ] : '';
  };

  const containerCheck = [ getField(CONTAINER_DETAIL), getField(CONTAINER_MANIFEST) ];

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const changeValue = (e) => {
    setValue(e.target.value);
  };
  const changeComment = (e, id) => {
    const temp = [ ...comments ];
    temp[ id ].content = e.target.value;
    setComments(temp);
  };
  const addComment = async (e) => {
    const targetValue = e.target.value;
    if (e.key === 'Enter') {
      if (targetValue) {
        const inqAns = {
          inquiry: question.id,
          confirm: false,
          type: 'REP'
        };
        const answer = {
          content: targetValue,
          type: question.ansType
        };
        const res = await saveComment({ inqAns, answer });
        setComments([
          ...comments,
          {
            answer: res.id,
            createdAt: new Date(),
            content: targetValue,
            creator: { userName: user.displayName, avatar: user.photoURL }
          }
        ]);
      }
      setValue('');
    }
  };

  const onEnterComment = (e, id) => {
    if (e.key === 'Enter') {
      editComment(comments[ id ].answer, e.target.value);
      setEdit('');
    }
  };
  const onDelete = (id) => {
    deleteComment(comments[ id ].answer);
    const temp = [ ...comments ];
    temp.splice(id, 1);
    setComments(temp);
    setAnchorEl(null);
  };
  const onEdit = (id) => {
    setEdit(id);
    setAnchorEl(null);
  };

  const checkSystemResolved = (process, key) => {
    return (process === 'draft' && key === 0) ? true : false;
  }

  const contentUI = ({ userName, createdAt, avatar, content, title, media, answersMedia, id, type, reply }) => {
    return (
      <div key={id}>
        <div className="comment-detail" style={{ padding: '20px', backgroundColor: `${checkSystemResolved(question?.process, id) && '#FDF2F2'}` }}>
          <div className="flex justify-between">
            <UserInfo name={checkSystemResolved(question?.process, id) ? 'System' : userName} time={displayTime(createdAt)} avatar={avatar} />
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
          {question?.process === 'draft' && content instanceof Array && containerCheck.includes(question.field) ?
            <ContainerDetailForm
              container={
                question.field === containerCheck[ 0 ] ? CONTAINER_DETAIL : CONTAINER_MANIFEST
              }
              setEditContent={() => null}
              originalValues={content}
              disableInput={true}
            />
            :
            <div className={'content-reply'} style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
              {!['REOPEN_A', 'REOPEN_Q'].includes(reply.state) ? `${title ? `${title} "${content}"` : content}` : (<span className={'markReopen'}>Marked as reopened</span>)}
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
        return contentUI({
          id,
          userName: k.updater?.userName,
          createdAt: k.updatedAt,
          avatar: k.updater?.avatar,
          title: k.title || '',
          content: k.content,
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
