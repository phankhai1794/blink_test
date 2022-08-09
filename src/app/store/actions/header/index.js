export const CHECK_ALLOW = 'CHECK_ALLOW';
export const CHECK_AUTH_TOKEN = 'CHECK_AUTH_TOKEN';

export function checkAllow(state = true) {
  return {
    type: CHECK_ALLOW,
    state: state
  };
}

export function checkAuthToken(state = true) {
  return {
    type: CHECK_AUTH_TOKEN,
    state: state
  };
}
