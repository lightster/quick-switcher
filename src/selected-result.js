define('selected-result', ['factories'], function(factories) {
  return {
    init: function init(selectedValue, searchText, domEvent) {
      this.selectedValue = selectedValue;
      this.searchText = searchText;
      this.domEvent = domEvent;
    },
    trackAs: function trackAs(trackerName) {
      factories.tracker(trackerName).trackSelection(
        this.selectedValue,
        this.searchText
      );
    },
  };
});
