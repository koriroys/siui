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
      type: "Module",
      name: "Module 2",
    },
    {
      id: 3,
      type: "Module",
      name: "Module 3",
    },
  ],
});

let currentlyChecked = observable([]);

const recursive = (element, id, type, doCheck, uncheckAll, list) => {
  if (uncheckAll) {
    element.checked = false;
    (element.children || []).forEach(child =>
      recursive(child, id, type, doCheck, uncheckAll, list)
    );
    return true;
  }

  if (element.id === id && element.type === type) {
    if (doCheck) {
      list.push(`${element.type}_${element.id}`);
      recursive(element, id, type, doCheck, true, list);
    }
    element.checked = doCheck;
    return true;
  }

  let isParent = (element.children || []).reduce(
    (isParent, child) =>
      recursive(child, id, type, doCheck, uncheckAll, list) || isParent,
    false
  );

  if (isParent) {
    element.checked = false;
    return true;
  }

  if (element.checked) list.push(`${element.type}_${element.id}`);

  return false;
};

var toggleOnTheOne = (id, type, checked) => {
  while (currentlyChecked.length) currentlyChecked.pop();
  recursive(hierarchy, id, type, checked, false, currentlyChecked);
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
