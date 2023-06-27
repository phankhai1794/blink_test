var React = require('react');
var jsdiff = require('diff');

var fnMap = {
  chars: jsdiff.diffChars,
  words: jsdiff.diffWords,
  lines: jsdiff.diffLines,
  sentences: jsdiff.diffSentences,
  json: jsdiff.diffJson
};

const Diff = (props) => {
  var diff = fnMap[props.type](props.inputA, props.inputB, { newlineIsToken: true });

  var result = diff.map((part, index) => {
    var spanStyle = {
      backgroundColor: part.added ? 'lightgreen' : part.removed ? 'salmon' : null
    };
    return (
      <span key={index} style={spanStyle}>
        {part.value}
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

export default Diff
