import moment from 'moment';
import {
  TOTAL_PACKAGE_UNIT,
  TOTAL_WEIGHT_UNIT,
  TOTAL_MEASUREMENT_UNIT,
  CONTAINER_LIST,
  DATED,
  DATE_CARGO,
  DATE_LADEN
} from '@shared/keyword';

export const getLabelById = (fieldOptions, id) => {
  const result = fieldOptions.filter(({ value }) => value === id);
  return result.length ? result[0].label : "";
}

export const toFindDuplicates = arry => arry.filter((item, index) => arry.indexOf(item) !== index)

export const displayTime = (time) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let inputTime = new Date(time);

  let month = months[inputTime.getMonth()];
  let day = inputTime.getDate();
  let hour = inputTime.getHours()
  let minute = inputTime.getMinutes()
  let year = inputTime.getFullYear()
  minute = minute.toString().length === 1 ? `0${minute}` : minute
  return `${month} ${day} ${year}   ${hour}:${minute}`
};

export const filterMetadata = (data) => {
  const dict = { field: {}, inq_type: {}, ans_type: {}, inq_type_options: [], field_options: [], template: data.template };
  data['field'].forEach(({ id, keyword, name, show }) => {
    dict['field'][keyword] = id;
    dict['field_options'].push({ label: name, value: id, keyword, display: show });
  })
  data['inqType'].forEach(({ id, name, field }) => {
    dict['inq_type'][name] = id;
    dict['inq_type_options'].push({
      label: name,
      value: id,
      field
    });
  })
  data['ansType'].forEach(({ id, name }) => {
    dict['ans_type'][name] = id;
  })
  return dict;
};

export const validateExtensionFile = (file) => {
  const fileExt = file.name.split('.').pop().toLowerCase();
  return fileExt.match(/jpe|jpg|png|pdf|csv|xls|sheet|ppt|doc|txt|gif/g);
};

export const checkNewInquiry = (metadata, inquiries, type, status = ['OPEN', 'REP_Q_DRF', 'AME_DRF', 'REP_DRF']) => {
  const list = [];
  const temp = inquiries?.filter(inq => inq.receiver[0] === type && status.includes(inq.state));
  if (temp.length) {
    const sortDateList = temp.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    sortDateList.forEach(inq => {
      const find = metadata?.field_options.find(field => field.value === inq.field);
      if (find && !list.includes(find.label)) list.push(find.label);
    })
  }
  return list;
}

export const NUMBER_INQ_BOTTOM = 6;

export const draftConfirm = 'DRF_CONF';

export const stateResquest = 'REQUEST';

export const COUNTRIES = [
  {
    name: 'United States',
    value: 'US'
  },
  {
    name: 'Singapore',
    value: 'SG'
  },
  {
    name: 'Thailand',
    value: 'TH'
  },
  {
    name: 'Vietnam',
    value: 'VN'
  },
  {
    name: 'Czechia',
    value: 'CZ'
  },
  {
    name: 'Denmark',
    value: 'DK'
  },
  {
    name: 'Finland',
    value: 'FI'
  },
  {
    name: 'France',
    value: 'FR'
  },
  {
    name: 'Hungary',
    value: 'HU'
  },
  {
    name: 'Italy',
    value: 'IT'
  },
  {
    name: 'Norway',
    value: 'NO'
  },
  {
    name: 'Poland',
    value: 'PL'
  },
  {
    name: 'Russian',
    value: 'RU'
  },
  {
    name: 'Sweden',
    value: 'SE'
  },
  {
    name: 'Switzerland',
    value: 'CH'
  },
  {
    name: 'Spain',
    value: 'ES'
  },
  {
    name: 'Portugal',
    value: 'PT'
  },
  {
    name: 'Taiwan',
    value: 'TW'
  },
  {
    name: 'Japan',
    value: 'JP'
  },
  {
    name: 'New Zealand',
    value: 'OC_ML'
  },
  {
    name: 'Myanmar',
    value: 'MM'
  },
  {
    name: 'Montenegro	',
    value: 'ME'
  },
];

export const sentStatus = [
  ...['ANS_SENT', 'REP_Q_DRF', 'REP_Q_SENT', 'REP_A_DRF', 'REP_A_SENT', 'REOPEN_Q', 'REOPEN_A'], // inquiry status
  ...['REP_SENT'] // draft status
];

