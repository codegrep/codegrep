import React from 'react'
import _ from 'underscore'
import {connect} from 'react-redux'
import 'whatwg-fetch';
import {ConnectedCodeView} from 'components/code-view'
import {
  toggleCodeView,
  toggleSearchView,
  updateFileUrl
} from 'reducers/ui-filters'
import {SuperFuckingAwesomeScrollbars} from './super-fucking-awesome-scrollbars'

export const CloseButton = ({onClose, toggleFull}) => {
  return (
    <div className="TogglerContainer">
      <button className='Toggler' onClick={toggleFull}>
        <i className="icon ion-android-expand"/>
      </button>
      <button className='Toggler' onClick={onClose}>
        <i className="icon ion-ios-close-empty"/>
      </button>
    </div>
  );
}

export const Header = ({filePath, lno}) => {
  if (lno) {
    return (
      <div className="Header">
        <a href={'#/' + filePath + '//' + lno} target="_blank" className="SnippetLink">{filePath}:{lno}</a>
      </div>
    );
  } else {
    return (
      <div className="Header">
        <a href={'#/' + filePath} target="_blank" className="SnippetLink">{filePath}</a>
      </div>
    );
  }
}

export class FileViewer extends React.Component {
  constructor(props) {
    super(props);
    this.closePanel = this.closePanel.bind(this);
    this.toggleFullScreen = this.toggleFullScreen.bind(this);
    this.scrollToFocusedLine = this.scrollToFocusedLine.bind(this);
  }

  closePanel() {
    this.props.toggleCodeView(false);
    this.props.updateFileUrl(null);
    this.props.toggleSearchView(true);
  }

  toggleFullScreen() {
    this.props.toggleSearchView(!this.props.views.search);
  }

  scrollToFocusedLine() {
    var scrollAmount =  (this.props.line-1)*20 + 16 - screen.height/4;
    this.scrollbars.scrollTop(scrollAmount);
  }

  render() {
    var {currentFilePath, line, className = ''} = this.props;
    return (
      <div className={"FullView " + className}>
        <CloseButton onClose={this.closePanel} toggleFull={this.toggleFullScreen}/>
        <Header filePath={currentFilePath} lno={line}/>
        <SuperFuckingAwesomeScrollbars className="scrollParent" ref={(ref) => this.scrollbars = this.scrollbars || ref}>
          <div className="FullCode">
            <ConnectedCodeView
              key={currentFilePath}
              lno={line}
              start={1}
              filePath={currentFilePath}
              setScroll={this.scrollToFocusedLine}
            />
          </div>
        </SuperFuckingAwesomeScrollbars>
      </div>
    );
  }
}

export const ConnectedFileViewer = connect(
  (state) => ({
    currentFilePath: state.uiFilters.fileUrl,
    line: state.uiFilters.line,
    views: state.uiFilters.views
  }),
  {
    updateFileUrl: updateFileUrl,
    toggleCodeView: toggleCodeView,
    toggleSearchView: toggleSearchView,
  }
)(FileViewer);
