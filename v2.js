const receipeModule = require('./src/receipe');
const pipeline      = require('./src/pipeline');
const execution     = require('./src/execution');
const scopes 	    = require('./src/scopes');

const evaluators  = receipeModule.evaluators;

const receipe     = pipeline.receipe;
const run         = pipeline.run;

const exec        = execution.exec;
const timeout     = execution.timeout;

const scope       = scopes.scope;

module.exports = {
  receipe,
  exec,
  run,
  timeout,
  evaluators,
  scope
};