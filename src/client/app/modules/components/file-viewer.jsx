import React from 'react'
import _ from 'underscore'
import {connect} from 'react-redux'
import {toggleCodeView, updateFileUrl} from 'reducers/ui-filters'
import 'whatwg-fetch';
import {CodeView} from 'components/code-view'

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

  handleToggle(e) {
    this.props.toggleCodeView(false);
    this.props.updateFileUrl(null);
  }

  render() {
    var {fileUrl, toggleCodeView, updateFileUrl} = this.props
    return (
      <div className="FullView">
        <CloseButton handleToggle={this.handleToggle}/>
        {
          fileUrl ? <CodeView filePath={fileUrl}/> : null
        }
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
