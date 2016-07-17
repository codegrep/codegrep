import React from 'react'
import _ from 'underscore'

export const LineNumbers = ({start, length}) => {
  return (
    <div className="LineNumberContainer">
        {_.range(start, start+length).map((number) => (
          <div key={number} className="LineNumber">{number}</div>
        ))}
    </div>
  )
}

export class CodeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.filePath !== this.props.filePath) {
      this.setState({content: ''})
    }
  }

  componentDidMount() {
    if (this.props.content) {
      hljs.highlightBlock(this.code);
      return;
    }
    this.loadFile(this.props.filePath);
  }

  componentDidUpdate(prevProps, prevState) {
    var {content, filePath} = this.props;
    if (content || this.state.content) {
      hljs.highlightBlock(this.code);
      return;
    }
    if (filePath !== prevProps.filePath) {
      this.loadFile(filePath);
    }
  }

  loadFile(fileUrl) {
    fetch(`/api/file?f=${fileUrl}`)
      .then((response) => {
        return response.text();
      })
      .then((response) => {
        this.setState({content: response})
      })
  }

  render() {
    var {filePath, content, length, start=1, openFile} = this.props;
    var fetched = this.state.content;
    var length = fetched? (fetched.match(/\n/g) || []).length+1 : length;
    return (
      <div className="SnippetContainer">
        {content?
          <a className="SnippetLink" onClick={() => {openFile(filePath)}}>{filePath}</a>
          : null
        }
        <pre className="Snippet-code">
          {length? <LineNumbers start={start} length={length}/> : null}
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
  openFile: React.PropTypes.func,
}
