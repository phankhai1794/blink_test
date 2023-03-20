import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import { getFile } from 'app/services/fileService';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import * as FormActions from '../store/actions/form';


const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    zIndex: 1555,
    width: '100%',
    height: '100%',
    '& #pdf-renderer': {
      '& #pdf-download': {
        display: 'none'
      },
      '& #pdf-zoom-in': {
        display: 'none'
      },
      '& #pdf-zoom-out': {
        display: 'none'
      },
      '& #pdf-zoom-reset': {
        display: 'none'
      },
      '& .react-pdf__Page__textContent': {
        display: 'none'
      },
      '& #pdf-toggle-pagination': {
        display: 'none'
      },
      '& #pdf-controls': {
        top: '13%',
        width: '100%',
        height: '2%',
        display: 'flex',
        background: 'none',
        boxShadow: 'none',
        position: 'absolute',
        justifyContent: 'center'
      }
    },
    '& #pdf-page-wrapper': {
      '& canvas': {
        width: '65rem!important',
        height: '70rem!important',
      }
    },
    '& #react-doc-viewer': {
      background: 'rgba(0, 0, 0, 0.2)',
      height: '100%',
    },
    '& #proxy-renderer': {
      justifyContent: 'center',
      overflow: 'hidden',
      '& #image-renderer': {
        background: 'rgba(0, 0, 0, -0.5)',
        '& #image-img': {
          width: 1000,
          height: 700
        }
      },
      '& #pdf-renderer': {
        overflow: 'hidden',
        '& .react-pdf__Document': {
          height: '100%',
          alignItems: 'center',
          '& #pdf-page-wrapper': {
            height: '100%',
            display: 'flex',
            alignItems: 'center'
          }
        },
        '& #pdf-pagination': {
          marginRight: '0%',
          '& #pdf-pagination-next': {
            margin: '0px 5px'
          }
        }
      }
    },
    '& #header-bar': {
      '& #doc-nav': {
        position: 'absolute'
      }
    },
    '& .MuiDialog-paperWidthMd': {
      maxWidth: '100%'
    },
    '& .MuiDialog-paperScrollPaper': {
      height: '100%',
      width: '100%',
      margin: '0 0 48px 0',
    },
    '& .MuiPaper-root': {
      background: 'none'
    },
    '& .MuiDialogTitle-root': {
      display: 'flex',
      width: '100%',
      justifyContent: 'flex-end',
      background: '#132535',
      opacity: 0.8,
      padding: '0 16px 0 0',
      height: '9%',
      '& .MuiTypography-root': {
        margin: '0 20px 0 0',
        display: 'flex'
      }
    },
    '& .MuiDialog-paper': {
      top: '-3%',
      overflow: 'hidden'
    },
    '& .MuiDialogContent-root': {
      alignItems: 'center',
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
    },
    '& .header-preview': {
      height: '66px',
      width: '100%',
      position: 'fixed',
      zIndex: 500,
      background: '#132535',
      opacity: 0.8,
    },
    '& .closePreviewTop': {
      position: 'absolute',
      width: '100%',
      top: '6%',
      height: '16%'
    },
    '& .closePreviewLeft': {
      position: 'absolute',
      width: '11%',
      top: '7%',
      height: '100%'
    },
    '& .closePreviewRight': {
      position: 'absolute',
      right: '0%',
      width: '12%',
      bottom: '0%',
      height: '92%'
    },
    '& .closePreviewBottom': {
      position: 'absolute',
      width: '100%',
      bottom: '0%',
      height: '21%'
    }
  },
  nextPreview: {
    position: 'relative',
    top: '44rem',
    width: '60rem',
    margin: 'auto'
  },
  noSupport: {
    width: '85%'
  },
  nameFile: {
    color: 'white',
    position: 'absolute',
    top: '20px',
    left: '77px',
    fontFamily: 'Montserrat',
    fontSize: '13px',
    lineHeight: '14px',
    fontWeight: 600,

  },
  downloadFile: {
    position: 'absolute',
    right: '47px',
    top: '14px',
    // background: '#515F6B',
    borderRadius: '8px',
    '& .MuiButton-root': {
      textTransform: 'inherit',
    }
  },
  cannotPreivewFilePopup: {
    width: '700px',
    height: '500px',
    top: '194px',
    left: '32%',
    background: '#FFFFFF',
    position: 'absolute',
    zIndex: 1500,
  },

  iconCannotPreviewFile: {
    position: 'absolute',
    width: '82.5px',
    height: '105px',
    left: '42.62%',
    right: '16.62%',
    top: '27.25%',
    bottom: '6.25%',

  },
  textCannotPreviewFile: {
    position: 'absolute',
    left: '21.53%',
    top: '51.54%',
  },
  NoPrevDownloadButton: {
    position: 'absolute',
    display: 'flex',
    gap: '10px',
    width: '117px',
    height: '40px',
    left: '40.53%',
    top: '60.54%',
    color: 'white',
    backgroundColor: '#BD0F72',
    borderRadius: '8px',
    fontFamily: 'Montserrat',
    fontSize: '16px',
    lineHeight: '19.5px',
    '& .MuiButton-root': {
      textTransform: 'inherit',
    }
  },
  ZoomButton: {
    width: '130px',
    height: '34.5px',
    // backgroundColor: '#515F6B',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
    alignItems: 'center',
    position: 'absolute',
    top: '14px',
    right: '9.25%',
    fontFamily: 'Montserrat',
    fontSize: '13px',
    lineHeight: '14px',
    fontWeight: 600,
  },

}));

