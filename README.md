# Regex Blocklist

Regex Blocklist allows you to easily block urls using RegEx. This blocklist will not only stop pages from loading, but also images, scripts, style sheets, fonts and more.

# Advantages over similar Add-ons

* 100% open source
* Support for RegEx flags (e.g. for case-insensitivity)
* Easily test your blocklist against urls in the settings
* High performance and low RAM usage
* Automatic dark mode

[![**Get the Add-on**](https://extensionworkshop.com/assets/7a17e6-5cc43798bf2472557d8b437e779316758d0e41483542e921f6781694623ee71c.png "Get the Add-on")](https://addons.mozilla.org/en-US/firefox/addon/regex-blocklist/)

# Change Blocklist settings

To add new entries to the blocklist or to change entries, go to the Firefox Add-ons page (or use `Ctrl+Shift+A`) and select this Add-on. Then open the "Preferences" tab.

## Add new entries

To add a new entry to the blocklist click on "Add new Regex". Two new input field will appear. The first input field stores the actual Regular Expression, the second one stores additional flags such as `i` for enabling case-insensitivity.

## Edit entries

Each entry can be edited by simply clicking on the text fields and entering a Regular Expression. While editing **the blacklist will be automatically updated**, there's no need to save changes.

## Validate expressions

To check whether your blocklist actually blocks an url you can enter a test url into the text field at the bottom. All matching entries of the blocklist will be marked green, all entries that don't match the url will be marked red. The colors will be updated automatically, even as you change entries of the blocklist.

# Build

To test this Add-on you just need to install web-ext and run `web-ext run` from your shell. To build run `web-ext build`. More information: [https://github.com/mozilla/web-ext](https://github.com/mozilla/web-ext)