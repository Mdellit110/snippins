const regexType = {
  functionCreate: /function\s*([a-z0-9]+)\s*\((.*)\)(\t|\r|\s)*\{(.*)\}/gi,
  functionCall: /\s*([a-z0-9]+)\s*\((.*)\)/gi,
  assignVar: /\s*([a-z0-9]+)\s*=\s*([a-z0-9]+)/gi,
  getVar: /\s*([a-z0-9]+)\s*/gi,
  help: /^help*$/gi,
  helpFunc: /^\s*(help function+)/gi,  
  helpVar: /^\s*(help var+)/gi
};

const makeFunc = s => {
  const parts = s.split(
    /(function)\s*([a-z0-9]+)\s*\((.*)\)(\t|\r|\s)*\{(.*)\}/
  );
  const [, type, name, params, , body] = parts;
  return {
    type: type,
    name: name,
    params: params,
    body: body
  }
};

const callFunc = (s, funcMap, varMap) => {
  const parts = s.split(regexType.functionCall);
  const [, name, params] = parts;
  debugger;
  const p = params
    .split(",")
    .map(x => x.trim())
    .map(x => (!!+x ? JSON.parse(x) : x))
    .map(x => varMap[x] || x)
  debugger;
  if (funcMap[name]) {
    return funcMap[name](
      ...p
    );
  }
  return '<command not found>';
};

const assignVar = (s, varMap) => {
  debugger;
  const parts = s.split(regexType.assignVar);
  const [, name, value, ] = parts;
  const v = value.trim();
  varMap[name] = (!!+v ? JSON.parse(v) : v)
  return {
    name: name,
    value: varMap[name]
  }
}

const getVar = (s, varMap) => {
  return varMap[s.trim()];
}

export {
  regexType,
  callFunc,
  makeFunc,
  assignVar,
  getVar
};
