class MyClass {
  x;
  a(arr) {
    arr.forEach(function () {
      this.x = 5;
    });
  }
}
