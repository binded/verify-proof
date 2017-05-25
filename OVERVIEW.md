# How Binded uses the Bitcoin blockchain

## Overview

Binded timestamps every copyright claim to the Bitcoin ledger (aka
blockchain). A timestamp proves that some piece of data existed prior to
the date of the timestamp. Timestamps are permanent and can't be changed
due to the "append only" nature of the Bitcoin blockchain. This is
useful in the context of copyright for a few reasons.

Given a timestamp, a copyright claimant can mathematically prove that
they had access to a file before the timestamp was produced.

For example, if you are the author of a picture, you can timestamp it on
the blockchain, alongside metadata identifying yourself as its author.

If you do this before you publish the picture, no one will ever be able
to produce a timestamp before you do, providing pretty good evidence for
the fact that you had access to the picture before anyone else and that
you are therefore its legitimate author.

Now, this mechanism is not perfect or at least, not until copyright
legislation exclusively relies on it to determine authorship. Most
authors today do not take advantage of this mechanism which leaves the
door open to instances of illegitimate claims.

However, if that were to happen, an author could likely still prove
authorship through traditional means (raw image files, drafts,
witnesses, etc.) and the fraudster would be left with timestamped
evidence for their attempted fraud.

## Technical

Binded doesn't write data directly to the blockchain, but instead uses
short signatures (cryptographic hashes) which uniquely identify said
data. There is a non negligible fee for writing data to the blockchain
and it would be uneconomical to write anything other than short hashes.

This means that no useful information can be retrieved from reading the
blockchain alone. However, given a piece of data, it is possible to
compute its unique hash and verify that it was written to the blockchain
at a given time.

In order to further reduce transaction fees, Binded's uses merkle trees
to batch an unbounded amount of claims into a single Bitcoin
transaction, versus having to write one transaction per claim.

This allows us to keep our monthly transaction fee constant regardless
of how many claims we timestamp.

Binded's claims currently consist in metadata about the author (name,
email) and an associated file (picture, video, document, etc.). It is
possible to partially reveal some pieces of data for a claim (e.g. hide
the email value while revealing the file and author name) and still
prove that the revealed data was timestamped. This is possible because
claims themselves have a Merkle tree like structure.

The transactions we write to the blockchain contain an OP_RETURN output
starting with a prefix constant (`0xb10c`) followed by the hash of a
merkle tree. There might also be a change output which can be safely
ignored.

Each timestamp proof we provide to users consists in the merkle branch
linking their claim data to the root hash which was written to the
blockchain as well as the claim data itself. With this proof in hand,
users can prove their claim was timestamped on the blockchain.

