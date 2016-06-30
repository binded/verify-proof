import React, { Component } from 'react'
// import blockaiVerify from '../../../src/'
import axios from 'axios'

const isUrl = (url) => url.match(/^https?:\/\//i)

export default class ProofInput extends Component {
  constructor(props) {
    super(props)
    this.onChangeUrl = this.onChangeUrl.bind(this)
    this.onClickVerify = this.onClickVerify.bind(this)
    this.state = {
      url: props.url || '',
      status: null,
    }
  }

  componentWillMount() {
    if (this.state.url) {
      this.onClickVerify()
    }
  }

  onChangeUrl(e) {
    // TODO: trime
    this.setState({
      url: e.target.value.trim(),
    })
  }

  /* eslint-disable no-console */
  onClickVerify() {
    const { onProof, onClickVerify } = this.props
    onClickVerify()
    const { url } = this.state
    this.setState({
      status: { pending: true },
    })
    axios
      .get(url)
      .then((response) => {
        const data = response.data
        if (typeof data !== 'object') {
          throw new Error('URL did not return a JSON response.')
        }
        return data
      })
      .catch((err) => {
        console.error(err)
        console.error(err.stack)
        this.setState({
          status: { error: true, message: err.message || 'Error retrieving proof' },
        })
        throw err
      })
      .then((proof) => {
        this.setState({
          status: { success: true },
        })
        onProof(proof)
      })
  }

  render() {
    const { url, status } = this.state
    const isPending = status && status.pending
    const disabled = isPending || !isUrl(url)

    return (
      <form className="form" onSubmit={this.onClickVerify}>
        {status && status.error && (
          <div className="alert alert-warning">
            {status.message}
          </div>
        )}
        <div className="form-group">
          <input
            onChange={this.onChangeUrl}
            value={url}
            className="form-control"
            placeholder="Enter proof url"
          />
        </div>
        <div className="form-group">
          <button
            type="submit"
            disabled={disabled}
            className="btn btn-primary btn-block"
            onClick={this.onClickVerify}
          >
            Verify
          </button>
        </div>
      </form>
    )
  }
}
