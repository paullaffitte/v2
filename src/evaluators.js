const execution = require('./execution');
const fs = require('fs');

let v2success = function(trace) {
  if (trace.returnValue != 0)
    return { summary: 'Program ended with a non null return value: ' + trace.returnValue };
  return { success: true };
}

let v2failure = function(trace) {
  if (trace.returnValue == 0)
    return { summary: 'Program ended with a null return value: ' + trace.returnValue };
  return { success: true };
}

let v2file = function(trace) {
  return execution.exec(`diff ${this.filename} ${this.referenceFilename}`)
    .then((diffTrace) => {
      if (diffTrace.returnValue != 0) {
        return {
          summary: 'Files differs',
          diffTrace
        };
      } else {
        return { success: true };
      }
    });
};

let v2string = function(trace) {
  let conf = {
    filename: '.v2string',
    referenceFilename: '.v2reference'
  };

  fs.writeFileSync(conf.filename, this.string);
  fs.writeFileSync(conf.referenceFilename, this.reference);
  return v2file.call(conf, trace)
    .then((evaluation) => {
      fs.unlinkSync(conf.filename);
      fs.unlinkSync(conf.referenceFilename);
      if (!evaluation.success)
        evaluation.summary = 'Strings differs';
      return evaluation;
    });
}

let v2numbers = function(trace) {
  let lengthDiffers = this.numbers.length + ' instead of ' + this.reference.length;
  if (this.numbers.length < this.reference.length)
    return {
      summary: 'Not enough numbers, ' + lengthDiffers
    };
  else if (this.numbers.length > this.reference.length)
    return {
      summary: 'Too much numbers, ' + lengthDiffers
    };

  let results = [];
  let fails = 0;
  for (let i = 0; i < this.reference.length; i++) {
    var status = 'distance > ' + this.precision;

    if (this.numbers[i] == this.reference[i])
      status = '';
    else if (Math.abs(this.numbers[i] - this.reference[i]) <= this.precision)
      status = 'near';
    
    fails += (status !== '');

    results.push({
      value: this.numbers[i],
      referenceValue: this.reference[i],
      status: status
    });
  }
  if (fails)
    return {
      summary: 'Numbers differs',
      results
    }
  return { success: true };
}

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
      if (!evaluation.success)
        evaluation.summary = 'Outputs differs';
      return evaluation;
    });
};

module.exports = {
  v2success,
  v2failure,
  v2file,
  v2string,
  v2numbers,
  v2stdout,
};
