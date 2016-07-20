import React from 'react'
import {connect} from 'react-redux'
import classnames from 'classnames';
import {ConnectedSearchForm} from 'components/search-form'
import {ConnectedFileViewer} from 'components/file-viewer'
import {updateLocation} from 'reducers/search'
import {toggleCodeView, toggleSearchView, updateFileUrl} from 'reducers/ui-filters'

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export class App extends React.Component {
  tryOpenFile() {
    var hash = window.location.hash;
    if (!hash.startsWith('#/')) return;
    hash = hash.substring(2);

    var splitResults = hash.split(/\/\//);
    if (splitResults.length <= 0 || splitResults[0] == '' || splitResults.length > 2) return;
    this.props.updateFileUrl(splitResults[0], parseInt(splitResults[1], 10) || 0);
    this.props.toggleCodeView(true);
    this.props.toggleSearchView(false);
  }
  componentDidMount() {
    this.tryOpenFile();

    var lang = getParameterByName('lang');
    // console.log(lang);
    if (lang && typeof(lang) === 'string') {
      this.props.updateLocation(lang + '$');
    }
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
  updateLocation: React.PropTypes.func.isRequired,
}

export const ConnectedApp = connect(
  (state) => ({
    views: state.uiFilters.views,
  }),
  {
    updateFileUrl: updateFileUrl,
    toggleCodeView: toggleCodeView,
    toggleSearchView: toggleSearchView,
    updateLocation: updateLocation
  }
)(App);
