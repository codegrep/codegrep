import React from 'react'
import _ from 'underscore'
import {connect} from 'react-redux'
import {
  updateSearchString,
  updateLocation,
  updateResults,
} from 'reducers'
import {resultsFromLocationSelector} from 'selectors/results';

export const CodeSnippet = ({
  fullURL,
  lines,
  lineNumber,
  compact = false
}) => {
  var length = compact ? 1 : 6
  var tempStyle = {
    display: "flex",
    width: "100px",
    justifyContent: "space-between",
    marginBottom: "10px"
  }
  return (
    <div className="SnippetContainer">
      <a href={fullURL} className="SnippetLink">{fullURL}</a>
      <br/>
      <div className="Snippet" style={tempStyle}>
        <div className="LineNumberContainer">
          {
            _.range(lineNumber, lineNumber+length).map((number) => (
              <div key={number} className="LineNumber">{number}<br/></div>
            ))
          }
        </div>
        <div className="Code">
          {
            _.first(lines, length).map((line, i) => (
              <div key={i} className="Code">{line}<br/></div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

const FAKE_RESULTS = [
  {
    lines: ['gu', 'is', 'so', 'sleepy', 'ja', 'Zzzzzz'],
    lineNumber: 84,
    location: 'San Francisco'
  },
  {
    lines: ['noo', 'eyes', 'gu', 'are', 'closing', 'Zzzzzz'],
    lineNumber: 120,
    location: 'San Diago'
  },
  {
    lines: ['thats', 'a', 'rip', 'perinos', 'bobo', 'zero'],
    lineNumber: 1,
    location: 'Indiana'
  },
]

export class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.handleLocationChange = this.handleLocationChange.bind(this)
  }

  handleSearchChange(e) {
  	this.props.updateSearchString(e.target.value);
  }

  handleLocationChange(e) {
    this.props.updateLocation(e.target.value);
  }

  componentDidMount() {
    // populate with fake results
    this.props.updateResults(FAKE_RESULTS);
  }

  render() {
    var {searchString, location, results} = this.props;
    return (
      <div>
        Codegrep!
        <br/>
      <input disabled type="text" value={searchString} onChange={this.handleSearchChange} placeholder="DISABLED JA"/>
        <br/>
        <input type="text" value={location} onChange={this.handleLocationChange} placeholder="Location"/>
        <br/>
        <div>
          Searching for everything in {location}
          <br/>
          <div className="resultsContainer">
            {results.length} results<br/>
            {
              results.map((result, i) => (
                <CodeSnippet key={i} fullURL={result.location} lines={result.lines} lineNumber={result.lineNumber}/>
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
    searchString: state.form.searchString,
    location: state.form.location,
    results: resultsFromLocationSelector(state)
  }),
  {
    updateSearchString: updateSearchString,
    updateLocation: updateLocation,
    updateResults: updateResults,
  }
)(SearchForm);
