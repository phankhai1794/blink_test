import React from 'react';
import DescriptionIcon from '@material-ui/icons/Description';
import { makeStyles } from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    borderWidth: '1px',
    borderStyle: 'ridge',
    justifyContent: 'center',
    width: '198px',
    margin: '10px',
    '& img': {
      height: '50px',
      width: '50px'
    },
    '& h3': {
      display: 'block',
      margin: 'auto 1rem',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      width: '160px'
    },
    '& h3:hover': {
      color: '#0000ee'
    }
  }
}));

const FileAttach = ({ file }) => {
  const classes = useStyles();
  const downloadFile = () => {
    const link = document.createElement('a');
    link.href = file.src;
    link.setAttribute('download', file.name);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const previewPDF = () => {
    window.open(file.src);
  };
  const handleRemoveChoice = (id) => {};
  return (
    <div className={classes.root}>
      {file.ext.includes('pdf') ? (
        <img src={`/assets/images/logos/pdf_icon.png`} />
      ) : file.ext.match(/csv|xls|sheet/g) ? (
        <img src={`/assets/images/logos/excel_icon.png`} />
      ) : file.ext.match(/doc/g) ? (
        <img src={`/assets/images/logos/word_icon.png`} />
      ) : (
        <DescriptionIcon />
      )}
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {file.ext.includes('pdf') ? (
          <h3 onClick={previewPDF}>{file.name}</h3>
        ) : (
          <h3 onClick={downloadFile}>{file.name}</h3>
        )}
        <IconButton onClick={() => handleRemoveChoice(1)} style={{ padding: '2px' }}>
          <CloseIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default FileAttach;
