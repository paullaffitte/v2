const execution = require('./execution');
const fs = require('fs');

let v2stdout = function(trace) {
  let stdoutFile = '.v2stdout';
  let referenceFile = '.v2reference';

  fs.writeFileSync(stdoutFile, trace.stdout)
  if (!this.referenceFile) {
    fs.writeFileSync(referenceFile, this.reference);
  } else {
    referenceFile = this.referenceFile
  }

  return execution.exec(`diff ${stdoutFile} ${referenceFile}`)
    .then((diffTrace) => {
      fs.unlinkSync(stdoutFile);
      if (!this.referenceFile)
        fs.unlinkSync(referenceFile);
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
        return {success: true};
      }
    });
};

module.exports = {
  v2stdout
};
