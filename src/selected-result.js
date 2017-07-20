define('selected-result', ['factories'], function(factories) {
  return {
    init: function init(selectedValue, searchText, parent, domEvent) {
      this.selectedValue = selectedValue;
      this.searchText = searchText;
      this.parent = parent;
      this.domEvent = domEvent;
      this.trackingPrevented = false;
      this.searchTextClearingPrevented = false;
    },

    preventTracking: function() {
      this.trackingPrevented = true;
    },

    track: function track() {
      if (!this.parent.trackChildrenAs && !this.trackingPrevented) {
        return;
      }

      factories.tracker(this.parent.trackChildrenAs).trackSelection(
        this.selectedValue,
        this.searchText
      );
    },

    preventSearchTextClearing: function preventSearchTextClearing() {
      this.searchTextClearingPrevented = true;
    },

    isSearchTextClearingPrevented: function shouldClearSearchText() {
      return this.searchTextClearingPrevented;
    },
  };
});
