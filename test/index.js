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

test('close http server', (t) => {
  httpServer.close()
  t.end()
})
