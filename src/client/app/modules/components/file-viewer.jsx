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
        Close
      </button>
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
    var target = document.querySelector('.LineNumber--focused');
    if (this.parentView) {
      this.parentView.scrollTop = (this.props.line-1)*20 + 16 - screen.height/4;
    }
  }

  render() {
    var {currentFilePath, line} = this.props;
    console.log('gonna render', this.props.currentFilePath);
    return (
      <div className="FullView" ref={(ref) => this.parentView = ref}>
        <CloseButton handleToggle={this.handleToggle}/>
        <ConnectedCodeView
          key={currentFilePath}
          lno={line}
          start={1}
          filePath={currentFilePath}
          setScroll={this.scrollToFocusedLine}
        />
      </div>
    )
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
