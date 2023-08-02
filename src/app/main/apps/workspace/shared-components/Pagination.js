import React, { useState, useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/styles';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import NavigateNext from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles((theme) => ({
  pageSelected: {
    backgroundColor: '#BD0F72 !important',
    color: '#FFFFFF !important'
  }
}));

const DOTS = '...';

const range = (start, end) => {
  let length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

const usePagination = (totalPageCount, currentPage) => {
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
      let rightRange = range(currentPage - 1, totalPageCount);
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
  const { page, totalPageNumber, setPage, isReset } = props;
  const classes = useStyles();

  const [state, setState] = useState({
    page: page.currentPageNumber
  });

  useEffect(() => {
    setState({ page: Math.min(totalPageNumber, page.currentPageNumber) });
  }, [totalPageNumber]);

  useEffect(() => {
    if (isReset) setState({ page: 1 });
  }, [isReset]);

  const handleSelectPage = (currentPage) => {
    setPage(currentPage, page.pageSize);
    setState({ ...state, page: currentPage });
  };

  const handlePrevious = () => {
    if (state.page > 1) {
      setPage(state.page - 1, page.pageSize);
      setState({ ...state, page: state.page - 1 });
    }
  };

  const handleNext = () => {
    if (state.page < totalPageNumber) {
      setPage(state.page + 1, page.pageSize);
      setState({ ...state, page: state.page + 1 });
    }
  };

  const paginationRange = usePagination(totalPageNumber, state.page);

  return (
    <>
      {/* <a key={'start'} onClick={() => handleClickStart()} style={{ fontSize: '17px' }}>&laquo;</a> */}
      <a key={'previous'} onClick={() => handlePrevious()}>
        <NavigateBefore style={{ fontSize: '15px' }} />
      </a>
      {paginationRange?.map((pageNumber, index) => {
        if (pageNumber === DOTS) {
          return (
            <div key={`pa-${index}`} style={{ margin: 'auto 0', textAlign: 'center', width: 40 }}>
              &#8230;
            </div>
          );
        }

        return (
          <a
            key={pageNumber + 1}
            className={state.page === pageNumber ? classes.pageSelected : ''}
            onClick={() => handleSelectPage(pageNumber)}>
            {pageNumber}
          </a>
        );
      })}
      <a key={'next'} onClick={() => handleNext()}>
        <NavigateNext style={{ fontSize: '15px' }} />
      </a>
      {/* <a key={'end'} onClick={() => handleClickEnd()} style={{ fontSize: '17px' }}>&raquo;</a> */}
    </>
  );
};
export default Pagination;
