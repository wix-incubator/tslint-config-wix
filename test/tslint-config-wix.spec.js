'use strict';

const fs = require('fs');
const path = require('path');
const expect = require('chai').expect;
const execSync = require('child_process').execSync;
const baseDir = './test/scripts/';

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

function tslint(targetFile) {
  try {
    execSync(`node ./node_modules/.bin/tslint ${targetFile}`);
  } catch (e) {
    throw new Error(`Message: ${e.toString()}, stdout: ${e.stdout && e.stdout.toString()}, stderr: ${e.stderr && e.stderr.toString()}`);
  }
}

describe('wix tslint', () => {
  getDirectories(baseDir).forEach(dir => {
    describe(dir, () => {
      it('should pass for valid.ts', () => {
        tslint(`${baseDir}${dir}/valid.ts`);
      });
      it('should fail for invalid.ts', () => {
        expect(() => tslint(`${baseDir}${dir}/invalid.ts`)).to.throw();
      });
    });
  })
});
