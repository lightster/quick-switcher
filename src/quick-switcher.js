if (typeof module === 'undefined') {
  module = {};
}

if (typeof module.exports === 'undefined') {
  module.exports = {};
}

if (typeof module.exports.jQuery === 'undefined') {
  module.exports.jQuery = jQuery;
}

(function(exports) {
  var QuickSwitcher = {
    init: function($parentDom, options) {
      this.$parentDom = null;
      this.$liCollection = null;
      this.valueObjects = null;
      this.selectedIndex = null;
      this.$results = null;
      this.$search = null;
      this.searchText = '';

      this.initDomElement($parentDom);
      this.options = options;

      this.renderList();
    },

    initDomElement: function($parentDom) {
      var qSwitcher = this;

      this.$parentDom = $parentDom;
      this.$domElement = $(
        '<div class="lstr-qswitcher-overlay">' +
        '</div>' +
        '<div class="lstr-qswitcher-container">' +
        '  <form class="lstr-qswitcher-popup">' +
        '    <span class="lstr-qswitcher-help">' +
        '      <ul>' +
        '        <li>↵ to navigate</li>' +
        '        <li>↵ to select</li>' +
        '        <li>↵ to clear</li>' +
        '        <li>↵ to dismiss</li>' +
        '      </ul>' +
        '    </span>' +
        '    <span class="lstr-qswitcher-category">' +
        '      People' +
        '    </span>' +
        '    <input type="text" class="lstr-qswitcher-search" />' +
        '    <div class="lstr-qswitcher-results">' +
        '    </div>' +
        '  </form>' +
        '</div>'
      );

      $parentDom.append(this.$domElement);

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
          qSwitcher.triggerSelect(qSwitcher.selectedIndex);

          event.preventDefault();
        }
      });
      this.$search.on('keyup', function (event) {
        var searchText = qSwitcher.$search.val();
        if (searchText !== qSwitcher.searchText) {
          qSwitcher.searchText = searchText;
          qSwitcher.renderList();
        }
      });
      this.$domElement.on('hover', '.lstr-qswitcher-results li', function() {
        var $li = $(this);
        qSwitcher.selectIndex($li.data('lstr-qswitcher').index);
      });
      this.$domElement.on('click', '.lstr-qswitcher-results li', function() {
        var $li = $(this);
        qSwitcher.triggerSelect($li.data('lstr-qswitcher').index);
      });

      this.$domElement.find('.lstr-qswitcher-search').focus();
    },

    renderList: function() {
      var qSwitcher = this;
      var $results = this.$results;

      var items = this.options.searchCallback(this.searchText);

      if (items.length == 0) {
        $results.html('');
        return;
      }

      this.valueObjects = [];

      var $ul = $('<ul>');

      items.forEach(function(value, index) {
        var $li = $('<li>');
        $ul.append($li);
        qSwitcher.setListText($li, value);
        $li.data('lstr-qswitcher', {'index': index});

        qSwitcher.valueObjects[index] = {
          'index': index,
          'value': value,
          '$li': $li
        };
      });

      $results.html($ul);

      this.selectIndex(0);
    },

    setListText: function($li, value) {
      if (value.toHtml || value.html) {
        $li.html(value.toHtml ? value.toHtml() : value.html);
        return;
      }

      if (value.toText || value.text) {
        $li.text(value.toText ? value.toText() : value.text);
        return;
      }

      $li.text(value);
    },

    selectIndex: function(selectedIndex) {
      if (this.selectedIndex !== null && this.valueObjects[this.selectedIndex].$li) {
        this.valueObjects[this.selectedIndex].$li.removeClass('lstr-qswitcher-result-selected');
      }

      this.selectedIndex = selectedIndex % this.valueObjects.length;

      if (this.selectedIndex < 0) {
        this.selectedIndex = this.valueObjects.length - 1;
      }

      this.valueObjects[this.selectedIndex].$li.addClass('lstr-qswitcher-result-selected');
    },

    scrollToSelectedItem: function() {
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

    toggleSwitcher: function() {
      this.$parentDom.toggleClass('lstr-qswitcher-noscroll');
      this.$search.focus();
    },

    closeSwitcher: function() {
      this.$parentDom.removeClass('lstr-qswitcher-noscroll');
    },

    triggerSelect: function(index) {
      if (false !== this.options.selectCallback(this.valueObjects[index].value)) {
        this.closeSwitcher();
      }
    }
  };

  exports.lstrQuickSwitcher = function(searchCallback, selectCallback) {
    var $parentDom = $('body');

    var options = {
      'searchCallback': searchCallback,
      'selectCallback': selectCallback
    };

    quickSwitcher = Object.create(QuickSwitcher);
    quickSwitcher.init($parentDom, options);
  };
}(module.exports));
