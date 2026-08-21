/**
    * Usage: npx babel-tape-runner OZprivate/rawJS/OZTreeModule/tests/test_search_manager.js
    */
import test from 'tape';
import search_manager from '../src/ui/search_manager';
import config from '../src/global_config';

test('search_manager', function (t) {
    t.ok(search_manager);
    t.ok(search_manager.compile_searchbox_data);
    const cols = {
        "vernacular": 0,
        "name": 1,
        "ott": 2,
        "extra_vernaculars": 3,
        "id": 4,
    }
    let result;
    // With latin name
    result = search_manager.compile_searchbox_data("", "en", [
        "Test case",
        "Testicus Casicus",
        null,
        [],
        12345,
    ], cols, false);
    t.deepEqual(result.pinpoint, "@Testicus_Casicus", "Can use latin name as pinpoint when no ott");
    
    // Fake latin name - prefix
    result = search_manager.compile_searchbox_data("", "en", [
        "Test case",
        "_Testicus Casicus",
        null,
        [],
        12345,
    ], cols, false);
    t.deepEqual(result.pinpoint, "@_ozid=12345", "Ignores fake latin name with underscore prefix when no ott");

    // Fake latin name - suffix
    result = search_manager.compile_searchbox_data("", "en", [
        "Test case",
        "Testicus Casicus_",
        null,
        [],
        12345,
    ], cols, false);
    t.deepEqual(result.pinpoint, "@_ozid=12345", "Ignores fake latin name with underscore suffix when no ott");
    t.end();
});

test('search_manager uses configured OZstrings in sponsor prefix detection', function (t) {
    const prevStrings = config.OZstrings;
    const prevUrlsConfigured = search_manager._urls_configured;
    const prevLastSearch = search_manager.last_search;
    const prevSearchTimer = search_manager.search_timer;
    config.OZstrings = {
        "Sponsored for": "Sponsored for",
        "Sponsored by": "Sponsored by",
        "Sponsored": "Sponsored",
        "Sponsor": "Sponsor",
    };
    const prevSearchForSponsor = search_manager.searchForSponsor;
    try {
        search_manager._urls_configured = true;
        search_manager.last_search = null;

        const calls = [];
        search_manager.searchForSponsor = function (query, callback, type) {
            calls.push({ query, type });
            if (callback) callback([]);
        };

        search_manager.full_search('Sponsored by Ada Lovelace', function () {}, 0);

        t.equal(calls.length, 1, 'Routes sponsored searches through searchForSponsor');
        t.equal(calls[0].type, 'by', 'Uses localized "Sponsored by" prefix to pick sponsor type');
        t.equal(calls[0].query, ' Ada Lovelace', 'Strips the configured prefix before sponsor search');
    } finally {
        if (search_manager.search_timer) {
            clearTimeout(search_manager.search_timer);
            search_manager.search_timer = null;
        }
        search_manager.searchForSponsor = prevSearchForSponsor;
        search_manager._urls_configured = prevUrlsConfigured;
        search_manager.last_search = prevLastSearch;
        search_manager.search_timer = prevSearchTimer;
        config.OZstrings = prevStrings;
        t.end();
    }
});

test('search_manager compile_searchbox_data uses localized "Also called:" label', function (t) {
    const prevStrings = config.OZstrings;
    try {
        config.OZstrings = {
            "Also called:": "Also called:",
        };

        const cols = {
            "vernacular": 0,
            "name": 1,
            "ott": 2,
            "extra_vernaculars": 3,
            "id": 4,
        };

        const result = search_manager.compile_searchbox_data('wolf', 'en', [
            null,
            'Canis lupus',
            9612,
            ['wolf'],
            42,
        ], cols, false);

        t.equal(result[4].info_type, 'Extra Vernacular', 'Produces extra vernacular metadata');
        t.equal(result[4].text, 'Also called: wolf', 'Builds extra label from config.OZstrings');
    } finally {
        config.OZstrings = prevStrings;
        t.end();
    }
});
