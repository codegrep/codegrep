import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

export class SuperFuckingAwesomeScrollbars extends Component {
  scrollTop(scrollAmount) {
      this.scrollbars.scrollTop(scrollAmount);
  }

  render() {
    return (
      <Scrollbars
        autoHide={true}
        autoHideTimeout={500}
        renderThumbHorizontal={props => <div {...props} className="thumb-horizontal"/>}
        renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
        {...this.props}
        ref={(ref) => this.scrollbars = ref}>
        {this.props.children}
      </Scrollbars>
    );
  }
}

export class SuperFuckingAwesomeHorizontalScrollbars extends Component {
  render() {
    const containerStyle = {
      position: 'relative',
      overflow: 'hidden',
      width: '100%'
    };
    const viewStyle = {
      position: 'relative',
      width: '100%',
      marginBottom: '-5px',
      overflowX: 'scroll',
      overflowY: 'visible'
    };

    return (
      <SuperFuckingAwesomeScrollbars
        className="horizontal-scrollbars"
        renderView={props => <div {...props} style={viewStyle}/>}
        {...this.props} >
        {this.props.children}
      </SuperFuckingAwesomeScrollbars>
    );
  }
}
