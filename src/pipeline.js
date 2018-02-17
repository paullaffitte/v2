const xml = require('xmlbuilder');
const receipeModule = require('./receipe');
const scopes = require('./scopes');

let pipeline = [];
let index = -1;

function getScopeName(target) {
  return target.split(':')[0];
}

function isDependency(target) {
  if (typeof target !== 'string' || target.length == 0)
    return false;
  return (target.split(':')[1] == 'dependency');
}

function setDependencies(target, evaluations) {
  let scopeName = getScopeName(target);

  if (isDependency(target)) {
    scopes.dependency(getScopeName(target));
  }

  evaluations.forEach(evaluation => {
    let subScopeName;

    if (typeof evaluation.subTarget === 'string'
        && evaluation.subTarget.length != 0) {
      subScopeName = [scopeName, getScopeName(evaluation.subTarget)].join('.');
    } else {
      subScopeName = scopeName;
    }

    if (isDependency(evaluation.subTarget)) {
      scopes.dependency(subScopeName);
    }
    evaluation.scopeName = subScopeName;
  });
}

function getEvaluationModels(evaluations) {
  let evaluationModels = [];

  evaluations.forEach(evaluation => {
    evaluationModels.push({
      subTarget: evaluation.subTarget,
      evaluator: evaluation.evaluator ? evaluation.evaluator : 'v2success',
      options: evaluation.options
    });
  });

  return evaluationModels;
}

function receipe(cmd, target, evaluations, options) {
  if (!target)
    target = '';

  if (!evaluations) {
    evaluations = 'v2success';
  }

  if (typeof evaluations === 'string' || typeof evaluations === 'function') {
    evaluations = [{
      evaluator: evaluations,
      options: options
    }];
  } else {
    evaluations = getEvaluationModels(evaluations);
  }

  setDependencies(target, evaluations);

  pipeline.push({
    action: receipeModule.receipe,
    cmd: cmd,
    testname: getScopeName(target),
    evaluations: evaluations,
    options: options
  });
}

function next() {
  ++index;
  if (index < pipeline.length) {
    let pipelineItem = pipeline[index];
    pipelineItem.action(pipelineItem, next);
  }
}

function run() {
  next();
};

module.exports = {
  run,
  receipe
};