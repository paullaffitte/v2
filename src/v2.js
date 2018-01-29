const child_process = require('child_process');
const xml = require('xmlbuilder');
const pipeline = require('./pipeline');

let xmlResult;
let _timeout = 3000;
let _index = -1;
let evaluators = {};

function setTimeout(timeout) {
  _timeout = timeout;
}

function formatTrace(cmd, err, stdout, stderr) {
  let trace = {
    cmd: cmd,
    stdout: stdout,
    stderr: stderr,
    returnValue: err ? err.code : 0,
  };

  if (err) {
    trace.error = {
      signal: err.code === 139 ? 'SIGSEGV' : err.signal,
      label: err.killed ? 'Timeout' : 'Crash'
    };
  }
  return trace;
}

function exec(cmd, timeout) {
  return new Promise(function(resolve, reject) {
    if (!cmd)
      resolve(null);
    else
      child_process.exec(cmd, {
        timeout: timeout ? timeout : _timeout,
        killSignal: 'SIGTERM'
      }, (err, stdout, stderr) => {
        resolve(formatTrace(cmd, err, stdout, stderr));
      });
  });
}

function xmlTestcase(testname) {
  const splitedName = testname.split('.');
  return xmlResult.ele('testcase', {
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
  let msg = `Failure reason: ${evaluation.summary}\n`
  let exitSignal = 'None (process exited normally)';

  if (trace.error) {
    exitSignal = `${trace.error.signal} [${trace.error.label}]`;
  }

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

  let logs = getLogs(trace, evaluation);
  if (trace.error) {
    console.log(testname + ' > ERROR (' + trace.error.label + ')');
    xmlError(testcase, logs);
  } else {
    let failureSummary = (evaluation ? evaluation.summary : '');
    console.log(testname + ' > FAILURE (' + failureSummary + ')');
    xmlFailure(testcase, logs);
  }
}

const actions = {
  test: function(pipelineItem) {
    let promises = exec(pipelineItem.cmd);
    let evaluator = evaluators[pipelineItem.evaluator];
    let tmp = {};

    if (typeof evaluator === 'function') {
      promises = promises
        .then(function(trace) {
          tmp.trace = trace;
          return trace;
        })
        .then(evaluator.bind(pipelineItem.options))
        .then((evaluation) => {
          let trace = tmp.trace;
          if (evaluation.success)
            success(pipelineItem.testname);
          else
            failure(pipelineItem.testname, trace, evaluation)
        })
        .then(next)
        .catch(console.error);
    }
  }
};

function next() {
  _index += 1;

  if (_index < pipeline.pipeline.length) {
    let pipelineItem = pipeline.pipeline[_index];
    actions[pipelineItem.action](pipelineItem);
  } else {
    console.warn(xmlResult.end({ 
      pretty: true,
      indent: '  ',
      newline: '\n',
      allowEmpty: true,
      spacebeforeslash: ''
    }));
  }
}

function run() {
  xmlResult = xml.create('testsuite');
  next();
};

const test = require('./pipeline').test;
module.exports = {
  test,
  exec,
  run,
  timeout: setTimeout,
  evaluators
};
