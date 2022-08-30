import React from 'react';
import { displayTime } from '@shared'
import { makeStyles } from '@material-ui/styles';

import UserInfo from '../../workspace/components/UserInfo';
import ImageAttach from '../../workspace/components/ImageAttach';
import FileAttach from '../../workspace/components/FileAttach';

const useStyles = makeStyles((theme) => ({
  labelStatus: {
    backgroundColor: '#EBF7F2',
    color: '#36B37E',
    padding: '2px 9px',
    fontWeight: 600,
    fontSize: 14,
    borderRadius: 4
  },
}))

const Inquiry = (props) => {
  const { question } = props
  const classes = useStyles();

  return (
    <>
      <div className='flex justify-between'>
        <UserInfo
          name={question.creator.userName}
          time={displayTime(question.createdAt)}
          avatar={question.creator.avatar}
        />
        {question.state === 'AME_SENT' &&
          <div style={{ marginRight: 15 }}>
            <span className={classes.labelStatus}>Sent</span>
          </div>
        }
      </div>
      <div>
        The update information is &quot;{question.content.content}&quot;
      </div>
      {question.content?.mediaFile?.map((file, mediaIndex) => (
        <div style={{ position: 'relative', display: 'inline-block' }} key={mediaIndex}>
          {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
            <ImageAttach file={file} />)
            : (
              <FileAttach file={file} />
            )}
        </div>
      ))}
    </>
  )
}
export default Inquiry;
