let pipeline = [];

function test(cmd, testname, evaluator, options) {
  pipeline.push({
    action: 'test',
    cmd: cmd,
    testname: testname,
    evaluator: evaluator,
    options: options 
  });
}

module.exports = {
  pipeline,
  test
};