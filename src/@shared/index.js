export const getKeyByValue = (object, value) => {
  return Object.keys(object).find((key) => object[key] === value);
};

export const toFindDuplicates = arry => arry.filter((item, index) => arry.indexOf(item) !== index)

export const displayTime = (time) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let current_time = new Date(time);

  let month = months[current_time.getMonth()];
  let day = current_time.getDate();
  let hour = current_time.getHours()
  let minute = current_time.getMinutes()
  let year = current_time.getFullYear()
  minute = minute.toString().length === 1 ? `0${minute}` : minute
  return `${month} ${day} ${year}   ${hour}:${minute}`
};

export const filterMetadata = (data) => {
  const dict = { field: {}, inq_type: {}, ans_type: {}, inq_type_options: [], field_options: [] };
  for (const field of data['field']) {
    if (field.name !== 'OTHER') {
      dict['field'][field.name] = field.id;
      dict['field_options'].push({ label: field.name, value: field.id });
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

export const NUMBER_INQ_BOTTOM = 6;

export const draftConfirm = 'DRF_CONF';

export const stateResquest = 'REQUEST';

export const COUNTRIES = [
  {
    name: 'Vietnam',
    value: 'VN'
  },
  {
    name: 'Korea',
    value: 'KR'
  },
  {
    name: 'Singapore',
    value: 'SG'
  },
  {
    name: 'Spain',
    value: 'ES'
  }
];
