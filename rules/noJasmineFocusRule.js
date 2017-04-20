'use strict';

const Lint = require('tslint');

class Rule extends Lint.Rules.AbstractRule {
  constructor(options) {
    super(options);
    this.prohibitedWords = ['fit', 'fdescribe'];
    this.regex = new RegExp(`^(${this.prohibitedWords.join('|')})$`);
  }

  apply(sourceFile) {
    return this.applyWithWalker(new NoJasmineFocusWalker(sourceFile, this.getOptions(), this.regex, this.prohibitedWords));
  }
}

class NoJasmineFocusWalker extends Lint.RuleWalker {
  constructor(sourceFile, options, regex, prohibitedWords) {
    super(sourceFile, options);
    this.regex = regex;
    this.prohibitedWords = prohibitedWords;
  }

  visitCallExpression(node) {
    const match = node.expression.getText().match(this.regex);

    if (match) {
      this.addFailureAt(node.getStart(), match[0].length, 'Jasmine focus is not allowed (fit or fdescribe)');
    }

    super.visitCallExpression(node);
  }
}

exports.Rule = Rule;
