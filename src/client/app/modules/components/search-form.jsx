import React from 'react'
import _ from 'underscore'
import {connect} from 'react-redux'
import {
  updateSearchString,
  updateLocation,
  updateResults,
} from 'reducers/search'
import {resultsFromLocationSelector} from 'selectors/results';


export const CodeSnippet = ({
  result,
  compact = false
}) => {
  var {path, lno, context_before, line, context_after, bound} = result;
  return (
    <div className="SnippetContainer">
      <a href={path} className="SnippetLink">{path}</a>
      <pre className="line-numbers Snippet-code" data-start={lno-3} data-line={lno}>
        <code className="language-python">
          {
            context_before.concat(line, context_after).join('\n')
          }
        </code>
      </pre>
    </div>
  )
}

const FAKE_RESULTS =  [
   {
     "path": "web/lib/a/model/wanted_answer/_wanted_answer.py",
     "lno": 82,
     "context_before": [
       "    args = (a.network.current_nid(), qid, answerer_uid, from_actor_id)",
       "    '''",
       "            from_actor_id = %s"
     ],
     "context_after": [
       "    return r['creation_time'] if r else None",
       "",
       ""
     ],
     "bounds": [
       8,
       18
     ],
     "line": "    r = a.db.query_single(sql, args)"
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
      <div className="SearchForm">
        Find code anywhere!
        <div className="FormContainer">
          <input className="FormInput" type="text" value={searchString} onChange={this.handleSearchChange} placeholder="Find files containing these words"/>
          <input className="FormInput" type="text" value={location} onChange={this.handleLocationChange} placeholder="File directory"/>
        </div>
        <div className="ResultsContainer">
          <div className="Summary">
            {results.length} results found for string {`'${searchString}'`} in  {`'${location}'`}
          </div>
          <div className="Results">
            {
              results.map((result, i) => (
                <CodeSnippet key={i} result={result}/>
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
    results: state.search.results//resultsFromLocationSelector(state)
  }),
  {
    updateSearchString: updateSearchString,
    updateLocation: updateLocation,
    updateResults: updateResults,
  }
)(SearchForm);
