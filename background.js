/* RegEx Blocklist
Copyright (C) 2020 Aaron Erhardt

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>. */

'use strict';

// I would like to fix the naming
// but renaming breaks the code and also 
// deletes configurations on update...
let regex_blacklist = [];
let regex_allowlist = [];

function loadBlacklist() {
  browser.storage.sync.get("regex_blacklist")
    .then(result => {
      regex_blacklist = [];
      const blacklist = result.regex_blacklist || [];

      // Push new RegEx entries into the blacklist
      for (const entry of blacklist) {
        regex_blacklist.push(new RegExp(entry.regex, entry.flags));
      }

    }, error => {
      console.error(`RegEx blocker: ${error}`);
    });
    
  browser.storage.sync.get("regex_allowlist")
    .then(result => {
      regex_allowlist = [];
      const allowlist = result.regex_allowlist || [];

      // Push new RegEx entries into the allowlist
      for (const entry of allowlist) {
        regex_allowlist.push(new RegExp(entry.regex, entry.flags));
      }

    }, error => {
      console.error(`RegEx blocker: ${error}`);
    });
}

function checkRequest(requestDetails) {
  // Testing the url against every blacklist entry
  for (const block_regex of regex_blacklist) {
    if (block_regex.test(requestDetails.url)) {

      for (const allow_regex of regex_allowlist) {
        if (allow_regex.test(requestDetails.url)) {
          console.log(`RegEx blocker: Allowed '${requestDetails.url}'`);
          return {
            cancel: false
          };
        }
      }

      return {
        cancel: true
      };
      console.log(`RegEx blocker: Canceled '${requestDetails.url}'`);
    }
  }

  return {
    cancel: false
  };
}

document.addEventListener("DOMContentLoaded", () => {
  loadBlacklist();

  browser.webRequest.onBeforeRequest.addListener(
    checkRequest, {
      urls: ["<all_urls>"]
    }, ["blocking"]
  );
});