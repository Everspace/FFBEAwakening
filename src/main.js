import React from 'react'
import ReactDOM from 'react-dom'

import { AppContainer } from 'react-hot-loader'
import WindowContainer from 'WindowContainer'
import 'whatwg-fetch'

let render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app')
  )
}

window.ffbedata = {}

Promise.all(
  ['items', 'units'].map(
    thing => fetch(`./build/${thing}.json`)
              .then(res => res.json())
              .then(json => window.ffbedata[thing] = json)
    )
)
.then(() => {
  // Do some data manipulation
  window.ffbedata.nameToUnitId
  = Object.keys(window.ffbedata.units).map(
    key => {
      let o = {}
      o[window.ffbedata.units[key].name['en']] = key
      return o
    }
  ).reduce((a, b) => Object.assign({}, a, b), {})

  render(WindowContainer)
})
.then(() => {
  if (module.hot) {
    module.hot.accept('WindowContainer', () => {
      render(WindowContainer)
    })
  }
})
