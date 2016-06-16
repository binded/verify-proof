import React, { Component } from 'react'
import blockaiVerify from '../../../src/'
import Input from './Input'
import Result from './Result'

export default class VerifyProof extends Component {
  constructor(props) {
    super(props)
    this.onProof = this.onProof.bind(this)
    this.state = {
      result: null,
      status: {},
      proof: null,
    }
  }

  onProof(proof) {
    this.setState({ status: { pending: true }, proof })
    return blockaiVerify(proof)
      .analyze()
      .then((result) => {
        this.setState({ status: { success: true }, result })
      })
      .catch((err) => {
        console.error(err)
        console.error(err.stack)
        this.setState({ status: { error: true, message: err.message } })
      })
  }

  render() {
    const { result, status } = this.state
    return (
      <div className="col-md-offset-3 col-md-6">
        <div className="row">
          <div className="col-md-12">
            <Input onProof={this.onProof} />
          </div>
          <div className="col-md-12">
            {status.pending && (
              <div className="alert alert-info">
                Verifying proof...
              </div>
            )}
            {status.error && (
              <div className="alert alert-danger">
                {status.message}
              </div>
            )}
            {result && (
              <Result result={result} />
            )}
          </div>
        </div>
      </div>
    )
  }
}
