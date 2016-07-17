import React from 'react'
import {connect} from 'react-redux'
import classnames from 'classnames'
import _ from 'underscore'
import {
  toggleCodeView,
  updateFileUrl
} from 'reducers/ui-filters'


export const LineNumbers = ({start, length, focus}) => {
  return (
    <div className="LineNumberContainer">
        {_.range(start, start+length).map((number) => {
            var classes = classnames('LineNumber', {
              'LineNumber--focused': focus == number
            });
            return <div key={number} className={classes}>{number}</div>
        })}
    </div>
  )
}

export class CodeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
      lastFilePath: '',
    };
    this.openFile = this.openFile.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentFilePath !== this.props.currentFilePath) {
      this.setState({content: ''})
    }
  }

  componentDidMount() {
    if (this.props.content) {
      hljs.highlightBlock(this.code);
      return;
    }
    this.loadFile(this.props.currentFilePath);
  }

  componentDidUpdate(prevProps, prevState) {
    var {content, currentFilePath, filePath} = this.props;
    if (content || this.state.content) {
      hljs.highlightBlock(this.code);
      if (this.props.setScroll) {
        this.props.setScroll();
      }
      return;
    }
    if (currentFilePath && currentFilePath != this.state.lastFilePath) {
      this.loadFile(currentFilePath);
    }
  }

  loadFile(fileUrl) {
    fetch(`/api/file?f=${fileUrl}`)
      .then((response) => {
        return response.text();
      })
      .then((response) => {
        this.setState({
          content: response,
          lastFilePath: fileUrl
        })
      })
  }

  openFile(url) {
    this.props.toggleCodeView(true);
    this.props.updateFileUrl(url, this.props.start);
  }

  render() {
    var {filePath, content, length, start=1, openFile, focusLine, currentFilePath} = this.props;
    var filePath = filePath || currentFilePath;
    var fetched = this.state.content;
    var length = fetched? (fetched.match(/\n/g) || []).length+1 : length;
    return (
      <div className="SnippetContainer">
        {content?
          <a className="SnippetLink" onClick={() => {this.openFile(filePath)}}>{filePath}</a>
          : null
        }
        <pre className="Snippet-code">
          {length? <LineNumbers start={start} length={length} focus={focusLine}/> : null}
          <code ref={(ref) => this.code = ref}>
            {
              content || (fetched.length > 0? fetched: 'Loading ja')
            }
          </code>
        </pre>
      </div>
    )
  }
}

CodeView.propTypes = {
  filePath: React.PropTypes.string,
  content: React.PropTypes.string,
  length: React.PropTypes.number,
  start: React.PropTypes.number,
  updateFileUrl: React.PropTypes.func.isRequired,
  toggleCodeView: React.PropTypes.func.isRequired,
  focusLine: React.PropTypes.number,
  currentFilePath: React.PropTypes.string,
  setScroll: React.PropTypes.func
}

export const ConnectedCodeView = connect(
  (state) => ({
    currentFilePath: state.uiFilters.fileUrl,
    focusLine: state.uiFilters.line
  }),
  {
    updateFileUrl: updateFileUrl,
    toggleCodeView: toggleCodeView
  }
)(CodeView);
