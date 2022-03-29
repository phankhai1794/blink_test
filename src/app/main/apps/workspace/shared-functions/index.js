import history from '@history';
import { loadBL } from '../api/mybl';
import { loadAccount } from '../api/account';

export const getKeyByValue = (object, value) => {
  return Object.keys(object).find((key) => object[key] === value);
};

export const getHeaders = (action) => {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('AUTH_TOKEN'),
    action
  };
};

export const checkExistBkg = () => {
  const query = new URLSearchParams(window.location.search);
  const blID = query.get('bl');
  const accountID = query.get('id');
  if (!blID || !accountID) history.push(`/pages/errors/error-404`);

  loadBL(blID)
    .then((res) => {
      if (res) {
        loadAccount(accountID).catch((error) => {
          console.log(error);
          history.push(`/pages/errors/error-404`);
        });
      }
    })
    .catch((error) => {
      console.log(error);
      history.push(`/pages/errors/error-404`);
    });
};
