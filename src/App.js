import React, { useState, useEffect } from "react";
import "./App.css";
import { regexType, callFunc, makeFunc, assignVar, getVar } from "./functions/parsedCommands";

function App() {
  const [lines, addLines] = useState([]);
  const [newLine, updateLine] = useState("");
  const [funcMap, addFunction] = useState({});
  const [varMap, addVar] = useState({});

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

  const parseCommand = e => {
    e.preventDefault();
    if (newLine.match(regexType.functionCreate)) {
      const parts = makeFunc(newLine);
      addFunction({
        // eslint-disable-next-line no-eval
        [parts.name]: eval(`(${parts.params}) => { ${parts.body} }`),
        ...funcMap
      });
      addLines([...lines, newLine]);
    } else if (newLine.match(regexType.functionCall)) {
      const res = callFunc(newLine, funcMap, varMap);
      addLines([...lines, newLine, `> ${res}`]);
    } else if (newLine.match(regexType.help)) {
      addLines([...lines, newLine, `> enter this fool:`, `>> help function - for list of functions`, `>> help var - for list of vars`  ]);   
    } else if (newLine.match(regexType.helpFunc)) {
      addLines([...lines, newLine, `> functions`]);   
    } else if (newLine.match(regexType.helpVar)) {
      addLines([...lines, newLine, `> vars`]);     
    } else if (newLine.match(regexType.assignVar)) {
      const res = assignVar(newLine, varMap);
      addVar({...varMap, [res.name]: res.value})
      addLines([...lines, newLine, `> ${res.value}`]);
    } else if (newLine.match(regexType.getVar)) {
      const res = getVar(newLine, varMap);
      addLines([...lines, newLine, `> ${res}`]);
    }
      updateLine('');
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
