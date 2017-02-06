define('tracker', [], function() {
  var time = function() {
    return Math.floor(new Date().getTime() / 1000);
  };
  var Selection = {
    init: function(data) {
      if (data) {
        this.timestamps = data.timestamps;
        this.count = data.count;
        return;
      }

      this.timestamps = [];
      this.count = 0;
    },

    increment: function() {
      this.timestamps.push(time());
      ++this.count;

      while (this.timestamps.length > 10) {
        this.timestamps.shift();
      }
    },
  };

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

    trackSelection: function(item) {
      if (!item.trackerId) {
        return;
      }

      var trackerId = item.trackerId;

      if (!this.selections[trackerId]) {
        this.selections[trackerId] = Object.create(Selection);
        this.selections[trackerId].init();
      }

      this.selections[trackerId].increment();

      this.save();
    },

    sort: function(items) {
      var tracker = this;
      var originalOrder = 0;
      items.forEach(function(item) {
        item._qswitcherOriginalOrder = originalOrder;
        item._qswitcherScore = tracker.scoreSelection(item);
        originalOrder++;
      });

      items.sort(function(a, b) {
        if (a._qswitcherScore == b._qswitcherScore) {
          return a._qswitcherOriginalOrder < b._qswitcherOriginalOrder ? -1 : 1;
        }

        return a._qswitcherScore > b._qswitcherScore ? -1 : 1;
      });

      items.forEach(function(item) {
        delete item._qswitcherOriginalOrder;
        delete item._qswitcherScore;
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

    scoreSelection: function(item) {
      var selection = this.selections[item.trackerId];

      if (typeof selection === 'undefined' || !selection.timestamps.length) {
        return 0;
      }

      var now = time();

      /**
       * Scoring based on weights and calculation used by Slack as
       * described in their article:
       * https://slack.engineering/a-faster-smarter-quick-switcher-77cbc193cb60#.cb5ofyxyl
       */
      var score = selection.timestamps.reduce(
        function(score, timestamp) {
          if (timestamp > now - (3600 * 4)) {
            return score + 100;
          }

          if (timestamp > now - (3600 * 24)) {
            return score + 80;
          }

          if (timestamp > now - (3600 * 24 * 3)) {
            return score + 60;
          }

          if (timestamp > now - (3600 * 7)) {
            return score + 40;
          }

          if (timestamp > now - (3600 * 30)) {
            return score + 20;
          }

          if (timestamp > now - (3600 * 90)) {
            return score + 10;
          }

          return score;
        },
        0
      );

      return selection.count * score / selection.timestamps.length;
    },
  };
});
