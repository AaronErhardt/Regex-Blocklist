# Regex Blacklist

Regex Blacklist allows you to easily block urls using RegEx. 

# Change Blacklist settings

To add new entries to the blacklist or to change entries, go to the Firefox Add-ons page (or use `Ctrl+Shift+A`) and select this Add-on. Then open the "Preferences" tab.

## Add new entries

To add a new entry to the blacklist click on "Add new Regex". Two new input field will appear. The first input field stores the actual Regular Expression, the second one stores additional flags such as `i` for enabling case-insensitivity.

## Edit entries

Each entry can be edited by simply clicking on the text fields and entering a Regular Expression. While editing **the blacklist will be automatically updated**, there's no need to save changes.

## Validate expressions

To check whether your blacklist actually blocks an url you can enter a test url into the text field at the bottom. All matching entries of the Blacklist will be marked green, all entries that don't match the url will be marked red. The colors will be updated automatically, even as you change entries of the blacklist.

# Build

To test this Add-on you just need to install web-ext and run `web-ext run` from your shell. To build run `web-ext build`. More information: [https://github.com/mozilla/web-ext](https://github.com/mozilla/web-ext)