import type { NextApiRequest, NextApiResponse } from 'next'

type Badge = {
  id: string,
  network: string,
  recordedAt: string,
  timestamp: string,
  value: string,
  issuer: string,
  owner: {
    id: string
  },
  transaction: {
    id: string
  },
  mintedBadge: {
    id: string
  }
}

type Data = {
  badgeData: Badge[]
}


// TODO: Better error handling
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (typeof req.query.address !== 'string') {
    res.status(400).json({ badgeData: [] });
    return;
  }

  const badgesList = await getSismoBadges(req.query.address);

  if (badgesList === null) {
    res.status(500).json({ badgeData: [] });
    return;
  }

  res.status(200).json({ badgeData: badgesList });
}

// Gets sismo badges of a user on goerli
export const getSismoBadges = async (address: string): Promise<Badge[]> => {
  const query = `
    query getAllAttestationsForAccount {
      attestations(where: { owner: "${address}" }) {
        id
        network
        recordedAt
        timestamp
        value
        issuer
        owner {
          id
        }
        transaction {
          id
        }
        mintedBadge {
          id
        }
      }
    }`;

  const res = await fetch('https://api.sismo.io', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ query })
  });

  const { data, errors } = await res.json();
  if (errors) {
    console.error(errors);
    throw new Error('Failed to get badges');
  }

  const filteredData = data.attestations.filter((attestation: any) => {
    return attestation.network === "goerli";
  });

  return filteredData;
}
