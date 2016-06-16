import test from 'blue-tape'
import blockaiVerify from '../src'
import fs from 'fs'
import path from 'path'
import express from 'express'

const testDataPath = path.join(__dirname, 'data/')

// Load test data
const loadTestData = (name, baseUrl) => {
  const basePath = path.join(testDataPath, name)
  // const dataPath = path.join(basePath, 'file')
  const proofPath = path.join(basePath, 'proof.json')

  const proof = JSON.parse(fs.readFileSync(proofPath, { encoding: 'utf8' }))
  // const dataBuffer = fs.readFileSync(dataPath)
  proof.extras.dataUrl = `${baseUrl}/${name}/file`
  return {
    proof,
  }
}

const loadAllTestData = (baseUrl) => [
  'confirmed',
  'invalid',
  'text',
  'somewhatvalid',
].reduce((acc, name) => ({
  ...acc,
  [name]: loadTestData(name, baseUrl),
}), {})

let testData
let httpServer
test('start http server to serve data/ files', (t) => {
  // start test server
  const app = express().use(express.static(testDataPath))
  httpServer = app.listen()
  const { port } = httpServer.address()
  const baseUrl = `http://localhost:${port}`
  testData = loadAllTestData(baseUrl)
  t.end()
})

test('isTargetHashValid', (t) => {
  const confirmed = blockaiVerify(testData.confirmed)
  const invalid = blockaiVerify(testData.invalid)
  t.ok(confirmed.isTargetHashValid(), 'target hash is valid')
  t.notOk(invalid.isTargetHashValid(), 'target hash is not valid')
  t.end()
})

test('isMerkleRootValid', (t) => {
  const confirmed = blockaiVerify(testData.confirmed)
  const invalid = blockaiVerify(testData.invalid)
  t.ok(confirmed.isMerkleRootValid(), 'merle root is valid')
  t.notOk(invalid.isMerkleRootValid(), 'merkle root is not valid')
  t.end()
})

test('isDataHashValid', (t) => {
  t.plan(3)
  const text = blockaiVerify(testData.text)
  const confirmed = blockaiVerify(testData.confirmed)
  const invalid = blockaiVerify(testData.invalid)
  text.isDataHashValid().then((isValid) => t.ok(isValid)).catch(t.fail)
  confirmed.isDataHashValid().then((isValid) => t.ok(isValid)).catch(t.fail)
  invalid.isDataHashValid().then((isValid) => t.notOk(isValid)).catch(t.fail)
})

test('isTxValid', (t) => {
  t.plan(3)
  const text = blockaiVerify(testData.text)
  const confirmed = blockaiVerify(testData.confirmed)
  const invalid = blockaiVerify(testData.invalid)
  text.isTxValid().then((isValid) => t.ok(isValid)).catch(t.fail)
  confirmed.isTxValid().then((isValid) => t.ok(isValid)).catch(t.fail)
  invalid.isTxValid().then((isValid) => t.notOk(isValid)).catch(t.fail)
})

test('getConfirmations', (t) => {
  t.plan(3)
  const text = blockaiVerify(testData.text)
  const confirmed = blockaiVerify(testData.confirmed)
  const invalid = blockaiVerify(testData.invalid)
  // text.getConfirmations().then((confirms) => console.log(confirms)).catch(t.fail)
  text.getConfirmations().then((confirms) => t.ok(confirms > 100)).catch(t.fail)
  confirmed.getConfirmations().then((confirms) => t.ok(confirms > 100)).catch(t.fail)
  invalid.getConfirmations().then((confirms) => t.equal(confirms, 0)).catch(t.fail)
})

test('analyze', (t) => {
  t.plan(3)
  const text = blockaiVerify(testData.text)
  const invalid = blockaiVerify(testData.invalid)
  const somewhatvalid = blockaiVerify(testData.somewhatvalid)
  text
    .analyze()
    .then((results) => {
      results.confirmations = 4097
      t.deepEqual(results, {
        validations: {
          isTargetHashValid: true,
          isMerkleRootValid: true,
          isDataHashValid: true,
          isTxValid: true,
        },
        confirmations: 4097,
        isValid: true,
      }, 'text')
    })
    .catch(t.fail)
  invalid
    .analyze()
    .then((results) => {
      t.deepEqual(results, {
        validations: {
          isTargetHashValid: false,
          isMerkleRootValid: false,
          isDataHashValid: false,
          isTxValid: false,
        },
        confirmations: 0,
        isValid: false,
      })
    }, 'invalid')
    .catch(t.fail)
  somewhatvalid
    .analyze()
    .then((results) => {
      results.confirmations = 4097
      t.deepEqual(results, {
        validations: {
          isTargetHashValid: true,
          isMerkleRootValid: false,
          isDataHashValid: true,
          isTxValid: false,
        },
        confirmations: 4097,
        isValid: false,
      }, 'somewhatvalid')
    })
    .catch(t.fail)
})

test('infer data url and analyze', (t) => {
  // sete dataUrl to null
  const remoteProof = {
    proof: {
      ...testData.confirmed.proof,
      extras: {
        ...testData.confirmed.proof.extras,
        dataUrl: null,
      },
    },
  }
  const remote = blockaiVerify(remoteProof)
  const expectedUrl = 'https://api.blockai.com/v1/registrations/sha1/9017d9ef115f342115c33b26a82c120ffa0dd68c/download'
  t.equal(remote.dataUrl, expectedUrl)
  remote
    .analyze()
    .then((results) => {
      results.confirmations = 4097
      t.deepEqual(results, {
        validations: {
          isTargetHashValid: true,
          isMerkleRootValid: true,
          isDataHashValid: true,
          isTxValid: true,
        },
        confirmations: 4097,
        isValid: true,
      }, 'remote')
      t.end()
    })
    .catch(t.fail)
})

test('close http server', (t) => {
  httpServer.close()
  t.end()
})
