import React from 'react'
import _ from 'underscore'
import {connect} from 'react-redux'
import {toggleCodeView, updateFileUrl} from 'reducers/ui-filters'

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
  }

  componentDidMount() {
    Prism.fileHighlight()
  }

  componentDidUpdate() {
    Prism.fileHighlight()
  }

  handleToggle(e) {
    console.log("WOO");
    this.props.toggleCodeView(false);
    this.props.updateFileUrl(null);
  }

  render() {
    var {fileUrl, toggleCodeView, updateFileUrl} = this.props
    console.log("RERENDER?");
    return (
      <div className="FullView">
        <CloseButton handleToggle={this.handleToggle}/>
        { fileUrl? (<pre className="line-numbers language-javascript" data-src={'api/file?f=' + fileUrl}></pre>) : null }
      </div>
    )
  }
}

export const ConnectedFileViewer = connect(
  (state) => ({
    fileUrl: state.uiFilters.fileUrl,
  }),
  {
    toggleCodeView: toggleCodeView,
    updateFileUrl: updateFileUrl
  }
)(FileViewer);
