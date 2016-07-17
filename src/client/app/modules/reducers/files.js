export const toggleCodeView = (value) => {
  return {
    type: 'UPDATE_VIEW',
    view: 'full',
    value
  }
}

export const updateFileUrl = (fileUrl) => {
  return {
    type: 'CLEAR_CACHE',
    fileUrl,
  }
}

const getDefaultState = () => ({})

export default (state, action) => {
  if (!state) {
    state = getDefaultState();
  }
  switch(action.type) {
    case 'CLEAR_CACHE':
      return getDefaultState();
    case 'CACHE_FILE':
      return {
        ...state,
        [action.filePath]: action.content
      }
    default:
      return state;
  }
}
