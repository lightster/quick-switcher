define('filters', [], function () {
  return {
    isFuzzyMatch: function(needle, haystack) {
      for (var i = 0, j = 0; i < needle.length && j < haystack.length; i++) {
        while (j < haystack.length) {
          j++;
          if (needle.charAt(i) === haystack.charAt(j)) {
            break;
          }
        }
      }

      return j < haystack.length;
    },

    areWordsFound: function(needle, haystack) {
      var pieces = needle.split(/[^\w]/);
      for (var i = 0; i < pieces.length; i++) {
        if (haystack.indexOf(pieces[i]) === -1) {
          return false;
        }
      }

      return true;
    },

    isMatch: function(needle, haystack) {
      if (haystack.indexOf(needle) !== -1) {
        return true;
      } else if (this.areWordsFound(needle, haystack)) {
        return true;
      }

      return false;
      //return this.isFuzzyMatch(needle, haystack);
    }
  };
});
