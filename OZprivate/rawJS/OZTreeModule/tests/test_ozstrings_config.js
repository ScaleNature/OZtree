/**
  * Usage: npx babel-tape-runner OZprivate/rawJS/OZTreeModule/tests/test_ozstrings_config.js
  */
import test from 'tape';
import config from '../src/global_config.js';

test('global config exposes OZstrings slot with null default', function (t) {
  t.ok(Object.prototype.hasOwnProperty.call(config, 'OZstrings'), 'config exposes OZstrings property');
  t.equal(config.OZstrings, null, 'config.OZstrings defaults to null before host seeding');
  t.end();
});

test('config.OZstrings can be seeded directly from the host payload', function (t) {
  const prevStrings = config.OZstrings;
  const hostStrings = { foo: 'bar' };

  try {
    config.OZstrings = hostStrings;

    t.ok(config.OZstrings, 'config.OZstrings exists');
    t.equal(config.OZstrings.foo, 'bar', 'config.OZstrings is seeded from the host payload');
  } finally {
    config.OZstrings = prevStrings;
    t.end();
  }
});
