const xml = require('xmlbuilder');
const receipeModule = require('./receipe');
const scopes = require('./scopes');

let pipeline = [];
let index = -1;

function receipe(cmd, target, evaluator, options) {
  let scopeName = target.split(':')[0];
  let isDependency = (target.split(':')[1] == 'dependency')

  if (isDependency) {
    scopes.dependency(scopeName);
  }

  pipeline.push({
    action: receipeModule.receipe,
    cmd: cmd,
    testname: scopeName,
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