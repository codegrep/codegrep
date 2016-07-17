import React from 'react'
import _ from 'underscore'
import {connect} from 'react-redux'
import {
  updateSearchString,
  updateLocation,
  updateResults,
} from 'reducers/search'
import {ConnectedCodeView} from 'components/code-view';
import {
  updateFileUrl,
  toggleCodeView
} from 'reducers/ui-filters'
import {resultsFromLocationSelector} from 'selectors/results';
import 'whatwg-fetch';

export class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.handleLocationChange = this.handleLocationChange.bind(this)
    this.debounceUpdateSearch = _.debounce(this.updateSearch, 200)
  }

  handleSearchChange(e) {
  	this.props.updateSearchString(e.target.value);
    this.debounceUpdateSearch(e.target.value, this.props.location);
  }

  handleLocationChange(e) {
    this.props.updateLocation(e.target.value);
    this.debounceUpdateSearch(this.props.searchString, e.target.value);
  }

  updateSearch(searchString, location) {
    fetch(`/api/search?q=${searchString}&f=${location}`)
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        this.props.updateResults(response)
      })
  }

  render() {
    var {searchString, location, results, full} = this.props;
    return (
      <div className="SearchForm">
        <div className="FormContainer">
          { full? null : <div className="Slogan">Find anything</div> }
          <input className="FormInput" type="text" value={searchString} onChange={this.handleSearchChange} placeholder="Search String"/>
          <input className="FormInput" type="text" value={location} onChange={this.handleLocationChange} placeholder="File directory"/>
        </div>
        <div className="ResultsContainer">
          <div className="Summary">
            {
              searchString.length === 0 ?
                <span> Type in the searchbox to get started! </span> :
                <span>
                  {results.length} results found for string <code>{`'${searchString}'`}</code> in  <code>{`'${location}'`}</code>
                </span>
            }
          </div>
          <div className="Results">
            {
              results.map((result, i) => {
                var {file, lno, above_lines, the_line, below_lines} = result;
                var code = above_lines.concat(the_line, below_lines);
                return (
                  <ConnectedCodeView
                    key={i}
                    filePath={file}
                    content={code.join('\n')}
                    length={code.length}
                    start={lno}
                  />
                );
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

export const ConnectedSearchForm = connect(
  (state) => ({
    searchString: state.search.form.searchString,
    location: state.search.form.location,
    results: state.search.results,
    full: state.uiFilters.views.full,
  }),
  {
    updateSearchString: updateSearchString,
    updateLocation: updateLocation,
    updateResults: updateResults,
  }
)(SearchForm);
