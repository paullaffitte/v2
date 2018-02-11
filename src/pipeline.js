const xml = require('xmlbuilder');
const _evaluator = require('./evaluator');

let pipeline = [];
let index = -1;

function receipe(cmd, testname, evaluator, options) {
  pipeline.push({
    action: _evaluator.receipe,
    cmd: cmd,
    testname: testname,
    evaluator: evaluator,
    options: options 
  });
}

function next() {
  index += 1;

  if (index < pipeline.length) {
    let pipelineItem = pipeline[index];
    pipelineItem.action(pipelineItem, next);
  } else {
    console.warn(_evaluator.result.xml.end({ 
      pretty: true,
      indent: '  ',
      newline: '\n',
      allowEmpty: true,
      spacebeforeslash: ''
    }));
  }
}

function run() {
  _evaluator.result.xml = xml.create('testsuite');
  next();
};

module.exports = {
  run,
  receipe
};