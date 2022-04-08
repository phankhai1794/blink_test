import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import _ from '@lodash';
import * as HeaderActions from 'app/store/actions/header';

const DraftWorkspace = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(HeaderActions.displayBtn({ displayEditBtn: true }));
  }, []);

  return (
    <>
      <div style={{ height: '100%' }}>
        <iframe
          id="pdf-contents"
          src="assets/pdf/BL_TYOBH3669500_1644908786.3842757.pdf#view=FitH&toolbar=0"
          width="100%"
          height="100%"
          frameborder="0"
        ></iframe>
      </div>
    </>
  );
};
export default DraftWorkspace;
