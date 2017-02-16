define('tracker/statistic', function() {
  var time = function() {
    return Math.floor(new Date().getTime() / 1000);
  };

  var Statistic = {
    create: function(data) {
      var stat = Object.create(Statistic);
      stat.init(data);

      return stat;
    },

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

    score: function() {
      if(!this.timestamps.length) {
        return 0;
      }

      var now = time();

      /**
       * Scoring based on weights and calculation used by Slack as
       * described in their article:
       * https://slack.engineering/a-faster-smarter-quick-switcher-77cbc193cb60#.cb5ofyxyl
       */
      var score = this.timestamps.reduce(
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

      return this.count * score / this.timestamps.length;
    },
  };

  return Statistic;
});
