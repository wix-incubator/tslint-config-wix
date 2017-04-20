declare let describe: any;
declare let fdescribe: any;
declare let it: any;
declare let fit: any;

describe('test me', () => {
  const fits = () => null;
  it('should do nothing', () => {
    return true;
  });

  /*
  fit('should not fail', () => {
    return true;
  });
  */

  it('should do nothing', () => {
    //fit(
    //fdescribe
    fits();
    return true;
  });
});
