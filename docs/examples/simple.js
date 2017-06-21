define(function(require) {
  var lstrQuickSwitcher = require('quick-switcher');

  var simpleQs = lstrQuickSwitcher({
    searchCallback: function(searchText, resultHandler) {
      var options = [
        'Zach',
        'Stacy',
        'Matt',
        'Lightster',
        'Baxter',
      ];
      var filteredOptions = options.filter(function(item) {
        return resultHandler.filters.isMatch(searchText, item);
      });

      resultHandler.setResults(filteredOptions);
    },
    selectCallback: function(selected) {
      console.log(selected.selectedValue);
    },
    hotKey: null
  });

  $('#example-simple').on('click', simpleQs.open.bind(simpleQs));
});
