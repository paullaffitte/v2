const execution = require('./execution');
const evaluators = require('./evaluators');
const scopes = require('./scopes');
const logger = require('./logger');

let receipe = function(pipelineItem, next) {
  let evaluator = pipelineItem.evaluator;
  let scopeName = pipelineItem.testname;
  let data = {};

  if (!scopes.isReachable(scopeName)) {
    next();
    return;
  }

  if (typeof evaluator === 'string') {
    evaluator = evaluators[evaluator];
  }

  if (typeof evaluator === 'function') {
    execution.exec(pipelineItem.cmd)
      .then(trace => {
        data.trace = trace;
        return trace;
      })
      .then(evaluator.bind(pipelineItem.options))
      .then(evaluation => {
        data.trace.scopeName = scopeName;
        scopes.validate(scopeName, evaluation);
        logger.log(scopeName, evaluation, data.trace);
      })
      .then(next)
      .catch(console.error);
  } else {
    console.error('evaluator ' + pipelineItem.evaluator + ' not found');
    next();
  }
}

module.exports = {
  evaluators,
  receipe
};
