/**
    * Usage: npx babel-tape-runner OZprivate/rawJS/OZTreeModule/tests/test_factory_utils_ozstrings.js
    */
import test from 'tape';
import config from '../src/global_config';
import { spec_num_full, number_convert, gpmapper, ageAsText } from '../src/factory/utils';

test('factory utils read localized labels from config.OZstrings', function (t) {
    const prevStrings = config.OZstrings;
    try {
        config.OZstrings = {
            sp: 'species',
            spp: 'species',
            geological: {
                periods: [
                    { Ma: 1, name: 'Quaternary', long: 'Quaternary Period' },
                ],
                eons: [
                    { Ma: 4600, name: 'Hadean', long: 'Hadean Eon' },
                ],
            },
            Mya: '{mya} million years ago',
            tya: '{tya} thousand years ago',
        };

        t.equal(spec_num_full({ richness_val: 1 }), '1 species', 'Singular species label comes from OZstrings');
        t.equal(number_convert(1200), '1,200 species', 'Plural species label comes from OZstrings');
        t.equal(gpmapper(0.5, false), 'Quaternary', 'Geological period name comes from OZstrings');
        t.equal(gpmapper(0.5, true), 'Quaternary Period', 'Long geological period label comes from OZstrings');
        t.equal(ageAsText(0.5), '500 thousand years ago', 'Sub-million age template comes from OZstrings');
    } finally {
        config.OZstrings = prevStrings;
        t.end();
    }
});
