define('selectors', ['factories'], function (factories) {
  return {
    tracker: function getTracker(trackerName) {
      return factories.tracker(trackerName);
    }
  };
});
