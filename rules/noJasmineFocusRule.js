'use strict';

let Lint = require('tslint');
if (!Lint.Rules) {
  //tslint 3
  Lint = require('tslint/lib/lint');
}

const PROHIBITED_WORDS = ['fit', 'fdescribe'];
const REGEX = new RegExp(`^(${PROHIBITED_WORDS.join('|')})$`);

class Rule extends Lint.Rules.AbstractRule {
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

if (!Lint.RuleWalker.prototype.addFailureAt) {
  //tslint 3
  NoJasmineFocusWalker.prototype.addFailureAt = function (nodeStart, length, msg) {
    return this.addFailure(this.createFailure(nodeStart, length, msg));
  };
}

exports.Rule = Rule;
