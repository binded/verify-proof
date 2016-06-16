import React from 'react'

export const NotVerifiedAlert = () => (
  <div className="alert alert-danger text-center">
    <h1 style={{ margin: 0 }}>
      <span className="glyphicon glyphicon-remove" />
      {' '}Proof Not Verified
    </h1>
  </div>
)

export const NotVerifiedError = ({ status }) => (
  <div>
    <NotVerifiedAlert />
    <p className="text-danger">Error: {status.message}</p>
  </div>
)

export default ({
  result,
  status,
}) => {
  if (!result && status.error) {
    return <NotVerifiedError status={status} />
  }
  if (!result) return

  const {
    isValid,
    confirmations,
    validations: {
      isTargetHashValid,
      isMerkleRootValid,
      isDataHashValid,
      isTxValid,
    },
    verifiedData: {
      dataUrl,
      registeredBy,
      txId,
    },
  } = result

  const txLink = (
    <a target="_blank" href={`https://blockchain.info/tx/${txId}`}>{confirmations}</a>
  )

  const renderValid = () => (
    <div>
      <div className="alert alert-success text-center">
        <h1 style={{ margin: 0 }}>
          <span className="glyphicon glyphicon-ok" />
          {' '}Proof Verified
        </h1>
      </div>
      <div className="alert alert-success">
        <h4>Verified Data</h4>
        <ul>
          <li>
            <strong>File:</strong>
            {' '}<a href={dataUrl} target="_blank" download>Download file</a>
          </li>
          <li><strong>Registered by:</strong> {registeredBy}</li>
          <li><strong>Blockchain Confirmations:</strong> {txLink}</li>
        </ul>
      </div>
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
        <NotVerifiedAlert />
        <div>
          <p>
            The proof failed the following validations:
          </p>
          <ul className="text-danger">
            {messages.map((msg, i) => (<li key={i}>{msg}</li>))}
          </ul>
        </div>
      </div>
    )
  }

  if (!isValid) return renderInvalid()
  return renderValid()
}
