import ReactDOM from 'react-dom'
import React from 'react'

import VerifyProof from './VerifyProof'

import { Router, Route, browserHistory } from 'react-router'

const App = ({ location: { query } }) => (
  <div className="container">
    <div className="row">
      <div className="text-center">
        <a href="https://blockai.com" style={{ margin: 20, display: 'block' }}>
          <img width="200" src="static/logo.png" alt="Blockai Verify" />
        </a>
        <h2>Blockai Proof Verification</h2>
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
        </div>
      </div>
    </footer>
  </div>
)

const routes = [
  <Route path="/" component={App} />,
]

ReactDOM.render(
  <Router history={browserHistory} routes={routes} />,
  document.getElementById('app')
)
