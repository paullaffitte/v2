const execution = require('./execution');
const fs = require('fs');

let v2success = function(trace) {
  return { success: trace.returnValue == 0 };
}

let v2failure = function(trace) {
  return { success: trace.returnValue != 0};
}

let v2file = function(trace) {
  return execution.exec(`diff ${this.filename} ${this.referenceFilename}`)
    .then((diffTrace) => {
      if (diffTrace.returnValue != 0) {
        return {
          summary: 'Output differs',
          message: '==== STDOUT ====\n' + trace.stdout
               + '\n==== STDERR ====\n' + trace.stderr
               + '\n=== DIFF OUT ===\n' + diffTrace.stdout
               + '\n=== DIFF ERR ===\n' + diffTrace.stderr
               + '\n================\n\n'
        };
      } else {
        return { success: true };
      }
    });
};

let v2stdout = function(trace) {
  let conf = {
    filename: '.v2stdout',
    referenceFilename: '.v2reference'
  };

  let unlinkReferenceFile = true;
  let fileEvaluator = v2file.bind(conf, trace);
  let promises = new Promise((resolve, reject) => {resolve();});

  if (this.binaryReference) {
    promises = execution.exec(this.binaryReference).then((binaryRefTrace) => {
      fs.writeFileSync(conf.referenceFilename, binaryRefTrace.stdout);
    });
  } else if (this.stringReference) {
    fs.writeFileSync(conf.referenceFilename, this.stringReference);
  } else if (this.fileReference) {
    conf.referenceFilename = this.fileReference
    unlinkReferenceFile = false;
  }

  fs.writeFileSync(conf.filename, trace.stdout);
  return promises
    .then(fileEvaluator)
    .then((evaluation) => {
      fs.unlinkSync(conf.filename);
      if (unlinkReferenceFile)
        fs.unlinkSync(conf.referenceFilename);  
      return evaluation;
    });
};

module.exports = {
  v2success,
  v2failure,
  v2stdout,
  v2file
};
