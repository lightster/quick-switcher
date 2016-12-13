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
      this.$liCollection = null;
      this.valueObjects = null;
      this.selectedIndex = null;
      this.$results = null;

      this.initDomElement($parentDom);
      this.options = options;

      this.$liCollection = null;
      this.valueObjects = null;
      this.selectedIndex = null;

      this.renderList();
    },

    initDomElement: function($parentDom) {
      var qSwitcher = this;

      this.$domElement = $(
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

      this.$domElement.find('.lstr-qswitcher-search').focus();
      this.$results = this.$domElement.find('.lstr-qswitcher-results');

      this.$domElement.on('keydown', '.lstr-qswitcher-search', function (event) {
        if (event.which === 38) { // up arrow key
          qSwitcher.selectIndex(qSwitcher.selectedIndex - 1);
          qSwitcher.scrollToSelectedItem();
          event.preventDefault();
        } else if (event.which === 40) { // down arrow key
          qSwitcher.selectIndex(qSwitcher.selectedIndex + 1);
          qSwitcher.scrollToSelectedItem();
          event.preventDefault();
        }
      });
      this.$domElement.on('hover', '.lstr-qswitcher-results li', function() {
        var $li = $(this);
        qSwitcher.selectIndex($li.data('lstr-qswitcher').index);
      });

      this.$domElement.find('.lstr-qswitcher-search').focus();
    },

    renderList: function() {
      var qSwitcher = this;

      this.valueObjects = [];

      var $results = this.$results;
      var $ul = $('<ul>');

      this.options.forEach(function(value, index) {
        var $li = $('<li>');
        $ul.append($li);
        $li.text(value);
        $li.data('lstr-qswitcher', {'index': index});

        qSwitcher.valueObjects[index] = {
          'index': index,
          'value': value,
          '$li': $li
        };
      });

      $results.append($ul);

      this.selectIndex(0);
    },

    selectIndex: function(selectedIndex) {
      if (this.selectedIndex !== null) {
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
    }
  };

  exports.lstrQuickSwitcher = function(options) {
    var $parentDom = $('body');

    quickSwitcher = Object.create(QuickSwitcher);
    quickSwitcher.init($parentDom, options);
  };
}(module.exports));
