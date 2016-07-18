import React from 'react'
import {connect} from 'react-redux'
import classnames from 'classnames';
import {ConnectedSearchForm} from 'components/search-form'
import {ConnectedFileViewer} from 'components/file-viewer'
import {toggleCodeView, toggleSearchView, updateFileUrl} from 'reducers/ui-filters'

export class App extends React.Component {
  componentDidMount() {
    var hash = window.location.hash;
    if (!hash.startsWith('#/')) return;
    hash = hash.substring(2);

    var splitResults = hash.split(/\/\//);
    if (splitResults.length <= 0 || splitResults.length > 2) return;
    this.props.updateFileUrl(splitResults[0], parseInt(splitResults[1], 10) || 0);
    this.props.toggleCodeView(true);
    this.props.toggleSearchView(false);
  }

  render() {
    var {views, toggleCodeView} = this.props;
    var {search, full} = views;
    var searchClasses = classnames({hidden: !search});
    return (
      <div className="App">
        <ConnectedSearchForm className={searchClasses}/>
        {full ? <ConnectedFileViewer/> : null}
      </div>
    )
  }
}

App.propTypes = {
  views: React.PropTypes.object.isRequired,
  updateFileUrl: React.PropTypes.func.isRequired,
  toggleCodeView: React.PropTypes.func.isRequired,
  toggleSearchView: React.PropTypes.func.isRequired,
}

export const ConnectedApp = connect(
  (state) => ({
    views: state.uiFilters.views,
  }),
  {
    updateFileUrl: updateFileUrl,
    toggleCodeView: toggleCodeView,
    toggleSearchView: toggleSearchView
  }
)(App);
