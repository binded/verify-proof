import React from 'react'

export default ({
  result: {
    isValid,
    confirmations,
    validations: {
      isTargetHashValid,
      isMerkleRootValid,
      isDataHashValid,
      isTxValid,
    },
  },
}) => {
  const renderValid = () => (
    <div>
      <div className="alert alert-success">
        Proof successfuly verified!
      </div>
      <p>The proof has {confirmations} confirmations.</p>
    </div>
  )
  const renderInvalid = () => {
    const messages = []
    if (!isTargetHashValid) {
      messages.push('The extra data does not produce the expected hash.')
    }
    if (!isMerkleRootValid) {
      messages.push('The target proof does not produce the expected merkle root.')
    }
    if (!isDataHashValid) {
      messages.push('The downloaded file did not produce the expected hash.')
    }
    if (!isTxValid) {
      messages.push('The merkle root was not found in the transaction.')
    }
    return (
      <div>
        <div className="alert alert-danger">
          This proof does not appear to be valid!
        </div>
        <p>
          The proof failed the following validations:
        </p>
        <ul>
          {messages.map((msg, i) => (<li key={i}>{msg}</li>))}
        </ul>
      </div>
    )
  }

  if (!isValid) return renderInvalid()
  return renderValid()
}
