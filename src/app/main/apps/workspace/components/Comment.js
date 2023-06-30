import { Divider } from '@material-ui/core';
import { displayTime, isJsonText, formatDate } from '@shared';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { CONTAINER_MANIFEST, CONTAINER_DETAIL } from '@shared/keyword';
import clsx from "clsx";

import Diff from "../shared-components/react-diff";

import ContainerDetailForm from './ContainerDetailForm';
import UserInfo from './UserInfo';
import ImageAttach from './ImageAttach';
import FileAttach from './FileAttach';
import ChoiceAnswer from './ChoiceAnswer';
import ParagraphAnswer from "./ParagraphAnswer";
import { ContainerDetailFormOldVersion } from './InquiryViewer';
import ContainerDetailInquiry from "./ContainerDetailInquiry";
import InquiryWithGroup from "./InquiryWithGroup";

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
    '& .delete-content': {
      textDecorationLine: 'line-through'
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
  const { question, comment, isDateTime, currentQuestion } = props;
  const [comments, setComments] = useState(comment?.length ? comment : [])
  const reply = useSelector(({ workspace }) => workspace.inquiryReducer.reply);
  const [anchorEl, setAnchorEl] = useState(null);
  const orgContent = useSelector(({ workspace }) => workspace.inquiryReducer.orgContent);
  const classes = useStyles();
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
    let dataCD = [];
    let dataCM = [];
    if (reply.content && isJsonText(reply.content) && containerCheck.includes(currentQuestion.field) && (reply.type === 'ANS_CD_CM' || ['COMPL', 'UPLOADED'].includes(reply.state))) {
      const parseJs = JSON.parse(reply.content);
      dataCD = parseJs?.[getField(CONTAINER_DETAIL)];
      dataCM = parseJs?.[getField(CONTAINER_MANIFEST)];
    }
    if (content && content.indexOf(getField(CONTAINER_DETAIL)) !== -1) {
      const parseJs = JSON.parse(content);
      dataCD = parseJs[getField(CONTAINER_DETAIL)];
      dataCM = parseJs[getField(CONTAINER_MANIFEST)];
    }

    const renderContent = () => {
      return (isDateTime && ['COMPL', 'RESOLVED', 'AME_DRF', 'AME_SENT', 'AME_ORG'].includes(reply.state)) ? formatDate(content, 'DD MMM YYYY') : content
    }

    return (
      <div key={id}>
        <div className="comment-detail" style={{ padding: '20px', backgroundColor: `${checkSystemResolved(question?.process, id) && '#FDF2F2'}` }}>
          <div className="flex justify-between" style={{ alignItems: 'self-start' }}>
            <UserInfo name={checkSystemResolved(question?.process, id) ? 'System' : userName} time={displayTime(createdAt)} avatar={avatar} state={reply.state} status={reply.status} />

            {['COMPL', 'RESOLVED'].includes(reply.state) && (<div><span className={classes.labelStatus}>Resolved</span></div>)}
            {['UPLOADED'].includes(reply.state) && (<div><span className={classes.labelStatus}>Uploaded</span></div>)}
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

          {(content instanceof Array || isJson(content)) && containerCheck.includes(question.field) && question.process === 'draft' ?
            (!['REOPEN_A', 'REOPEN_Q'].includes(reply.state) ?
              (
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
            (
              (containerCheck.includes(question.field) && (dataCD && dataCM && dataCD.length && dataCM.length)) ? (
                <ContainerDetailInquiry
                  getDataCD={dataCD}
                  getDataCM={dataCM}
                  disableInput={true}
                  currentQuestion={currentQuestion}
                />
              ) : (
                <div
                  className={clsx((['REP_DRF_DELETED', 'REP_SENT_DELETED'].includes(reply.state) || reply.status === 'DELETED') ? 'delete-content' : '', 'content-reply')}
                  style={{
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    fontStyle: (
                      (!['INQ', 'ANS'].includes(type) && !['COMPL', 'REOPEN_Q', 'REOPEN_A', 'UPLOADED', 'OPEN', 'INQ_SENT', 'ANS_DRF', 'ANS_SENT'].includes(reply.state) && reply.process === 'pending')
                      ||
                      (!['AME_ORG', 'AME_DRF', 'AME_SENT', 'REOPEN_A', 'REOPEN_Q', 'RESOLVED', 'UPLOADED'].includes(reply.state) && reply.process === 'draft')
                    ) && 'italic'
                  }}
                >
                  {!['REOPEN_A', 'REOPEN_Q'].includes(reply.state) ?
                    <div className={reply.isChangeRecipient ? 'markReopen' : ''}>
                      {['RESOLVED', 'COMPL'].includes(reply.state) ?
                        <Diff inputA={isDateTime ? formatDate(orgContent[question.field], 'DD MMM YYYY') : orgContent[question.field]} inputB={renderContent()} type="chars" /> :
                        renderContent()
                      }
                    </div> :
                    (type === 'INQ' ? content : <span className={'markReopen'}>Marked as reopened</span>)
                  }
                </div>
              )
            )
          }

          {containerCheck.includes(currentQuestion.field)
            && currentQuestion.inqGroup && currentQuestion.inqGroup.length
            && ['ANS', 'INQ'].includes(reply.type)
            ? currentQuestion.inqGroup.map(q => {
              return (
                <div key={q.id}>
                  <InquiryWithGroup inqGroup={q} role={user.role} />
                </div>
              )
            }) : ``
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
              media?.map((file) => (
                <>
                  <FileAttach
                    hiddenRemove={true}
                    file={file}
                    files={media}
                    indexInquiry={id}
                    question={reply} />
                </>
              ))}
          </div>
          <div className='attachment-answer' style={{ width: '108%' }}>
            {answersMedia?.length > 0 && (
              <>
                {answersMedia?.map((file, mediaIndex) => (
                  <>
                    <FileAttach
                      hiddenRemove={true}
                      file={file}
                      files={answersMedia}
                      indexInquiry={id}
                      question={reply}
                    />
                  </>
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
        if (k.content && isJsonText(k.content) && !JSON.parse(k.content).length && !containerCheck.includes(k.field)) {
          content = `${JSON.parse(k.content).name}\n${JSON.parse(k.content).address}`
        }
        let mediaFiles = k.mediaFile;
        if (k.type === 'ANS' && ['ANS_SENT', 'ANS_DRF'].includes(k.state)) {
          mediaFiles = [];
        }
        return contentUI({
          id,
          userName: k.updater?.userName,
          createdAt: k.updatedAt,
          avatar: k.updater?.avatar,
          title: k.title || '',
          content,
          media: mediaFiles,
          answersMedia: k.answersMedia,
          type: k.type,
          reply: k,
        });
      })}
    </div>
  );
};

export default Comment;
