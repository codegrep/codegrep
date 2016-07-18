import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { ConnectedApp } from 'components/app'
import searchApp from 'reducers'

//import '../scss'

window.cache = new Cache(20); // cache up to 20 full source code items
let store = createStore(searchApp, window.devToolsExtension ? window.devToolsExtension() : f => f);

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
