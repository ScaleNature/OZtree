/**
  * Usage: npx babel-tape-runner OZprivate/rawJS/OZTreeModule/tests/test_projection_leaf_layout_ozstrings.js
  */
import test from 'tape';

import config from '../src/global_config';
import LeafLayoutBase from '../src/projection/layout/leaf_layout_base';

test('leaf layout uses config.OZstrings for sponsor and conservation labels', function (t) {
  const prevStrings = config.OZstrings;
  try {
    config.OZstrings = {
      leaf_sponsored: 'Sponsored leaf',
      leaf_sponsored_extra: 'Awaiting confirmation',
      'Sponsored by': 'Sponsored by',
      sponsor_text: {
        leaf: [
          ['Line one', 'Line two'],
        ],
      },
      Conservation: 'Conservation',
      'IUCN Red List status:': 'IUCN status:',
      IUCN: {
        EN: 'Endangered',
        '': 'Not Evaluated',
      },
    };

    const layout = new LeafLayoutBase();

    const sponsored = layout.get_sponsor_text({
      sponsor_name: 'leaf_sponsored',
      sponsor_kind: 'by',
      sponsor_extra: null,
    });
    t.equal(sponsored[0], 'SPONSORED LEAF', 'special leaf sponsorship label comes from OZstrings');
    t.equal(sponsored[1], 'AWAITING CONFIRMATION', 'special leaf sponsorship extra text comes from OZstrings');

    const normalSponsor = layout.get_sponsor_text({
      sponsor_name: 'Ada',
      sponsor_kind: 'by',
      sponsor_extra: 'for science',
    });
    t.equal(normalSponsor[0], 'SPONSORED BY ADA', 'standard sponsorship prefix uses localized string');
    t.equal(normalSponsor[1], ', FOR SCIENCE', 'standard sponsorship extra text is appended and uppercased');

    const conservation = layout.get_conservation_text({ redlist: 'EN' });
    t.deepEqual(conservation, ['Conservation', 'IUCN status:', 'Endangered'], 'conservation tuple is localized from OZstrings');
  } finally {
    config.OZstrings = prevStrings;
    t.end();
  }
});
