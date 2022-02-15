import React from 'react'
import { render } from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import store from './store/store'

const renderApp = () =>
  render(
    <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>,
    document.getElementById('root')
  )

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

if (module.hot) {
  module.hot.accept('./App', () => {
    renderApp()
  })
}

renderApp()
