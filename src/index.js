import React from "react";
import ReactDOM from "react-dom";
import { action, observable, computed } from "mobx";
import { observer } from "mobx-react";
import _ from "lodash";

import Node from "./node";

import "./styles.css";

let hierarchy = observable({
  id: 1,
  type: "Regulator",
  name: "SEC",
  checked: true,
  children: [
    {
      id: 1,
      type: "AscentModule",
      name: "Module 1",
      children: [
        {
          id: 1,
          type: "Subject",
          name: "Subject 1",
          children: [
            {
              id: 1,
              type: "Rule",
              name: "Rule 1",
              children: [
                {
                  id: 1,
                  type: "Requirement",
                  name: "Requirement 1",
                },
                {
                  id: 2,
                  type: "Requirement",
                  name: "Requirement 2",
                },
              ],
            },
            {
              id: 2,
              type: "Rule",
              name: "Rule 2",
            },
          ],
        },
        {
          id: 2,
          type: "Subject",
          name: "Subject 2",
        },
      ],
    },
    {
      id: 2,
      type: "AscentModule",
      name: "Module 2",
    },
    {
      id: 3,
      type: "AscentModule",
      name: "Module 3",
    },
  ],
});

let currentlyChecked = observable([]);

// iterate until you find the one you want, then you toggle yourself and call a
// separate simpler function to flip off your subtree, and then  return true to
// say you found it. If one of your children returns true, that means you're an
// ancestor, so you flip off and return true (don't need to finish traversing,
// you've found the one you're looking for). If none return true, you return false,
// saying you're not an ancestor. That sets the tree correctly, then it's a separate
// much simpler function to scan that new tree for which ones are checked.

const recursive = (element, id, type, doCheck, uncheckAll) => {
  if (element.id === id && element.type === type) {
    if (doCheck) {
      uncheckSubtree(element, id, type, doCheck);
    }
    element.checked = doCheck;
    return true;
  }

  let isParent = (element.children || []).reduce(
    (isParent, child) =>
      recursive(child, id, type, doCheck, uncheckAll) || isParent,
    false
  );

  if (isParent) {
    element.checked = false;
    return true;
  }

  return false;
};

const uncheckSubtree = element => {
  element.checked = false;
  (element.children || []).forEach(child => uncheckSubtree(child));
};

var collectCurrentlyChecked = (element, currentlyChecked) => {
  if (element.checked) {
    currentlyChecked.push(`${element.type}_${element.id}`);
  }
  (element.children || []).forEach(child =>
    collectCurrentlyChecked(child, currentlyChecked)
  );
};

var toggleOnTheOne = (id, type, checked) => {
  recursive(hierarchy, id, type, checked, false);
  while (currentlyChecked.length) currentlyChecked.pop();
  collectCurrentlyChecked(hierarchy, currentlyChecked);
};

let App = observer(function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <ul>
        <Node
          element={hierarchy}
          onClick={() => toggleOnTheOne(hierarchy.id, hierarchy.type)}
          whee={toggleOnTheOne}
        />
      </ul>
      <ul>{currentlyChecked.map(name => <li>{name}</li>)}</ul>
    </div>
  );
});

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
