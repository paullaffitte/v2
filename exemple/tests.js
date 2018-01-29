#! /usr/bin/env node
const v2 = require('../src/v2');
const fs = require('fs');

v2.evaluators.v2stdout = function(trace) {
  let stdoutFile = '.v2stdout';
  let referenceFile = '.v2reference';

  fs.writeFileSync(stdoutFile, trace.stdout)
  if (!this.referenceFile) {
    fs.writeFileSync(referenceFile, this.reference);
  } else {
    referenceFile = this.referenceFile
  }

  return v2.exec(`diff ${stdoutFile} ${referenceFile}`)
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
    })
};

v2.test('./usage', 'basics.stdout.success', 'v2stdout', {
  referenceFile: 'usage.txt'
});

v2.test('ls -aze', 'basics.stdout.error', 'v2stdout', {
  referenceFile: 'usage.txt'
});

v2.test('ls', 'basics.stdout.success_2', 'v2stdout', {
  reference: 'tests.js\nusage\nusage.txt\n'
});

v2.test('ls', 'basics.stdout.failure', 'v2stdout', {
  reference: 'tests.js stdout stdout.txt'
});

v2.run();