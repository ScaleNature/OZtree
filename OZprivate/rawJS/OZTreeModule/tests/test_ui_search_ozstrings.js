/**
  * Usage: npx babel-tape-runner OZprivate/rawJS/OZTreeModule/tests/test_ui_search_ozstrings.js
  */
import test from 'tape';
const { JSDOM } = require('jsdom');

import config from '../src/global_config';
import { searchPopulate } from '../src/ui/search';

test('searchPopulate renders headings from config.OZstrings', function (t) {
    const prevStrings = config.OZstrings;
    config.OZstrings = {
        Tours: 'Tours',
        'Search results': 'Search results',
        SponsorHits: 'Sponsor hits',
    };

    const dom = new JSDOM(`
<html>
  <body>
    <div id="searchbox">
      <div class="searchinput"><input value="bat"></div>
      <div class="search_dropdown">
        <div class="popular_species"></div>
        <div class="recents"></div>
        <div class="search_hits"></div>
        <div class="no_results"></div>
      </div>
    </div>
  </body>
</html>`);

    const prevWindow = global.window;
    const prevDocument = global.document;
    const prevDollar = global.$;
    const prevUIkit = global.UIkit;

    global.window = dom.window;
    global.document = dom.window.document;
    const jqueryPath = require.resolve('../../../../static/js/jquery.js');
    delete require.cache[jqueryPath];
    global.$ = require('../../../../static/js/jquery.js');
    global.window.jQuery = global.$;
    global.UIkit = {
        dropdown: function () {
            return { show: function () {} };
        },
    };

    const searchbox = global.$('#searchbox');

    const treeResult = ['Fruit bat', 'Pteropus', -10, 1];
    treeResult.pinpoint = '@Pteropus=448935';

    searchPopulate(searchbox, 'bat', {
        tree: [treeResult],
        tour: [{ href: '/tour/1', url: '/tour/1', title: 'Bat tour' }],
    });

    const headings = global.$('.search_hits dt', searchbox)
        .map(function () { return global.$(this).text(); })
        .get();

    t.ok(headings.indexOf('Tours') > -1, 'Uses localized tours heading');
    t.ok(headings.indexOf('Search results') > -1, 'Uses localized search results heading');

    config.OZstrings = prevStrings;
    global.window = prevWindow;
    global.document = prevDocument;
    global.$ = prevDollar;
    global.UIkit = prevUIkit;
    dom.window.close();

    t.end();
});
