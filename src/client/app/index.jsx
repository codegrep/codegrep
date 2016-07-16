import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { ConnectedApp } from 'components/app'
import searchApp from 'reducers'

//import '../scss'

let store = createStore(searchApp);

class Container extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <ConnectedApp />
      </Provider>
    )
  }
}

render(<Container/>, document.getElementById('app'));
