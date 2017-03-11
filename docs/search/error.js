define(function() {
  return {
    breadcrumbText: 'Demo Error',
    text: 'Demo Error',
    trackerId: 'Demo Error',
    searchCallback: function searchCallback(searchText, resultHandler) {
      resultHandler.setError();
    },
  };
});
