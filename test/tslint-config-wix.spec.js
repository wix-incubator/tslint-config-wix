'use strict';

const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');
const {expect} = require('chai');
const glob = require('glob');

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
        tslint(`${baseDir}${dir}/valid*.*`);
      });
      glob.sync(`${baseDir}${dir}/invalid*.*`).forEach(file => {
        it(`should fail for ${path.basename(file)}`, () => {
          expect(() => tslint(file)).to.throw();
        });
      });
    });
  })
});
