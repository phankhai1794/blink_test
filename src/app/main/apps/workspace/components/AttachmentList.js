import { getKeyByValue } from '@shared';
import React from 'react';
import { useSelector } from 'react-redux';
import { Divider, Link } from '@material-ui/core';
import DescriptionIcon from '@material-ui/icons/Description';

import FileAttach from './FileAttach';

const AttachmentList = (props) => {
  const [inquiries, metadata] = useSelector(({ workspace }) => [
    workspace.inquiryReducer.inquiries,
    workspace.inquiryReducer.metadata,
  ])
  const handleRemove = () => {

  }
  return (
    <>
      {inquiries.map((i) => {
        return (
          <>
            {i.mediaFile.map((media, index1) => {
              return (
                <>
                  <div key={index1} className="flex">
                    <div className="flex" style={{ width: "300px" }}>
                      {media.ext.includes("pdf") ?
                        <img style={{ height: '25px', width: '25px' }} src={`../../assets/images/logos/pdf_icon.png`} />
                        :
                        media.ext.match(/jpeg|jpg|png/g) ? <img style={{ height: '20px', width: '20px' }} src={`../../assets/images/logos/image_icon.png`} />
                          :
                          media.ext.match(/doc/g) ? <img style={{ height: '20px', width: '20px' }} src={`../../assets/images/logos/word_icon.png`} />
                            :
                            (media.ext.includes("vnd.") || media.ext.match(/csv|xls/g) ? <img style={{ height: '20px', width: '20px' }} src={`../../assets/images/logos/excel_icon.png`} />
                              :
                              <DescriptionIcon />)
                      }
                      <span style={{ width: "200px", textOverflow: "ellipsis", overflow: "hidden", fontSize: '18px', fontWeight: 600, lineHeight: '22px', marginLeft: '1rem' }}>
                        {media.name}
                      </span>
                    </div>
                    <div className="flex justify-between" style={{ width: '600px' }}>
                      <div style={{ fontSize: '16px', color: '#BD0F72', fontWeight: 600, lineHeight: '20px' }}>
                        {getKeyByValue(metadata['field'], i.field)}
                      </div>

                      <Link
                        component="button"
                        variant="body2"
                        onClick={handleRemove}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <img style={{ height: '20px', width: '20px' }} src={`../../assets/images/logos/remove_icon.png`} />
                        <span style={{ fontSize: '15px', marginLeft: '5px', fontWeight: '500', color: 'gray' }}>Remove</span>
                      </Link>
                    </div>
                  </div>
                  {index1 !== i.mediaFile.length && <Divider className="mt-16 mb-16" />}
                </>
              )
            })
            }
          </>
        )
      })
      }
    </>
  )
}
export default AttachmentList;
