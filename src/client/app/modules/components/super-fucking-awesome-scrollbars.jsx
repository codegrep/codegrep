import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

export class SuperFuckingAwesomeScrollbars extends Component {
  render() {
    return (
      <Scrollbars
        autoHide={true}
        autoHideTimeout={500}
        renderThumbHorizontal={props => <div {...props} className="thumb-horizontal"/>}
        renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
        {...this.props}>
        {this.props.children}
      </Scrollbars>
    );
  }
}
