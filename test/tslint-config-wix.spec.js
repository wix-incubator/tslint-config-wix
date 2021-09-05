'use strict';

const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;
const expect = require('chai').expect;
const glob = require('glob');
const ejs = require('ejs');

const baseDir = './test/scripts/';

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

function tslint(targetFile) {
  const tsconfigPath = tsconfig(targetFile);
  try {
    execSync(`node ./node_modules/.bin/tslint --project ${tsconfigPath}`);
  } catch (e) {
    throw new Error(`Message: ${e.toString()}, stdout: ${e.stdout && e.stdout.toString()}, stderr: ${e.stderr && e.stderr.toString()}`);
  } finally {
    fs.unlink(tsconfigPath, () => null);
  }
}

function tsconfig(file) {
  const dir = path.dirname(file);
  const tsconfigPath = path.join(dir, 'tsconfig.json');
  const tsconfigTemplate = fs.readFileSync(path.join(__dirname, './tsconfig.json.template')).toString();
  const template = ejs.compile(tsconfigTemplate);
  const result = template({file: path.basename(file)});
  fs.writeFileSync(tsconfigPath, result);
  return tsconfigPath;
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
