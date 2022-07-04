import React, { useState } from 'react';
import ImageViewer from 'react-simple-image-viewer';
import { makeStyles } from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    borderWidth: '1px',
    borderStyle: 'ridge',
    margin: '10px',
    '& img': {
      height: '220px', 
      width: '190px', 
      objectFit: 'fill'
    },
    '& h3': {
      display: 'block',
      margin: '5px',
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

const ImageAttach = ({ file }) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const images = [file.src];
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
    link.setAttribute('download', file.name);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const handleRemoveChoice = (id) => {};

  return (
    <div className={classes.root}>
      <img
        src={file.src}
        onClick={openImageViewer}
      />
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <h3 onClick={downloadFile}>{file.name}</h3>
        <IconButton onClick={() => handleRemoveChoice(1)} style={{ padding: '2px' }}>
          <CloseIcon />
        </IconButton>
      </div>
      {isViewerOpen && (
        <ImageViewer
          src={images}
          currentIndex={0}
          onClose={closeImageViewer}
          disableScroll={false}
          backgroundStyle={{
            backgroundColor: 'rgba(0,0,0,0.9)'
          }}
          closeOnClickOutside={true}
        />
      )}
    </div>
  );
};

export default ImageAttach;
