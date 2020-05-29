﻿/* RegEx Blacklist
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

// document should be loaded when the script is executed
const black_list = document.querySelector("#blacklist");
const add_regex_button = document.querySelector("#add-regex");
const regex_test = document.querySelector("#regex-test");

add_regex_button.addEventListener("click", createEmptyListEntry);
regex_test.addEventListener("input", testRegexList);

function createEmptyListEntry() {
  if (!listContainsEmptyEntry()) {
    addListEntry();
    add_regex_button.classList.add("inactive");
  }
}

function reloadExtensionData(){
  browser.runtime.getBackgroundPage().then(page => {
    page.loadBlacklist();            
  }, err => console.error(err));
}

function addListEntry(regex, flags) {

  const entry = document.createElement("DIV");
  entry.classList.add("flex-horizontal");

  const input1 = document.createElement("INPUT");
  const input2 = document.createElement("INPUT");

  input1.type = input2.type = "text";

  input1.classList.add("regex");
  input2.classList.add("regexFlags");

  input1.placeholder = "New Regular Expression";
  input2.placeholder = "RegEx Flags";

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

function storeListEntries() {
  console.log("Storing entries");

  const storage = [];

  for (let child of blacklist.children) {
    if (child.firstChild && child.firstChild.value !== "") {
      storage.push({
        regex: child.firstChild.value,
        flags: child.lastChild.value,
      });
    }
  }

  browser.storage.local.set({
    regex_blacklist: storage
  });
}

function clearList() {
  for (const node of blacklist.children) {
    blacklist.removeChild(node);
  }
}

function loadListEntries() {
  console.log("Loading entries");

  clearList();

  browser.storage.local.get("regex_blacklist")
    .then(result => {
      const storage = result.regex_blacklist || [];

      for (let item of storage) {
        addListEntry(item.regex, item.flags);
      }
    }, err => console.error(err));
}

function updateList() {
  for (const node of blacklist.children) {
    if (node.firstChild.value === "") {
      if (node !== blacklist.lastChild) {
        blacklist.removeChild(node);
      }
    }
  }

  storeListEntries();
  testRegexList();
  reloadExtensionData();

  if (listContainsEmptyEntry()) {
    add_regex_button.classList.add("inactive");
  } else {
    add_regex_button.classList.remove("inactive");
  }
}

function testRegexList() {
  if (regex_test.value === "") {
    const matches = blacklist.querySelectorAll(".match");
    const no_matches = blacklist.querySelectorAll(".no-match");

    for (const match of matches) {
      match.classList.remove("match");
    }
    for (const no_match of no_matches) {
      no_match.classList.remove("no-match");
    }

  } else {
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

loadListEntries();