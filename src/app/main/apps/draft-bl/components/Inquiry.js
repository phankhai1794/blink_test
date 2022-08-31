import React from 'react';
import { displayTime } from '@shared'
import { makeStyles } from '@material-ui/styles';

import UserInfo from '../../workspace/components/UserInfo';
import ImageAttach from '../../workspace/components/ImageAttach';
import FileAttach from '../../workspace/components/FileAttach';

const colorInq = '#DC2626';

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
    <div style={{ paddingLeft: 18, borderLeft: `2px solid ${colorInq}` }}>
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
      <div>{`The update information is "${question.content.content}"`}</div>
      {question.content?.mediaFile?.map((file, mediaIndex) => (
        <div style={{ position: 'relative', display: 'inline-block', marginTop: 20 }} key={mediaIndex}>
          {file.ext.toLowerCase().match(/jpeg|jpg|png/g) ? (
            <ImageAttach file={file} />)
            : (
              <FileAttach file={file} />
            )}
        </div>
      ))}
    </div>
  )
}
export default Inquiry;
