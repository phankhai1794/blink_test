import React from 'react';
import { displayTime } from '@shared'

import UserInfo from '../../workspace/components/UserInfo';
const Inquiry = (props) => {
  const { question } = props
  return (
    <>
      <UserInfo
        name={question.creator.userName}
        time={displayTime(question.createdAt)}
        avatar={question.creator.avatar}
      />
      <div>
        The update information is &quot;{question.content.content}&quot;
      </div>
    </>
  )
}
export default Inquiry;
