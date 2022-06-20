export const getKeyByValue = (object, value) => {
  return Object.keys(object).find((key) => object[key] === value);
};

export const displayTime = (time) => {
  let current_time = new Date();
  let time_difference = current_time.getTime() - new Date(time).getTime();
  let seconds = time_difference / 1000;
  let minutes = Math.round(seconds / 60);
  let hours = Math.round(seconds / 3600);
  let days = Math.round(seconds / 86400);
  let weeks = Math.round(seconds / 604800);
  let months = Math.round(seconds / 2592000);
  let years = Math.round(seconds / 31536000);
  if (seconds <= 60) {
    return 'Just Now';
  } else if (minutes <= 60) {
    return minutes === 1 ? 'one minute ago' : `${minutes} minutes ago`;
  } else if (hours <= 24) {
    return hours === 1 ? 'an hour ago' : `${hours} hrs ago`;
  } else if (days <= 7) {
    return days === 1 ? 'yesterday' : `${days} days ago`;
  } else if (weeks <= 4.3) {
    return weeks === 1 ? 'a week ago' : `${weeks} weeks ago`;
  } else if (months <= 12) {
    return months === 1 ? 'a month ago' : `${months} months ago`;
  } else {
    return years === 1 ? 'one year ago' : `${years} years ago`;
  }
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
}

export const NUMBER_INQ_BOTTOM = 6;