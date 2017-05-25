import ReactDOM from 'react-dom'
import React from 'react'

import VerifyProof from './VerifyProof'

import { Router, Route, IndexRoute, browserHistory } from 'react-router'

const App = ({ location: { query } }) => (
  <div className="container">
    <div className="row">
      <div className="text-center">
        <a href="https://binded.com" style={{ margin: 20, display: 'block' }}>
          <img width="200" src="static/logo.png" alt="Binded Verify" />
        </a>
        <h2>Binded Proof Verification</h2>
        <br />
      </div>
    </div>
    <div className="row">
      <VerifyProof proofUrl={query.url} />
    </div>
    <footer style={{ margin: '20px 0 20px 0' }}>
      <div className="row">
        <div className="col-md-12 text-small">
          <p>
            This verification tool runs completely client side and its source code
            is open source.
          </p>
          <p>
            Github: <a href="https://github.com/blockai/blockai-verify">blockai/blockai-verify</a>
          </p>
          <p>
            Binded was formerly known as Blockai.
          </p>
        </div>
      </div>
    </footer>
  </div>
)

let basePath = window.location.pathname
basePath = basePath.split('/').filter(part => part.length).join('/')
if (!basePath) basePath = '/'

const routes = (
  <Route path={basePath}>
    <IndexRoute component={App} />,
  </Route>
)

ReactDOM.render(
  <Router history={browserHistory} routes={routes} />,
  document.getElementById('app')
)