export function NumberFormat(number) {
  if (!number || number.length === 0) return '';
  const formattedNumber = (typeof number === 'string' ? parseFloat(number.replace(",", "")).toFixed(3) : number).toLocaleString("en-US", {
    maximumFractionDigits: 3,
  });
  return formattedNumber;
}

export const validatePartiesContent = (partiesContent, type) => {
  const MAX_LENGTH = 35;
  const ErrorMessage = `The maximum number of lines is ${type === 'name' ? 2 : 3}. No more than 35 characters per each line.`;
  let isError = false, errorType = ErrorMessage;
  const textInput = partiesContent;
  const arrTextInput = typeof textInput === 'string' ? textInput.split('\n') : [];
  arrTextInput.forEach(text => {
    if (text.length > MAX_LENGTH) isError = true;
  })
  if (['name'].includes(type) && arrTextInput.length > 2) {
    isError = true;
    errorType = ErrorMessage;
  };
  if (['address'].includes(type) && arrTextInput.length > 3) {
    isError = true;
    errorType = ErrorMessage;
  };

  return { isError, errorType }
}

export const validateAlsoNotify = (content) => {
  const MAX_LENGTH = 35;
  const ErrorMessage = 'The maximum number of lines is 5. No more than 35 characters per each line.';
  let isError = false, errorType = "";
  const textInput = content;
  const arrTextInput = typeof textInput === 'string' ? textInput.split('\n') : [];
  arrTextInput.forEach(text => {
    if (text.length > MAX_LENGTH) isError = true;
  })
  if (arrTextInput.length > 5) {
    isError = true;
  };
  isError && (errorType = ErrorMessage);

  return { isError, errorType }
}

export const validateBLType = (input) => {
  let response = { isError: false, errorType: "" };
  let value = input?.trim();
  if (!value || !["B", "W"].includes(value.toUpperCase())) {
    response = {
      ...response,
      isError: true,
      errorType: `The value you entered should be "B" or "W".\n- "B" for Ocean B/L\n- "W" for Seaway Bill`
    };
  }
  return response;
}

/**
 * @description
 * Takes an Array<V>, and a grouping function,
 * and returns a Map of the array grouped by the grouping function.
 *
 * @param list An array of type V.
 * @param keyGetter A Function that takes the the Array type V as an input, and returns a value of type K.
 *                  K is generally intended to be a property key of V.
 *
 * @returns Map of the array grouped by the grouping function.
 */
// export function groupBy<K, V>(list: Array<V>, keyGetter: (input: V) => K): Map<K, Array<V>> {
//    const map = new Map<K, Array<V>>();

export function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach(item => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}


export function isJsonText(str) {
  try {
    JSON.parse(str);
    if (['object'].includes(typeof JSON.parse(str))) return true;
  } catch (e) {
    return false;
  }
  return false;
}

export function formatDate(time, formatType) {
  return moment(time).format(formatType).toUpperCase();
}

// Format Dummy Container Data
export function formatContainerNo(containerNo) {
  let result = containerNo ? containerNo.toUpperCase() : '';
  if (result) {
    let contNo = containerNo.toUpperCase().match(/(CONT-NO)/g);
    let contName = containerNo.toUpperCase().match(/:(.*)/) || '';
    if (contName) {
      contName = contName[1]?.trim() || '';
    }
    if (contNo) {
      result = `${contNo}: ${contName}`
    }
  }
  return result;
}

export const isSameFile = (inquiries, tempReply) => {
  let isSame = false;
  const orgItem = inquiries.filter(item => item.id === tempReply.answer.id);
  const listId1 = orgItem[0].mediaFile.map(item => item.id);
  const listId2 = tempReply.mediaFiles.map(item => item.id);

  if (listId1.length === listId2.length) {
    if (listId1.length === 0 || (listId1.every(id => listId2.includes(id)))) isSame = true;
  }

  return isSame;
}

export const MAX_ROWS_CD = 13;

export const MAX_CHARS = {
  mark: 21,
  package: 14,
  description: 35
}

