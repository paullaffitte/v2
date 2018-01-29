const evaluator   = require('./src/evaluator');
const pipeline    = require('./src/pipeline');
const execution   = require('./src/execution');

const run         = evaluator.run;
const evaluators  = evaluator.evaluators;

const test        = pipeline.test;

const exec        = execution.exec;
const timeout     = execution.timeout;

module.exports = {
  test,
  exec,
  run,
  timeout,
  evaluators
};