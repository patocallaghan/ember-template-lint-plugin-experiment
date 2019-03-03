// Respectfully stolen from https://github.com/ember-template-lint/ember-template-lint/blob/master/test/helpers/rule-test-harness.js

const expect = require('chai').expect;
const Linter = require('ember-template-lint');

function parseMeta(item) {
  let meta = item !== undefined && typeof item === 'object' && item.meta ? item.meta : {};
  meta.moduleId = meta.moduleId || 'layout.hbs';

  return meta;
}

module.exports = function(options) {
  let groupingMethod = options.focus ? describe.only : describe;
  let skipDisabledTests = options.skipDisabledTests;

  groupingMethod(options.name, function() {
    let DISABLE_ALL = '{{! template-lint-disable }}';
    let DISABLE_ONE = `{{! template-lint-disable ${options.name} }}`;

    let linter;
    let config;
    let meta;

    function verify(template) {
      linter.config.rules[options.name] = config;
      return linter.verify({ source: template, moduleId: meta.moduleId });
    }

    beforeEach(function() {
      let fullConfig = {
        rules: {},
      };
      fullConfig.rules[options.name] = config = options.config;

      meta = null;

      linter = new Linter({
        config: fullConfig,
      });
    });

    function parseResult(result) {
      let defaults = {
        severity: 2,
      };

      if (!skipDisabledTests) {
        defaults.rule = options.name;
      }

      if (result.moduleId !== null) {
        defaults.moduleId = 'layout.hbs';
      } else {
        delete result.moduleId;
      }

      return Object.assign({}, defaults, result);
    }

    options.bad.forEach(function(badItem) {
      let template = badItem.template;
      let testMethod = badItem.focus ? it.only : it;

      testMethod(`logs a message in the console when given \`${template}\``, function() {
        let expectedResults = badItem.results || [badItem.result];

        meta = parseMeta(badItem);

        if (badItem.config) {
          config = badItem.config;
        }

        let actual = verify(template);

        if (badItem.fatal) {
          expect(actual.length).to.equal(1); // can't have more than one fatal error
          delete actual[0].source; // remove the source (stack trace is not easy to assert)
          expect(actual[0]).to.deep.equal(badItem.fatal);
        } else {
          expectedResults = expectedResults.map(parseResult);

          expect(actual).to.deep.equal(expectedResults);
        }
      });

      if (!skipDisabledTests) {
        testMethod(`passes with \`${template}\` when rule is disabled`, function() {
          config = false;
          meta = parseMeta(badItem);
          let actual = verify(template);

          expect(actual).to.deep.equal([]);
        });

        testMethod(
          `passes with \`${template}\` when disabled via inline comment - single rule`,
          function() {
            meta = parseMeta(badItem);
            let actual = verify(`${DISABLE_ONE}\n${template}`);

            expect(actual).to.deep.equal([]);
          },
        );

        testMethod(
          `passes with \`${template}\` when disabled via inline comment - all rules`,
          function() {
            meta = parseMeta(badItem);
            let actual = verify(`${DISABLE_ALL}\n${template}`);

            expect(actual).to.deep.equal([]);
          },
        );
      }
    });

    options.good.forEach(function(item) {
      let template = typeof item === 'object' ? item.template : item;
      let testMethod = typeof item === 'object' && item.focus ? test.only : test;

      testMethod(`passes when given \`${template}\``, function() {
        meta = parseMeta(item);
        let actual;

        if (typeof item === 'string') {
          actual = verify(item);
        } else {
          if (item.config !== undefined) {
            config = item.config;
          }

          actual = verify(template);
        }

        expect(actual).to.deep.equal([]);
      });
    });

    let error = options.error || [];
    error.forEach(item => {
      let template = item.template;
      let testMethod = item.focus ? it.only : it;

      if (item.config !== undefined) {
        config = item.config;
      }

      let friendlyConfig = JSON.stringify(config);

      let _config = config;

      testMethod(`errors when given \`${template}\` with config \`${friendlyConfig}\``, function() {
        let expectedResults = item.results || [item.result];
        meta = parseMeta(item);
        expectedResults = expectedResults.map(parseResult);

        config = _config;

        let actual = verify(template);

        for (let i = 0; i < actual.length; i++) {
          if (actual[i].fatal) {
            delete expectedResults[i].rule;
            delete actual[i].source;

            expect(actual[i].message).to.contain(expectedResults[i].message);

            delete actual[i].message;
            delete expectedResults[i].message;
          }
        }

        expect(actual).to.deep.equal(expectedResults);
      });
    });
  });
};
