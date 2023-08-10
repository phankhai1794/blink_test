import React from 'react';

import NextPage from './NextPage';

const Rider = ({ pages }) => {
  return (
    <>
      {pages.map((page, idx) => (
        <NextPage
          key={idx}
          currentPage={idx + 2} // start from 1 and +1 first page
          totalPage={pages.length + 1} // +1 first page
          data={page}
        />
      ))}
    </>
  );
};

export default Rider;