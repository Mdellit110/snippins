import React, { useState, useEffect } from "react";
import "./App.css";
import { callFunc, makeFunc } from "./functions/parsedCommands";

function App() {
  const [lines, addLines] = useState([]);
  const [newLine, updateLine] = useState("");
  const [funcMap, addFunction] = useState({});

  useEffect(() => {
    if (Object.keys(funcMap).length === 0) {
      const obj = Object.keys(localStorage).reduce((obj, key) => {
        // eslint-disable-next-line no-eval
        obj[key] = eval(localStorage.getItem(key));
        return obj;
      }, {});
      if (Object.keys(obj).length > 0) {
        addFunction(obj);
      }
    } else {
      Object.keys(funcMap).forEach(key => {
        localStorage.setItem(key, funcMap[key].toString());
      });
    }
  }, [funcMap]);

  const types = {
    function: "function",
    var: "var",
    class: "class"
  };

  const regexType = {
    functionCreate: /function\s*([a-z0-9]+)\s*\((.*)\)(\t|\r|\s)*\{(.*)\}/gi,
    functionCall: /\s*([a-z0-9]+)\s*\((.*)\)/gi
  };

  const parseCommand = e => {
    e.preventDefault();
    if (newLine.match(regexType.functionCreate)) {
      return makeFunc(newLine);
    } else if (newLine.match(regexType.functionCall)) {
      return callFunc(newLine);
    }
    return e;
  };

  return (
    <div className="App">
      <div className="data">
        {lines.map((line, key) => (
          <div className="line" key={key}>
            {line}
          </div>
        ))}
      </div>
      <form onSubmit={e => parseCommand(e)} className="input-container">
        <input
          value={newLine}
          onChange={e => updateLine(e.target.value)}
          className="cli"
        />
        <button type="submit" className="enter">
          ENTER
        </button>
      </form>
    </div>
  );
}

export default App;
