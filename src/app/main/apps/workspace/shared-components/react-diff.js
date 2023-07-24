import React from 'react';

var jsdiff = require('diff');

var fnMap = {
  chars: jsdiff.diffChars,
  words: jsdiff.diffWordsWithSpace,
  lines: jsdiff.diffLines,
  sentences: jsdiff.diffSentences,
  json: jsdiff.diffJson
};

const Diff = (props) => {
  var diff = fnMap[props.type](props.inputA, props.inputB, { newlineIsToken: true });
  var emptyA = false;
  var emptyB = false;
  if (!props.inputA) emptyA = true;
  if (!props.inputB) emptyB = true;

  var result = diff.map((part, index) => {
    let value = part.value
    if (part.added && !emptyA) {
      value = part.value.replace(/\n/g, '↩\n');
    }
    if (part.removed && !emptyB) {
      value = part.value.replace(/\n/g, '↩');
    }

    var spanStyle = {
      // display: /^\n+$/g.test(part.value) ? 'block' : null,
      backgroundColor: part.added ? 'lightgreen' : part.removed ? 'salmon' : null
    };
    return (
      <span key={index} style={spanStyle}>
        {value}
      </span>
    );
  });

  return (
    <pre
      className="diff-result"
      style={{
        color: '#132535',
        whiteSpace: 'pre-wrap',
        fontFamily: 'Montserrat',
        fontSize: 15
      }}>
      {result}
    </pre>
  );
};

export default React.memo(Diff);