import React, { useState} from 'react';
import ImageViewer from "react-simple-image-viewer";
const ImageAttach = ({ src }) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const images = [src]
  const openImageViewer = () => {
    setIsViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };
  return (
    <>
      <img 
        src={src} 
        style={{ height: 'auto', width: '220px', margin: '10px', /*objectFit: 'contain'*/ }} 
        onClick={openImageViewer}
      />

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
    </>
  )
  ;
};

export default ImageAttach;
