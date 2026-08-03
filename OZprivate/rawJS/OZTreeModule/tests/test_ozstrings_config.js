/**
  * Usage: npx babel-tape-runner OZprivate/rawJS/OZTreeModule/tests/test_ozstrings_config.js
  */
import test from 'tape';
import config from '../src/global_config.js';

test('config.OZstrings can be seeded directly from the host payload', function (t) {
  const hostStrings = { foo: 'bar' };

  config.OZstrings = hostStrings;

  t.ok(config.OZstrings, 'config.OZstrings exists');
  t.equal(config.OZstrings.foo, 'bar', 'config.OZstrings is seeded from the host payload');
  t.end();
});
