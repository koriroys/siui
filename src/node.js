import React from "react";
import { observer } from "mobx-react";

const Node = observer(
  class Node extends React.Component {
    onChange(event, id, type) {
      //       event.preventDefault();
      this.props.whee(id, type, event.target.checked);
    }

    someCallback() {}

    render() {
      var { id, name, type, checked, children, highlight } = this.props.element;
      const labelId = `${type}_${id}`;
      return (
        <li id={"_" + labelId} className={highlight}>
          <input
            id={labelId}
            style={{ cursor: "pointer" }}
            checked={checked}
            type="checkbox"
            onChange={event => this.onChange(event, id, type)}
          />
          <label htmlFor={labelId} style={{ cursor: "pointer" }}>
            ID: {id}, name: {name}, type: {type}
          </label>
          <ul>
            {children &&
              children.map(e => <Node element={e} whee={this.props.whee} />)}
          </ul>
        </li>
      );
    }
  }
);

export default Node;
