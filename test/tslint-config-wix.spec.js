'use strict';

const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;
const expect = require('chai').expect;
const glob = require('glob');
const ejs = require('ejs');

const baseDir = './test/scripts/';
const tsconfigTemplate = fs.readFileSync(path.join(__dirname, './tsconfig.json.template')).toString();
const template = ejs.compile(tsconfigTemplate);

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

function tslint(targetFile) {
  const tsconfigPath = tsconfig(targetFile);

  try {
    return execSync(`node ./node_modules/.bin/tslint --type-check --project ${tsconfigPath}`).toString().trim();
  } catch (e) {
    console.log(e.stdout.toString());
    throw new Error(`Message: ${e.toString()}, stdout: ${e.stdout && e.stdout.toString()}, stderr: ${e.stderr && e.stderr.toString()}`);
  } finally {
    fs.unlink(tsconfigPath);
  }
}

function tsconfig(file) {
  const dir = path.dirname(file);
  const tsconfig = path.join(dir, 'tsconfig.json');
  const result = template({file: path.basename(file)});
  fs.writeFileSync(tsconfig, result);
  return tsconfig;
}

describe('wix tslint', () => {
  getDirectories(baseDir).forEach(dir => {
    describe(dir, () => {
      it('should pass for valid.ts', () => {
        const res = tslint(`${baseDir}${dir}/valid*.*`);
        expect(res).to.equal('');
      });
      glob.sync(`${baseDir}${dir}/invalid*.*`).forEach(file => {
        it(`should fail for ${path.basename(file)}`, () => {
          expect(() => tslint(file)).to.throw();
        });
      });
      glob.sync(`${baseDir}${dir}/warn*.*`).forEach(file => {
        it(`should warn for ${path.basename(file)}`, () => {
          const res = tslint(file);
          expect(res).to.have.string('WARNING:');
        });
      });
    });
  })
});
