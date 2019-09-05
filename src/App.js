import React, { useState, useEffect, useReducer } from "react";
import "./App.css";
import { regexType, callFunc, makeFunc, assignVar, getVar } from "./functions/parsedCommands";
import { defaultLineState, lineStateReducer } from "./reducers/lines";



function App() {
  const [lineState, lineDispatch] = useReducer(
    lineStateReducer,
    defaultLineState
  )

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

  const parseCommand = e => {
    e.preventDefault();
    if (lineState.value.match(regexType.functionCreate)) {
      // if (newLine.match(regexType.functionCreate)) {
      const parts = makeFunc(lineState.value);
      addFunction({
        ...funcMap,
        // eslint-disable-next-line no-eval
        [parts.name]: eval(`(${parts.params}) => { ${parts.body} }`),
      });

      lineDispatch({type: 'addLine', payload: [lineState.value]})
    } 
    else if (lineState.value.match(regexType.functionCall)) {
      const res = callFunc(lineState.value, funcMap, varMap);
      lineDispatch({type: 'addLine', payload: [lineState.value, `> ${res}`]});
    } 
    else if (lineState.value.match(regexType.help)) {
      lineDispatch({type: 'addLine', payload: [lineState.value, `> enter this fool:`, `>> help function - for list of functions`, `>> help var - for list of vars`]});
    } 
    else if (lineState.value.match(regexType.helpFunc)) {
      lineDispatch({type: 'addLine', payload: [lineState.value, `> functions`]});
    } 
    else if (lineState.value.match(regexType.helpVar)) {
      lineDispatch({type: 'addLine', payload: [lineState.value, `> vars`]});
    } 
    else if (lineState.value.match(regexType.assignVar)) {
      const res = assignVar(lineState.value, varMap);
      addVar({ ...varMap, [res.name]: res.value })
      lineDispatch([lineState.value, `> ${res.value}`]);
    } 
    else if ({type: 'addLine', payload: lineState.value.match(regexType.getVar)}) {
      const res = getVar(lineState.value, varMap);
      lineDispatch({type: 'addLine', payload: [lineState.value, `> ${res}`]});
    }
    lineDispatch({type: 'updateLine', payload: ''});
    return e;
  };

  return (
    <div className="App">
      <div className="data">
        {lineState.lines.map((line, key) => (
          <div className="line" key={key}>
            {line}
          </div>
        ))}
      </div>
      <form onSubmit={e => parseCommand(e)} className="input-container">
        <input
          value={lineState.value}
          onChange={e => lineDispatch({type: 'updateLine', payload: e.target.value})}
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
