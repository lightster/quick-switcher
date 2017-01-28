require.config({
  baseUrl: 'src'
});

define(['quick-switcher'], function(lstrQuickSwitcher) {
  lstrQuickSwitcher({
    'searchCallback': function(searchText, basicResultHandler) {
      basicResultHandler.setResults(basicResultHandler.sorters.tracker('main').sort([
        {
          'breadcrumbText': 'Peoplez',
          'text': 'people',
          'trackerId': 'People',
          'description': {'html': '&#128269;'},
          'searchCallback': function searchCallback(searchText, peopleResultHandler) {
            setTimeout(function () {
              peopleResultHandler.setResults(peopleResultHandler.sorters.tracker('person').sort([
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
                'boni'
              ].filter(function(item) {
                var text = item;
                if (item.text) {
                  text = item.text;
                } else if (item.html) {
                  text = item.html;
                }
                return peopleResultHandler.filters.isMatch(searchText, text);
              }).map(function (item) {
                return {
                  'text': item,
                  'trackerId': item
                };
              })));
            }, 1);
          },
          'searchDelay': 500,
          'selectCallback': function selectCallback(selected) {
            console.log(selected.selectedValue);
            selected.trackAs('person');
          }
        },
        {
          'breadcrumbText': 'Demo Error',
          'text': 'Demo Error',
          'trackerId': 'Demo Error',
          'searchCallback': function searchCallback(searchText, errorResultHandler) {
            errorResultHandler.setError();
          }
        },
        {
          'text': 'Quickest Item',
          'trackerId': 'Quickest Item'
        }
      ].filter(function(item) {
        return basicResultHandler.filters.isMatch(searchText, item.text);
      })));
    },
    'selectCallback': function(selected) {
      selected.trackAs('main');
      console.log(selected.selectedValue);
    },
    'selectChildSearchCallback': function(selected) {
      selected.trackAs('main');
    },
    'searchDelay': 0,
  });
});
