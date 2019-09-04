import React, {useState, useEffect} from 'react';
import './App.css';

function App() {
  const [lines, addLines] = useState([])
  const [newLine, updateLine] = useState('function eat(food, num) {return `eat ${num} ${food}s`}')
  const [funcMap, addFunction] = useState({})

  useEffect(() => {
    if (Object.keys(funcMap).length === 0) {
      const obj = Object.keys(localStorage).reduce((obj, key) => {
        // eslint-disable-next-line no-eval
        obj[key] = eval(localStorage.getItem(key));
        return obj;
      }, {})
      if (Object.keys(obj).length > 0) {
        addFunction(obj);
      }
    } else {
      Object.keys(funcMap).forEach(key => {
        localStorage.setItem(key, funcMap[key].toString())
      })
    }
  }, [funcMap])

  const types = {
    function: 'function',
    var: 'var',
    class: 'class'
  }

  const regexType = {
    functionCreate: '',
    functionCall: /\s*([a-z0-9]+)\s*\((.*)\)/gi
  }


  const makeFunc = (s) => {
    const parts = s.split(/(function)\s*([a-z0-9]+)\s*\((.*)\)(\t|\r|\s)*\{(.*)\}/)
    const [, type, name, params, , body] = parts;
    // eslint-disable-next-line no-eval
    addFunction({
      [name]: eval(`(${params}) => { ${body} }`),
      ...funcMap
    })
    addLines([...lines, newLine]);
    return parts
  }

  const callFunc = (s) => {
    const parts = s.split(regexType.functionCall);
    const [, name, params, ] = parts;
    if (funcMap[name]) {
      const res = funcMap[name](...params.split(',').map(x => x.trim()).map(x => !!+x ? JSON.parse(x) : x));
      addLines([...lines, newLine])
      addLines([...lines, res])
    }

  }

  const parseCommand = e => {
    e.preventDefault()
    if (newLine.match(/function\s*([a-z0-9]+)\s*\((.*)\)(\t|\r|\s)*\{(.*)\}/gi)) {
      return makeFunc(newLine)
    } else if (newLine.match(regexType.functionCall)) {
      return callFunc(newLine)
    }
    return e
  }
  
  return (
    <div className="App">
      <div className="data">
        {lines.map((line, key) => <div className="line" key={key} >{line}</div>)}
      </div>
      <form onSubmit={e => parseCommand(e)} className="input-container">
        <input value={newLine} onChange={e => updateLine(e.target.value)} className="cli"/>
        <button type="submit" className="enter">ENTER</button>
      </form>
    </div>
  );
}

export default App;
