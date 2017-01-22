define('tracker', [], function () {
  return {
    init: function (trackerName) {
      this.name = trackerName;
      this.localStorageName = 'qswitcher-tracker-' + trackerName;
      this.selections = {};

      if (!window.localStorage) {
        return;
      }

      if (localStorage.getItem(this.localStorageName)) {
        this.selections = JSON.parse(localStorage.getItem(this.localStorageName));
      }
    },

    trackSelection: function (item) {
      if (!item.trackerId) {
        return;
      }

      var trackerId = item.trackerId;

      if (!this.selections[trackerId]) {
        this.selections[trackerId] = {
          count: 0,
          timestamps: []
        };
      }

      this.selections[trackerId].timestamps.push(Math.floor(new Date().getTime() / 1000));
      ++this.selections[trackerId].count;

      while (this.selections[trackerId].timestamps.length > 10) {
        this.selections[trackerId].timestamps.shift();
      }

      this.save();
    },

    sort: function (items) {
      var tracker = this;
      var originalOrder = 0;
      items.forEach(function (item) {
        item._qswitcherOriginalOrder = originalOrder;
        item._qswitcherScore = tracker.scoreSelection(item);
        originalOrder++;
      });

      items.sort(function (a, b) {
        if (a._qswitcherScore == b._qswitcherScore) {
          return a._qswitcherOriginalOrder < b._qswitcherOriginalOrder ? -1 : 1;
        }

        return a._qswitcherScore > b._qswitcherScore ? -1 : 1;
      });

      items.forEach(function (item) {
        delete item._qswitcherOriginalOrder;
      });

      return items;
    },

    save: function () {
      if (!window.localStorage) {
        return;
      }

      localStorage.setItem(this.localStorageName, JSON.stringify(this.selections));
    },

    scoreSelection: function (item) {
      if (typeof this.selections[item.trackerId] === 'undefined') {
        return 0;
      }

      return this.selections[item.trackerId].timestamps.length;
    }
  };
});
