---
layout: base
---

<div class="jumbotron">
  <h2>Try it out</h2>
  <div class="row">
    <div class="col-md-12">
      <!-- <h3>Modal</h3> -->
      <p class="">
        Type <code class="qs-hotkey">Cmd+K / Ctrl+K</code> to bring up a demo of the quick switcher.
      </p>

      <button class="open-qswitcher btn btn-primary">Open Quick Switcher</button>
    </div>
  </div>
</div>

## Simple Usage

```html
<script type="text/javascript">
  var qs = lstrQuickSwitcher({
    searchCallback: function(searchText, resultHandler) {
      var options = [
        'Zach',
        'Stacy',
        'Matt',
        'Lightster',
        'Baxter',
      ];
      var filteredOptions = options.filter(function(item) {
        return resultHandler.filters.isMatch(searchText, item);
      });

      resultHandler.setResults(filteredOptions);
    },
    selectCallback: function(selected) {
      console.log(selected.selectedValue);
    },
    hotKey: null
  });

  $('#example-simple').on('click', qs.open.bind(simpleQs));
</script>

<button class="btn btn-outline-primary" id="example-simple">Open Quick Switcher</button>
```

<button class="btn btn-outline-primary" id="example-simple">Open Quick Switcher</button>
