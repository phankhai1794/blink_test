import { filterMetadata } from '@shared';
import { getInquiryById, getMetadata } from 'app/services/inquiryService';
import { createBL, getBlInfo } from 'app/services/myBLService';
import { setMyBL, saveField, editInquiry, setOriginalInquiry, saveMetadata } from './inquiry'
// export * from './mail.actions'

export const initBL = (bkgNo) => async (dispatch) => {
  createBL(bkgNo)
    .then((res) => {
      if (res) dispatch(setMyBL(res.myBL));
    })
    .catch((err) => console.log(err));
};

export const loadMetadata = () => async (dispatch) => {
  getMetadata().then((res) => {
    const data = filterMetadata(res);
    dispatch(saveMetadata(data));
  }).catch((err) => console.log(err));
};


export const loadInquiry = (myBL_Id) => async (dispatch) => {
  getInquiryById(myBL_Id).then((res) => {
    const field_list = res.map(e => e.field);
    dispatch(saveField(field_list));
    dispatch(editInquiry(res));
    dispatch(setOriginalInquiry(JSON.parse(JSON.stringify(res))));
  }).catch((err) => console.log(err));
};

export const loadBlInfo = (myBL_Id, setContent) => {
  getBlInfo(myBL_Id).then((res) => {
    setContent(res.myBL.content)
  }).catch((err) => console.log(err));
};
