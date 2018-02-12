let scopes = newScope('');

function getPath(name) {
  return name.split('.').filter(element => element != '');
}

function newScope(name) {
  return {name: name, childs: {}, failure: false};
}

let parent = function(name) {
  name = name.split('.');
  name.pop();
  return name.join('.');
}

let dependency = function(name) {
  let path = getPath(name);
  let tmp = scopes.childs;
  
  let i = 1;
  path.forEach(key => {
    if (!tmp[key])
      tmp[key] = newScope(path.slice(0, i).join('.'));
    if (i < path.length)
      tmp = tmp[key].childs;
    else 
      tmp[key].dependency = true;
    ++i;
  });
}

let getScope = function(name) {
  let path = getPath(name);
  let scope = scopes;
  let i = 0;

  while (scope && scope.childs && i < path.length) {
    scope = scope.childs[path[i]];
    ++i;
  }

  if (i != path.length)
    return null;
  return scope;
}

let editScope = function(name, editCallback) {
  let path = getPath(name);
  let scope = scopes;

  let i = 0;
  while (i < path.length) {
    if (!scope.childs[path[i]])
      scope.childs[path[i]] = newScope(path.slice(0, i + 1).join('.'));
    scope = scope.childs[path[i]];
    ++i;
  }

  editCallback(scope)
}

let failure = function(scope) {
  let dependency = false;

  if (scope) {
    scope.failure = true;
    if (scope.dependency)
      dependency = scope.dependency;
  }

  if (dependency)
    failure(getScope(parent(scope.name)));
}

let validate = function(name, evaluation) {
  if (!evaluation.success) 
    failure(getScope(name));

}

let isReachable = function(name) {
  let scope = getScope(name);

  if (scope && scope.failure == true)
    return false;

  if (name != '')
    return isReachable(parent(name)); 
  return true;
}

module.exports = {
  dependency,
  getScope,
  editScope,
  parent,
  validate,
  isReachable
};