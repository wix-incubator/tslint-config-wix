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
  visitCallExpression(node) {
    const match = node.expression.getText().match(REGEX);

    if (match) {
      const msg = `Jasmine focus is not allowed (${PROHIBITED_WORDS.join(', ')})`;
      const matchIndex = match[0].length;
      if (this.addFailureAt) {
        this.addFailureAt(node.getStart(), matchIndex, msg);
      } else {
        //addFailure is deprecated since tslint 5 (still supported)
        this.addFailure(this.createFailure(node.getStart(), matchIndex, msg));
      }
    }

    super.visitCallExpression(node);
  }
}

exports.Rule = Rule;
