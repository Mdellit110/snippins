const regexType = {
  functionCreate: /function\s*([a-z0-9]+)\s*\((.*)\)(\t|\r|\s)*\{(.*)\}/gi,
  functionCall: /\s*([a-z0-9]+)\s*\((.*)\)/gi
};

const makeFunc = s => {
  const parts = s.split(
    /(function)\s*([a-z0-9]+)\s*\((.*)\)(\t|\r|\s)*\{(.*)\}/
  );
  const [, type, name, params, , body] = parts;
  // eslint-disable-next-line no-eval
  addFunction({
    [name]: eval(`(${params}) => { ${body} }`),
    ...funcMap
  });
  addLines([...lines, newLine]);
  return parts;
};

const callFunc = s => {
  const parts = s.split(regexType.functionCall);
  const [, name, params] = parts;
  debugger;
  if (funcMap[name]) {
    const res = funcMap[name](
      ...params
        .split(",")
        .map(x => x.trim())
        .map(x => (!!+x ? JSON.parse(x) : x))
    );
    addLines([...lines, newLine]);
    addLines([...lines, res]);
  }
};

export { callFunc, makeFunc };
