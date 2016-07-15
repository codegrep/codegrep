import { createSelector } from 'reselect'

export const resultsFromLocationSelector = createSelector([
  (state) => state.results,
  (state) => state.form.location.toLowerCase()
], (results, location) => {
  return results.filter((result) => result.location.toLowerCase().indexOf(location) >= 0)
})
