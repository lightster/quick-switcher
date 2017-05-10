define('tracker/selection', ['tracker/statistic'], function(Statistic) {
  var canonicalizeSearchKey = function(searchKey) {
    return searchKey.toLowerCase();
  };

  return {
    init: function(data) {
      if (data) {
        var selection = this;

        this.overall = Statistic.create(data.overall);
        this.searchKeys = {};
        Object.keys(data.searchKeys).forEach(function(searchKey) {
          searchKey = canonicalizeSearchKey(searchKey);

          var stat = Statistic.create(data.searchKeys[searchKey]);
          selection.searchKeys[searchKey] = stat;
        });

        return;
      }

      this.overall = Statistic.create();
      this.searchKeys = {};
    },

    increment: function(searchText) {
      this.overall.increment();

      if (!searchText) {
        return;
      }

      searchText = canonicalizeSearchKey(searchText);

      if(!this.searchKeys[searchText]) {
        this.searchKeys[searchText] = Statistic.create();
      }
      this.searchKeys[searchText].increment();
    },

    score: function(searchText) {
      searchText = canonicalizeSearchKey(searchText);

      if(!searchText || !this.searchKeys[searchText]) {
        return this.overall.score() * 0.5;
      }

      return this.searchKeys[searchText].score();
    },
  };
});
