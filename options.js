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
const allow_list = document.querySelector("#allowlist");

const add_regex_blocker = document.querySelector("#add-blocker");
const add_regex_allower = document.querySelector("#add-allower");

const regex_test = document.querySelector("#regex-test");

// load settings on page load
loadListEntries();

add_regex_blocker.addEventListener("click", createEmptyListEntry);
add_regex_allower.addEventListener("click", createEmptyListEntry);
regex_test.addEventListener("input", testAllLists);

// UPDATE functions

// update data of background.js
function reloadExtensionData() {
  browser.runtime.getBackgroundPage().then(page => {
    page.loadBlacklist();
  }, error => console.error(`RegEx blocker: ${error}`));
}

function storeListEntries() {
  const blocker = [];
  const allower = [];

  for (const child of blacklist.children) {
    // check whether first input (the RegEx) is empty
    if (child.firstChild.value !== "") {
      blocker.push({
        regex: child.firstChild.value,
        flags: child.lastChild.value,
      });
    }
  }

  for (const child of allowlist.children) {
    // check whether first input (the RegEx) is empty
    if (child.firstChild.value !== "") {
      allower.push({
        regex: child.firstChild.value,
        flags: child.lastChild.value,
      });
    }
  }

  browser.storage.sync.set({
    regex_blacklist: blocker,
    regex_allowlist: allower
  });
}


function testAllLists() {
  testList(black_list);
  testList(allow_list);
}

function testList(list) {
  if (regex_test.value === "") {
    // remove colors -> no test url
    list.querySelectorAll(".match").forEach(elem => elem.classList.remove("match"))
    list.querySelectorAll(".no-match").forEach(elem => elem.classList.remove("no-match"));
  } else {
    // match every entry of the blacklist against a RegEx
    for (const node of list.children) {
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

function updateList(list, button) {
  // remove every empty entry except the last one
  for (const node of list.children) {
    if (node.firstChild.value === "" && node.lastChild.value === "" && node !== list.lastChild) {
      list.removeChild(node);
    }
  }

  // only the last entry can be empty
  // if the last entry is empty we don't need new empty entries so mark the button as inactive
  if (listContainsEmptyEntry(list)) {
    button.classList.add("inactive");
  } else {
    button.classList.remove("inactive");
  }
}

function updateAllLists() {
  updateList(black_list, add_regex_blocker);
  updateList(allow_list, add_regex_allower);

  storeListEntries();
  testAllLists();
  reloadExtensionData();
}


// DOM manipulation functions

function addListEntry(list, regex = "", flags = "") {

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

  input1.addEventListener("input", updateAllLists);
  input2.addEventListener("input", updateAllLists);

  entry.appendChild(input1);
  entry.appendChild(input2);

  list.appendChild(entry);
}

function listContainsEmptyEntry(list) {
  for (let child of list.children) {
    if (child.firstChild.value === "" && child.lastChild.value === "") {
      return true;
    }
  }
  return false;
}

function createEmptyListEntry(ev) {
  let list;
  let button;

  if (ev.currentTarget.id === "add-blocker") {
    list = black_list;
    button = add_regex_blocker;
  } else {
    list = allow_list;
    button = add_regex_allower;
  }

  if (!listContainsEmptyEntry(list)) {
    addListEntry(list);
    button.classList.add("inactive");
  }
}

function clearList(list) {
  for (const node of list.children) {
    list.removeChild(node);
  }
}


// Loading the settings

function loadListEntries() {
  clearList(black_list);
  clearList(allow_list);

  browser.storage.sync.get("regex_blacklist")
    .then(result => {
      const storage = result.regex_blacklist || [];

      for (let item of storage) {
        addListEntry(black_list, item.regex, item.flags);
      }
    }, err => console.error(err));
  
  browser.storage.sync.get("regex_allowlist")
    .then(result => {
      const storage = result.regex_allowlist || [];

      for (let item of storage) {
        addListEntry(allow_list, item.regex, item.flags);
      }
    }, err => console.error(err));
}