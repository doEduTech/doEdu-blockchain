export interface NFT {
	readonly id: Buffer;
	readonly name: string;
	readonly ownerAddress: Buffer;
	readonly value: bigint;
	readonly minPurchaseMargin: number;
}

export interface NFTJson {
	readonly id: string;
	readonly name: string;
	readonly ownerAddress: string;
	readonly value: string;
	readonly minPurchaseMargin: number;
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
				required: ['id', 'value', 'ownerAddress', 'minPurchaseMargin', 'name'],
				properties: {
					id: {
						dataType: 'bytes',
						fieldNumber: 1,
					},
					value: {
						dataType: 'uint64',
						fieldNumber: 2,
					},
					ownerAddress: {
						dataType: 'bytes',
						fieldNumber: 3,
					},
					minPurchaseMargin: {
						dataType: 'uint32',
						fieldNumber: 4,
					},
					name: {
						dataType: 'string',
						fieldNumber: 5,
					},
				},
			},
		},
	},
};
