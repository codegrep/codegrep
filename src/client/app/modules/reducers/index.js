import { combineReducers } from 'redux'
import search from 'reducers/search'
import uiFilters from 'reducers/ui-filters'

const app = combineReducers({
  search,
  uiFilters
})

export default app
