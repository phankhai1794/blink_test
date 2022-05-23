import React from 'react';
import DescriptionIcon from '@material-ui/icons/Description';
const FileAttach = ({ file }) => {
  return (
    <div style={{ margin: '1rem 5rem' }} display="flex">
      {file.ext.includes("pdf") ?
        <img style={{ height: '25px', width: '25px' }} src={`/assets/images/logos/pdf_icon.png`} />
        :
        (file.ext.match(/csv|xls|sheet/g) ? <img style={{ height: '25px', width: '25px' }} src={`/assets/images/logos/excel_icon.png`} />
          :
          (file.ext.match(/doc/g) ? <img style={{ height: '25px', width: '25px' }} src={`/assets/images/logos/word_icon.png`} />
            :
            <DescriptionIcon />))
      }
      <h2 style={{ display: 'inline-block', margin: 'auto 1rem' }}>{file.name}</h2>
    </div>

  );
};

export default FileAttach;
