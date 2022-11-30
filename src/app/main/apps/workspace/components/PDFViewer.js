import React, { useState } from 'react';
import { Document, Page, pdfjs } from "react-pdf";
import {
  Dialog,
  DialogTitle,
  Button,
  DialogContent,
} from '@material-ui/core';
import pdfjsWorker from "react-pdf/node_modules/pdfjs-dist/build/pdf.worker.entry";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PDFViewer = (props) => {
  const { view, handleClose, pdfUrl, name } = props
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  }
  const downloadFile = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute(
      'download',
      name,
    );
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }
  return (
    <Dialog
      open={view}
      onClose={handleClose}
      maxWidth="md"
      scroll='paper'
    >
      <DialogTitle style={{ textAlign: 'end' }} >
        <Button
          variant="text"
          size="medium"
          onClick={downloadFile}>
          <span className="pl-12">Download</span>
        </Button>
      </DialogTitle>
      <DialogContent dividers={true}>
        <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} >
          {Array.from(new Array(numPages), (el, index) => (
            <div key={index}>
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
              <p style={{ textAlign: 'center' }}>
                Page {index + 1} of {numPages}
              </p>
            </div>
          ))}
        </Document>
      </DialogContent>
    </Dialog >
  );
};

export default PDFViewer;
