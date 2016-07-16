import { combineReducers } from 'redux'
import search from 'reducers/search'
import uiFilters from 'reducers/ui-filters'

const todoApp = combineReducers({
  search,
  uiFilters
})

export default todoApp
