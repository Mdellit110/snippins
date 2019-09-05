const defaultLineState = {
    lines: [],
    idxOffset: 0,
    value: ''
  }
  
  Object.defineProperty(defaultLineState, 'currIdx', {
    get: function () {
      return defaultLineState.lines.length - 1 - defaultLineState.idxOffset; 
    }
  });
  
  Object.defineProperty(defaultLineState, 'currLine', {
    get: function () {
      return defaultLineState.lines[defaultLineState.currIdx]; 
    }
  });
  
  const lineStateReducer = (state, action) => {
    switch (action.type) {
      case 'addLine':
        return {
          lines: [...state.lines, ...action.payload],
          idxOffset: 0,
          value: ''
        };
      case 'updateLine': 
        return {
          lines: [...state.lines], //, ...action.payload],
          idxOffset: 0,
          value: action.payload
        }
      default:
        return state;
    }
  }

  export { defaultLineState, lineStateReducer }