import React from 'react'
import _ from 'underscore'
import {connect} from 'react-redux'
import {
  updateSearchString,
  updateSearchStringRegEx,
  updateSearchStringCaseSensitive,
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
import ReactTooltip from 'react-tooltip'

export class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.handleSearchRegExToggle = this.handleSearchRegExToggle.bind(this)
    this.handleSearchCaseSensitiveToggle = this.handleSearchCaseSensitiveToggle.bind(this)
    this.handleLocationChange = this.handleLocationChange.bind(this)
    this.getSearchParamsFromProps = this.getSearchParamsFromProps.bind(this);
    this.debounceUpdateSearch = _.debounce(this.updateSearch, 200)
  }

  getSearchParamsFromProps() {
    return {
      searchString: this.props.searchString,
      searchStringRegEx: this.props.searchStringRegEx,
      searchStringCaseSensitive: this.props.searchStringCaseSensitive,
      location: this.props.location
    }
  }

  handleSearchChange(e) {
  	this.props.updateSearchString(e.target.value);
    this.debounceUpdateSearch({...this.getSearchParamsFromProps(), searchString: e.target.value});
  }

  handleLocationChange(e) {
    this.props.updateLocation(e.target.value);
    this.debounceUpdateSearch({...this.getSearchParamsFromProps(), location: e.target.value});
  }

  handleSearchRegExToggle() {
    this.props.updateSearchStringRegEx(!this.props.searchStringRegEx);
    this.debounceUpdateSearch({...this.getSearchParamsFromProps(), searchStringRegEx: !this.props.searchStringRegEx});
  }

  handleSearchCaseSensitiveToggle() {
    this.props.updateSearchStringCaseSensitive(!this.props.searchStringCaseSensitive);
    this.debounceUpdateSearch({...this.getSearchParamsFromProps(), searchStringCaseSensitive: !this.props.searchStringCaseSensitive});
  }

  updateSearch(params) {
    if(!params.searchStringRegEx) {
      // Escape regex characters
      params.searchString = params.searchString.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    const isCaseSensitive = params.searchStringCaseSensitive ? 'true' : 'false';

    fetch(`/api/search?q=${params.searchString}&isCaseSensitive=${isCaseSensitive}&f=${params.location}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          hashes: ['123', '456'],
        })
      })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        this.props.updateResults(response)
      })
  }

  render() {
    var {searchString, searchStringRegEx, searchStringCaseSensitive, location, results, full} = this.props;
    return (
      <div className="SearchForm">
        <div className="FormContainer">
          { full? null : <div className="Slogan">CodeGrep!</div> }
          <input className="FormInput" type="text" value={searchString} onChange={this.handleSearchChange} placeholder="Search String"/>
          <span className="SearchStringToggles">
            <button className={'RegEx' + (searchStringRegEx ? ' active' : '')}
                    onClick={this.handleSearchRegExToggle}
                    data-tip="enabled"
                    data-for="SearchStringRegExTooltip"
                    data-place="bottom"
                    data-effect="solid"
              >.*</button>
            <ReactTooltip id="SearchStringRegExTooltip" getContent={[() => (searchStringRegEx ? 'RegEx' : 'Non-RegEx')]}/>
            <button className={'CaseSensitive' + (searchStringCaseSensitive ? ' active' : '')}
                    onClick={this.handleSearchCaseSensitiveToggle}
                    data-tip="enabled"
                    data-for="searchStringCaseSensitiveTooltip"
                    data-place="bottom"
                    data-effect="solid"
              >Aa</button>
            <ReactTooltip id="searchStringCaseSensitiveTooltip" getContent={[() => (searchStringCaseSensitive ? 'Case Sensitive' : 'Case Insensitive')]}/>
          </span>
          <input className="FormInput" type="text" value={location} onChange={this.handleLocationChange} placeholder="File Path"/>
        </div>
        <div className="ResultsContainer">
          <div className="Summary">
            {
              (searchString === '' && location === '') ?
                <span> Type in the searchbox to get started! </span> :
                <span>
                  {results.length} {searchString === '' ? 'files found' : 'results found for string'} <code>{searchString === '' ? '' : `'${searchString}'`}</code> at <code>{ location ===  '' ? 'any path' : `'${location}'`}</code>
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
                    content={code.join('\n')+'\n'}
                    length={code.length}
                    start={lno-3}
                    lno={lno}
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
    searchStringRegEx: state.search.form.searchStringRegEx,
    searchStringCaseSensitive: state.search.form.searchStringCaseSensitive,
    location: state.search.form.location,
    results: state.search.results,
    full: state.uiFilters.views.full,
  }),
  {
    updateSearchString,
    updateSearchStringRegEx,
    updateSearchStringCaseSensitive,
    updateLocation,
    updateResults,
  }
)(SearchForm);
