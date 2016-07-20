import React from 'react'
import {connect} from 'react-redux'
import classnames from 'classnames'
import _ from 'underscore'
import {
  toggleCodeView,
  updateFileUrl
} from 'reducers/ui-filters'
import {SuperFuckingAwesomeHorizontalScrollbars} from './super-fucking-awesome-scrollbars'

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

function loadingString(filePath) {
  return 'Loading ...';
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
    var className = 'hljs';
    var lang = getLanguageByPath(filePath);
    if (lang) {
      className += ' language-' + lang;
    }
    return (
      <code className={ className } ref={refHandler}>
        { content ? content : loadingString(filePath) }
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
        if (typeof(this.state.cachedContent) === 'string') {
          this.code.innerHTML = this.state.cachedContent;
        } else {
          hljs.highlightBlock(this.code);
          window.cache.setItem(filePath, this.code.innerHTML, {
            expirationSliding: 60, // live up to 1 minute
            priority: Cache.Priority.HIGH,
          });
        }
        this.isHighlighted = true;
      }
      if (this.props.setScroll) {
        this.props.setScroll();
      }
      return;
    }
    var cachedContent = window.cache.getItem(filePath);
    if (cachedContent) {
      setTimeout(() => {
        this.setState({
          content: loadingString,
          cachedContent: cachedContent,
        })
      }, 0);
    } else {
      this.loadFile(this.props.filePath);
    }
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
    var fetched = this.state.cachedContent || this.state.content;
    var length = fetched? (fetched.match(/\n/g) || []).length+1 : length;
    return (
      <div className="SnippetContainer">
        {content?
          <a className="SnippetLink" onClick={() => {this.openFile(filePath)}}>{filePath}</a>
          : null
        }
        <pre className="Snippet-code">
          {length? <LineNumbers start={start} length={length} lno={lno}/> : null}
          <SuperFuckingAwesomeHorizontalScrollbars>
            <CodeInnerView
              key={filePath}
              filePath={filePath}
              content={content || fetched}
              refHandler={this.refHandler}
            />
        </SuperFuckingAwesomeHorizontalScrollbars>
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
