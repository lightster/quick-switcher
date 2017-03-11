define(function() {
  return {
    breadcrumbText: 'Peoplez',
    text: 'people',
    trackerId: 'People',
    description: {html: '&#128269;'},
    searchCallback: function searchCallback(searchText, resultHandler) {
      setTimeout(function() {
        resultHandler.setResults(resultHandler.sorters.tracker('person').sort([
          'lightster',
          'zulu',
          'ollie',
          'enderwiggin',
          'twenty7',
          'netbattler',
          'majorstriker',
          'nimble',
          'darthsidious',
          'pariah',
          'blackstar',
          'boni',
        ].filter(function(item) {
          var text = item;
          if (item.text) {
            text = item.text;
          } else if (item.html) {
            text = item.html;
          }
          return resultHandler.filters.isMatch(
            searchText.toLowerCase(),
            text.toLowerCase()
          );
        }).map(function(item) {
          return {
            text: item,
            trackerId: item,
          };
        }), searchText));
      }, 1);
    },
    searchDelay: 500,
    selectCallback: function selectCallback(selected) {
      console.log(selected.selectedValue);
      selected.trackAs('person');
    },
  };
});
