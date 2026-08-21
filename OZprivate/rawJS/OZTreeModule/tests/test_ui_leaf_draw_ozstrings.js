/**
  * Usage: npx babel-tape-runner OZprivate/rawJS/OZTreeModule/tests/test_ui_leaf_draw_ozstrings.js
  */
import test from 'tape';

import config from '../src/global_config';
import { fullLeaf, natural_theme } from '../src/ui/leaf_draw';

function makeFakeContext() {
  const drawnTexts = [];
  return {
    drawnTexts,
    beginPath: function () {},
    moveTo: function () {},
    lineTo: function () {},
    arc: function () {},
    bezierCurveTo: function () {},
    closePath: function () {},
    fill: function () {},
    stroke: function () {},
    save: function () {},
    restore: function () {},
    translate: function () {},
    rotate: function () {},
    scale: function () {},
    clip: function () {},
    drawImage: function () {},
    fillRect: function () {},
    createPattern: function () { return null; },
    createLinearGradient: function () { return { addColorStop: function () {} }; },
    // Keep text widths conservative so autotext paths can render within the fake canvas.
    measureText: function (text) { return { width: (text || '').length }; },
    fillText: function (text) { drawnTexts.push(text); },
    strokeText: function (text) { drawnTexts.push(text); },
    textBaseline: 'middle',
    textAlign: 'left',
    font: '',
    lineCap: 'round',
    lineJoin: 'round',
    lineWidth: 1,
  };
}

test('leaf draw uses localized no-common-name label from config.OZstrings', function (t) {
  const prevStrings = config.OZstrings;
  try {
    config.OZstrings = {
      'No common name': 'Localized no common name',
      'No known name': 'Localized no known name',
      sciname: 'Scientific name: ',
    };

    const context = makeFakeContext();

    fullLeaf(
      context,
      100,
      100,
      120,
      0,
      1,
      1,
      null,
      'SPONSORED',
      '',
      null,
      'Canis lupus',
      '',
      '',
      '',
      'Helvetica',
      1,
      null,
      false,
      natural_theme.leaf,
      {},
      false,
      1,
      0,
      0
    );

    const rendered = context.drawnTexts.join(' | ');
    t.ok(rendered.indexOf('Localized') > -1 && rendered.indexOf('common name') > -1,
      'fallback label is read from localized OZstrings');
  } finally {
    config.OZstrings = prevStrings;
    t.end();
  }
});
