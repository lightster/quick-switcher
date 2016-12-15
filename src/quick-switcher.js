if (typeof module === 'undefined') {
  module = {};
}

if (typeof module.exports === 'undefined') {
  module.exports = {};
}

if (typeof module.exports.jQuery === 'undefined') {
  module.exports.jQuery = jQuery;
}

(function (exports) {
  var ResultHandler = {
    filters: {
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
    }
  };

  var QuickSwitcher = {
    init: function ($parentDom, searchCallback, selectCallback) {
      this.$parentDom = null;
      this.$liCollection = null;
      this.valueObjects = null;
      this.selectedIndex = null;
      this.$results = null;
      this.$breadcrumb = null;
      this.$search = null;
      this.searchText = '';

      this.initDomElement($parentDom);
      this.searchCallback = searchCallback;
      this.selectCallback = selectCallback;
      this.callbackStack = [];
    },

    initDomElement: function ($parentDom) {
      var qSwitcher = this;

      this.$parentDom = $parentDom;
      this.$domElement = $(
        '<div class="lstr-qswitcher-overlay">' +
        '</div>' +
        '<div class="lstr-qswitcher-container">' +
        '  <form class="lstr-qswitcher-popup">' +
        '    <div class="lstr-qswitcher-breadcrumb">' +
        '    </div>' +
        '    <div class="lstr-qswitcher-help">' +
        '      <ul>' +
        '        <li><em>&#8597;</em> to navigate</li>' +
        '        <li><em>&#8629;</em> to select</li>' +
        '        <li><em>&#9003;</em> to clear</li>' +
        '        <li><em>esc</em> to dismiss</li>' +
        '      </ul>' +
        '    </div>' +
        '    <input type="text" class="lstr-qswitcher-search" />' +
        '    <div class="lstr-qswitcher-results">' +
        '    </div>' +
        '  </form>' +
        '</div>'
      );

      $parentDom.append(this.$domElement);

      this.$breadcrumb = this.$domElement.find('.lstr-qswitcher-breadcrumb');
      this.$search = this.$domElement.find('.lstr-qswitcher-search');
      this.$results = this.$domElement.find('.lstr-qswitcher-results');

      this.$domElement.find('.lstr-qswitcher-popup').on('submit', function (event) {
        event.preventDefault();
      });
      this.$parentDom.find('.lstr-qswitcher-overlay').on('click', function (event) {
        qSwitcher.closeSwitcher();
        event.preventDefault();
      });
      this.$parentDom.on('keydown', function (event) {
        if ((event.metaKey || event.ctrlKey) && event.which === 75) {
          qSwitcher.toggleSwitcher();
          event.preventDefault();
        }
      });
      $('html').on('keydown', '.lstr-qswitcher-noscroll', function (event) {
        if (event.which === 38) { // up arrow key
          qSwitcher.selectIndex(qSwitcher.selectedIndex - 1);
          qSwitcher.scrollToSelectedItem();
          event.preventDefault();
        } else if (event.which === 40) { // down arrow key
          qSwitcher.selectIndex(qSwitcher.selectedIndex + 1);
          qSwitcher.scrollToSelectedItem();
          event.preventDefault();
        } else if (event.which === 27) { // escape key
          qSwitcher.toggleSwitcher();
          event.preventDefault();
        } else if (13 === event.keyCode) {
          var $li = $(this);
          qSwitcher.triggerSelect(qSwitcher.selectedIndex, event);
          event.preventDefault();
        }
      });
      this.$search.on('keyup', function (event) {
        var searchText = qSwitcher.$search.val();
        if (searchText !== qSwitcher.searchText) {
          qSwitcher.searchText = searchText;
          qSwitcher.renderList();
        } else if (event.which === 8 && '' === searchText) { // backspace with text box blank
          qSwitcher.popCallback();
          qSwitcher.renderList();
        }
      });
      this.$domElement.on('hover', '.lstr-qswitcher-results li', function () {
        var $li = $(this);
        qSwitcher.selectIndex($li.data('lstr-qswitcher').index);
      });
      this.$domElement.on('click', '.lstr-qswitcher-results li', function (event) {
        var $li = $(this);
        qSwitcher.triggerSelect($li.data('lstr-qswitcher').index, event);
      });
    },

    renderList: function () {
      this.renderBreadcrumb();

      this.$results.html('');

      var resultHandler = Object.create(ResultHandler);
      resultHandler.setResults = this.setResults.bind(this);

      this.searchCallback(this.searchText, resultHandler);
    },

    setResults: function (items) {
      var qSwitcher = this;
      var $results = this.$results;

      if (items.length == 0) {
        $results.html('');
        return;
      }

      qSwitcher.valueObjects = [];

      var $ul = $('<ul>');

      items.forEach(function (value, index) {
        var $li = $('<li>');
        var $container = $('<div>');
        $ul.append($li);
        $li.append($container);
        qSwitcher.setListText($container, value);

        $li.data('lstr-qswitcher', {'index': index});
        $container.addClass('lstr-qswitcher-result-container');

        if (value.searchCallback) {
          $li.addClass('lstr-qswitcher-result-category');
        }

        qSwitcher.valueObjects[index] = {
          'index': index,
          'value': value,
          '$li': $li
        };
      });

      $results.html($ul);

      qSwitcher.selectIndex(0);
    },

    renderBreadcrumb: function ()
    {
      var $ul = $('<ul>');

      this.callbackStack.forEach(function (value, index) {
        var $li = $('<li>');
        $li.text(value.text);
        $ul.append($li);
      });

      this.$breadcrumb.html($ul);
    },

    setListText: function ($element, value) {
      if (value.toHtml || value.html) {
        $element.html(value.toHtml ? value.toHtml() : value.html);
        return;
      }

      if (value.toText || value.text) {
        $element.text(value.toText ? value.toText() : value.text);
        return;
      }

      $element.text(value);
    },

    selectIndex: function (selectedIndex) {
      if (this.selectedIndex !== null && this.valueObjects[this.selectedIndex]) {
        this.valueObjects[this.selectedIndex].$li.removeClass('lstr-qswitcher-result-selected');
      }

      this.selectedIndex = selectedIndex % this.valueObjects.length;

      if (this.selectedIndex < 0) {
        this.selectedIndex = this.valueObjects.length - 1;
      }

      this.valueObjects[this.selectedIndex].$li.addClass('lstr-qswitcher-result-selected');
    },

    scrollToSelectedItem: function () {
      var $li = this.valueObjects[this.selectedIndex].$li;
      var $results = this.$results;

      var topOfLi = $li.offset().top - $li.parent().offset().top;
      var bottomOfLi = topOfLi + $li.outerHeight(true);
      var scrollTop = $results.scrollTop();
      var scrollBottom = scrollTop + $results.outerHeight(true);

      if (bottomOfLi > scrollBottom || topOfLi < scrollTop) {
        $results.scrollTop(topOfLi);
      }
    },

    toggleSwitcher: function () {
      this.useRootCallback();
      this.$search.val('');
      this.renderList();

      this.$parentDom.toggleClass('lstr-qswitcher-noscroll');
      this.$search.focus();
    },

    closeSwitcher: function () {
      this.$parentDom.removeClass('lstr-qswitcher-noscroll');
    },

    triggerSelect: function (index, event) {
      var selectedValue = this.valueObjects[index].value;

      if (selectedValue.searchCallback) {
        this.callbackStack.push({
          'text': selectedValue.breadcrumbText,
          'parentSearchCallback': this.searchCallback,
          'parentSelectCallback': this.selectCallback
        });

        this.searchCallback = selectedValue.searchCallback;
        if (selectedValue.selectCallback) {
          this.selectCallback = selectedValue.selectCallback;
        }

        this.renderList();
        this.$search.val('');

        return;
      }

      if (false !== this.selectCallback(selectedValue, event)) {
        this.closeSwitcher();
      }
    },

    popCallback: function () {
      var callbacks = this.callbackStack.pop();
      if (!callbacks) {
        return false;
      }

      this.searchCallback = callbacks.parentSearchCallback;
      this.selectCallback = callbacks.parentSelectCallback;

      return true;
    },

    useRootCallback: function () {
      while (this.callbackStack.length > 0) {
        this.popCallback();
      }
    }
  };

  exports.lstrQuickSwitcher = function (searchCallback, selectCallback) {
    var $parentDom = $('body');

    quickSwitcher = Object.create(QuickSwitcher);
    quickSwitcher.init($parentDom, searchCallback, selectCallback);
  };
}(module.exports));
