# Change Log

## v0.3.0

Backwards breaking changes and steps for migrating to v0.3.0:
 - Make tracking recently used selections as easy as setting a config value
     1. Add `trackChildrenAs` property to root element or parent search item
     2. Remove calls to `tracker().sort()` and `selected.trackAs()`—these calls are now handled automatically
 - Switch style sheets source to use SCSS and add CSS dist file to build process
     1. Copy the CSS file from quick-switcher.tar.gz instead of referencing the `src` (also, keep in mind that the committed `dist` directory may go away soon)
 - Remove unused `isFuzzyMatch` function
     1. Rely on your own fuzzy-match method instead :) Feel free to copy `isFuzzyMatch` logic from the quick-switcher git history

Other changes:
 - Add distribution tarball with compiled JS & CSS assets to GitHub releases
 - Use `yarn` to lock dependency versions

## v0.2.0

 - Fix selected item's lack of highlight
 - Reset scroll to 0 when changing search callbacks
 - Re-focus search input after changing search callbacks
 - Make quick-switcher mobile friendly
 - Make it possible to manually trigger the opening of the quick switcher
 - Allow statically sorted items, bypassing tracker
 - Rename result description CSS class

## v0.1.0

 - Limit hotkey to be platform-specific (Cmd only on Mac, Ctrl on other platforms)
 - Add ability to track selection frequency of items
 - Add callback for selection of child-search items
 - Use almond to load dependencies and minify
 - Rename `subtext` to `description`
   - `description` is now treated as text by default
   - Use an object with an `html` property as the `description` value to treat
     the description as HTML
 - Fix undefined index during result processing
 - Use .text and .html as functions when relevant
 - Fix flash of "No results found" message
 - Move all callbacks to settings object
