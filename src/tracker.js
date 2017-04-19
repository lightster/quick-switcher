define('tracker', ['tracker/selection'], function(Selection) {
  return {
    init: function(trackerName) {
      this.name = trackerName;
      this.localStorageName = 'qswitcher-tracker-' + trackerName;
      this.selections = {};

      if (!window.localStorage) {
        return;
      }

      var selections = localStorage.getItem(this.localStorageName);
      if (selections) {
        this.selections = JSON.parse(selections);

        var tracker = this;
        Object.keys(this.selections).forEach(function(key) {
          var selection = Object.create(Selection);
          selection.init(tracker.selections[key]);

          tracker.selections[key] = selection;
        });
      }
    },

    trackSelection: function(item, searchText) {
      if (!item.trackerId) {
        return;
      }

      var trackerId = item.trackerId;

      if (!this.selections[trackerId]) {
        this.selections[trackerId] = Object.create(Selection);
        this.selections[trackerId].init();
      }

      this.selections[trackerId].increment(searchText);

      this.save();
    },

    sort: function(items, searchText) {
      var tracker = this;
      items.forEach(function(item, index) {
        item._qswitcher = {
          index: index,
          score: tracker.scoreSelection(item, searchText),
          sort: item.trackerStaticSort ? item.trackerStaticSort : 0,
        };
      });

      items.sort(function(a, b) {
        if (a._qswitcher.sort != b._qswitcher.sort) {
          return a._qswitcher.sort < b._qswitcher.sort ? -1 : 1;
        }

        if (a._qswitcher.score == b._qswitcher.score) {
          return a._qswitcher.index < b._qswitcher.index ? -1 : 1;
        }

        return a._qswitcher.score > b._qswitcher.score ? -1 : 1;
      });

      items.forEach(function(item) {
        delete item._qswitcher;
      });

      return items;
    },

    save: function() {
      if (!window.localStorage) {
        return;
      }

      localStorage.setItem(
        this.localStorageName,
        JSON.stringify(this.selections)
      );
    },

    scoreSelection: function(item, searchText) {
      var selection = this.selections[item.trackerId];

      if (typeof selection === 'undefined') {
        return 0;
      }

      return selection.score(searchText);
    },
  };
});
