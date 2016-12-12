(function() {
  $('.lstr-qswitcher-search').on('keydown', function () {
    console.log('down')
  })
  $('.lstr-qswitcher-search').on('keyup', function () {
    console.log('up')
  })
  $('.lstr-qswitcher-search').on('keypress', function () {
    console.log('press')
  })
})();

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

      this.renderList();
    },

    initDomElement: function($parentDom) {
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
    },

    renderList: function() {
      var $results = this.$domElement.find('.lstr-qswitcher-results');
      var $ul = $('<ul>');

      this.options.forEach(function(value) {
        var $li = $('<li>');
        $ul.append($li);
        $li.text(value);
      })

      $results.append($ul);
    }
  };

  exports.lstrQuickSwitcher = function(options) {
    var $parentDom = $('body');

    quickSwitcher = Object.create(QuickSwitcher);
    quickSwitcher.init($parentDom, options);
  };
}(module.exports));
