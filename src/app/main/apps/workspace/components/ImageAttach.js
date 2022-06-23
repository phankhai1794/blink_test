import React, { useState } from 'react';
import ImageViewer from "react-simple-image-viewer";
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '2rem 3rem',
    '& img': {
      height: 'auto',
      width: '220px',
      margin: '10px'
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


const ImageAttach = ({ file }) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const images = [file.src]
  const classes = useStyles();
  const openImageViewer = () => {
    setIsViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };
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

  return (
    <div className={classes.root}>
      <img
        src={file.src}
        style={{ height: 'auto', width: '220px', margin: '10px', /*objectFit: 'contain'*/ }}
        onClick={openImageViewer}
      />
      <h2 onClick={downloadFile}>{file.name}</h2>

      {isViewerOpen && (
        <ImageViewer
          src={images}
          currentIndex={0}
          onClose={closeImageViewer}
          disableScroll={false}
          backgroundStyle={{
            backgroundColor: "rgba(0,0,0,0.9)"
          }}
          closeOnClickOutside={true}
        />
      )}
    </div>
  );
};

export default ImageAttach;
