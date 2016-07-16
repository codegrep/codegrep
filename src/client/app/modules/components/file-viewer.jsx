import React from 'react'
import _ from 'underscore'
import {connect} from 'react-redux'
import {toggleCodeView} from 'reducers/ui-filters'

export class FileViewer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    Prism.fileHighlight()
  }

  componentDidUpdate() {
    Prism.fileHighlight()
  }

  render() {
    var {fileUrl} = this.props
    console.log(fileUrl)
    return (
      <div className="FullView">
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
    toggleCodeView: toggleCodeView
  }
)(FileViewer);
