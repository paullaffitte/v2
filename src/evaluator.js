const execution = require('./execution');
const evaluators = require('./evaluators');

let result = {};

function xmlTestcase(testname) {
  const splitedName = testname.split('.');
  return result.xml.ele('testcase', {
    name: splitedName[2],
    classname: splitedName[0] + '.' + splitedName[1],
  });
}

function xmlFailure(testcase, details) {
  return testcase.ele('failure', {
    message: 'Test failed'
  }, details);
}

function xmlError(testcase, details) {
  return testcase.ele('error', {
    message: 'Test crashed'
  }, details);
}



function getLogs(trace, evaluation) {
  let exitSignal = 'None (process exited normally)';
  let reason = '';

  if (trace.error) {
    exitSignal = `${trace.error.signal} [${trace.error.label}]`;
  }
  else if (evaluation) {
    reason = `Failure reason: ${evaluation.summary};\n`
  }

  let msg = reason;
  msg += `Executed shell command: ${trace.cmd}\n`;
  msg += `Process exit signal: ${exitSignal}\n`;
  msg += `Process exit status: ${trace.returnValue}\n@~#`;
  if (evaluation)
    msg += evaluation.message;
  return msg;
}

function success(testname) {
  console.log(testname + ' > SUCCESS');
  xmlTestcase(testname);
}

function failure(testname, trace, evaluation) {
  let testcase = xmlTestcase(testname);
  xmlFailure(testcase, getLogs(trace, evaluation));
  console.log(testname + ' > FAILURE (' + evaluation.summary + ')');
}

function error(testname, trace) {
  let testcase = xmlTestcase(testname);
  xmlError(testcase, getLogs(trace));
  console.log(testname + ' > ERROR (' + trace.error.label + ')');
}

function evaluate(pipelineItem, evaluator, trace) {
  return evaluator.call(pipelineItem.options, trace)
    .then((evaluation) => {
      if (evaluation.success)
        success(pipelineItem.testname);
      else
        failure(pipelineItem.testname, trace, evaluation)
    })
}

let receipe = function(pipelineItem, next) {
  let evaluator = evaluators[pipelineItem.evaluator];
  execution.exec(pipelineItem.cmd)
    .then((trace) => {
      if (trace.error) {
        error(pipelineItem.testname, trace);
        next();
      }
      else if (typeof evaluator === 'function')
        evaluate(pipelineItem, evaluator, trace).then(next).catch(console.error);
      else {
        console.error('evaluator ' + pipelineItem.evaluator + ' not found');
        next();
      }
    })
    .catch(console.error);
}

module.exports = {
  evaluators,
  receipe,
  result
};
