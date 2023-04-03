import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { MAX_ROWS_CD, MAX_CHARS, lineBreakAtBoundary } from '@shared';
import { SHIPPING_MARK, TOTAL_PACKAGE, TOTAL_PACKAGE_UNIT, DESCRIPTION_OF_GOODS, TOTAL_WEIGHT, TOTAL_WEIGHT_UNIT, TOTAL_MEASUREMENT, TOTAL_MEASUREMENT_UNIT, CM_MARK, CM_PACKAGE, CM_PACKAGE_UNIT, CM_DESCRIPTION } from '@shared/keyword';
import { packageUnitsJson } from '@shared/units';

import NextPage from './NextPage';

const MAX_ROW_NEXT_PAGE = 63;

const Rider = ({ drfMD, containersDetail, containersManifest, setTotalPage }) => {

  const [cdSplitted, setCdSplitted] = useState([]);
  const [cmSplitted, setCmSplitted] = useState([]);

  const [metadata, content, drfView] = useSelector(({ draftBL }) => [draftBL.metadata, draftBL.content, draftBL.drfView]);

  const getField = (field) => {
    return metadata.field ? metadata.field[field] : '';
  };

  const getValueField = (field) => {
    return content[getField(field)] || '';
  };

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
    let arr = [[]];
    let filledLines = cdSplitted.length ? (cdSplitted[cdSplitted.length - 1].length + 1) : 0; // +1 dashline

    if (drfView === "MD") {
      let result = { mark: [[]], package: [[]], description: [[]] };
      let data = {
        mark: getValueField(SHIPPING_MARK)
          .split("\n")
          .map(line => lineBreakAtBoundary(line, MAX_CHARS.mark))[0].split("\n"),
        package: `${drfMD[TOTAL_PACKAGE]}\n${getPackageName(drfMD[TOTAL_PACKAGE_UNIT])}`
          .split("\n").map(line => lineBreakAtBoundary(line, MAX_CHARS.package)),
        description: getValueField(DESCRIPTION_OF_GOODS)
          .split("\n")
          .map(line => lineBreakAtBoundary(line, MAX_CHARS.description))[0].split("\n")
      };

      ['mark', 'package', 'description'].forEach(key => {
        while (data[key].length) {
          const availableLines = MAX_ROW_NEXT_PAGE - filledLines;
          if (data[key].length < availableLines) {
            result[key][result[key].length - 1].push(data[key].join("\n"));
            data[key] = [];
          } else {
            let sliceData = data[key].slice(0, availableLines).join("\n");
            result[key][result[key].length - 1].push(sliceData);
            data[key] = data[key].slice(availableLines);
            filledLines = 0;
          }
        }
      })

      const max = Math.max(
        result.mark[0]?.length,
        result.package[0].length,
        result.description[0].length,
      ) || 1;

      for (let i = 0; i < max; i++) {
        arr[i] = [{
          [SHIPPING_MARK]: result.mark[0]?.[i] || [],
          [TOTAL_PACKAGE]: result.package[0]?.[i] || [],
          [DESCRIPTION_OF_GOODS]: result.description[0]?.[i] || [],
          [TOTAL_WEIGHT]: i === 0 ? `${drfMD[TOTAL_WEIGHT]} ${drfMD[TOTAL_WEIGHT_UNIT]}` : "",
          [TOTAL_MEASUREMENT]: i === 0 ? `${drfMD[TOTAL_MEASUREMENT]} ${drfMD[TOTAL_MEASUREMENT_UNIT]}` : ""
        }];
      }
    } else {
      let idx = 0;
      let cmMark = "";
      let cmPackage = "";
      let cmDescription = "";

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
    }

    setCmSplitted(arr);
    setTotalPage(arr.length + 1);
  }, [cdSplitted, drfView]);

  return (
    <>
      {cmSplitted.map((cmList, idx) => (
        <NextPage
          key={idx}
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
