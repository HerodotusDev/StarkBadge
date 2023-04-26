import type { NextApiRequest, NextApiResponse } from 'next'
import { herodotusProof, proofOfOwnership, starknetVerify } from '../erc721/proofs'
import { getCurrentBlockNum } from '../erc721/quicknode'
import { getTokenIds } from '../erc721/alchemy'
type ReturnData = {
  nftList: any
}

let contract_data = {
  address: '0xB6920Bc97984b454A2A76fE1Be5e099f461Ed9c8',
  mapping_storage_slot: 5,
  proof_blocknumber: 0
}

const get = async (req: NextApiRequest, res: NextApiResponse<ReturnData>) => {
  const address = req.query.addr as string
  const nftList = await getTokenIds(address, contract_data.address)
  res.status(200).json({nftList})
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReturnData>
) {
  if (req.method === 'GET') {
    get(req, res)
  } else {
    res.status(405).end()
  }
}
