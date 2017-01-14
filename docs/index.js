require.config({
  paths: {
    'quick-switcher': '../src/quick-switcher'
  }
});

define(['quick-switcher'], function(lstrQuickSwitcher) {
  lstrQuickSwitcher(
    function searchCallback(searchText, basicResultHandler) {
      basicResultHandler.setResults([
        {
          'breadcrumbText': 'Peoplez',
          'text': 'people',
          'description': {'html': '&#128269;'},
          'searchCallback': function searchCallback(searchText, peopleResultHandler) {
            setTimeout(function () {
              peopleResultHandler.setResults([
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
              }));
            }, 1000);
          },
          'searchDelay': 500,
          'selectCallback': function selectCallback(selected) {
            console.log(selected)
          }
        },
        {
          'breadcrumbText': 'Demo Error',
          'text': 'Demo Error',
          'searchCallback': function searchCallback(searchText, errorResultHandler) {
            errorResultHandler.setError();
          }
        }
      ].filter(function(item) {
        return basicResultHandler.filters.isMatch(searchText, item.text);
      }));
    },
    function selectCallback(selected) {
      console.log(selected);
    },
    {
      'searchDelay': 0
    }
  );
});
