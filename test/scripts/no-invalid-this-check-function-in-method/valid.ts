class MyClass {
  x;
  a(arr) {
    arr.forEach(() => {
      this.x = 5;
    });
  }
}
