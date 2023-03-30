import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { MAX_ROWS_CD, MAX_CHARS, lineBreakAtBoundary } from '@shared';
import { CM_MARK, CM_PACKAGE, CM_PACKAGE_UNIT, CM_DESCRIPTION } from '@shared/keyword';
import { packageUnitsJson } from '@shared/units';

import NextPage from './NextPage';

const MAX_ROW_NEXT_PAGE = 63;

const Rider = ({ drfMD, containersDetail, containersManifest, setTotalPage }) => {

  const [cdSplitted, setCdSplitted] = useState([]);
  const [cmSplitted, setCmSplitted] = useState([]);

  const metadata = useSelector(({ draftBL }) => draftBL.metadata);

  const getInqType = (field) => {
    return metadata ? metadata.inq_type[field] : '';
  };

  const getPackageName = (packageCode) => packageUnitsJson.find(pkg => pkg.code === packageCode)?.description;

  useEffect(() => {
    let cd = containersDetail.length > MAX_ROWS_CD ? containersDetail.slice(MAX_ROWS_CD + 1) : [];
    while (cd.length) {
      const arr = [...cdSplitted];
      if (cd.length > MAX_ROW_NEXT_PAGE) {
        arr.push(cd.slice(0, MAX_ROW_NEXT_PAGE));
        cd = cd.slice(MAX_ROW_NEXT_PAGE + 1);
      } else {
        arr.push(cd);
        cd = [];
      }
      setCdSplitted(arr);
    }
  }, []);

  useEffect(() => {
    let idx = 0;
    let arr = [[]];
    let cmMark = "";
    let cmPackage = "";
    let cmDescription = "";
    let filledLines = cdSplitted.length ? (MAX_ROW_NEXT_PAGE - cdSplitted[cdSplitted.length - 1].length + 1) : 0;

    containersManifest.forEach(cm => {
      cmMark += lineBreakAtBoundary(cm[getInqType(CM_MARK)], MAX_CHARS.mark) + "\n";
      cmPackage += `${cm[getInqType(CM_PACKAGE)]}\n${getPackageName(cm[getInqType(CM_PACKAGE_UNIT)])}`.split("\n").map(line => lineBreakAtBoundary(line, MAX_CHARS.package)).join("\n");
      cmDescription += lineBreakAtBoundary(cm[getInqType(CM_DESCRIPTION)], MAX_CHARS.description) + "\n";

      const maxLine = Math.max(
        cmMark.trim().split("\n").length,
        cmPackage.trim().split("\n").length,
        cmDescription.trim().split("\n").length
      );

      if ((filledLines + maxLine + (idx + 1)) < MAX_ROW_NEXT_PAGE) {
        arr[arr.length - 1].push(cm);
      } else { // push to new page
        arr.push([cm]);
        idx = 0;
        cmMark = "";
        cmPackage = "";
        cmDescription = "";
        filledLines = 0;
      }
    });

    setCmSplitted(arr);
    setTotalPage(arr.length + 1);
  }, [cdSplitted]);

  return (
    <>
      {cmSplitted.map((cmList, idx) => (
        <NextPage
          key={idx}
          drfMD={drfMD}
          containersDetail={cdSplitted[idx] || []}
          containersManifest={cmList}
          currentPage={idx + 2} // currentPage start from 2
          totalPage={cmSplitted.length + 1} // + first page
        />
      ))}
    </>
  );
};

export default Rider;
