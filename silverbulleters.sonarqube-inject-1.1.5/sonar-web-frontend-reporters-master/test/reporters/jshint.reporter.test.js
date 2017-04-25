require('chai').should();

const fs = require('fs'),
  JSHintReporter = require('../../lib/api').JSHintReporter,
  JSHintReporterES5 = require('../../build/reporters/jshint.reporter'),
  readJSONFile = require('../test.utils').readJSONFile,
  jsHintMock = require('./jshint.reporter.mock');

module.exports = () => {

  describe('JSHintReporter', () => {

    describe('#launch', () => {

      it('should throw an error if the project name is undefined', () => {
        (() => new JSHintReporter(jsHintMock.defaultOptions)).should.throw(Error);
      });

      it('should be the right project name', (done) => {
        let reporter = new JSHintReporter(jsHintMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          readJSONFile(jsHintMock.defaultOptions.report).project.should.be.equal('SonarWebFrontEndReporters');

          done();
        });
      });

      it('should create the output file', (done) => {
        let reporter = new JSHintReporter(jsHintMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          fs.existsSync(jsHintMock.defaultOptions.report);

          done();
        });
      });

      it('should be the right number of files', (done) => {
        let reporter = new JSHintReporter(jsHintMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(jsHintMock.defaultOptions.report);

          result.files.length.should.be.equal(1);
          result.nbFiles.should.be.equal(1);

          done();
        });
      });

      it ('should have an issue', (done) => {
        let reporter = new JSHintReporter(jsHintMock.defaultOptions, 'SonarWebFrontEndReporters'),
          expected = [ 'W098' ];

        reporter.launch(() => {
          let result = readJSONFile(jsHintMock.defaultOptions.report);

          result.files[0].issues.length.should.be.equal(1);
          result.files[0].issues.forEach((issue) => {
            issue.rulekey.should.be.oneOf(expected);
          });

          done();
        });
      });

      it ('should be a one line file', (done) => {
        let reporter = new JSHintReporter(jsHintMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(jsHintMock.defaultOptions.report);

          result.files[0].nbLines.should.be.equal(1);

          done();
        });
      });

      it ('shouldn\'t match the ignored file', (done) => {
        let reporter = new JSHintReporter(jsHintMock.multiSrcOption, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(jsHintMock.multiSrcOption.report);

          result.files.length.should.be.equal(1);
          result.nbFiles.should.be.equal(1);

          done();
        });
      });

      it ('shouldn\'t have processed files', (done) => {
        let reporter = new JSHintReporter(jsHintMock.badSrcOption, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(jsHintMock.badSrcOption.report);

          result.files.length.should.be.equal(0);
          result.nbFiles.should.be.equal(0);

          done();
        });
      });

      it('should find the rules file', () => {
        (() => new JSHintReporter(jsHintMock.badRulesFileOption, 'SonarWebFrontEndReporters')).should.throw(Error);
      });

      it('should launch with ES5 backward compatibility', (done) => {
        let reporter = new JSHintReporterES5(jsHintMock.defaultOptions, 'SonarWebFrontEndReporters');

        reporter.launch(() => {
          let result = readJSONFile(jsHintMock.defaultOptions.report);

          result.files.length.should.be.equal(1);
          result.nbFiles.should.be.equal(1);

          done();
        });

      });

    });

  });

};
