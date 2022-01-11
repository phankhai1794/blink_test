import React from 'react';
const ImageAttach = ({ src }) => {
  return <img src={src} style={{ height: '220px', width: '220px', objectFit: 'contain' }} />;
};

export default ImageAttach;
