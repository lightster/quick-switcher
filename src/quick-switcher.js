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

      this.$domElement.on('keydown', '.lstr-qswitcher-search', function (event) {
        if (event.which === 38) { // up arrow key
          qSwitcher.selectIndex(qSwitcher.selectedIndex - 1);
          event.preventDefault();
        } else if (event.which === 40) { // down arrow key
          qSwitcher.selectIndex(qSwitcher.selectedIndex + 1);
          event.preventDefault();
        }
      });

      this.$domElement.find('.lstr-qswitcher-search').focus();
    },

    renderList: function() {
      var qSwitcher = this;

      this.valueObjects = [];

      var $results = this.$domElement.find('.lstr-qswitcher-results');
      var $ul = $('<ul>');

      this.options.forEach(function(value, index) {
        var $li = $('<li>');
        $ul.append($li);
        $li.text(value);

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

      var $li = this.valueObjects[this.selectedIndex].$li;
      if ($li.offset().top + $li.outerHeight(true) - $li.parent().offset().top > $li.parents('.lstr-qswitcher-results').outerHeight(true) + $('.lstr-qswitcher-results').scrollTop()) {
        $('.lstr-qswitcher-results').scrollTop($li.offset().top - $li.parent().offset().top);
      } else if ($li.offset().top - $li.parent().offset().top < $('.lstr-qswitcher-results').scrollTop()) {
        $('.lstr-qswitcher-results').scrollTop($li.offset().top - $li.parent().offset().top);
      }
    }
  };

  exports.lstrQuickSwitcher = function(options) {
    var $parentDom = $('body');

    quickSwitcher = Object.create(QuickSwitcher);
    quickSwitcher.init($parentDom, options);
  };
}(module.exports));
