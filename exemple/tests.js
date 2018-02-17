#! /usr/bin/env node

const v2 = require('../v2');

v2.receipe('./usage', 'v2.stdout.success', 'v2stdout', {
  fileReference: 'usage.txt'
});

v2.receipe('ls -aze', 'v2.stdout.error:dependency', 'v2stdout', {
  fileReference: 'usage.txt'
});

v2.receipe('ls', 'v2.stdout.success_2', 'v2stdout', {
  stringReference: 'tests.js\nusage\nusage.txt\n'
});

v2.receipe('ls', 'v2.stdout2.failure', 'v2stdout', {
  stringReference: 'tests.js stdout stdout.txt'
});


v2.receipe('./usage', 'v2.func.success', trace => {
  return { success: true };
}, {});

v2.receipe('./usage', 'v2.func.failure', trace => {
  return { success: false };
}, {});


let subtests = [
  {
    subTarget: 'func-const-failure',
    evaluator: () => {
      return { success: this.success };
    },
    options: { success: false }
  },
  {
    subTarget: 'v2success',
    evaluator: 'v2success'
  },
  {
    evaluator: 'v2failure'
  }
];

v2.receipe('./usage', 'v2.multi.usage', subtests);
v2.receipe('ls', 'v2.multi.ls', subtests);



v2.logger((evaluation, trace) => {
  console.log('global scope ----------------');
  console.log('group: ', trace.scopeName);
  if (!evaluation.success)
    console.log(evaluation.scopeName + ': failure');
  else
    console.log(evaluation.scopeName + ': success');
  console.log('-----------------------------\n');
});

v2.logger('v2.stdout', (evaluation, trace, success) => {
  console.log('---- SCOPE V2.STDOUT - ' + trace.cmd);
  if (!success)
    console.log('failure on scope v2.stdout.');
});

v2.logger('v2.stdout2.failure', (evaluation, trace) => {
  console.log(trace.scopeName + ' returnValue: ' + trace.returnValue);
});

v2.run();
