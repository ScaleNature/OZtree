/**
  * Usage: npx babel-tape-runner OZprivate/rawJS/OZTreeModule/tests/test_ozentry_ozstrings.js
  */
import test from 'tape';
const { JSDOM } = require('jsdom');

import config from '../src/global_config';
import api_manager from '../src/api/api_manager';
import tree_settings from '../src/tree_settings';
import get_controller from '../src/controller/controller';

test('OZentry setup seeds config.OZstrings from window payload', function (t) {
  const dom = new JSDOM('<html><body class="tree-viewer"><canvas id="oz-canvas"></canvas></body></html>');

  const prevWindow = global.window;
  const prevDocument = global.document;
  global.window = dom.window;
  global.document = dom.window.document;

  const ozEntryPath = require.resolve('../src/OZentry');
  const polyfillPath = require.resolve('babel-polyfill');
  const prevPolyfillModule = require.cache[polyfillPath];

  // OZentry imports babel-polyfill directly; in the test harness that can throw
  // unless we provide a benign cached module before requiring OZentry.
  require.cache[polyfillPath] = {
    id: polyfillPath,
    filename: polyfillPath,
    loaded: true,
    exports: {},
  };
  delete require.cache[ozEntryPath];
  const setup = require('../src/OZentry').default;

  const prevStrings = config.OZstrings;
  const prevDisableRecordUrl = config.disable_record_url;

  const prevSetUrls = api_manager.set_urls;
  const prevStart = api_manager.start;
  const prevFetchTreeData = api_manager.fetch_tree_data;
  const prevSetDefault = tree_settings.set_default;

  const controller = get_controller();
  const prevSetupCanvas = controller.setup_canvas;
  const prevDrawLoading = controller.draw_loading;

  global.window.OZstrings = { sp: 'species from host' };

  api_manager.set_urls = function () {};
  api_manager.start = function () {};
  api_manager.fetch_tree_data = function () {
    // Keep async startup inert in this unit test.
    return new Promise(function () {});
  };
  tree_settings.set_default = function () {};

  controller.setup_canvas = function () {};
  controller.draw_loading = function () {};

  const oz = setup(
    { data_path_pics: '/static/images' },
    {},
    null,
    'oz-canvas',
    {}
  );

  t.equal(config.OZstrings && config.OZstrings.sp, 'species from host', 'setup updates shared config from window.OZstrings');
  t.equal(oz.config.OZstrings && oz.config.OZstrings.sp, 'species from host', 'returned OneZoom object exposes seeded strings');

  controller.setup_canvas = prevSetupCanvas;
  controller.draw_loading = prevDrawLoading;

  api_manager.set_urls = prevSetUrls;
  api_manager.start = prevStart;
  api_manager.fetch_tree_data = prevFetchTreeData;
  tree_settings.set_default = prevSetDefault;

  config.disable_record_url = prevDisableRecordUrl;
  config.OZstrings = prevStrings;
  global.window = prevWindow;
  global.document = prevDocument;

  if (prevPolyfillModule) {
    require.cache[polyfillPath] = prevPolyfillModule;
  } else {
    delete require.cache[polyfillPath];
  }
  dom.window.close();

  t.end();
});

test.onFinish(function() {
  process.exit(0);
});
