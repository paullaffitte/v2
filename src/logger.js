const scopes = require('./scopes');

function render(scopeName, evaluation, trace) {
  scope = scopes.getScope(scopeName);
  if (scope && scope.loggers) {
    scope.loggers.forEach(logger => {
      logger(evaluation, trace);
    });
  }
};

let log = function(scopeName, evaluation, trace) {
  let scope = null;

  while (scopeName != '') {
    render(scopeName, evaluation, trace);
    scopeName = scopeName.split('.');
    scopeName.pop();
    scopeName = scopeName.join('.');
  }

  render(scopeName, evaluation);
}

let logger = function(scopeName, callback) {
  if (callback == null && typeof scopeName == 'function') {
     callback = scopeName
     scopeName = '';
  }

  scopes.editScope(scopeName, scope => {
    if (!scope.loggers)
    	scope.loggers = [];
    scope.loggers.push(callback);
  });
}

module.exports = {
  logger,
  log
};
