export const toggleCodeView = (value) => {
  return {
    type: 'UPDATE_VIEW',
    view: 'full',
    value
  }
};

export const toggleSearchView = (value) => {
  return {
    type: 'UPDATE_VIEW',
    view: 'search',
    value
  }
};

export const setLastUpdate = (time) => {
  return {
    type: 'SET_LAST_UPDATE',
    time
  }
};

export const updateFileUrl = (fileUrl, line) => {
  if (fileUrl) {
    if (typeof(line) === 'number' && line > 0) {
      window.history.pushState('', '', '#/' + fileUrl + '//' + line);
    } else {
      window.history.pushState('', '', '#/' + fileUrl);
    }
  } else {
    window.history.pushState('', '', '#/');
  }
  return {
    type: 'UPDATE_FILE_URL',
    fileUrl,
    line
  }
};

const getDefaultState = () => ({
  views: {
    search: true,
    full: false,
  },
  fileUrl: null,
  line: null,
  lastUpdate: null
})

export default (state, action) => {
  if (!state) {
    state = getDefaultState();
  }
  switch(action.type) {
    case 'RESET_STATE':
      return getDefaultState();
    case 'UPDATE_VIEW':
      return {
        ...state,
        views: {
          ...state.views,
          [action.view]: action.value
        }
      }
    case 'UPDATE_FILE_URL':
      return {
        ...state,
        fileUrl: action.fileUrl,
        line: action.line
      }
    case 'SET_LAST_UPDATE':
      return {
        ...state,
        lastUpdate: action.time
      }
    default:
      return state;
  }
}
