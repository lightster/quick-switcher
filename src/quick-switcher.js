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

(function($ ) {
  var methods = {
    renderList: function(list) {
      var $ul = $('<ul>');
      this.append($ul);

      $(list).each(function(idx, value) {
        var $li = $('<li>');
        $ul.append($li);
        $li.text(value);
      })
    }
  };

  $.fn.lstrQuickSwitcher = function(methodOrOptions) {
    if (methods[methodOrOptions]) {
      return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' +  methodOrOptions + ' does not exist on jQuery.lstrQuickSwitcher');
    }
  };
}(jQuery));
