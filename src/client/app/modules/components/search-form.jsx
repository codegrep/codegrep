import React from 'react'
import _ from 'underscore'
import {connect} from 'react-redux'
import {
  updateSearchString,
  updateLocation,
  updateResults,
} from 'reducers/search'
import {
  updateFileUrl,
  toggleCodeView
} from 'reducers/ui-filters'
import {resultsFromLocationSelector} from 'selectors/results';
import 'whatwg-fetch';

export const LineNumbers = ({start, length}) => {
  return (
    <div className="LineNumberContainer">
        {_.range(start, start+length).map((number) => (
          <div key={number} className="LineNumber">{number}</div>
        ))}
    </div>
  )
}

export class CodeSnippet extends React.Component {
  componentDidMount() {
    Prism.highlightElement(this.code)
  }

  componentDidUpdate() {
    Prism.highlightElement(this.code)
  }

  render() {
    var {result, openFile} = this.props;
    var {file, lno, above_lines, the_line, below_lines} = result;
    var code = above_lines.concat(the_line, below_lines);
    return (
      <div className="SnippetContainer">
        <a className="SnippetLink" onClick={() => {openFile(file)}}>{file}</a>
        <pre className="line-number Snippet-code">
          <LineNumbers start={Math.max(lno-3, 1)} length={code.length}/>
          <code className="language-javascript" ref={(ref) => this.code = ref}>
            {
              code.join('\n')
            }
          </code>
        </pre>
      </div>
    )
  }
}

export class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.handleLocationChange = this.handleLocationChange.bind(this)
    this.openFile = this.openFile.bind(this)
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

  openFile(url) {
    this.props.toggleCodeView(true);
    this.props.updateFileUrl(url)
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
              results.map((result, i) => (
                <CodeSnippet key={i} result={result} openFile={this.openFile}/>
              ))
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
    updateFileUrl: updateFileUrl,
    toggleCodeView: toggleCodeView
  }
)(SearchForm);
