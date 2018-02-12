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
  ++index;
  if (index < pipeline.length) {
    let pipelineItem = pipeline[index];
    pipelineItem.action(pipelineItem, next);
  }
}

function run() {
  next();
};

module.exports = {
  run,
  receipe
};