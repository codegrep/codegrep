import React from 'react'
import _ from 'underscore'
import {connect} from 'react-redux'
import 'whatwg-fetch';
import {ConnectedCodeView} from 'components/code-view'

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

  componentWillUpdate(nextProps) {

  }

  scrollToFocusedLine() {
    var target = document.querySelector('.LineNumber--focused');
    this.parentView.scrollTop = (this.props.line-1)*18 + 16 - screen.height/4;
  }

  render() {
    var {fileUrl} = this.props
    return (
      <div className="FullView" ref={(ref) => this.parentView = ref}>
        <CloseButton handleToggle={this.handleToggle}/>
        <ConnectedCodeView setScroll={this.scrollToFocusedLine}/>
      </div>
    )
  }
}

export const ConnectedFileViewer = connect(
  (state) => ({
    line: state.uiFilters.line,
  })
)(FileViewer);
