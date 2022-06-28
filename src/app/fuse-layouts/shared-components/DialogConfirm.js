import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogContent,
    DialogActions,
} from '@material-ui/core';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import CloseOutlined from '@material-ui/icons/CloseOutlined';
import { useSelector } from 'react-redux';
import { draftConfirm } from '@shared';

function DialogConfirm(props) {
    const { handleClose, open } = props;
    const myblState = useSelector(({ draftBL }) => draftBL.myblState);
    const [checkUpdate, setCheckUpdate] = useState(false);
    useEffect(() => {
        myblState === draftConfirm && setCheckUpdate(true)
    }, [myblState])

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
            maxWidth="md"
            style={{ fontSize: '16px' }}
        >
            <DialogContent style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                {checkUpdate ?
                    <CheckCircleOutline fontSize={'large'} color='primary' /> :
                    <CloseOutlined fontSize={'large'} color='primary' />}
                {checkUpdate ?
                    <DialogContent id="alert-dialog-title" className='text-center font-bold'>
                        <p style={{ color: '#bd1874' }}>Your B/L is confrimed</p>
                        <p>Thank you!</p>
                    </DialogContent> :
                    <DialogContent id="alert-dialog-title" className='text-center font-bold'>
                        <p style={{ color: '#bd1874' }}>Confirmed B/L is Failed!</p>
                    </DialogContent>}
                <DialogActions>
                    <Button
                        style={{
                            width: '120px',
                            height: '30px',
                            color: 'white',
                            backgroundColor: '#bd1874',
                            borderRadius: '8px'
                        }}
                        variant="contained"
                        size="medium"
                        onClick={handleClose}
                        className='normal-case'>
                        <span>{checkUpdate ? 'Done' : 'Close'}</span>
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog >
    );
}

export default DialogConfirm;
