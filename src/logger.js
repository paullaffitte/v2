const scopes = require('./scopes');

function render(scopeName, evaluation) {
  scope = scopes.getScope(scopeName);
  if (scope && scope.loggers) {
    scope.loggers.forEach(logger => {
      logger(evaluation);
    });
  }
};

let log = function(scopeName, evaluation) {
  let scope = null;

  while (scopeName != '') {
    render(scopeName, evaluation);
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
