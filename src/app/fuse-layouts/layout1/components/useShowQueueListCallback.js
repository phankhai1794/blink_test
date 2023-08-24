import {useCallback} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as InquiryActions from 'app/main/apps/workspace/store/actions/inquiry';
import { setLocalStorageItem } from 'app/main/apps/dashboards/admin/components';

const useShowQueueListCallback = () => {
  const userType = useSelector(({ user }) => user.userType);
  const dispatch = useDispatch();
  const showQueueList = useCallback(() => {
    const { search } = window.location;
    const country = new URLSearchParams(search).get('cntr');

    // BACKUP Code
    // const param = country ? `?cntr=${country}` : "";
    // userType === 'ADMIN' ?
    //   window.open(`/apps/admin${param}`) :
    //   dispatch(InquiryActions.openQueueList(true));

    userType === 'ADMIN' ?
      window.open('/apps/admin') :
      dispatch(InquiryActions.openQueueList(true));

    localStorage.setItem('fcountry', JSON.stringify([country]));
    localStorage.removeItem('foffice');
    setLocalStorageItem('from', null);
    setLocalStorageItem('to', null);
    setLocalStorageItem('bookingNo', null);
  }, [userType, dispatch]);
  
  return {
    showQueueList
  }
}

export default useShowQueueListCallback;