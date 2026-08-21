/**
  * Usage: npx babel-tape-runner OZprivate/rawJS/OZTreeModule/tests/test_projection_node_layout_ozstrings.js
  */
import test from 'tape';

import config from '../src/global_config';
import NodeLayoutBase from '../src/projection/layout/node_layout_base';

test('node layout reads sponsor text and headers from config.OZstrings', function (t) {
  const prevStrings = config.OZstrings;
  config.OZstrings = {
    Mya: '{mya} million years ago',
    tya: '{tya} thousand years ago',
    geological: {
      periods: [
        { Ma: 66, name: 'Cretaceous', long: 'the Cretaceous period' },
      ],
      eons: [
        { Ma: 4600, name: 'Hadean', long: 'the Hadean eon' },
      ],
    },
    node_labels: {
      text_only: {
        dated: {
          named: 'HEADER for {geo_time}\nSECOND LINE',
          unnamed: 'UNNAMED HEADER\nSECOND LINE',
        },
        undated: {
          named: 'NO DATE\nSECOND LINE',
          unnamed: 'NO DATE UNNAMED\nSECOND LINE',
        },
      },
      with_pic: {
        dated: {
          named: 'PIC HEADER for {geo_time}\nSECOND LINE',
          unnamed: 'PIC UNNAMED\nSECOND LINE',
        },
        undated: {
          named: 'PIC NO DATE\nSECOND LINE',
          unnamed: 'PIC NO DATE UNNAMED\nSECOND LINE',
        },
      },
    },
    sponsor_text: {
      node: {
        named: 'Sponsor one of the {group_name}',
        unnamed: 'Sponsor one of these',
      },
    },
  };

  const layout = new NodeLayoutBase();

  const sponsorNamed = layout.get_sponsor_text({ cname: 'Mammals' });
  const sponsorUnnamed = layout.get_sponsor_text({ cname: '' });
  t.equal(sponsorNamed, 'SPONSOR ONE OF THE MAMMALS', 'named sponsor text uses localized template');
  t.equal(sponsorUnnamed, 'SPONSOR ONE OF THESE', 'unnamed sponsor text uses localized fallback');

  const textOnlyHeader = layout.get_textonly_header({ lengthbr: 10, cname: 'Mammals' }).join(' ');
  t.ok(textOnlyHeader.indexOf('Cretaceous') > -1, 'text-only header includes localized geological period');

  const picHeader = layout.get_pic_header_text({ lengthbr: 10, cname: 'Mammals' }).join(' ');
  t.ok(picHeader.indexOf('Cretaceous') > -1, 'picture header includes localized geological period');

  config.OZstrings = prevStrings;
  t.end();
});
