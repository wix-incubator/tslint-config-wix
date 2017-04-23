'use strict';

let Lint = require('tslint');
if (!Lint.Rules) {
  //for tslint 3
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
  constructor(sourceFile, options) {
    super(sourceFile, options);
    if (!this.addFailureAt) {
      //tslint < 5
      this.addFailureAt = (nodeStart, length, msg) => {
        return this.addFailure(this.createFailure(node.getStart(), matchIndex, msg));
      };
    }
  }

  visitCallExpression(node) {
    const match = node.expression.getText().match(REGEX);

    if (match) {
      this.addFailureAt(node.getStart(), match[0].length, `Jasmine focus is not allowed (${PROHIBITED_WORDS.join(', ')})`);
    }

    super.visitCallExpression(node);
  }
}

exports.Rule = Rule;
