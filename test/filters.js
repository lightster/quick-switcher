var requirejs = require('requirejs');
var test = require('tape');

requirejs.config({
  baseUrl: 'src',
});

test('simple substring can be found', function(t) {
  t.plan(1);

  var filters = requirejs('filters');

  t.ok(filters.isMatch('world', 'hello world and friends'));
});

test('multi-word search criteria can be matched', function(t) {
  t.plan(1);

  var filters = requirejs('filters');

  t.ok(filters.isMatch('world friends', 'hello world and friends'));
});

test('all search words must be in search index to be a match', function(t) {
  t.plan(1);

  var filters = requirejs('filters');

  t.notOk(filters.isMatch('world friends the', 'hello world and friends'));
});
