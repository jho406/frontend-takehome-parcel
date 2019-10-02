import React from "react"
import App from './components/App'
import {Provider} from 'react-redux'
import store from './store'
import { render } from "react-dom"
import ReduxThunk from 'redux-thunk'

render(
  <Provider store={store}>
    <App />
  </Provider>,
  // The target element might be either root or app,
  // depending on your development environment
  // document.getElementById("app")
  document.getElementById("app")
)

