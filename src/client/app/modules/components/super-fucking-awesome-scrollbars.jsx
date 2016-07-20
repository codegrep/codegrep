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
