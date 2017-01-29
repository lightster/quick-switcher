define('sorters', ['factories'], function(factories) {
  return {
    tracker: function getTracker(trackerName) {
      return factories.tracker(trackerName);
    },
  };
});
