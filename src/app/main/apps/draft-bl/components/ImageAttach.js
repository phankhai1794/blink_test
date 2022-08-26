import React, { useEffect, useState } from 'react';
import ImageViewer from 'react-simple-image-viewer';
import { makeStyles } from '@material-ui/styles';
import { getFile } from 'app/services/fileService';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '165px',
    height: '100%',
    borderWidth: '1px',
    borderStyle: 'ridge',
    marginLeft: '10px',
    marginRight: '10px',
    marginBottom: '10px',
    backgroundColor: '#F5F8FA',
    '& h3': {
      display: 'block',
      margin: '5px',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      overflow: 'hidden'
    },
    '& h3:hover': {
      color: '#0000ee'
    }
  }
}));
const ImageAttach = (props) => {
  const { file } = props
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const classes = useStyles();
  const [srcUrl, setSrcUrl] = useState(file.src || null);

  const urlMedia = (fileExt, file) => {
    if (fileExt.toLowerCase().match(/jpeg|jpg|png/g)) {
      return URL.createObjectURL(new Blob([file], { type: 'image/jpeg' }));
    } else if (fileExt.toLowerCase().match(/pdf/g)) {
      return URL.createObjectURL(new Blob([file], { type: 'application/pdf' }));
    } else {
      return URL.createObjectURL(new Blob([file]));
    }
  };

  useEffect(() => {
    if (file.id) {
      getFile(file.id)
        .then((f) => {
          setSrcUrl(urlMedia(file.ext, f));
        })
        .catch((error) => console.error(error));
    }
  }, []);
  const openImageViewer = () => {
    setIsViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };
  return (
    <div className={classes.root}>
      <img
        style={{
          height: '120px',
          width: '100%',
          objectFit: 'cover'
        }}
        src={srcUrl}
        onClick={openImageViewer}
      />
      {isViewerOpen &&
        <ImageViewer
          src={[srcUrl]}
          currentIndex={0}
          onClose={closeImageViewer}
          disableScroll={false}
          backgroundStyle={{
            backgroundColor: 'rgba(0,0,0,0.7)'
          }}
          closeOnClickOutside={true}
        />
      }
    </div>
  )
}

export default ImageAttach;
