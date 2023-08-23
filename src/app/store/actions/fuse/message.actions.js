export const HIDE_MESSAGE = '[MESSAGE] CLOSE';
export const SHOW_MESSAGE = '[MESSAGE] SHOW';
export const DEPLOYING = 'DEPLOYING';

export function hideMessage() {
  return {
    type: HIDE_MESSAGE
  };
}

export function showMessage(options) {
  return {
    type: SHOW_MESSAGE,
    options
  };
}

export function warningDeploying(state) {
  return {
    type: DEPLOYING,
    state
  };
}
