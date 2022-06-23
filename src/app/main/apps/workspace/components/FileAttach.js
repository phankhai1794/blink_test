import React from 'react';
import DescriptionIcon from '@material-ui/icons/Description';
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '2rem 3rem',
    display: 'flex',
    '& img': {
      height: '25px',
      width: '25px'
    },
    '& h2': {
      display: 'block',
      margin: 'auto 1rem',
      cursor: 'pointer'
    },
    '& h2:hover': {
      color: '#0000ee'
    }
  },
}));


const FileAttach = ({ file }) => {
  const classes = useStyles();
  const downloadFile = () => {
    const link = document.createElement('a');
    link.href = file.src;
    link.setAttribute(
      'download',
      file.name,
    );
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }

  const previewPDF = () => {
    window.open(file.src);
  }

  return (
    <div className={classes.root}>
      {file.ext.includes("pdf") ?
        <img src={`/assets/images/logos/pdf_icon.png`} />
        :
        (file.ext.match(/csv|xls|sheet/g) ? <img src={`/assets/images/logos/excel_icon.png`} />
          :
          (file.ext.match(/doc/g) ? <img src={`/assets/images/logos/word_icon.png`} />
            :
            <DescriptionIcon />))
      }
      {file.ext.includes("pdf") ? <h2 onClick={previewPDF}>{file.name}</h2> : <h2 onClick={downloadFile}>{file.name}</h2>}

    </div>

  );
};

export default FileAttach;
