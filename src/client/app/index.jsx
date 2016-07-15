import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { App } from 'components/app'
import searchApp from 'reducers'

let store = createStore(searchApp);

class Container extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
}

render(<Container/>, document.getElementById('app'));
