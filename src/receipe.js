const execution = require('./execution');
const evaluators = require('./evaluators');
const scopes = require('./scopes');
const logger = require('./logger');

let receipe = function(pipelineItem, next) {
  let scopeName = pipelineItem.testname;
  let data = {};

  if (!scopes.isReachable(scopeName)) {
    next();
    return;
  }

  let promises = execution.exec(pipelineItem.cmd)
    .then(trace => {
      data.trace = trace;
      return trace;
    });


  pipelineItem.evaluations.forEach(evaluationModel => {
    let evaluator = evaluationModel.evaluator;
    let options = evaluationModel.options;
    let evaluatorName = 'untitled';

    if (typeof evaluator === 'string') {
      evaluatorName = evaluator;
      evaluator = evaluators[evaluator];
    }

    if (typeof evaluator === 'function') {
      promises = promises
        .then(evaluator.bind(options))
        .then(evaluation => {
          data.trace.scopeName = scopeName;
          evaluation.scopeName = evaluationModel.scopeName;
          scopes.validate(evaluation);
          logger.log(scopeName, evaluation, data.trace);
          return data.trace;
        });
    } else {
      console.error('evaluator ' + evaluatorName + ' not found');
    }
  });

  promises
    .then(next)
    .catch(error => {
      console.error(error);
      next();
    });
    
}

module.exports = {
  evaluators,
  receipe
};
