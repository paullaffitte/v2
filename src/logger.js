const scopes = require('./scopes');

function render(scopeName, evaluation, trace) {
  scope = scopes.getScope(scopeName);
  if (scope && scope.loggers) {
    scope.loggers.forEach(logger => {
      logger.onEvaluate(evaluation, trace, !scope.failure);
    });
  }
};

let log = function(scopeName, evaluation, trace) {
  let scope = null;

  while (scopeName != '') {
    render(scopeName, evaluation, trace);
    scopeName = scopes.parent(scopeName);
  }

  render(scopeName, evaluation, trace);
};

let globalLogger = function(onEvaluate, onStdout, onStderr) {
  return logger('', onEvaluate, onStdout, onStderr);
};

let logger = function(scopeName, onEvaluate, onStdout, onStderr) {
  scopes.editScope(scopeName, scope => {
    if (!scope.loggers)
    	scope.loggers = [];
    scope.loggers.push({onEvaluate, onStdout, onStderr});
  });
};

module.exports = {
  globalLogger,
  logger,
  log
};
