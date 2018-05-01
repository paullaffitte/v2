#! /usr/bin/env node

const v2 = require('../v2');

/*
** Stdout evaluator with file, binary and string reference
*/
v2.receipe('./usage', 'v2.stdout.file.success', 'v2stdout', {
  fileReference: 'usage.txt'
});

v2.receipe('ls', 'v2.stdout.file.failure:dependency', 'v2stdout', {
  fileReference: 'usage.txt'
});

v2.receipe('ls', 'v2.stdout.binary.success', 'v2stdout', {
  binaryReference: 'ls'
});

v2.receipe('ls', 'v2.stdout2.string.failure', 'v2stdout', {
  stringReference: '.\n..'
});

/*
** Success and failure basic evaluators
*/
v2.receipe('pwd');
v2.receipe('pwd', 'v2.v2success.success');
v2.receipe('pwdd', 'v2.v2success.failure');
v2.receipe('pwdd', 'v2.v2failure.success', 'v2failure');
v2.receipe('pwd', 'v2.v2failure.failure', 'v2failure');

/*
** Callback evaluators
*/
v2.receipe('./usage', 'v2.func.success', trace => {
  return { success: true };
});

v2.receipe('./usage', 'v2.func.failure', trace => {
  return { success: false };
});

/*
** Multi-evaluation
*/
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


/*
** Timeout
*/
v2.timeout(1);
v2.receipe('ls -lRa ~/', 'v2.timeout.ls');

v2.logger('v2.timeout.ls', (evaluation, trace) => {
  console.log(trace.error);
});

/*
** Global logger
*/
v2.globalLogger((evaluation, trace) => {
  console.log('global scope ----------------');
  console.log('group: ', trace.scopeName);
  if (!evaluation.success)
    console.log(evaluation.scopeName + ': failure');
  else
    console.log(evaluation.scopeName + ': success');
  console.log('-----------------------------\n');
});

/*
** Scoped loggers
*/
v2.logger('v2.stdout', (evaluation, trace, success) => {
  console.log('---- SCOPE V2.STDOUT - ' + trace.cmd);
  if (!success)
    console.log('failure on scope v2.stdout.');
});

v2.logger('v2.stdout2.failure', (evaluation, trace) => {
  console.log(trace.scopeName + ' returnValue: ' + trace.returnValue);
});


/*
** Set global timeout
*/
v2.timeout(500);

/*
** Run the receipes
*/
v2.run();
