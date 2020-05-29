/* RegEx Blacklist
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
along with this program.  If not, see <http://www.gnu.org/licenses/>. */

'use strict';

let regex_blacklist = [];

function loadBlacklist() {
  browser.storage.local.get("regex_blacklist")
    .then(result => {
      regex_blacklist = [];
      const blacklist = result.regex_blacklist || [];

      for (const entry of blacklist) {
        regex_blacklist.push(new RegExp(entry.regex, entry.flags));
      }

    }, error => {
      console.error(`regex blocker: ${error}`);
    });
}

function checkRequest(requestDetails) {
  for (const regex of regex_blacklist) {
    if (regex.test(requestDetails.url)) {
      console.log(`regex blocker: Canceling '${requestDetails.url}'`);
      return {
        cancel: true
      };
    }
  }
  return {
    cancel: false
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadBlacklist();

  browser.webRequest.onBeforeRequest.addListener(
    checkRequest, {
      urls: ["<all_urls>"]
    }, ["blocking"]
  );
});