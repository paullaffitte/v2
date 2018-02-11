const evaluator   = require('./src/evaluator');
const pipeline    = require('./src/pipeline');
const execution   = require('./src/execution');

const evaluators  = evaluator.evaluators;

const receipe     = pipeline.receipe;
const run         = pipeline.run;

const exec        = execution.exec;
const timeout     = execution.timeout;

module.exports = {
  receipe,
  exec,
  run,
  timeout,
  evaluators
};