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

      while (this.selections[trackerId].timestamps.length > 10) {
        this.selections[trackerId].timestamps.shift();
        ++this.selections[trackerId].count;
      }

      this.save();
    },

    sort: function (items) {
      var tracker = this;
      var originalOrder = 0;
      items.forEach(function (item) {
        item._qswitcherOriginalOrder = originalOrder;
        originalOrder++;
      });

      items.sort(function (a, b) {
        if (typeof tracker.selections[a.trackerId] === 'undefined') {
          return typeof tracker.selections[b.trackerId] !== 'undefined' ? 1 : -1;
        }

        if (typeof tracker.selections[b.trackerId] === 'undefined') {
          return typeof tracker.selections[a.trackerId] !== 'undefined' ? -1 : 1;
        }

        var aCount = tracker.selections[a.trackerId].timestamps.length;
        var bCount = tracker.selections[b.trackerId].timestamps.length;

        if (aCount == bCount) {
          return a._qswitcherOriginalOrder < b._qswitcherOriginalOrder ? -1 : 1;
        }

        return aCount > bCount ? -1 : 1;
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
    }
  };
});
