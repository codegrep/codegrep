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
  }

  componentDidMount() {
    hljs.highlightBlock(this.code);
  }

  componentDidUpdate() {
    hljs.highlightBlock(this.code);
  }

  render() {
    var {filePath, content, length, start, openFile} = this.props;
    return (
      <div className="SnippetContainer">
        {filePath?
          <a className="SnippetLink" onClick={() => {openFile(filePath)}}>{filePath}</a>
          : null
        }
        <pre className="Snippet-code">
          <LineNumbers start={start} length={length}/>
          <code ref={(ref) => this.code = ref}>
            {
              content
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
  length: React.PropTypes.number.isRequired,
  start: React.PropTypes.number.isRequired,
  openFile: React.PropTypes.func,
}
