'use strict';

const Lint = require('tslint');

const PROHIBITED_WORDS = ['fit', 'fdescribe'];
const REGEX = new RegExp(`^(${PROHIBITED_WORDS.join('|')})$`);

class Rule extends Lint.Rules.AbstractRule {
  constructor(options) {
    super(options);
  }

  apply(sourceFile) {
    return this.applyWithWalker(new NoJasmineFocusWalker(sourceFile, this.getOptions()));
  }
}

class NoJasmineFocusWalker extends Lint.RuleWalker {
  visitCallExpression(node) {
    const match = node.expression.getText().match(REGEX);

    if (match) {
      this.addFailureAt(node.getStart(), match[0].length, `Jasmine focus is not allowed (${PROHIBITED_WORDS.join(', ')})`);
    }

    super.visitCallExpression(node);
  }
}

exports.Rule = Rule;
