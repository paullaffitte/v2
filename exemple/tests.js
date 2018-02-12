#! /usr/bin/env node

const v2 = require('../v2');

v2.scope('v2.stdout', {
	policies: ['selfFailure', 'dependency']
})

v2.receipe('./usage', 'v2.stdout.success', 'v2stdout', {
  fileReference: 'usage.txt'
});

v2.receipe('ls -aze', 'v2.stdout.error', 'v2stdout', {
  fileReference: 'usage.txt'
});

v2.receipe('ls', 'v2.stdout.success_2', 'v2stdout', {
  stringReference: 'tests.js\nusage\nusage.txt\n'
});

v2.receipe('ls', 'v2.stdout.failure', 'v2stdout', {
  stringReference: 'tests.js stdout stdout.txt'
});


v2.logger('v2.stdout', (evaluation) => {
  console.log('\tscope v2.stdout');
  if (!evaluation.success)
    console.log('\tfailure on scope v2.stdout');
});

v2.logger('v2.stdout.failure', (evaluation) => {
	console.log('\tv2.stdout.failure');
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
