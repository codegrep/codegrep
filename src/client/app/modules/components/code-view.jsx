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
      /* lastFilePath: '', */
    };
    console.log('uo', this.state.content);
    this.openFile = this.openFile.bind(this);
  }

  /* componentWillReceiveProps(nextProps) {
    if (nextProps.filePath !== this.props.currentFilePath) {
      this.setState({content: ''})
    }
  } */

  refresh() {
    var {content, filePath} = this.props;
    console.log(content, filePath, !!this.state.content);
    if (content) {
      hljs.highlightBlock(this.code);
      return;
    }
    if (this.state.content) {
      hljs.highlightBlock(this.code);
      if (this.props.setScroll) {
        this.props.setScroll();
      }
      return;
    }
    this.loadFile(this.props.filePath);
  }

  componentDidMount() {
    console.log('mount');
    this.refresh();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('update');
    this.refresh();
    /* if (currentFilePath && currentFilePath != this.state.lastFilePath) {
      this.loadFile(currentFilePath);
    } */
  }

  loadFile(fileUrl) {
    fetch(`/api/file?f=${fileUrl}`)
      .then((response) => {
        return response.text();
      })
      .then((response) => {
        this.setState({
          content: response,
          /* lastFilePath: fileUrl */
        })
      })
  }

  openFile(url) {
    this.props.toggleCodeView(true);
    this.props.updateFileUrl(url, this.props.start);
  }

  render() {
    var {filePath, content, length, start=1, openFile} = this.props;
    var fetched = this.state.content;
    var length = fetched? (fetched.match(/\n/g) || []).length+1 : length;
    return (
      <div className="SnippetContainer">
        {content?
          <a className="SnippetLink" onClick={() => {this.openFile(filePath)}}>{filePath}</a>
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
  updateFileUrl: React.PropTypes.func.isRequired,
  toggleCodeView: React.PropTypes.func.isRequired,
  setScroll: React.PropTypes.func
}

export const ConnectedCodeView = connect(
  (state) => ({}),
  {
    updateFileUrl: updateFileUrl,
    toggleCodeView: toggleCodeView
  }
)(CodeView);
