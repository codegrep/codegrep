export const toggleCodeView = (value) => {
  return {
    type: 'UPDATE_VIEW',
    view: 'full',
    value
  }
}

const getDefaultState = () => ({
  views: {
    search: true,
    full: true,
  }
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
    default:
      return state;
  }
}
