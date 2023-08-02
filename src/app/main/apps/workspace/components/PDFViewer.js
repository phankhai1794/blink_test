import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@material-ui/core';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import { getFile } from 'app/services/fileService';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { handleError } from '@shared/handleError';
import { removeMultipleMedia } from 'app/services/inquiryService';

import * as FormActions from '../store/actions/form';
import * as InquiryActions from '../store/actions/inquiry';


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
    // '& #pdf-page-wrapper': {
    //   '& canvas': {
    //     width: '660px !important',
    //     height: '700px !important',
    //   }
    // },
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
          maxHeight: 'none',
          maxWidth: 'none'
        }
      },
      '& #pdf-renderer': {
        // overflow: 'hidden',
        '& .react-pdf__Document': {
          height: '100%',
          alignItems: 'center',
          '& #pdf-page-wrapper': {
            height: '100%',
            display: 'contents',
            // alignItems: 'center',
            '& #pdf-page-info': {
              display: 'none'
            }
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
      display: 'none',
      '& #doc-nav': {
        position: 'absolute',
        
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
      background: '#1325357d',
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
    position: 'relative',
    top: '14px',
    width: '14px',
    height: '27px',
    background: '#515F6B',
    padding: '4px 8px',
    gap: '8px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: '8px',
  },
  deleteFile: {
    position: 'relative',
    top: '14px',
    width: '14px',
    height: '27px',
    background: '#515F6B',
    padding: '4px 8px',
    gap: '8px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: '8px',
  },
  openNewTabs: {
    position: 'relative',
    // left: '88.6%',
    top: '14px',
    width: '14px',
    height: '27px',
    background: '#515F6B',
    padding: '4px 8px',
    gap: '8px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: '8px',
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
  confirmDelPopUp: {
    width: '480px',
    height: '200px',
    top: '42%',
    left: '37%',
    background: '#FFFFFF',
    position: 'absolute',
    zIndex: 3500,
    borderRadius: 8,
    border: '1px solid #BD0F72',
  },
  iconDelFile: {
    position: 'absolute',
    width: '41.67px',
    height: '41.57px',
    left: '46%',
    top: '12%',
  },
  textConfirmDelFile: {
    position: 'absolute',
    left: ' 7.53%',
    top: '38.54%',
    fontFamily: 'Montserrat',
    fontSize: '16px',
    color: '#BD0F72',
    lineHeight: '19.5px',
    fontWeight: 600
  },
  textCannotPreviewFile: {
    position: 'absolute',
    left: '21.53%',
    top: '51.54%',
  },
  conFirmDelButton: {
    position: 'absolute',
    display: 'flex',
    gap: '10px',
    width: '120px',
    height: '40px',
    top: '58%',
    left: '24%',
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
  cancelDelButton: {
    position: 'absolute',
    display: 'flex',
    gap: '10px',
    width: '120px',
    height: '40px',
    top: '58%',
    left: '51%',
    color: '#BD0F72',
    border: '1px solid #BD0F72',
    backgroundColor: 'white',
    borderRadius: '8px',
    fontFamily: 'Montserrat',
    fontSize: '16px',
    lineHeight: '19.5px',
    '& .MuiButton-root': {
      textTransform: 'inherit',
    }
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
    backgroundColor: '#515F6B',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
    alignItems: 'center',
    position: 'relative',
    top: '14px',
    fontFamily: 'Montserrat',
    fontSize: '13px',
    lineHeight: '14px',
    fontWeight: 600,
  },
  ViewInquiry: {
    width: '133px',
    height: '34.5px',
    backgroundColor: '#515F6B',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
    alignItems: 'center',
    position: 'relative',
    top: '13px',
    fontFamily: 'Montserrat',
    fontSize: '13px',
    lineHeight: '14px',
    fontWeight: 600,
  },
  closePreview: {
    position: 'relative',
    top: '18px',
  }

}));

let currentFilePreview = {}

const PDFViewer = (props) => {
  const { inquiry } = props
  const user = useSelector(({ user }) => user);
  const [allFileUrl, setFileUrl] = useState([]);
  const inquiries = useSelector(({ workspace }) => workspace.inquiryReducer.inquiries);
  const openPreviewFiles = useSelector(({ workspace }) => workspace.formReducer.openPreviewFiles);
  const dispatch = useDispatch();
  const classes = useStyles();
  const docViewerRef = useRef(null);

  const urlMedia = (fileExt, file) => {
    if (fileExt.toLowerCase().match(/jpeg|jpg|png/g)) {
      return URL.createObjectURL(new Blob([file], { type: 'image/jpeg' }));
    } else if (fileExt.toLowerCase().match(/pdf/g)) {
      return URL.createObjectURL(new Blob([file], { type: 'application/pdf' }));
    } else {
      return URL.createObjectURL(new Blob([file]));
    }
  };

  const MyHeader = (state, previousDocument, nextDocument) => {
    const classes = useStyles();
    const [viewSize, setViewSize] = useState(1);
    const [originalSize, setOriginalSize] = useState([]);
    const [openDelPopup, setOpenDelPopup] = useState(false);
    const dispatch = useDispatch();
    let [openAttachment] = useSelector(({ workspace }) => [
      workspace.formReducer.openAttachment,
    ])
    
    if (!state.currentDocument || state.config?.header?.disableFileName) {
      return null;
    } else {
      currentFilePreview = state.currentDocument;
    }
  
    const closePreview = () => {
      dispatch(FormActions.toggleOpenPreviewFiles({ openPreviewFiles: false, currentInqPreview: {} }));
    }

    const downloadFile = () => {
      const link = document.createElement('a');
      link.href = state.currentDocument?.uri;
      link.setAttribute('download', state.currentDocument?.fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    }
  
    const openNewTabs = () => {
      window.open(state.currentDocument.uri, "_blank");
    }
    
    const ViewInquiry = () => {
      closePreview();
      const curInqId = inquiry.files[currentFilePreview.index]
      const process = inquiries.filter(item => item.id === curInqId.inquiryId)
      dispatch(FormActions.setScrollInquiry(curInqId.inquiryId))
      if (openAttachment) {
        dispatch(FormActions.toggleAttachment(false));
        dispatch(FormActions.setTabs(Number(process[0].receiver[0] === 'onshore')));
        if(process[0].process === 'pending') {
          dispatch(FormActions.toggleAllInquiry(true));
        } else {
          dispatch(FormActions.toggleAmendmentsList(true));
        }
      } 
    }

    const zoomFeature = (action, fileType) => {
      if (fileType.includes("image")) {
        const pic = document.getElementById("image-img");
        let width = 0, height = 0;
        if( viewSize === 1) {
          width = pic.clientWidth;
          height = pic.clientHeight;
          setOriginalSize([pic.clientWidth,pic.clientHeight])
        } else {
          width = originalSize[0];
          height = originalSize[1];
        }
        
        if (action === 'in' && viewSize > 0.25 ) {
          pic.setAttribute('style', `width: ${width*(viewSize-0.25)}px !important; height: ${height *(viewSize-0.25)}px !important`);
          setViewSize(viewSize - 0.25);
        } else if (action === 'out' && viewSize < 5) {
          pic.setAttribute('style', `width: ${width*(viewSize+0.25)}px !important; height: ${height *(viewSize+0.25)}px !important`);
          setViewSize(viewSize + 0.25);
        }
      } else if (fileType === 'application/pdf') {
        const pdf = document.getElementsByClassName("react-pdf__Page__canvas");
        const temp = document.getElementsByClassName("react-pdf__Page__canvas")[0];
        let width = 660, height = 700;
        if( viewSize === 1) {
          width = temp.clientWidth;
          height = temp.clientHeight;
          setOriginalSize([width, height])
        } else {
          width = originalSize[0];
          height = originalSize[1];
        }
        if (action === 'in' && viewSize > 0.25) {
          for (let i = 0; i < pdf.length; i++) {
            const curPage = document.getElementsByClassName("react-pdf__Page__canvas")[i];
            curPage.setAttribute('style', `width: ${width*(viewSize-0.25)}px !important; height: ${height*(viewSize-0.25)}px !important`);
          }
          setViewSize(viewSize - 0.25);
        } else if (action === 'out' && viewSize < 5) {
          for (let i = 0; i < pdf.length; i++) {
            const curPage = document.getElementsByClassName("react-pdf__Page__canvas")[i];
            curPage.setAttribute('style', `width: ${width*(viewSize+0.25)}px !important; height: ${height*(viewSize+0.25)}px !important`);
          }
          setViewSize(viewSize + 0.25);
        }
      }
    }

    const removeFile = () => {
      dispatch(FormActions.setFileRemoveIndex(currentFilePreview.index));
      closePreview();
      
    }

    const onPrevFile = () => {
      setOpenDelPopup(false);
      setViewSize(1);
      return previousDocument();
    }

    const onNextFile = () => {
      setOpenDelPopup(false);
      setViewSize(1);
      return nextDocument();
    }

    let zoomElement = (
      <div role="group" className={classes.ZoomButton} style={{marginRight: 13}}>
        <Button
          variant="text"
          size="medium"
          style={{ width: '12px', position: 'absolute', left: '-6%' }}
          onClick={() => zoomFeature('out', state.currentDocument.fileType)}>
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
          {viewSize * 100}%
        </span>
        <span style={{ color: 'white', position: 'absolute', width: '0px', right: '36%' }}>|</span>
        <Button
          variant="text"
          size="medium"
          style={{ width: '12px', position: 'absolute', right: '-6%' }}
          onClick={() => zoomFeature('in', state.currentDocument.fileType)}>
          <img src="/assets/images/icons/minus_icon.svg" />
        </Button>
      </div>
    )

    const viewElement = (
      <div className={classes.ViewInquiry} style={{marginRight: 13}} >
        <Button
          onClick={ViewInquiry}
          style={{
            color: 'white',
            display: 'flex',
            fontFamily: 'Montserrat',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '13px',
            lineHeight: '14px',
            width: '133px',
            padding: 0,
            position: 'absolute',
            left: '13px',
            textTransform: 'none',
          }}>
          <img src="/assets/images/icons/list_icon.svg" style={{height: '16px', width: '16px', position: 'absolute', left: '-1px'}}/>
            View Inquiry
        </Button>
      </div>
    )

    const expandElement = (
      <div className={classes.openNewTabs} title="Open in new tabs" style={{marginRight: '13px'}}>
        <Button
          variant="text"
          size="medium"
          onClick={openNewTabs}>
          <img src="/assets/images/icons/openNewTabs.svg" style={{height: '16px', width: '16px', position: 'absolute', left: '1px'}} />
        </Button>
      </div>
    )

    const delElement = (
      <div className={classes.deleteFile} title="Delete" style={{marginRight: 13}}>
        <Button onClick={() => {setOpenDelPopup(true)}}>
          <img src="/assets/images/icons/remove_file.svg" style={{height: '16px', width: '16px', position: 'absolute', left: '-1px'}}/> 
        </Button>
      </div>
    )

    const downloadElement = (
      <div className={classes.downloadFile} title="Download" style={{marginRight: 13}}>
        <Button onClick={downloadFile}>
          <img src="/assets/images/icons/download_icon.svg" style={{height: '16px', width: '16px', position: 'absolute', left: '-0.8px'}}/>
        </Button>
      </div>
    )

    const closePreviewElement = (
      <div className={classes.closePreview}>
        <Button
          variant="text"
          size="medium"
          onClick={closePreview}>
          <img src="/assets/images/icons/close_icon.svg" style={{ marginRight: 8 }} />
        </Button>
      </div>
    )

    const renderButton = () => {
      let iconShowList = [zoomElement, viewElement, expandElement, delElement, downloadElement, closePreviewElement];
      if(openAttachment) {
        const curInq = inquiry.files[currentFilePreview.index];
        // case different rule of creator and current user
        if(curInq && ((curInq.creator && curInq.creator.toUpperCase() !== user.role.toUpperCase()) || !curInq.creator)){
          iconShowList = [zoomElement, viewElement, expandElement, downloadElement, closePreviewElement];
        }
        // case create new attachments
        if(curInq && !curInq.inquiryId) {
          iconShowList = [zoomElement, expandElement, downloadElement, closePreviewElement];
        }
      } else {
        // no show inquiry detail
        iconShowList = [zoomElement, expandElement, downloadElement, closePreviewElement]
        // if(isEdit) {
        //   // no show del icon
        //   iconShowList = [zoomElement, expandElement, downloadElement, closePreviewElement]
        // } else {
        //   iconShowList = [zoomElement, expandElement, downloadElement, closePreviewElement]
        // }
      }
      
      return (
        <div style={{display: 'inline-flex'}}>
          {iconShowList.map(i => {
            return i
          })}
        </div>
      )
    }

    return (
      <div>
        <div className={'header-preview'}>
          <div className={'action-preview'}>
            <div className={classes.nameFile}>{state.currentDocument.fileName || ""}</div>
            <div style={{position:'absolute', display: 'inline-flex', right: '0px'}}>
              {renderButton()}
            </div>
            <div className={classes.nextPreview}>
              <ArrowBackIosIcon
                style={{
                  position: 'fixed',
                  left: '19rem',
                  width: '60px',
                  height: '60px',
                  color: state.currentFileNo === 0 ? '#999999' : 'white',
                  zIndex: 9000,
                  cursor: 'pointer'
                }}
                onClick={onPrevFile} disabled={state.currentFileNo === 0}
              />
              <ArrowBackIosIcon
                style={{
                  position: 'fixed',
                  right: '19rem',
                  width: '60px',
                  height: '60px',
                  color: state.currentFileNo >= state.documents.length - 1 ? '#999999' : 'white',
                  transform: 'scaleX(-1)',
                  zIndex: 9000,
                  cursor: 'pointer'
                }}
                onClick={onNextFile}
                disabled={state.currentFileNo >= state.documents.length - 1} />
            </div>
  
          </div>
              
        </div>

        {openDelPopup &&
          <div className={classes.confirmDelPopUp}>
            <div>
              <img className={classes.iconDelFile} src="/assets/images/icons/warning.svg" />
            </div>
            <div className={classes.textConfirmDelFile}>
              Are you sure you want to delete this attachment?
            </div>
            <Button
              variant="text"
              size="medium"
              className={classes.conFirmDelButton}
              onClick={() => removeFile()}
            >
              Confirm
            </Button>
            <Button
              variant="text"
              size="medium"
              className={classes.cancelDelButton}
              onClick={() => {setOpenDelPopup(false)}}
            >
              Cancel
            </Button>
          </div>

        }
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

  useEffect(() => {
    let fileIds = [];
    if (inquiry && inquiry.files) {
      if (inquiry.files && inquiry.files.length > 0) {
        inquiry.files.forEach(file => fileIds.push({ id: file.id, ext: file.ext, name: file.name, url: file.src }));
        let listSrcFiles = [];
        fileIds.forEach(async (f, i) => {
          let url = '';
          if (f.id) {
            const blob = await getFile(f.id).catch((err) => handleError(dispatch, err));
            url = urlMedia(f.ext, blob);
          } else url = f.url;
          if (url) {
            if (!['png', 'pdf', 'jpeg', 'jpg'].includes(f.name.split(".").slice(-1)[0].toLowerCase())) {
              listSrcFiles.push({ uri: url, fileName: f.name, index: i, fileType: '', fileId: f.id });
            } else {
              listSrcFiles.push({ uri: url, fileName: f.name, index: i, fileType: f.type, fileId: f.id });
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
    dispatch(FormActions.setScrollInquiry());
  }
  
  const handleKeyPress = (event) => {
    if (event.key === 'ArrowLeft') {
      return docViewerRef?.current?.prev();
    } else if (event.key === 'ArrowRight') {
      return docViewerRef?.current?.next();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div className={classes.root}>
      <div className={'closePreviewTop'} onClick={closePreview}></div>
      <div className={'closePreviewLeft'} onClick={closePreview}></div>
      <div className={'closePreviewRight'} onClick={closePreview}></div>
      <div className={'closePreviewBottom'} onClick={closePreview}></div>

      <DocViewer
        ref={docViewerRef}
        pluginRenderers={DocViewerRenderers}
        documents={allFileUrl}
        initialActiveDocument={allFileUrl.length && inquiry.file && allFileUrl.find(f => (f.filedId ? (f.fileId === inquiry.file.id) : (f.fileName === inquiry.file.name)))}
        config={{
          header: {
            overrideComponent: MyHeader
          },
          pdfVerticalScrollByDefault: true

        }}

      />
      
    </div>
  );
};

export default PDFViewer;
