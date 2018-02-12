const execution = require('./execution');
const evaluators = require('./evaluators');
const scopes = require('./scopes');
const logger = require('./logger');

let receipe = function(pipelineItem, next) {
  let evaluator = evaluators[pipelineItem.evaluator];
  let scopeName = pipelineItem.testname;

  if (!scopes.isReachable(scopeName)) {
    next();
    return;
  }
  execution.exec(pipelineItem.cmd)
    .then((trace) => {
      if (typeof evaluator === 'function') {
        evaluator.call(pipelineItem.options, trace)
          .then((evaluation) => {
            trace.scopeName = scopeName;
            scopes.validate(scopeName, evaluation);
            logger.log(scopeName, evaluation, trace);
          })
          .then(next)
          .catch(console.error)
      } else {
        console.error('evaluator ' + pipelineItem.evaluator + ' not found');
        next();
      }
    })
    .catch(console.error);
}

module.exports = {
  evaluators,
  receipe
};
