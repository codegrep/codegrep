export const toggleCodeView = (value) => {
  return {
    type: 'UPDATE_VIEW',
    view: 'full',
    line: 1,
    value
  }
};

export const updateFileUrl = (fileUrl, line) => {
  if (fileUrl) {
    window.history.pushState('', '', '#/' + fileUrl + '//' + line);
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
  line: null
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
    default:
      return state;
  }
}
