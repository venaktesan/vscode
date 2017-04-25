const ReporterType = require('./reporter.enum'),
  CSSLintReporter = require('./reporters/csslint.reporter'),
  SASSLintReporter = require('./reporters/sasslint.reporter'),
  SASSTOSCSSLintReporter = require('./reporters/sass-to-scsslint.reporter'),
  ESLintReporter = require('./reporters/eslint.reporter'),
  ESLintAngularReporter = require('./reporters/eslint-angular.reporter'),
  JSHintReporter = require('./reporters/jshint.reporter'),
  HTMLHintReporter = require('./reporters/htmlhint.reporter'),
  TSLintReporter = require('./reporters/tslint.reporter');

/**
 * Handle the reporters creation.
 */
class ReporterFactory {

  /**
   * Instantiante a reporter
   *
   * @param   {ReporterType}  type              Reporter type.
   * @param   {Object}        options           User specific options.
   * @param   {string}        projectName       The project name, coming from `.sreporterrc` file and used later by SonarQube.
   * @returns {Reporter}                        Instance of `Reporter`.
   */
  static create (type, options, projectName) {
    let reporter, opts;

    switch (type) {
      case ReporterType.CSSLINT:
        opts = ReporterFactory.mergeOptions(options, CSSLintReporter.defaultOptions());
        reporter = new CSSLintReporter(opts, projectName);
        break;

      case ReporterType.ESLINT:
        opts = ReporterFactory.mergeOptions(options, ESLintReporter.defaultOptions());
        reporter = new ESLintReporter(opts, projectName);
        break;

      case ReporterType.ESLINTANGULAR:
        opts = ReporterFactory.mergeOptions(options, ESLintAngularReporter.defaultOptions());
        reporter = new ESLintAngularReporter(opts, projectName);
        break;

      case ReporterType.HTMLHINT:
        opts = ReporterFactory.mergeOptions(options, HTMLHintReporter.defaultOptions());
        reporter = new HTMLHintReporter(opts, projectName);
        break;

      case ReporterType.JSHINT:
        opts = ReporterFactory.mergeOptions(options, JSHintReporter.defaultOptions());
        reporter = new JSHintReporter(opts, projectName);
        break;

      case ReporterType.TSLINT:
        opts = ReporterFactory.mergeOptions(options, TSLintReporter.defaultOptions());
        reporter = new TSLintReporter(opts, projectName);
        break;

      case ReporterType.SASSLINT:
        opts = ReporterFactory.mergeOptions(options, SASSLintReporter.defaultOptions());
        reporter = new SASSLintReporter(opts, projectName);
        break;

      case ReporterType.SASS_TO_SCSSLINT:
        opts = ReporterFactory.mergeOptions(options, SASSTOSCSSLintReporter.defaultOptions());
        reporter = new SASSTOSCSSLintReporter(opts, projectName);
        break;

      default:
        throw new Error(`Unknown reporter '${type}'`);
    }

    return reporter;
  }

/**
 * Merge the user specific options with the default ones of the reporter.
 * Prioritize the user options.
 *
 * @param   {Object}        options         User specific options
 * @param   {Object}        defaultOptions  Default reporter options
 * @returns {Object|false}                  Merged options; Or FALSE if this reporter should be ignored
 */
  static mergeOptions (options, defaultOptions) {
    if (options === true) {
      return defaultOptions;
    } else if (options) {
      return Object.assign(defaultOptions, options);
    }

    return false;
  }

}

module.exports = ReporterFactory;
