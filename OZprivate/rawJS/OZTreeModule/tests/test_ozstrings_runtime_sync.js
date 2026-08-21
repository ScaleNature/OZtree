/**
  * Usage: npx babel-tape-runner OZprivate/rawJS/OZTreeModule/tests/test_ozstrings_runtime_sync.js
  */
import test from 'tape';
import config from '../src/global_config';
import tree_settings from '../src/tree_settings';
import installNavigationMethods from '../src/controller/controller_navigation';

test('OZui bootstrap seeds config.OZstrings from window.OZstrings', function (t) {
  const prevWindow = global.window;
  const prevStrings = config.OZstrings;

  global.window = { OZstrings: { foo: 'bar' } };
  config.OZstrings = null;

  delete require.cache[require.resolve('../src/OZui')];
  require('../src/OZui');

  t.ok(config.OZstrings, 'config.OZstrings gets seeded during OZui bootstrap');
  t.equal(config.OZstrings && config.OZstrings.foo, 'bar', 'OZui path uses host-provided OZstrings');

  config.OZstrings = prevStrings;
  global.window = prevWindow;
  t.end();
});

test('set_language keeps config.OZstrings synced with window.OZstrings', function (t) {
  class FakeController {}
  installNavigationMethods(FakeController);
  const controller = new FakeController();

  const prevWindow = global.window;
  const prevStrings = config.OZstrings;
  const prevLang = config.lang;
  const prevChangeLanguage = tree_settings.change_language;

  global.window = {
    OZstrings: {
      'Search results': 'Resultados',
    },
  };
  config.OZstrings = {
    'Search results': 'Search results',
  };

  tree_settings.change_language = function (lang) {
    config.lang = lang;
  };

  controller.set_language('es', true);

  t.equal(config.OZstrings['Search results'], 'Resultados', 'set_language refreshes localized strings from window payload');

  tree_settings.change_language = prevChangeLanguage;
  config.lang = prevLang;
  config.OZstrings = prevStrings;
  global.window = prevWindow;
  t.end();
});

test.onFinish(function() {
  process.exit(0);
});
