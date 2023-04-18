import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import * as InquiryActions from 'app/main/apps/workspace/store/actions/inquiry';

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

    // TODO
    const handlePrevious = () => {
    }

    // TODO
    const handleNext = () => {
    }

    const result = () => {
        return (
            <div className={classes.pagination}>
                <a onClick={() => handleClickStart()}>&laquo;</a>
                {Array.from(Array(state.totalPageNumber).keys()).map(key => (
                    <a className={(state.currentNumber === key + 1) ? classes.pageSelected : ''} index={key} onClick={() => handleSelectPage(key + 1)}>{key + 1}</a>
                ))}
                <a onClick={() => handleClickEnd()}>&raquo;</a>
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
