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
    this.state = {
      fileContent: ''
    };
  }

  loadFile() {
    fetch(`/api/file?f=${this.props.fileUrl}`)
      .then((response) => {
        return response.text();
      })
      .then((response) => {
        this.setState({fileContent: response})
      })
  }

  componentDidMount() {
    this.loadFile();
  }

  componentDidUpdate() {
    this.loadFile();
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
          this.state.fileContent ?
            (<CodeView
                content={this.state.fileContent}
                length={(this.state.fileContent.match(/\n/g) || []).length}
                start={1}
              />) : 'Loading ja'
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
