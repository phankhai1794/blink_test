import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import * as InquiryActions from 'app/main/apps/workspace/store/actions/inquiry';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import NavigateNext from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles((theme) => ({
  pageSelected: {
    backgroundColor: '#BD0F72 !important',
    color: '#FFFFFF !important',
  }
}));

const DOTS = '...';

const range = (start, end) => {
  let length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

const usePagination = (
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage
) => {

  const totalPageCount = Math.ceil(totalCount / pageSize);

  // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
  const totalPageNumbers = siblingCount + 5;

  /*
    If the number of pages is less than the page numbers we want to show in our
    paginationComponent, we return the range [1..totalPageCount]
  */
  if (totalPageNumbers >= totalPageCount) {
    return range(1, totalPageCount);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(
    currentPage + siblingCount,
    totalPageCount
  );

  /*
    We do not want to show dots if there is only one position left 
    after/before the left/right page count as that would lead to a change if our Pagination
    component size which we do not want
  */
  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

  const firstPageIndex = 1;
  const lastPageIndex = totalPageCount;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    let leftItemCount = 3 + 2 * siblingCount;
    let leftRange = range(1, leftItemCount);

    return [...leftRange, DOTS, totalPageCount];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    let rightItemCount = 3 + 2 * siblingCount;
    let rightRange = range(
      totalPageCount - rightItemCount + 1,
      totalPageCount
    );
    return [firstPageIndex, DOTS, ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    let middleRange = range(leftSiblingIndex, rightSiblingIndex);
    return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
  }

};
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
      dispatch(InquiryActions.searchQueueQuery({ ...searchQueueQuery, currentPageNumber: state.currentNumber - 1 }));
      setState({ ...state, currentNumber: state.currentNumber - 1 });
    }
  }

  const handleNext = () => {
    if (state.currentNumber < state.totalPageNumber) {
      dispatch(InquiryActions.searchQueueQuery({ ...searchQueueQuery, currentPageNumber: state.currentNumber + 1 }));
      setState({ ...state, currentNumber: state.currentNumber + 1 });
    }
  }

  const paginationRange = usePagination(props.totalBkgNo, searchQueueQuery.pageSize, 2, state.currentNumber);

  return (
    <>
      {/* <a key={'start'} onClick={() => handleClickStart()} style={{ fontSize: '17px' }}>&laquo;</a> */}
      <a key={'previous'} onClick={() => handlePrevious()}><NavigateBefore style={{ fontSize: '15px' }} /></a>
      {paginationRange.map(pageNumber => {
        if (pageNumber === DOTS) {
          return <div style={{ margin: 'auto 0', textAlign: 'center', width: 40 }}>&#8230;</div>;
        }

        return (
          <a
            key={pageNumber + 1}
            className={(state.currentNumber === pageNumber) ? classes.pageSelected : ''}
            onClick={() => handleSelectPage(pageNumber)}
          >
            {pageNumber}
          </a>
        );
      })}
      <a key={'next'} onClick={() => handleNext()}><NavigateNext style={{ fontSize: '15px' }} /></a>
      {/* <a key={'end'} onClick={() => handleClickEnd()} style={{ fontSize: '17px' }}>&raquo;</a> */}
    </>
  );
};
export default Pagination;
