import React, { Component } from 'react'
import blockaiVerify from '../../../src/'
import Input from './Input'
import Result from './Result'

export default class VerifyProof extends Component {
  constructor(props) {
    super(props)
    this.onProof = this.onProof.bind(this)
    this.reset = this.reset.bind(this)
    this.state = {
      result: null,
      status: {},
      proof: null,
    }
  }

  onProof(proof) {
    this.setState({ status: { pending: true }, proof })
    return Promise
      .resolve()
      .then(() => {
        const blockaiProof = blockaiVerify(proof)
        return blockaiProof
          .analyze()
          .then((validateResult) => {
            const result = {
              ...validateResult,
              verifiedData: {
                dataUrl: blockaiProof.dataUrl,
                registeredBy: proof.extras.leaves[1].data,
                txId: proof.header.tx_id,
              },
            }
            this.setState({ status: { success: true }, result })
          })
      })
      .catch((err) => {
        // console.log('errrror!')
        /* eslint-disable no-console */
        console.error(err.stack)
        this.setState({ status: { error: true, message: err.message } })
      })
  }

  reset() {
    this.setState({ status: {}, result: null, proof: null })
  }

  render() {
    const { result, status } = this.state
    console.log('render')
    console.log(status)
    return (
      <div className="col-md-offset-3 col-md-6">
        <div className="row">
          <div className="col-md-12">
            <Input onClickVerify={this.reset} onProof={this.onProof} />
          </div>
          <div className="col-md-12">
            {status.pending && (
              <div className="alert alert-info">
                Verifying proof...
              </div>
            )}
            {status.error && (
              <Result result={result} status={status} />
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
