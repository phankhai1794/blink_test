import * as FormActions from 'app/main/apps/workspace/store/actions/form';
import React, { useEffect } from 'react';
import { Button } from '@material-ui/core';
import clsx from 'clsx';
import { useSelector, useDispatch } from 'react-redux';
import * as TransActions from 'app/main/apps/workspace/store/actions/transaction';
import * as Actions from 'app/main/apps/workspace/store/actions';
import * as AppActions from 'app/store/actions';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  button: {
    textTransform: 'none',
    fontWeight: 'bold'
  }
}));

function RestoreVersion(props) {
  const dispatch = useDispatch();
  const classes = useStyles(props);
  const [myBL] = useSelector(({ workspace }) => [workspace.inquiryReducer.myBL]);
  const [transId, restoreSuccess] = useSelector(({ workspace }) => [
    workspace.transReducer.transId,
    workspace.transReducer.restoreSuccess
  ]);

  const restoreHandle = () => {
    dispatch(TransActions.restoreBLTrans(myBL.id, transId));
  };

  useEffect(() => {
    if (restoreSuccess) {
      dispatch(
        AppActions.showMessage({
          message: 'Restore version successfully',
          variant: 'success'
        })
      );
      dispatch({
        type: TransActions.RESTORE_BL_TRANS_NONE
      });
      dispatch(TransActions.BlTrans(myBL.id, {}));
      dispatch(FormActions.openTrans());
      dispatch(Actions.loadInquiry(myBL.id));
    }
  }, [restoreSuccess]);

  return (
    <>
      <div
        style={{
          paddingLeft: 15,
          paddingRight: 5,
          paddingTop: 17
        }}>
        <Button
          style={{
            width: 120,
            height: 30,
            color: 'white',
            backgroundColor: '#137333',
            borderRadius: 20
          }}
          variant="text"
          size="medium"
          className={clsx('h-64', classes.button)}
          onClick={restoreHandle}>
          <span className="pl-12">RESTORE VERSION</span>
        </Button>
      </div>
    </>
  );
}

export default RestoreVersion;
