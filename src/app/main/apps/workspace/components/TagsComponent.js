import React from 'react';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';

const tagType = {
  'primary': {
    backgroundColor: '#FDF2F2',
    color: '#BD0F72',
  },
  'success': {
    backgroundColor: '#EBF7F2',
    color: '#36B37E',
  }
};
const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: '10px',
    '& span': {
      fontFamily: 'Montserrat',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: '10px',
      paddingRight: '10px',
      gap: '10px',
      height: '24px',
      fontSize: '14px',
      fontWeight: '600',
      lineHeight: '17px',
      width: 'fit-content',
      borderRadius: '4px',
    }
  },
}));

const TagsComponent = (props) => {
  const { tagName, tagColor } = props;
  const classes = useStyles();

  return (
    <div className={clsx(classes.root)} >
      <span style={{ ...tagType[tagColor] }}>
        {tagName || ''}
        {props.children || ''}
      </span>
    </div>
  );
};

export default TagsComponent;
