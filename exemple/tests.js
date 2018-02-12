#! /usr/bin/env node

const v2 = require('../v2');

v2.scope('v2.stdout.error');

v2.receipe('./usage', 'v2.stdout.success', 'v2stdout', {
  fileReference: 'usage.txt'
});

v2.receipe('ls -aze', 'v2.stdout.error', 'v2stdout', {
  fileReference: 'usage.txt'
});

v2.receipe('ls', 'v2.stdout.success_2', 'v2stdout', {
  stringReference: 'tests.js\nusage\nusage.txt\n'
});

v2.receipe('ls', 'v2.stdout2.failure', 'v2stdout', {
  stringReference: 'tests.js stdout stdout.txt'
});


v2.logger((evaluation, trace) => {
  console.log(trace.scopeName);
  if (!evaluation.success)
    console.log('global scope - ' + trace.scopeName + ': failure');
});

v2.logger('v2.stdout', (evaluation, trace, success) => {
  console.log('---- SCOPE V2.STDOUT - ' + trace.cmd);
  if (!success)
    console.log('failure on scope v2.stdout.');
});

v2.logger('v2.stdout2.failure', (evaluation, trace) => {
  console.log(trace.scopeName + ' returnValue: ' + trace.returnValue);
});

// v2.receipe('ls', 'receipe.parameters.array', [
//   {
//     evaluator: 'v2stdout',
//     data: {
//       stringReference: 'tests.js stdout stdout.txt'
//     }
//   },
//   {
//     evaluator: 'v2return',
//     data: 42
//   }
// ]);

// v2.receipe('ls', 'receipe.parameters.object', 'v2stdout', {
//   stringReference: 'tests.js stdout stdout.txt'
// });

// v2.receipe('ls', 'receipe.parameters.evaluator-only', 'v2success');
// v2.receipe('ls', 'receipe.parameters.auto-check-return');

v2.run();
