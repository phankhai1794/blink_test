export const CHECK_ALLOW = 'CHECK_ALLOW';

export function checkAllow(state = true) {
  return {
    type: CHECK_ALLOW,
    state: state
  };
}