let currentFilePreview = {}
const MyHeader = (state, previousDocument, nextDocument) => {
  const classes = useStyles();
  const [viewSize, setViewSize] = useState(1);
  if (!state.currentDocument || state.config?.header?.disableFileName) {
    return null;
  } else {
    currentFilePreview = state.currentDocument;
  }
  // if (!['image/jpeg', 'application/pdf'].includes(state.currentDocument.fileType)) setIsopen(

  const downloadFile = () => {
    const link = document.createElement('a');
    link.href = state.currentDocument?.uri;
    link.setAttribute(
      'download',
      state.currentDocument?.fileName,
    );
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }
  const zoomFeature = (action, fileType) => {
    if (fileType === 'image/jpeg') {
      const pic = document.getElementById("image-img");
      const width = pic.clientWidth;
      const height = pic.clientHeight;
      if (action === 'out' && viewSize > 0.5) {
        // if (width > 100 && height > 100) {
        pic.style.width = width - 100 + "px";
        pic.style.height = height - 100 + "px";
        setViewSize(viewSize - 0.5);
        // }
      } else if (action === 'in' && viewSize < 2) {
        // if (width < 500 && height < 500) {
        pic.style.width = width + 100 + "px";
        pic.style.height = height + 100 + "px";
        setViewSize(viewSize + 0.5);
        // }
      }
    } else if (fileType === 'application/pdf') {
      const pdf = document.getElementsByClassName("react-pdf__Page__canvas")[0];
      const width = pdf.clientWidth;
      const height = pdf.clientHeight;

      if (action === 'out') {
        // if (width > 100 && height > 100) {
        pdf.setAttribute('style', `width: ${width - 50}px !important; height: ${height - 50}px !important`);
        setViewSize(viewSize - 0.5);
        // }
      } else {
        // if (width < 650 && height < 800) {
        pdf.setAttribute('style', `width: ${width + 50}px !important; height: ${height + 50}px !important`);
        setViewSize(viewSize + 0.5);
        // }
      }
    }
  }

  const getViewSize = (fileType) => {
    let size = 1;
    if (fileType === 'image/jpeg') {
      const pic = document.getElementById("image-img");
      if (pic) {
        const width = pic.clientWidth;
        size = (width - 1000) / 100 + 1;
      }
    } else if (fileType === 'application/pdf') {
      const pdf = document.getElementsByClassName("react-pdf__Page__canvas")[0];
      if (pdf) {
        const width = pdf.clientWidth;
        size = 1 + 0.25 * (width - 650) / 50;
      }
    }
    return size
  }

  return (
    <div>
      <div className={'header-preview'}>
        <div className={'action-preview'}>
          <div className={classes.nameFile}>{state.currentDocument.fileName || ""}</div>
          <div role="group" className={classes.ZoomButton}>
            <Button
              variant="text"
              size="medium"
              style={{ width: '12px', position: 'absolute', left: '-6%' }}
              onClick={() => zoomFeature('in', state.currentDocument.fileType)}>
              <img src="/assets/images/icons/plus_icon.svg" />
            </Button>
            <span style={{ color: 'white', position: 'absolute', width: '0px', left: '30%' }}>|</span>
            <span
              className="pl-12"
              style={{
                color: 'white',
                display: 'flex',
                fontFamily: 'Montserrat',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '13px',
                lineHeight: '14px',
                width: '34px',
                padding: 0,
                position: 'absolute',
                right: '38%'
              }}
            >
              {getViewSize(state.currentDocument.fileType) * 100}%
            </span>
            <span style={{ color: 'white', position: 'absolute', width: '0px', right: '36%' }}>|</span>
            <Button
              variant="text"
              size="medium"
              style={{ width: '12px', position: 'absolute', right: '-6%' }}
              onClick={() => zoomFeature('out', state.currentDocument.fileType)}>
              <img src="/assets/images/icons/minus_icon.svg" />
            </Button>
          </div>

          <div className={classes.downloadFile}>
            <Button
              variant="text"
              size="medium"
              onClick={downloadFile}>
              <img src="/assets/images/icons/download_icon.svg" style={{ marginRight: 8 }} />
              <span style={{ color: 'white', fontFamily: 'Montserrat', fontSize: '13px', fontWeight: 600, }}>Download</span>
            </Button>
          </div>
        </div>
        <div className={classes.nextPreview}>
          <ArrowBackIosIcon
            style={{
              position: 'fixed',
              left: '19rem',
              width: '60px',
              height: '60px',
              color: state.currentFileNo === 0 ? '#d3d3d3' : '#F5F8FA',
              zIndex: 9000
            }}
            onClick={previousDocument} disabled={state.currentFileNo === 0}
          />
          <ArrowBackIosIcon
            style={{
              position: 'fixed',
              right: '19rem',
              width: '60px',
              height: '60px',
              color: state.currentFileNo >= state.documents.length - 1 ? '#d3d3d3' : '#F5F8FA',
              transform: 'scaleX(-1)',
              zIndex: 9000
            }}
            onClick={nextDocument}
            disabled={state.currentFileNo >= state.documents.length - 1} />
        </div>
      </div>

      {!['png', 'pdf', 'jpeg', 'jpg'].includes(state.currentDocument.fileName.split(".").slice(-1)[0].toLowerCase()) &&
        <div className={classes.cannotPreivewFilePopup}>
          <div>
            <img className={classes.iconCannotPreviewFile} src="/assets/images/icons/noPreviewFile.svg" />
          </div>
          <div className={classes.textCannotPreviewFile}>
            Preview currently does not support this file format.
          </div>
          <Button
            variant="text"
            size="medium"
            className={classes.NoPrevDownloadButton}
            onClick={downloadFile}
          >
            DownLoad
          </Button>
        </div>
      }
    </div>
  );
};

