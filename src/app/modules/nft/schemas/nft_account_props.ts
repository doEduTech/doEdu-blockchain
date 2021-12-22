
export interface NFTAccountProps {
  readonly nft: {
    readonly ownNFTs: Buffer[];
  };
}

export const nftAccountSchema = {
  type: 'object',
  required: ['ownNFTs'],
  properties: {
    ownNFTs: {
      type: 'array',
      fieldNumber: 1,
      items: {
        dataType: 'bytes',
      },
    },
  },
  default: {
    ownNFTs: [],
  },
};