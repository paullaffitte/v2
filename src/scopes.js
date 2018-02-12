let scopes = {childs: {}};

function getPath(name) {
  return name.split('.').filter(element => element != '');
}

let scope = function(name, options) {
  let path = getPath(name);
  let newScope = scopes.childs;
  
  let i = 1;
  path.forEach(key => {
    if (!newScope[key])
      newScope[key] = {childs: {}};
    if (i != path.length)
      newScope = newScope[key].childs;
    else 
      newScope[key].options = options
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
      scope.childs[path[i]] = {childs: {}}
    scope = scope.childs[path[i]];
    ++i;
  }

  editCallback(scope)
}

module.exports = {
  scope,
  getScope,
  editScope
};