const PDFViewer = (props) => {
  const { inquiry } = props

  const [allFileUrl, setFileUrl] = useState([]);
  const openPreviewFiles = useSelector(({ workspace }) => workspace.formReducer.openPreviewFiles);
  const dispatch = useDispatch();
  const classes = useStyles();

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

    let fileIds = [];
    if (inquiry && inquiry.files) {
      if (inquiry.files && inquiry.files.length > 0) {
        inquiry.files.forEach(file => fileIds.push({ id: file.id, ext: file.ext, name: file.name, url: file.src }));
        let listSrcFiles = [];
        fileIds.forEach(async (f, i) => {
          let url = '';
          if (f.id) {
            const blob = await getFile(f.id);
            url = urlMedia(f.ext, blob);
          } else url = f.url;
          if (url) {
            if (!['png', 'pdf', 'jpeg', 'jpg'].includes(f.name.split(".").slice(-1)[0].toLowerCase())) {
              listSrcFiles.push({ uri: url, fileName: f.name, index: i, fileType: '' });
            } else {
              listSrcFiles.push({ uri: url, fileName: f.name, index: i, fileType: f.type });
            }
          }

          if (listSrcFiles.length === fileIds.length) {
            setFileUrl(listSrcFiles.sort((a, b) => (a.index > b.index) ? 1 : -1));
          }
        });
      }
    }
  }, [openPreviewFiles]);

  const closePreview = () => {
    dispatch(FormActions.toggleOpenPreviewFiles({ openPreviewFiles: false, currentInqPreview: {} }));
  }

  return (
    <div className={classes.root}>
      <div className={'closePreviewTop'} onClick={closePreview}></div>
      <div className={'closePreviewLeft'} onClick={closePreview}></div>
      <div className={'closePreviewRight'} onClick={closePreview}></div>
      <div className={'closePreviewBottom'} onClick={closePreview}></div>

      <DocViewer
        pluginRenderers={DocViewerRenderers}
        documents={allFileUrl}
        initialActiveDocument={allFileUrl.length && inquiry.file && allFileUrl.find(f => f.fileName === inquiry.file.name)}
        // initialActiveDocument={allFileUrl[2]}
        // style = {{ width: 'auto', zIndex: 999999 }}
        config={{
          header: {
            overrideComponent: MyHeader
          },

        }}

      />
    </div>
  );
};

export default PDFViewer;
