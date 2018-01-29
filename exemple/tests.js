#! /usr/bin/env node
const v2 = require('../v2');

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