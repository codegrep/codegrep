export const updateSearchString = (searchString) => {
  return {
    type: 'UPDATE_SEARCH_FORM',
    form: {searchString}
  }
}

export const updateSearchStringRegEx = (searchStringRegEx) => {
  return {
    type: 'UPDATE_SEARCH_FORM',
    form: {searchStringRegEx}
  }
}

export const updateSearchStringCaseSensitive = (searchStringCaseSensitive) => {
  return {
    type: 'UPDATE_SEARCH_FORM',
    form: {searchStringCaseSensitive}
  }
}

export const updateLocation = (location) => {
  return {
    type: 'UPDATE_SEARCH_FORM',
    form: {location}
  }
}

export const updateResults = (results) => {
  return {
    type: 'UPDATE_RESULTS',
    results
  }
}

const getDefaultState = () => ({
  results: [],
  form: {
    searchString: '',
    searchStringRegEx: false,
    searchStringCaseSensitive: false,
    location: ''
  }
})

export default (state, action) => {
  if (!state) {
    state = getDefaultState();
  }
  switch(action.type) {
    case 'RESET_STATE':
      return getDefaultState();
    case 'UPDATE_RESULTS':
      return {
        ...state,
        results: action.results
      }
    case 'UPDATE_SEARCH_FORM':
      return {
        ...state,
        form: {
          ...state.form,
          ...action.form,
        }
      }
    default:
      return state;
  }
}
