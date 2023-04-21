import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import * as InquiryActions from 'app/main/apps/workspace/store/actions/inquiry';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import NavigateNext from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '16px',
        paddingBottom: '16px',
        '& a': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '10px',
            width: '40px',
            height: '43px',
            border: '1px solid #E2E6EA',
            backgroundColor: '#FFFFFF',
            color: '#132535',
            textDecoration: 'none',
            margin: '5px',
            cursor: 'pointer',
        }
    },
    pagination: {
        display: 'flex',
        position: 'absolute',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bottom: '-10px',
    },
    pageSelected: {
        backgroundColor: '#BD0F72 !important',
        color: '#FFFFFF !important',
    }
}));

const Pagination = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const searchQueueQuery = useSelector(({ workspace }) => workspace.inquiryReducer.searchQueueQuery);

    const [state, setState] = useState({ currentNumber: props.currentNumber, totalPage: props.totalPage, totalPageNumber: Math.ceil(props.totalBkgNo / searchQueueQuery.pageSize) })

    useEffect(() => {
        setState({ currentNumber: props.currentNumber, totalPage: props.totalPage, totalPageNumber: Math.ceil(props.totalBkgNo / searchQueueQuery.pageSize) })
    }, [props]);

    const handleSelectPage = (page) => {
        dispatch(InquiryActions.searchQueueQuery({ ...searchQueueQuery, currentPageNumber: page }));
        setState({ ...state, currentNumber: page });
    }

    const handleClickStart = () => {
        dispatch(InquiryActions.searchQueueQuery({ ...searchQueueQuery, currentPageNumber: 1 }));
        setState({ ...state, currentNumber: 1 });
    }

    const handleClickEnd = () => {
        dispatch(InquiryActions.searchQueueQuery({ ...searchQueueQuery, currentPageNumber: state.totalPageNumber }));
        setState({ ...state, currentNumber: state.totalPageNumber });
    }

    const handlePrevious = () => {
        if (state.currentNumber > 1) {
            dispatch(InquiryActions.searchQueueQuery({ ...searchQueueQuery, currentPageNumber: state.totalPageNumber - 1 }));
            setState({ ...state, currentNumber: state.currentNumber - 1 });
        }
    }

    const handleNext = () => {
        if (state.currentNumber < state.totalPageNumber) {
            dispatch(InquiryActions.searchQueueQuery({ ...searchQueueQuery, currentPageNumber: state.currentNumber + 1 }));
            setState({ ...state, currentNumber: state.currentNumber + 1 });
        }
    }

    const result = () => {
        return (
            <div className={classes.pagination}>
                <a key={'start'} onClick={() => handleClickStart()} style={{ fontSize: '17px' }}>&laquo;</a>
                <a key={'previous'} onClick={() => handlePrevious()}><NavigateBefore style={{ fontSize: '15px' }} /></a>
                {Array.from(Array(state.totalPageNumber).keys()).map(key => (
                    <a key={key + 1} className={(state.currentNumber === key + 1) ? classes.pageSelected : ''} onClick={() => handleSelectPage(key + 1)}>{key + 1}</a>
                ))}
                <a key={'next'} onClick={() => handleNext()}><NavigateNext style={{ fontSize: '15px' }} /></a>
                <a key={'end'} onClick={() => handleClickEnd()} style={{ fontSize: '17px' }}>&raquo;</a>
            </div>
        )
    }

    return (
        <div className={classes.container}>
            {result()}
        </div>
    );
};
export default Pagination;
