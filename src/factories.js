define('factories', ['tracker'], function (Tracker) {
  var loadedTrackers = {};

  return {
    tracker: function getTracker(trackerName) {
      if (typeof loadedTrackers[trackerName] !== 'undefined') {
        return loadedTrackers[trackerName];
      }

      var trackerInstance = Object.create(Tracker);
      trackerInstance.init(trackerName);

      loadedTrackers[trackerName] = trackerInstance;

      return loadedTrackers[trackerName];
    }
  };
});
