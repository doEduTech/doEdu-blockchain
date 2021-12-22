export interface NFT {
	readonly id: Buffer;
	readonly name: string;
	readonly ownerAddress: Buffer;
	readonly transferable: boolean;
	readonly meta: Buffer;
	readonly avatarHash: Buffer;
	readonly contentHash: Buffer;
}

export interface NFTJson {
	readonly id: string;
	readonly name: string;
	readonly ownerAddress: string;
	readonly transferable: boolean;
	readonly meta: string;
	readonly avatarHash: string;
	readonly contentHash: string;
}

export interface RegisteredNFTs {
	readonly registeredNFTTokens: NFT[];
}

export interface RegisteredNFTsJson {
	readonly registeredNFTTokens: NFTJson[];
}

export const registeredNFTTokensSchema = {
	$id: 'lisk/nft/registeredTokens',
	type: 'object',
	required: ['registeredNFTTokens'],
	properties: {
		registeredNFTTokens: {
			type: 'array',
			fieldNumber: 1,
			items: {
				type: 'object',
				required: [
					'id',
					'name',
					'ownerAddress',
					'transferable',
					'meta',
					'avatarHash'
				],
				properties: {
					id: {
						dataType: 'bytes',
						fieldNumber: 1,
					},
					name: {
						dataType: 'string',
						fieldNumber: 2,
					},
					ownerAddress: {
						dataType: 'bytes',
						fieldNumber: 3,
					},
					transferable: {
						dataType: 'boolean',
						fieldNumber: 4,
					},
					meta: {
						dataType: 'bytes',
						fieldNumber: 5,
					},
					avatarHash: {
						dataType: 'bytes',
						fieldNumber: 6,
					},
					contentHash: {
						dataType: 'bytes',
						fieldNumber: 7,
					},
				},
			},
		},
	},
};
