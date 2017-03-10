require.config({
  baseUrl: 'src',
  paths: {
    'docs': '../docs',
  },
});

define(function(require) {
  var lstrQuickSwitcher = require('quick-switcher');

  lstrQuickSwitcher({
    searchCallback: function(searchText, basicResultHandler) {
      basicResultHandler.setResults(
        basicResultHandler.sorters.tracker('main').sort([
          require('docs/search/people'),
          require('docs/search/error'),
          {
            text: 'Quickest Item',
            trackerId: 'Quickest Item',
          },
      ].filter(function(item) {
        return basicResultHandler.filters.isMatch(searchText, item.text);
      }), searchText));
    },
    selectCallback: function(selected) {
      selected.trackAs('main');
      console.log(selected.selectedValue);
    },
    selectChildSearchCallback: function(selected) {
      selected.trackAs('main');
    },
    searchDelay: 0,
  });
});
