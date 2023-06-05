import React, { useState, useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/styles';
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
  totalPageCount,
  currentPage
) => {
  const paginationRange = useMemo(() => {
    /*
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..totalPageCount]
    */
    if (totalPageCount < 5) {
      return range(1, totalPageCount);
    }
    /*
      We do not want to show dots if there is only one position left 
      after/before the left/right page count as that would lead to a change if our Pagination
      component size which we do not want
    */
    const shouldShowLeftDots = currentPage - 1 >= 4;
    const shouldShowRightDots = currentPage < totalPageCount - 3;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = currentPage + 1;
      let leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, totalPageCount];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightRange = range(
        currentPage - 1,
        totalPageCount
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(currentPage - 1, currentPage + 1);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

    return range(1, totalPageCount);
  }, [totalPageCount, currentPage]);

  return paginationRange;
};
const Pagination = (props) => {
  const { currentNumber, totalPage, totalBkgNo, query, searchQueueQuery } = props;
  const classes = useStyles();

  const [state, setState] = useState({ currentNumber, totalPage, totalPageNumber: Math.ceil(totalBkgNo / query.pageSize) });

  useEffect(() => {
    setState({ currentNumber, totalPage, totalPageNumber: Math.ceil(totalBkgNo / query.pageSize) });
  }, [props]);

  const handleSelectPage = (page) => {
    searchQueueQuery({ currentPageNumber: page });
    setState({ ...state, currentNumber: page });
  }

  const handlePrevious = () => {
    if (state.currentNumber > 1) {
      searchQueueQuery({ currentPageNumber: state.currentNumber - 1 });
      setState({ ...state, currentNumber: state.currentNumber - 1 });
    }
  }

  const handleNext = () => {
    if (state.currentNumber < state.totalPageNumber) {
      searchQueueQuery({ currentPageNumber: state.currentNumber + 1 });
      setState({ ...state, currentNumber: state.currentNumber + 1 });
    }
  }

  const paginationRange = usePagination(state.totalPageNumber, state.currentNumber);

  return (
    <>
      {/* <a key={'start'} onClick={() => handleClickStart()} style={{ fontSize: '17px' }}>&laquo;</a> */}
      <a key={'previous'} onClick={() => handlePrevious()}><NavigateBefore style={{ fontSize: '15px' }} /></a>
      {paginationRange?.map(pageNumber => {
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
