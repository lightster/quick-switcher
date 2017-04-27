require.config({
  baseUrl: 'src',
  paths: {
    'docs': '../docs',
    'text': '../docs/requirejs-text',
  },
});

define(function(require) {
  var lstrQuickSwitcher = require('quick-switcher');

  var numbers = [];
  for (var i = 1; i < 100; i++) {
    numbers.push({text: i + '', description: 'Number'});
  }

  var qs = lstrQuickSwitcher({
    searchCallback: function(searchText, basicResultHandler) {
      basicResultHandler.setResults(
        basicResultHandler.sorters.tracker('main').sort([
          require('docs/search/people'),
          require('docs/search/colors'),
          require('docs/search/error'),
          {
            text: 'Quickest Item',
            trackerId: 'Quickest Item',
          },
        ].concat(numbers).filter(function(item) {
          return basicResultHandler.filters.isMatch(searchText, item.text);
        }), searchText)
      );
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

  $('#open-qswitcher').on('click', qs.open.bind(qs));
});
