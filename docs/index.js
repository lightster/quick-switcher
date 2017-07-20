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

  require('docs/examples/simple');

  var qs = lstrQuickSwitcher({
    trackChildrenAs: 'main',
    searchCallback: function(searchText, basicResultHandler) {
      var colors = require('docs/search/colors');
      var colorShortcut = Object.create(colors);
      colorShortcut.text = "Search for color '" + searchText + "'";
      colorShortcut.isShortcut = true;

      var results = [
        require('docs/search/people'),
        colors,
        require('docs/search/error'),
        {
          text: 'Quickest Item',
          trackerId: 'Quickest Item',
        },
      ].concat(numbers).filter(function(item) {
        return basicResultHandler.filters.isMatch(searchText, item.text);
      });

      if (searchText) {
        results.push(colorShortcut);
      }

      basicResultHandler.setResults(results);
    },
    selectCallback: function(selected) {
      console.log(selected.selectedValue);
    },
    selectChildSearchCallback: function(selected) {
      if (selected.selectedValue.isShortcut) {
        selected.preventSearchTextClearing();
      }
    },
    searchDelay: 0,
  });

  $('.open-qswitcher').on('click', qs.open.bind(qs));

  var modifierKey = 'Ctrl';
  if (navigator.platform.toLowerCase().indexOf('mac') != -1
    || navigator.platform.indexOf('iP') != -1
  ) {
    modifierKey = 'Cmd';
  }
  $('.qs-hotkey').text(modifierKey + '+K');
});
