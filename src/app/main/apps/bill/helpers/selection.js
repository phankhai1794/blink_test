function isSafari() {
  return (
    typeof navigator !== "undefined" &&
    /Version\/[\d\.]+.*Safari/.test(navigator.userAgent)
  );
}

function getSelected() {
  var t = "";
  if (window.getSelection) {
    t = window.getSelection();
  } else if (document.getSelection) {
    t = document.getSelection();
  } else if (document.selection) {
    t = document.selection.createRange().text;
  }
  return t;
}

function getPosition(selected) {
  var range = selected.getRangeAt(0);
  // hack for Safari
  if (isSafari()) {
    range = range.cloneRange();
    range.setStart(range.startContainer, 0);
  }
  return range.getBoundingClientRect();
}

export { getSelected, getPosition };
