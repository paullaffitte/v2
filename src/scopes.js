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

let getOptions = function(name) {
  let path = getPath(name);
  let scope = scopes;
  let options = null;

  let i = 0;
  while (scope && scope.childs && i < path.length) {
    scope = scope.childs[path[i]];
    if (!scope)
      break;
    options = scope.options;
    ++i;
  }

  if (i != path.length)
    return null;
  return options;
}

module.exports = {
  scope
};