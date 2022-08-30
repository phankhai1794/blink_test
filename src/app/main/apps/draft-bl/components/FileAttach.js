import React, { useState } from 'react';
import DescriptionIcon from '@material-ui/icons/Description';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    borderWidth: 1,
    borderStyle: 'ridge',
    justifyContent: 'center',
    height: "100%",
    width: 165,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#F5F8FA',
    '&:first-child': {
      marginLeft: 0
    },
    '& img': {
      height: 110,
      width: 110
    },
    '& h3': {
      display: 'block',
      margin: 'auto 1rem',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      overflow: 'hidden',

    },
    '& h3:hover': {
      color: '#0000ee'
    }
  },
  fontSizeLarge: {
    fontSize: 110
  }
}));
const FileAttach = (props) => {
  const { file } = props
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div style={{ height: 126, textAlign: 'center' }}>
        {file.ext.toLowerCase().includes('pdf') ? (
          <img src={`/assets/images/logos/pdf_icon.png`} />
        ) : file.ext.toLowerCase().match(/csv|xls|xlsx|excel|sheet/g) ? (
          <img src={`/assets/images/logos/excel_icon.png`} />
        ) : file.ext.toLowerCase().match(/doc/g) ? (
          <img src={`/assets/images/logos/word_icon.png`} />
        ) : (
          <DescriptionIcon classes={{ fontSizeLarge: classes.fontSizeLarge }} fontSize='large' />
        )}
      </div>
      <h3 >
        {file.name}
      </h3>
    </div>
  )
}

export default FileAttach;
