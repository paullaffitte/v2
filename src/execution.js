const child_process = require('child_process');

let _timeout = 3000;

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

  if (err && err.signal) {
    trace.error = {
      signal: err.signal,
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

module.exports = {
  exec,
  timeout: setTimeout
};
