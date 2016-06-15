/* eslint-disable no-unused-vars */
import merkletree, { verifyProof } from 'merkletree'
import { createHash } from 'crypto'

const blockaiVerify = (_proof) => {
  const proof = _proof.proof ? _proof.proof : _proof
  const {
    header: {
      hash_type,
      merkle_root,
      tx_id,
      timestamp,
    },
    target: {
      target_hash,
      target_proof,
    },
    extras,
  } = proof

  const hashAlgorithm = (hash_type || 'sha256').replace('-', '')

  const hash = (input) => {
    const hasher = createHash(hashAlgorithm)
    return hasher.update(input).digest('hex')
  }

  // Sync method to check if target hash is valid with respect to
  // extras.leaves
  const isTargetHashValid = () => {
    const leaves = extras.leaves.map((maybeLeaf) => {
      const leaf = typeof maybeLeaf === 'string'
        ? maybeLeaf
        : hash(maybeLeaf.data)
      return leaf
    })
    const tree = merkletree(leaves)
    const root = tree.root()
    return root === target_hash
  }

  // Sync method to check if merkle root is valid with respect
  // to target_proof
  const isMerkleRootValid = () => verifyProof(target_hash, merkle_root, target_proof)

  // Async method to verify if downloading dataUrl produces
  // expected hash
  const isDataHashValid = () => {

  }

  // Async method that checks how many confirmations transaction
  // holding merkle root has
  const getConfirmations = () => {

  }

  // Combines method above to give detailed report about proof
  const analyze = () => {

  }

  return {
    isTargetHashValid,
    isMerkleRootValid,
    isDataHashValid,
    getConfirmations,
    analyze,
  }
}

export default blockaiVerify
