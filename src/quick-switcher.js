var quickSwitcher = function(filters, SelectedResult, sorters, html) {
  var $ = jQuery;

  var ResultHandler = {
    filters: filters,
    sorters: sorters,
  };

  var callbackOrValue = function(value) {
    return (typeof value === 'function') ? value() : value;
  };

  var QuickSwitcher = {
    init: function($parentDom, options) {
      this.$parentDom = null;
      this.$liCollection = null;
      this.valueObjects = null;
      this.selectedIndex = null;
      this.$results = null;
      this.$noSearchTerms = null;
      this.$noResults = null;
      this.$loading = null;
      this.$breadcrumb = null;
      this.$search = null;
      this.searchText = '';
      this.searchDelayTimeout = null;
      this.searchId = 0;

      this.modifierKey = 'ctrlKey';
      if (navigator.platform.toLowerCase().indexOf('mac') != -1) {
        this.modifierKey = 'metaKey';
      }

      options = $.extend({
        searchCallback: function() {},
        selectCallback: function() {},
        selectChildSearchCallback: function() {},
        searchDelay: 1000,
        hotKey: 'K',
      }, options);

      this.hotKey = options.hotKey.toUpperCase();

      this.setOptions({
        searchCallback: options.searchCallback,
        selectCallback: options.selectCallback,
        selectChildSearchCallback: options.selectChildSearchCallback,
        searchDelay: options.searchDelay,
      });

      this.initDomElement($parentDom);

      this.callbackStack = [];
      this.abortSearchCallback = null;
    },

    initDomElement: function($parentDom) {
      var qSwitcher = this;

      this.$parentDom = $parentDom;
      this.$domElement = $(html);

      $parentDom.append(this.$domElement);

      this.$breadcrumb = this.$domElement.find('.lstr-qswitcher-breadcrumb');
      this.$close = this.$domElement.find('.lstr-qswitcher-close');
      this.$search = this.$domElement.find('.lstr-qswitcher-search');
      this.$loading = this.$domElement.find('.lstr-qswitcher-loading');
      this.$results = this.$domElement.find('.lstr-qswitcher-results');
      this.$noSearchTerms = this.$domElement.find('.lstr-qswitcher-no-terms');
      this.$noResults = this.$domElement.find('.lstr-qswitcher-no-results');
      this.$oopsResults = this.$domElement.find('.lstr-qswitcher-oops-results');

      var $domElement = this.$domElement;

      $domElement.find('.lstr-qswitcher-popup').on('submit', function(event) {
        event.preventDefault();
      });
      $parentDom.find('.lstr-qswitcher-overlay').on('click', function(event) {
        qSwitcher.closeSwitcher();
        event.preventDefault();
      });
      $parentDom.on('keydown', function(event) {
        var keyPressed = String.fromCharCode(event.which);
        if (event[qSwitcher.modifierKey] && keyPressed === qSwitcher.hotKey) {
          qSwitcher.toggleSwitcher();
          event.preventDefault();
        }
      });
      $('html').on('keydown', '.lstr-qswitcher-noscroll', function(event) {
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
          qSwitcher.triggerSelect(qSwitcher.selectedIndex, event);
          event.preventDefault();
        }
      });
      this.$close.on('click', function(event) {
        qSwitcher.closeSwitcher();
      });
      this.$search.on('keyup', function(event) {
        var searchText = qSwitcher.$search.val();

        if (qSwitcher.searchDelayTimeout) {
          clearTimeout(qSwitcher.searchDelayTimeout);
          qSwitcher.searchDelayTimeout = null;
        }

        if (searchText !== qSwitcher.searchText) {
          qSwitcher.searchDelayTimeout = setTimeout(function() {
            qSwitcher.selectIndex(null);
            qSwitcher.searchText = searchText;
            qSwitcher.renderList();
          }, qSwitcher.searchDelay);
        } else if (event.which === 8 && '' === searchText) {
          // backspace with text box blank
          qSwitcher.popCallback();
          qSwitcher.renderList();
        }
      });
      $domElement.on('mouseover', '.lstr-qswitcher-results li', function() {
        var $li = $(this);
        qSwitcher.selectIndex($li.data('lstr-qswitcher').index);
      });
      $domElement.on('touchstart', '.lstr-qswitcher-results li', function() {
        var $li = $(this);
        qSwitcher.selectIndex($li.data('lstr-qswitcher').index);
        qSwitcher.$search.blur();
      });
      $domElement.on('click', '.lstr-qswitcher-results li', function(event) {
        var $li = $(this);
        qSwitcher.triggerSelect($li.data('lstr-qswitcher').index, event);
      });
    },

    renderList: function() {
      if (this.abortSearchCallback) {
        this.abortSearchCallback();
        this.abortSearchCallback = null;
      }

      this.renderBreadcrumb();

      this.usePane(this.$loading);

      var resultHandler = Object.create(ResultHandler);
      ++this.searchId;
      resultHandler.setResults = this.setResults.bind(this, this.searchId);
      resultHandler.setError = this.setError.bind(this, this.searchId);
      this.abortSearchCallback = this.searchCallback(
        this.searchText,
        resultHandler
      );
    },

    setResults: function(searchId, items) {
      // if the search ID provided to setResults is not the current searchId,
      // ignore the results
      if (searchId !== this.searchId) {
        return;
      }

      var qSwitcher = this;

      qSwitcher.valueObjects = [];

      if (items.length == 0) {
        this.$results.html('');
        this.usePane(this.searchText ? this.$noResults : this.$noSearchTerms);
        return;
      }

      var $ul = $('<ul>');

      items.forEach(function(value, index) {
        var $li = $('<li>');
        var $container = $('<div>');
        $ul.append($li);
        $li.append($container);
        qSwitcher.setListText($container, value);

        if (value.description) {
          var $description = $(
            '<span class="lstr-qswitcher-result-description"></span>'
          );
          qSwitcher.setListText($description, value.description);
          $li.prepend($description);
        }

        $li.data('lstr-qswitcher', {'index': index});
        $container.addClass('lstr-qswitcher-result-container');

        if (value.searchCallback) {
          $li.addClass('lstr-qswitcher-result-category');
        }

        qSwitcher.valueObjects[index] = {
          'index': index,
          'value': value,
          '$li': $li,
        };
      });

      this.$results.html($ul);
      this.usePane(this.$results);

      qSwitcher.selectIndex(0);
      qSwitcher.scrollToSelectedItem();
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(function() {
          qSwitcher.scrollToSelectedItem();
        });
      }
    },

    setError: function(searchId) {
      if (searchId !== this.searchId) {
        return;
      }

      this.usePane(this.$oopsResults);
    },

    renderBreadcrumb: function() {
      if (this.callbackStack.length == 0) {
        this.$domElement.removeClass('lstr-qswitcher-subsearch');
        this.$breadcrumb.html('');
        return;
      }

      var $ul = $('<ul>');

      this.callbackStack.forEach(function(value, index) {
        var $li = $('<li>');
        $li.text(value.text);
        $ul.append($li);
      });

      this.$domElement.addClass('lstr-qswitcher-subsearch');
      this.$breadcrumb.html($ul);
    },

    setListText: function($element, value) {
      if (value.html) {
        $element.html(callbackOrValue(value.html));
        return;
      }

      if (value.text) {
        $element.html(callbackOrValue(value.text));
        return;
      }

      $element.text(value);
    },

    selectIndex: function(selectedIndex) {
      if (this.selectedIndex !== null
        && this.valueObjects[this.selectedIndex]
      ) {
        this.valueObjects[this.selectedIndex]
          .$li.removeClass('lstr-qswitcher-result-selected');
      }

      if (null === selectedIndex || 0 === this.valueObjects.length) {
        this.selectedIndex = null;
        return;
      }

      this.selectedIndex = selectedIndex % this.valueObjects.length;

      if (this.selectedIndex < 0) {
        this.selectedIndex = this.valueObjects.length - 1;
      }

      this.valueObjects[this.selectedIndex]
        .$li.addClass('lstr-qswitcher-result-selected');
    },

    scrollToSelectedItem: function() {
      var $results = this.$results;

      if (!this.selectedIndex) {
        $results.scrollTop(0);
        return;
      }

      var $li = this.valueObjects[this.selectedIndex].$li;

      var topOfLi = $li.offset().top - $li.parent().offset().top;
      var bottomOfLi = topOfLi + $li.outerHeight(true);
      var scrollTop = $results.scrollTop();
      var scrollBottom = scrollTop + $results.outerHeight(true);

      if (bottomOfLi > scrollBottom || topOfLi < scrollTop) {
        $results.scrollTop(topOfLi);
      }
    },

    toggleSwitcher: function() {
      if (this.$parentDom.hasClass('lstr-qswitcher-noscroll')) {
        this.closeSwitcher();
        return;
      }

      return this.openSwitcher();
    },

    openSwitcher: function() {
      this.useRootCallback();
      this.$search.val('');
      this.searchText = '';
      this.renderList();

      this.$parentDom.toggleClass('lstr-qswitcher-noscroll');
      this.$search.focus();
    },

    closeSwitcher: function() {
      this.$parentDom.removeClass('lstr-qswitcher-noscroll');
    },

    triggerSelect: function(index, event) {
      if (null === index) {
        return;
      }

      var selectedValue = this.valueObjects[index].value;
      var selectedResult = Object.create(SelectedResult);
      selectedResult.init(selectedValue, this.searchText, event);

      if (selectedValue.searchCallback) {
        if (false === this.selectChildSearchCallback(selectedResult)) {
          return;
        }

        this.callbackStack.push({
          'text': selectedValue.breadcrumbText,
          'parent': this.options,
        });

        this.options = selectedValue;
        this.searchCallback = selectedValue.searchCallback;
        if (selectedValue.searchDelay) {
          this.searchDelay = selectedValue.searchDelay;
        }
        if (selectedValue.selectCallback) {
          this.selectCallback = selectedValue.selectCallback;
        }
        if (selectedValue.selectChildSearchCallback) {
          this.selectChildSearchCallback
            = selectedValue.selectChildSearchCallback;
        }

        this.valueObjects = [];
        this.selectIndex(null);
        this.$search.val('');
        this.$search.focus();
        this.searchText = '';
        this.renderList();

        return;
      }

      if (false !== this.selectCallback(selectedResult)) {
        this.closeSwitcher();
      }
    },

    popCallback: function() {
      var callbacks = this.callbackStack.pop();
      if (!callbacks) {
        return false;
      }

      this.setOptions(callbacks.parent);

      return true;
    },

    useRootCallback: function() {
      while (this.callbackStack.length > 0) {
        this.popCallback();
      }
    },

    usePane: function($paneToUse) {
      this.$results.hide();
      this.$noSearchTerms.hide();
      this.$noResults.hide();
      this.$oopsResults.hide();
      this.$loading.hide();

      $paneToUse.show();
    },

    setOptions: function(options) {
      this.options = options;

      this.searchCallback = options.searchCallback;
      this.searchDelay = options.searchDelay;
      this.selectCallback = options.selectCallback;
      this.selectChildSearchCallback = options.selectChildSearchCallback;
    },
  };

  var lstrQuickSwitcher = function(options) {
    var $parentDom = $('body');

    var quickSwitcher = Object.create(QuickSwitcher);
    quickSwitcher.init($parentDom, options);

    return {
      open: quickSwitcher.openSwitcher.bind(quickSwitcher),
    };
  };

  return lstrQuickSwitcher;
};

define(
  'quick-switcher',
  ['filters', 'selected-result', 'sorters', 'text!quick-switcher.html'],
  quickSwitcher
);