export const lineBreakAtBoundary = (string, boundary) => {
  let line = "";
  let newString = "";
  const arr = string.split(" ");

  for (let idx = 0; idx < arr.length; idx++) {
    if (`${line}${arr[idx]}`.length > boundary) {
      newString += line.trim() + "\n";
      line = "";
    }
    line += arr[idx] + " ";
  }

  newString += line;
  return newString.trim();
}

export const checkMaxRows = (containerLength, mark, packages, description) => {
  const maxLength = Math.max(
    mark.trim().split("\n").length,
    packages.trim().split("\n").length,
    description.trim().split("\n").length
  );
  return (containerLength + maxLength) <= MAX_ROWS_CD; // max num of lines
}

export const compareObject = (a, b) => {
  if (a.length === b.length && a.length === 0) return true;
  const keyList = Object.keys(a[0]);
  for (let index in a) {
    for (let key of keyList) {
      if (typeof a[index][key] === 'string' && a[index][key]?.trim() !== b[index][key]?.trim()) return false;
      if (typeof a[index][key] === 'number' && a[index][key].toString()?.trim() !== b[index][key].toString()?.trim()) return false;
      if (typeof a[index][key] === 'object') {
        if (a[index][key]) {
          if (b[index][key].length !== a[index][key].length) return false;
          const checkList = b[index][key].filter(item3 => a[index][key].includes(item3.trim()));
          if (a[index][key].length > 0 && checkList.length !== b[index][key].length) return false;
        } else {
          if (b[index][key] && typeof b[index][key] === 'string' && b[index][key].trim() !== '') return false;
        }
      }
    }
  }
  return true;
}

export const clearLocalStorage = () => {
  let user = JSON.parse(localStorage.getItem("USER"));
  localStorage.clear();
  if (user) localStorage.setItem("lastEmail", user.email);
}

export const parseNumberValue = (value) => {
  if (!value) return 0;

  const stripped = (typeof value === 'string') ? value.replace(/,/g, '') : value;
  return parseFloat(stripped);
}

export const getTotalValueMDView = (drfView, containerDetail, getType) => {
  const drfMD = {};
  if (drfView === 'MD' && containerDetail) {
    const defaultUnit = {}
    defaultUnit[TOTAL_PACKAGE_UNIT] = "PK";
    defaultUnit[TOTAL_WEIGHT_UNIT] = "KGS";
    defaultUnit[TOTAL_MEASUREMENT_UNIT] = "CBM";

    CONTAINER_LIST.totalUnit.forEach((totalKey, index) => {
      const units = [];
      containerDetail.forEach((cd) => {
        units.push(cd[getType(CONTAINER_LIST.cdUnit[index])])
      })
      if ([... new Set(units)].length === 1) {
        drfMD[totalKey] = units[0].toString();
      } else {
        drfMD[totalKey] = defaultUnit[totalKey];
      }
    })

    CONTAINER_LIST.totalNumber.map((key, index) => {
      let total = 0;
      containerDetail.forEach((item) => {
        total += parseNumberValue(item[getType(CONTAINER_LIST.cdNumber[index])]);
      });
      drfMD[key] = parseFloat(total.toFixed(3));;
    })
  }
  return drfMD;
}

export const formatNoneContNo = (contNo) => {
  if (!contNo || /CONT-NO:\s\d+/.test(contNo.toUpperCase())) return "<none>";
  return contNo;
}

export const isDateField = (metadata, field) => {
  const fieldsDateTime = [
    DATED,
    DATE_CARGO,
    DATE_LADEN
  ];
  const fieldInfo = metadata['field_options'].find(item => item.value === field)
  const isDate = fieldsDateTime.includes(fieldInfo.keyword);

  return isDate;
}

export const formatNumber = (num) => {
  let dval = '';
  if (typeof num === 'string' && num.trim() !== '0') {
    if (num && num.match(/^0+\./g)) {
      dval = '0'
    }
    return num.trim().replace(/^0+/g, dval)
  } else return num;
}

export const isSameDate = (d1, d2) => {
  const t1 = new Date(d1);
  const t2 = new Date(d2);
  return (
    t1.getFullYear() === t2.getFullYear()
    && t1.getMonth() === t2.getMonth()
    && t1.getDay() === t2.getDay()
  )
}