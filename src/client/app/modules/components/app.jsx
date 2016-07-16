import React from 'react'
import {connect} from 'react-redux'
import classnames from 'classnames';
import {ConnectedSearchForm} from 'components/search-form'
import {FullView} from 'components/full-view'
import {toggleCodeView} from 'reducers/ui-filters'

export class ViewToggler extends React.Component {
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle(e) {
    this.props.toggleCodeView(!this.props.full);
  }

  render() {
    var classes = classnames('Toggler', {
      'is-active': this.props.full
    })
    return (
      <div className="TogglerContainer">
        <button className={classes} onClick={this.handleToggle}>
          Code
        </button>
      </div>
    );
  }
}

export const App = ({views, toggleCodeView}) => {
  var {search, full} = views;
  console.log(views);
  return (
    <div className="App">
      <ViewToggler full={full} toggleCodeView={toggleCodeView}/>
      {search || !full? <ConnectedSearchForm/>: null}
      {full? <FullView/>: null}
    </div>
  )
}

App.propTypes = {
  views: React.PropTypes.object.isRequired,
  toggleCodeView: React.PropTypes.func.isRequired
}

export const ConnectedApp = connect(
  (state) => ({
    views: state.uiFilters.views,
  }),
  {
    toggleCodeView: toggleCodeView
  }
)(App);
