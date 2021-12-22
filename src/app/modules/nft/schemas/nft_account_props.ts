export interface NFTModuleConfig {
	readonly allowedMinters: Buffer[];
}

export interface NFTAccountProps {
	readonly nft: {
		readonly ownNFTs: Buffer[];
		readonly mintedNFTs: Buffer[];
	};
}

export const nftAccountSchema = {
	type: 'object',
	required: ['ownNFTs', 'mintedNFTs'],
	properties: {
		ownNFTs: {
			type: 'array',
			fieldNumber: 1,
			items: {
				dataType: 'bytes',
			},
		},
		mintedNFTs: {
			type: 'array',
			fieldNumber: 2,
			items: {
				dataType: 'bytes',
			},
		},
	},
	default: {
		ownNFTs: [],
		mintedNFTs: [],
	},
};
