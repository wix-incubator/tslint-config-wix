let a, foo;
switch (foo) {
  case 1:
    a++;
    /* falls through */
  case 2:
  case 3:
    a--;
    break;
  default:
}
