import React from 'react'
import _ from 'underscore'
import {connect} from 'react-redux'
import 'whatwg-fetch';
import {ConnectedCodeView} from 'components/code-view'
import {
  toggleCodeView,
  updateFileUrl
} from 'reducers/ui-filters'

export const CloseButton = ({handleToggle}) => {
  return (
    <div className="TogglerContainer">
      <button className='Toggler' onClick={handleToggle}>
        <i className="icon ion-ios-close-empty"/>
      </button>
    </div>
  );
}

export const Header = ({filePath}) => {
  return (
    <div className="Header">
      <span>Viewing File:</span>
      <a href={filePath} className="SnippetLink">{filePath}</a>
    </div>
  );
}

export class FileViewer extends React.Component {
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
    this.scrollToFocusedLine = this.scrollToFocusedLine.bind(this);
    this.scrollAmount = 0;
  }

  handleToggle(e) {
    this.props.toggleCodeView(false);
    this.props.updateFileUrl(null);
  }

  scrollToFocusedLine() {
    this.parentView.scrollTop = (this.props.line-1)*20 + 16 - screen.height/4;
  }

  render() {
    var {currentFilePath, line} = this.props;
    return (
      <div className="FullView" ref={(ref) => this.parentView = this.parentView || ref}>
        <CloseButton handleToggle={this.handleToggle}/>
        <Header filePath={currentFilePath}/>
        <ConnectedCodeView
          key={currentFilePath}
          lno={line}
          start={1}
          filePath={currentFilePath}
          setScroll={this.scrollToFocusedLine}
        />
      </div>
    );
  }
}

export const ConnectedFileViewer = connect(
  (state) => ({
    currentFilePath: state.uiFilters.fileUrl,
    line: state.uiFilters.line,
  }),
  {
    updateFileUrl: updateFileUrl,
    toggleCodeView: toggleCodeView
  }
)(FileViewer);
