import moment from 'moment';

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
  const dict = { field: {}, inq_type: {}, ans_type: {}, inq_type_options: [], field_options: [] };
  for (const field of data['field']) {
    if (field.keyword.toLowerCase() !== 'other') {
      dict['field'][field.keyword] = field.id;
      dict['field_options'].push({ label: field.name, value: field.id, keyword: field.keyword, display: field.show });
    }
  }
  for (const inq of data['inqType']) {
    dict['inq_type'][inq.name] = inq.id;
    dict['inq_type_options'].push({
      label: inq.name,
      value: inq.id,
      field: inq.field
    });
  }
  for (const ans of data['ansType']) {
    dict['ans_type'][ans.name] = ans.id;
  }
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
      contNo = contNo[0] ? contNo[0].replace('CONT-NO', 'Cont-No') : '';
      result = `${contNo}: ${contName}`
    }
  }
  return result;
}
