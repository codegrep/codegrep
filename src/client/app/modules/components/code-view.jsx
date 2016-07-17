import React from 'react'
import {connect} from 'react-redux'
import classnames from 'classnames'
import _ from 'underscore'
import {
  toggleCodeView,
  updateFileUrl
} from 'reducers/ui-filters'

export const LineNumbers = ({start, length, lno}) => {
  start = Math.max(start, 1)
  return (
    <div className="LineNumberContainer">
        {_.range(start, start+length).map((number) => {
            var classes = classnames('LineNumber', {
              'LineNumber--focused': lno == number
            });
            return <div key={number} className={classes}>{number}</div>
        })}
    </div>
  )
}

function getLanguageByPath(path) {
  var extension = path.split(/\./).pop();
  if (hljs.getLanguage(extension)) return extension;
  var fileName = path.split(/\//).pop();
  if (hljs.getLanguage(fileName)) return fileName;
  return 'diff';
}

export class CodeInnerView extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.content !== nextProps.content;
  }

  render() {
    var {content, refHandler, filePath} = this.props;
    var lang = getLanguageByPath(filePath);
    return (
      <code className={ lang ? ('language-'+lang) : ''} ref={refHandler}>
        { content ? content : 'Loading ja' }
      </code>
    );
  }
}

export class CodeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
    };
    this.openFile = this.openFile.bind(this);
    this.refHandler = this.refHandler.bind(this);
  }

  refresh() {
    var {content, filePath} = this.props;
    if (content) {
      hljs.highlightBlock(this.code);
      return;
    }
    if (this.state.content) {
      if (!this.isHighlighted) {
        hljs.highlightBlock(this.code);
        this.isHighlighted = true;
      }
      if (this.props.setScroll) {
        this.props.setScroll();
      }
      return;
    }
    this.loadFile(this.props.filePath);
  }

  componentDidMount() {
    this.refresh();
  }

  componentDidUpdate(prevProps, prevState) {
    this.refresh();
  }

  loadFile(fileUrl) {
    fetch(`/api/file?f=${fileUrl}`)
      .then((response) => {
        return response.text();
      })
      .then((response) => {
        this.setState({
          content: response,
        })
      })
  }

  refHandler(ref) {
    this.code = ref;
  }

  openFile(url) {
    this.props.toggleCodeView(true);
    this.props.updateFileUrl(url, this.props.lno);
  }

  render() {
    var {filePath, content, length, start, lno, openFile} = this.props;
    var fetched = this.state.content;
    var length = fetched? (fetched.match(/\n/g) || []).length+1 : length;
    return (
      <div className="SnippetContainer">
        {content?
          <a className="SnippetLink" onClick={() => {this.openFile(filePath)}}>{filePath}</a>
          : null
        }
        <pre className="Snippet-code">
          {length? <LineNumbers start={start} length={length} lno={lno}/> : null}
          <CodeInnerView
            key={filePath}
            filePath={filePath}
            content={content || fetched}
            refHandler={this.refHandler}
          />
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
  lno: React.PropTypes.number,
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
