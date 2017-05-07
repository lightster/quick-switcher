# quick-switcher

[![Build Status](https://travis-ci.org/lightster/quick-switcher.svg?branch=master)](https://travis-ci.org/lightster/quick-switcher)
[![Code Climate](https://lima.codeclimate.com/github/lightster/quick-switcher/badges/gpa.svg)](https://lima.codeclimate.com/github/lightster/quick-switcher)

Front-end web component for navigating and searching

[Check out the docs for a demo.](https://lightster.github.io/quick-switcher/)

## Development Environment

1. Ensure [Node.js](https://nodejs.org) is installed
2. Install quick-switcher dependencies

  ```bash
  npm install
  ```

## Todo

Document:

- [ ] Basic initialization
  - [ ] `searchCallback`
  - [ ] `selectCallback`
- [ ] Basic options
  - [ ] `hotKey`
  - [ ] `searchDelay`
- [ ] Subsearches
  - [ ] Defining items as subsearches
  - [ ] `selectChildSearchCallback`—performing an action when an item is selected that is a subsearch
- [ ] Tracker usage
  - [ ] What is the purpose of a tracker?
  - [ ] How is tracking enabled?
  - [ ] How can the tracker be overridden so that items can be pinned to the top/bottom of the list?
- [ ] Sorters?
  - These may go away, especially if the tracker is revamped to handle sorting automatically
- [ ] Filters?
  - Right now only one of these is really useable
