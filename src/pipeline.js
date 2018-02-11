const xml = require('xmlbuilder');
const receipeModule = require('./receipe');

let pipeline = [];
let index = -1;

function receipe(cmd, testname, evaluator, options) {
  pipeline.push({
    action: receipeModule.receipe,
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
    console.warn(receipeModule.result.xml.end({ 
      pretty: true,
      indent: '  ',
      newline: '\n',
      allowEmpty: true,
      spacebeforeslash: ''
    }));
  }
}

function run() {
  receipeModule.result.xml = xml.create('testsuite');
  next();
};

module.exports = {
  run,
  receipe
};