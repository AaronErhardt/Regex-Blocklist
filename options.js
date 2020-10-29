﻿/* RegEx Blocklist
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

// document should be loaded when the script is executed
const black_list = document.querySelector("#blacklist");
const add_regex_button = document.querySelector("#add-regex");
const regex_test = document.querySelector("#regex-test");

// load settings on page load
loadListEntries();

add_regex_button.addEventListener("click", createEmptyListEntry);
regex_test.addEventListener("input", testRegexList);

// UPDATE functions

// update data of background.js
function reloadExtensionData() {
  browser.runtime.getBackgroundPage().then(page => {
    page.loadBlacklist();
  }, error => console.error(`RegEx blocker: ${error}`));
}

function storeListEntries() {
  const storage = [];

  for (const child of blacklist.children) {
    // check whether first input (the RegEx) is empty
    if (child.firstChild.value !== "") {
      storage.push({
        regex: child.firstChild.value,
        flags: child.lastChild.value,
      });
    }
  }

  browser.storage.sync.set({
    regex_blacklist: storage
  });
}

function testRegexList() {
  if (regex_test.value === "") {
    // remove colors -> no test url
    blacklist.querySelectorAll(".match").forEach(elem => elem.classList.remove("match"))
    blacklist.querySelectorAll(".no-match").forEach(elem => elem.classList.remove("no-match"));
  } else {
    // match every entry of the blacklist against a RegEx
    for (const node of blacklist.children) {
      const regex = new RegExp(node.firstChild.value, node.lastChild.value);
      if (regex.test(regex_test.value)) {
        node.firstChild.classList.add("match");
        node.lastChild.classList.add("match");
        node.firstChild.classList.remove("no-match");
        node.lastChild.classList.remove("no-match");
      } else {
        node.firstChild.classList.remove("match");
        node.lastChild.classList.remove("match");
        node.firstChild.classList.add("no-match");
        node.lastChild.classList.add("no-match");
      }
    }
  }
}

function updateList() {
  // remove every empty entry except the last one
  for (const node of blacklist.children) {
    if (node.firstChild.value === "" && node.lastChild.value === "" && node !== blacklist.lastChild) {
      blacklist.removeChild(node);
    }
  }

  // only the last entry can be empty
  // if the last entry is empty we don't need new empty entries so mark the button as inactive
  if (blacklist.firstChild.value === "" && blacklist.lastChild.value === "") {
    add_regex_button.classList.add("inactive");
  } else {
    add_regex_button.classList.remove("inactive");
  }

  storeListEntries();
  testRegexList();
  reloadExtensionData();
}


// DOM manipulation functions

function addListEntry(regex, flags) {

  const entry = document.createElement("DIV");
  entry.classList.add("flex-horizontal");

  const input1 = document.createElement("INPUT");
  const input2 = document.createElement("INPUT");

  input1.type = input2.type = "text";

  input1.classList.add("regex");
  input2.classList.add("regexFlags");

  input1.placeholder = "New Regular Expression";
  input2.placeholder = "Flags";

  input1.size = "30";
  input2.size = "3";

  if (regex)
    input1.value = regex;
  if (flags)
    input2.value = flags;

  input1.addEventListener("input", updateList);
  input2.addEventListener("input", updateList);

  entry.appendChild(input1);
  entry.appendChild(input2);

  black_list.appendChild(entry);
}

function listContainsEmptyEntry() {
  for (let child of blacklist.children) {
    if (child.firstChild.value === "") {
      return true;
    }
  }
  return false;
}

function createEmptyListEntry() {
  if (!listContainsEmptyEntry()) {
    addListEntry();
    add_regex_button.classList.add("inactive");
  }
}

function clearList() {
  for (const node of blacklist.children) {
    blacklist.removeChild(node);
  }
}


// Loading the settings

function loadListEntries() {
  clearList();

  browser.storage.sync.get("regex_blacklist")
    .then(result => {
      const storage = result.regex_blacklist || [];

      for (let item of storage) {
        addListEntry(item.regex, item.flags);
      }
    }, err => console.error(err));
}