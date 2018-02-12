const execution = require('./execution');
const evaluators = require('./evaluators');
const scopes = require('./scopes');
const logger = require('./logger');

let receipe = function(pipelineItem, next) {
  let evaluator = evaluators[pipelineItem.evaluator];
  execution.exec(pipelineItem.cmd)
    .then((trace) => {
      if (typeof evaluator === 'function') {
        evaluator.call(pipelineItem.options, trace)
          .then((evaluation) => {
            logger.log(pipelineItem.testname, evaluation, trace);
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
