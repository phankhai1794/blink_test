import React from 'react';
import { Radio, CardActions, CardContent, Card } from '@material-ui/core';
import UserInfo from './UserInfo';

const QuestionBoxViewOnly = (props) => {
  const { question } = props;
  const { choices, name, otherChoiceContent, addOther, selectedChoice } = question;
  return (
    <div style={{ width: '400px' }}>
      <div>
        <UserInfo name="Anrew" date="today" time="10:50PM" />
      </div>
      <h2 style={{ marginLeft: '1rem' }}>{name}</h2>
      <div style={{ display: 'block', margin: '1rem auto' }}>
        {choices.map((choice) => (
          <div key={choice.id} style={{ display: 'flex', marginTop: '0.5rem auto' }}>
            <div>
              <Radio
                checked={selectedChoice === choice.content}
                value={choice.content}
                color="primary"
                style={{ marginLeft: '5rem' }}
                disabled
              />
            </div>
            <p style={{ margin: 'auto 1rem', fontSize: '1.7rem' }}>{choice.content}</p>
          </div>
        ))}
        {addOther && (
          <div style={{ display: 'flex', marginTop: '1rem' }}>
            <Radio
              checked={selectedChoice === otherChoiceContent}
              value="other"
              color="primary"
              style={{ marginLeft: '5rem' }}
              disabled
            />
            <p style={{ margin: 'auto 1rem', fontSize: '1.7rem' }}>{otherChoiceContent}</p>
          </div>
        )}
      </div>
      {selectedChoice && (
        <div>
          <UserInfo name="Anrew" date="today" time="10:50PM" />
          <h3 style={{ margin: '1rem 5rem' }}>{selectedChoice}</h3>
        </div>
      )}
    </div>
  );
};

export default QuestionBoxViewOnly;
