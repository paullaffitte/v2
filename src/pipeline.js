const xml = require('xmlbuilder');
const receipeModule = require('./receipe');

let pipeline = [];
let index = 0;

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
  if (index < pipeline.length) {
    let pipelineItem = pipeline[index];
    pipelineItem.action(pipelineItem, next);
  }
  ++index;
}

function run() {
  next();
};

module.exports = {
  run,
  receipe
};